"""
Cliente WITSML puro (sin dependencias externas de Schlumberger/Halliburton).

Implementa solo lo necesario para leer datos de perforación en tiempo real
desde el servidor WITSML de una cabina geológica.

Soporta WITSML 1.4.1 (la más común en México) y WITSML 2.0 (limitado).

Uso:
    client = WitsmlClient(
        base_url="https://192.168.10.50/witsml/store",
        username="agenthinkos_ro",
        password="...",
        namespace="eml://OAE/Mulach-12"
    )
    params = client.get_realtime_params(since=datetime.utcnow() - timedelta(minutes=5))
    gas = client.get_gas_readings(since=...)
"""

import logging
import re
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from xml.etree import ElementTree as ET

import requests
from requests.auth import HTTPBasicAuth
from requests.exceptions import RequestException, Timeout


logger = logging.getLogger(__name__)


# ============================================================
# Excepciones
# ============================================================
class WitsmlError(Exception):
    """Error genérico de WITSML."""
    pass


class WitsmlAuthError(WitsmlError):
    """Error de autenticación (credenciales inválidas, IP no autorizada)."""
    pass


class WitsmlConnectionError(WitsmlError):
    """Error de conexión (timeout, DNS, firewall)."""
    pass


class WitsmlDataError(WitsmlError):
    """Error parseando la respuesta WITSML (XML malformado, schema desconocido)."""
    pass


# ============================================================
# Cliente principal
# ============================================================
class WitsmlClient:
    """
    Cliente WITSML mínimo para leer datos de perforación.

    Implementa solo las queries necesarias para el SaaS:
    - mwdRealtime / Realtime (parámetros de perforación)
    - gas (cromatografía)
    - trajectory (survey direccional)
    """

    # Namespaces de WITSML 1.4.1
    NS = {
        'witsml': 'http://www.witsml.org/schemas/1series',
        'eml': 'http://www.energistics.org/schemas/EmlWitsml',
    }

    # Data items de WITSML 1.4.1 que usamos
    PARAM_DATA_ITEMS = {
        'rop': 'rop',
        'wob': 'wob',
        'rpm': 'rpm',
        'spp': 'spp',  # standpipe pressure
        'gpm': 'gpm',  # flow rate out
        'torque': 'torque',
        'hookload': 'hkld',
        'bitdepth': 'bd',
        'den_in': 'densIn',
        'den_out': 'densOut',
        'temp_in': 'tempIn',
        'temp_out': 'tempOut',
    }

    GAS_DATA_ITEMS = {
        'gas_total': 'gasTotal',
        'c1': 'methane',
        'c2': 'ethane',
        'c3': 'propane',
        'ic4': 'ibutane',
        'nc4': 'nbutane',
        'ic5': 'ipentane',
        'nc5': 'npentane',
    }

    def __init__(
        self,
        base_url: str,
        username: str,
        password: str,
        namespace: str,
        version: str = "1.4.1",
        timeout: int = 20,
        verify_ssl: bool = True,
    ):
        """
        Args:
            base_url: URL del WITSML Store (ej: https://192.168.10.50/witsml/store)
            username: Usuario con permisos de lectura
            password: Contraseña (en producción, leer de Secret Manager)
            namespace: EML namespace (ej: eml://OAE/Mulach-12)
            version: Versión de WITSML ("1.4.1" o "2.0")
            timeout: Timeout en segundos
            verify_ssl: Si True, verifica el certificado SSL. False para cabinas con CA propio.
        """
        self.base_url = base_url.rstrip('/')
        self.username = username
        self.password = password
        self.namespace = namespace
        self.version = version
        self.timeout = timeout
        self.verify_ssl = verify_ssl
        self.auth = HTTPBasicAuth(username, password)
        self.session = self._build_session()

    def _build_session(self) -> requests.Session:
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'CabinasGeologicasSaaS/1.0',
            'Accept': 'application/xml',
        })
        return session

    # --------------------------------------------------------
    # Método principal: ejecuta una query WITSML y devuelve el root XML
    # --------------------------------------------------------
    def _query(self, query_xml: str) -> ET.Element:
        """
        Ejecuta una query WITSML Store y devuelve el elemento root.

        Args:
            query_xml: XML de la query (formato WITSML 1.4.1)

        Returns:
            Elemento root del XML de respuesta

        Raises:
            WitsmlAuthError: 401 o 403
            WitsmlConnectionError: timeout, DNS, network
            WitsmlDataError: XML malformado, schema error
            WitsmlError: otro error del servidor
        """
        url = f"{self.base_url}"
        # En WITSML 1.4.1, el body es SOAP sobre HTTP
        # (en 2.0 es REST puro)
        if self.version == "1.4.1":
            # Envolver en SOAP envelope
            body = self._wrap_soap(query_xml)
        else:
            body = query_xml

        try:
            response = self.session.post(
                url,
                data=body.encode('utf-8'),
                auth=self.auth,
                timeout=self.timeout,
                verify=self.verify_ssl,
                headers={'Content-Type': 'application/soap+xml; charset=utf-8'},
            )
        except Timeout:
            raise WitsmlConnectionError(f"Timeout ({self.timeout}s) connecting to {self.base_url}")
        except RequestException as e:
            raise WitsmlConnectionError(f"Network error: {e}")

        if response.status_code == 401:
            raise WitsmlAuthError("Credenciales inválidas (401)")
        if response.status_code == 403:
            raise WitsmlAuthError(f"Acceso denegado (403): {response.text[:200]}")
        if response.status_code >= 500:
            raise WitsmlError(f"Server error {response.status_code}: {response.text[:200]}")
        if response.status_code != 200:
            raise WitsmlError(f"HTTP {response.status_code}: {response.text[:200]}")

        try:
            root = ET.fromstring(response.content)
        except ET.ParseError as e:
            raise WitsmlDataError(f"XML malformado: {e}. Response: {response.text[:200]}")

        # Verificar si hay un fault de SOAP
        if root.tag.endswith('Fault'):
            faultstring = self._extract_fault(root)
            if 'auth' in faultstring.lower() or '401' in faultstring or '403' in faultstring:
                raise WitsmlAuthError(faultstring)
            raise WitsmlError(faultstring)

        return root

    def _wrap_soap(self, body: str) -> str:
        """Envuelve un cuerpo WITSML en un envelope SOAP."""
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:witsml="http://www.witsml.org/schemas/1series">
  <soap:Body>
    {body}
  </soap:Body>
