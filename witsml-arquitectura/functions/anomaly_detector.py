"""
Detector de anomalías (manifestaciones) en datos de perforación en tiempo real.

Reglas implementadas:
- gas_pico: gas_total > N * background
- gas_absoluto: gas_total > N ppm
- densidad_caida: densidad_salida cae más de N% vs entrada
- rop_caida: ROP cae más de N% en 5 min
- conexion_prolongada: ROP=0 por más de 30 min (sin conexión registrada)
"""

import logging
from datetime import datetime, timedelta
from typing import Optional

# Firestore se importa de forma lazy (solo en funciones legacy que lo usan).
# Esto permite importar el módulo en tests sin instalar google-cloud-firestore.
try:
    from google.cloud import firestore as _firestore
    _HAS_FIRESTORE = True
except ImportError:  # pragma: no cover
    _firestore = None  # type: ignore[assignment]
    _HAS_FIRESTORE = False


logger = logging.getLogger(__name__)


def _get_firestore_client():
    """Crea un cliente Firestore. Lanza ImportError si no está instalado."""
    if not _HAS_FIRESTORE:
        raise ImportError("google-cloud-firestore no instalado. "
                          "pip install google-cloud-firestore")
    return _firestore.Client()


# ============================================================
# Reglas
# ============================================================
def detectar_anomalia_gas(cabin_id: str, lectura: dict, rules: dict) -> Optional[dict]:
    """
    Detecta pico de gas por factor o por umbral absoluto.

    Returns:
        None si no hay anomalía, o dict con {tipo, severidad, regla, lectura, notas}
    """
    gas = lectura.get('gas_total', 0)
    if not gas:
        return None

    # Regla 1: Factor sobre background
    factor_pico = rules.get('gas_factor_pico', 5)
    background = _calcular_background_gas(cabin_id, ventana_horas=24)
    if background > 0 and gas > background * factor_pico:
        factor_real = gas / background
        severidad = 'critica' if factor_real > 10 else 'alta' if factor_real > 5 else 'media'
        return {
            'tipo': 'gas_pico',
            'severidad': severidad,
            'regla': f'gas_factor_{factor_pico}x',
            'lectura': lectura,
            'notas': f'Gas {gas:.0f} ppm = {factor_real:.1f}× sobre background {background:.0f} ppm',
        }

    # Regla 2: Umbral absoluto
    umbral_abs = rules.get('gas_umbral_absoluto', 5000)
    if gas > umbral_abs:
        return {
            'tipo': 'gas_absoluto',
            'severidad': 'alta' if gas > 2 * umbral_abs else 'media',
            'regla': f'gas_absoluto_{umbral_abs}',
            'lectura': lectura,
            'notas': f'Gas {gas:.0f} ppm supera umbral absoluto {umbral_abs} ppm',
        }

    return None


def detectar_anomalia_densidad(cabin_id: str, lectura: dict, rules: dict) -> Optional[dict]:
    """
    Detecta caída de densidad en salida vs entrada (posible influx).
    """
    den_in = lectura.get('den_in', 0)
    den_out = lectura.get('den_out', 0)
    if not (den_in > 0 and den_out > 0):
        return None

    caida_pct = ((den_in - den_out) / den_in) * 100
    umbral = rules.get('densidad_caida_pct', 5)

    if caida_pct > umbral:
        return {
            'tipo': 'densidad_caida',
            'severidad': 'critica' if caida_pct > 8 else 'alta',
            'regla': f'densidad_caida_{umbral}pct',
            'lectura': lectura,
            'notas': f'Densidad salida {den_out:.2f} g/cm³ es {caida_pct:.1f}% menor que entrada {den_in:.2f}',
        }

    return None


def detectar_anomalia_rop(cabin_id: str, lectura: dict, rules: dict) -> Optional[dict]:
    """
    Detecta caída súbita de ROP (posible problema de perforabilidad).
    """
    rop_actual = lectura.get('rop', 0)
    if rop_actual <= 0:
        return None

    # Calcular ROP promedio de los últimos 30 min
    rop_promedio = _calcular_rop_promedio(cabin_id, ventana_min=30)
    if not rop_promedio or rop_promedio <= 0:
        return None

    caida_pct = ((rop_promedio - rop_actual) / rop_promedio) * 100
    umbral = rules.get('rop_caida_pct', 80)

    if caida_pct > umbral:
        return {
            'tipo': 'rop_caida',
            'severidad': 'media' if caida_pct < 90 else 'alta',
            'regla': f'rop_caida_{umbral}pct',
            'lectura': lectura,
            'notas': f'ROP cayó {caida_pct:.0f}% en pocos minutos (de {rop_promedio:.0f} a {rop_actual:.0f} m/h)',
        }

    return None


# ============================================================
# Detectores agregados
# ============================================================
def detectar_todas_las_anomalias(cabin_id: str, lectura: dict, rules: dict) -> list[dict]:
    """
    Ejecuta todos los detectores sobre una lectura.
    Retorna lista de anomalías encontradas (puede haber varias).
    """
    anomalias = []
    for detector in [
        detectar_anomalia_gas,
        detectar_anomalia_densidad,
        detectar_anomalia_rop,
    ]:
        try:
            resultado = detector(cabin_id, lectura, rules)
            if resultado:
                anomalias.append(resultado)
        except Exception as e:
            logger.error(f"Error en detector {detector.__name__}: {e}", exc_info=True)
    return anomalias


# ============================================================
# Helpers (cálculo de baselines)
# ============================================================
def _calcular_background_gas(cabin_id: str, ventana_horas: int = 24) -> float:
    """
    Calcula el gas 'background' (mediana de las últimas N horas).
    Usa percentil 50 para que picos no afecten el baseline.
    """
    db = _get_firestore_client()
    col = db.collection(f'cabins/{cabin_id}/datos_realtime')
    desde = datetime.utcnow() - timedelta(hours=ventana_horas)

    docs = col.where('timestamp', '>=', desde).where('gas_total', '>', 0).stream()

    valores = [d.to_dict().get('gas_total', 0) for d in docs]
    if not valores:
        return 0

    valores.sort()
    n = len(valores)
    mediana = valores[n // 2] if n % 2 == 1 else (valores[n // 2 - 1] + valores[n // 2]) / 2
    return mediana


def _calcular_rop_promedio(cabin_id: str, ventana_min: int = 30) -> float:
    """Calcula ROP promedio de los últimos N minutos (excluye lecturas de 0)."""
    db = _get_firestore_client()
    col = db.collection(f'cabins/{cabin_id}/datos_realtime')
    desde = datetime.utcnow() - timedelta(minutes=ventana_min)

    docs = col.where('timestamp', '>=', desde).where('rop', '>', 0).stream()
    valores = [d.to_dict().get('rop', 0) for d in docs]
    if not valores:
        return 0
    return sum(valores) / len(valores)


# ============================================================
# Funciones PURAS (sin Firestore) — usadas por tests y por main.py
# que pasa history ya leída. Mantener signature compatible con las
# funciones de arriba para que sean intercambiables.
# ============================================================
def _mediana(values: list[float]) -> float:
    """Mediana de una lista. 0 si está vacía."""
    clean = [v for v in values if v is not None and v > 0]
    if not clean:
        return 0
    s = sorted(clean)
    n = len(s)
    return s[n // 2] if n % 2 == 1 else (s[n // 2 - 1] + s[n // 2]) / 2


def _promedio(values: list[float]) -> float:
    clean = [v for v in values if v is not None and v > 0]
    return sum(clean) / len(clean) if clean else 0


def pure_detect_gas(lectura: dict, history: list[dict], rules: dict) -> Optional[dict]:
    """
    Versión pura de detectar_anomalia_gas. Toma history como param
    en vez de consultar Firestore. La firma del hit retornado es
    la misma que detectar_anomalia_gas.
    """
    gas = lectura.get('gas_total', 0)
    if not gas:
        return None

    # Background = mediana de las últimas N horas del history
    background = _mediana([h.get('gas_total', 0) for h in history])
    factor_pico = rules.get('gas_factor_pico', 5)

    if background > 0 and gas > background * factor_pico:
        factor_real = gas / background
        severidad = 'critica' if factor_real > 10 else 'alta' if factor_real > 5 else 'media'
        return {
            'tipo': 'gas_pico',
            'severidad': severidad,
            'regla': f'gas_factor_{factor_pico}x',
            'lectura': lectura,
            'notas': f'Gas {gas:.0f} ppm = {factor_real:.1f}× sobre background {background:.0f} ppm',
        }

    umbral_abs = rules.get('gas_umbral_absoluto', 5000)
    if gas > umbral_abs:
        return {
            'tipo': 'gas_absoluto',
            'severidad': 'alta' if gas > 2 * umbral_abs else 'media',
            'regla': f'gas_absoluto_{umbral_abs}',
            'lectura': lectura,
            'notas': f'Gas {gas:.0f} ppm supera umbral absoluto {umbral_abs} ppm',
        }

    return None


def pure_detect_densidad(lectura: dict, history: list[dict], rules: dict) -> Optional[dict]:
    """Versión pura. history no se usa aquí, pero se mantiene en la firma."""
    den_in = lectura.get('den_in', 0)
    den_out = lectura.get('den_out', 0)
    if not (den_in > 0 and den_out > 0):
        return None

    caida_pct = ((den_in - den_out) / den_in) * 100
    umbral = rules.get('densidad_caida_pct', 5)

    if caida_pct > umbral:
        return {
            'tipo': 'densidad_caida',
            'severidad': 'critica' if caida_pct > 8 else 'alta',
            'regla': f'densidad_caida_{umbral}pct',
            'lectura': lectura,
            'notas': f'Densidad salida {den_out:.2f} g/cm³ es {caida_pct:.1f}% menor que entrada {den_in:.2f}',
        }

    return None


def pure_detect_rop(lectura: dict, history: list[dict], rules: dict) -> Optional[dict]:
    """
    Versión pura. Calcula el ROP promedio del history en vez de
    consultar Firestore.
    """
    rop_actual = lectura.get('rop', 0)
    if rop_actual <= 0:
        return None

    rop_promedio = _promedio([h.get('rop', 0) for h in history])
    if not rop_promedio or rop_promedio <= 0:
        return None

    caida_pct = ((rop_promedio - rop_actual) / rop_promedio) * 100
    umbral = rules.get('rop_caida_pct', 80)

    if caida_pct > umbral:
        return {
            'tipo': 'rop_caida',
            'severidad': 'media' if caida_pct < 90 else 'alta',
            'regla': f'rop_caida_{umbral}pct',
            'lectura': lectura,
            'notas': f'ROP cayó {caida_pct:.0f}% en pocos minutos (de {rop_promedio:.0f} a {rop_actual:.0f} m/h)',
        }

    return None


def pure_detect_todas(lectura: dict, history: list[dict], rules: dict) -> list[dict]:
    """
    Orquestador puro. Ejecuta los 3 detectores puros y retorna todas
    las anomalías. Reemplaza a detectar_todas_las_anomalias en main.py
    porque no toca Firestore.
    """
    anomalias = []
    for detector in (pure_detect_gas, pure_detect_densidad, pure_detect_rop):
        try:
            r = detector(lectura, history, rules)
            if r:
                anomalias.append(r)
        except Exception as e:
            logger.error("Error en %s: %s", detector.__name__, e, exc_info=True)
    return anomalias