</soap:Envelope>"""

    def _extract_fault(self, fault_root: ET.Element) -> str:
        """Extrae el mensaje de un fault SOAP."""
        for elem in fault_root.iter():
            if 'Reason' in elem.tag or 'faultstring' in elem.tag.lower():
                text = ET.tostring(elem, encoding='unicode')
                if 'Text' in text:
                    m = re.search(r'<[^>]*Text[^>]*>([^<]+)</', text)
                    if m:
                        return m.group(1)
        return "Unknown SOAP fault"

    # ============================================================
    # QUERIES DE DATOS
    # ============================================================
    def get_realtime_params(self, since: datetime, wellbore: Optional[str] = None) -> list[dict]:
        """
        Lee parámetros de perforación (mwdRealtime) desde `since`.

        Returns:
            Lista de dicts con campos: timestamp, md, wob, rpm, rop, spp, gpm,
                                       torque, hookload, den_in, den_out, temp_in, temp_out
        """
        # Construir query para mwdRealtime
        wellbore_id = wellbore or f"{self.namespace.split('/')[-1]}"
        since_str = since.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        query = f"""
<witsml:GetRealtimeObjects xmlns:witsml="http://www.witsml.org/schemas/1series"
                              xmlns:eml="http://www.energistics.org/schemas/EmlWitsml">
  <witsml:wellbore uidWell="{self.namespace}" uidWellbore="{wellbore_id}">
    <witsml:mwdRealtime dTimLastChange="{since_str}">
      <witsml:data>
        <witsml:md/>
        <witsml:rop/>
        <witsml:wob/>
        <witsml:rpm/>
        <witsml:spp/>
        <witsml:gpm/>
        <witsml:torque/>
        <witsml:hkld/>
        <witsml:densIn/>
        <witsml:densOut/>
        <witsml:tempIn/>
        <witsml:tempOut/>
      </witsml:data>
    </witsml:mwdRealtime>
  </witsml:wellbore>
</witsml:GetRealtimeObjects>"""

        root = self._query(query)
        return self._parse_realtime(root)

    def get_gas_readings(self, since: datetime, wellbore: Optional[str] = None) -> list[dict]:
        """
        Lee lecturas de gas (cromatografía) desde `since`.

        Returns:
            Lista de dicts con campos: timestamp, md, gas_total, c1, c2, c3, ic4, nc4, ic5, nc5
        """
        wellbore_id = wellbore or f"{self.namespace.split('/')[-1]}"
        since_str = since.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        query = f"""
<witsml:GetRealtimeObjects xmlns:witsml="http://www.witsml.org/schemas/1series"
                              xmlns:eml="http://www.energistics.org/schemas/EmlWitsml">
  <witsml:wellbore uidWell="{self.namespace}" uidWellbore="{wellbore_id}">
    <witsml:gas dTimLastChange="{since_str}">
      <witsml:data>
        <witsml:md/>
        <witsml:gasTotal/>
        <witsml:methane/>
        <witsml:ethane/>
        <witsml:propane/>
        <witsml:ibutane/>
        <witsml:nbutane/>
        <witsml:ipentane/>
        <witsml:npentane/>
      </witsml:data>
    </witsml:gas>
  </witsml:wellbore>
</witsml:GetRealtimeObjects>"""

        root = self._query(query)
        return self._parse_gas(root)

    def get_surveys(self, since_md: float = 0) -> list[dict]:
        """
        Lee surveys direccionales desde cierta profundidad MD.

        Returns:
            Lista de dicts con: md, inc, azi, tvd, ns, ew
        """
        wellbore_id = f"{self.namespace.split('/')[-1]}"

        query = f"""
<witsml:GetFromStore xmlns:witsml="http://www.witsml.org/schemas/1series">
  <witsml:trajectory uidWell="{self.namespace}" uidWellbore="{wellbore_id}">
    <witsml:trajectoryStation md="{since_md}">
      <witsml:md/>
      <witsml:incl/>
      <witsml:azi/>
      <witsml:tvd/>
      <witsml:ns/>
      <witsml:ew/>
    </witsml:trajectoryStation>
  </witsml:trajectory>
</witsml:GetFromStore>"""

        root = self._query(query)
        return self._parse_surveys(root)

    # ============================================================
    # PARSERS (XML → dict)
    # ============================================================
    def _parse_realtime(self, root: ET.Element) -> list[dict]:
        """Parsea XML de mwdRealtime a lista de dicts."""
        results = []
        for realtime in root.iter('{http://www.witsml.org/schemas/1series}mwdRealtime'):
            data = realtime.find('{http://www.witsml.org/schemas/1series}data')
            if data is None:
                continue
            row = {
                'timestamp': self._parse_dt(realtime.get('dTim')),
                'md': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}md')),
                'wob': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}wob')),
                'rpm': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}rpm')),
                'rop': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}rop')),
                'spp': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}spp')),
                'gpm': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}gpm')),
                'torque': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}torque')),
                'hookload': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}hkld')),
                'den_in': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}densIn')),
                'den_out': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}densOut')),
                'temp_in': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}tempIn')),
                'temp_out': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}tempOut')),
            }
            if row['md'] is not None:
                results.append(row)
        return results

    def _parse_gas(self, root: ET.Element) -> list[dict]:
        """Parsea XML de gas a lista de dicts."""
        results = []
        for gas in root.iter('{http://www.witsml.org/schemas/1series}gas'):
            data = gas.find('{http://www.witsml.org/schemas/1series}data')
            if data is None:
                continue
            row = {
                'timestamp': self._parse_dt(gas.get('dTim')),
                'md': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}md')),
                'gas_total': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}gasTotal')),
                'c1': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}methane')),
                'c2': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}ethane')),
                'c3': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}propane')),
                'ic4': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}ibutane')),
                'nc4': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}nbutane')),
                'ic5': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}ipentane')),
                'nc5': self._parse_float(data.findtext('{http://www.witsml.org/schemas/1series}npentane')),
            }
            if row['md'] is not None:
                results.append(row)
        return results

    def _parse_surveys(self, root: ET.Element) -> list[dict]:
        """Parsea XML de trajectory a lista de dicts."""
        results = []
        for station in root.iter('{http://www.witsml.org/schemas/1series}trajectoryStation'):
            row = {
                'md': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}md')),
                'inc': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}incl')),
                'azi': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}azi')),
                'tvd': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}tvd')),
                'ns': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}ns')),
                'ew': self._parse_float(station.findtext('{http://www.witsml.org/schemas/1series}ew')),
            }
            if row['md'] is not None:
                results.append(row)
        return results

    @staticmethod
    def _parse_float(s: Optional[str]) -> Optional[float]:
        """Parsea un string a float, devuelve None si vacío o inválido."""
        if s is None or s.strip() == '':
            return None
        try:
            return float(s)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _parse_dt(s: Optional[str]) -> Optional[datetime]:
        """Parsea un timestamp WITSML a datetime."""
        if not s:
            return None
        try:
            # WITSML format: 2026-09-15T14:23:00.000Z
            return datetime.fromisoformat(s.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            return None

    def test_connection(self) -> dict:
        """
        Prueba la conexión y devuelve un dict con info del servidor.

        Returns:
            {
                'ok': True/False,
                'server': 'Wellsight 4.2.1',
                'version': '1.4.1',
                'error': '...' (si !ok)
            }
        """
        try:
            query = f"""
<witsml:GetCap xmlns:witsml="http://www.witsml.org/schemas/1series">
  <witsml:capServers>
    <witsml:server ipAddress="{self.base_url.split('://')[1].split(':')[0].split('/')[0]}" />
  </witsml:capServers>
</witsml:GetCap>"""
            root = self._query(query)
            return {
                'ok': True,
                'version': self.version,
                'namespace': self.namespace,
            }
        except WitsmlError as e:
            return {
                'ok': False,
                'error': str(e),
            }
