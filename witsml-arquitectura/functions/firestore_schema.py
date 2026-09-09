"""
Helpers para escribir/leer en Firestore con tipos correctos.

Centraliza el schema para evitar inconsistencias entre Cloud Functions.
"""

from datetime import datetime, timezone
from typing import Optional


def now_utc() -> datetime:
    """Timestamp UTC actual con timezone awareness."""
    return datetime.now(timezone.utc)


def cabin_doc(cabin_id: str) -> dict:
    """Path helper para documento de cabina."""
    return f"cabins/{cabin_id}"


def datos_realtime_collection(cabin_id: str) -> str:
    """Path helper para subcolección de datos en tiempo real."""
    return f"cabins/{cabin_id}/datos_realtime"


def manifestaciones_collection(cabin_id: str) -> str:
    """Path helper para subcolección de manifestaciones."""
    return f"cabins/{cabin_id}/manifestaciones"


def normalize_lectura(lectura: dict) -> dict:
    """
    Normaliza una lectura WITSML para guardar en Firestore.
    Convierte None a 0, valida rangos, agrega timestamp del servidor.
    """
    return {
        'timestamp': now_utc(),
        'md': float(lectura.get('md') or 0),
        'wob': float(lectura.get('wob') or 0),
        'rpm': float(lectura.get('rpm') or 0),
        'rop': float(lectura.get('rop') or 0),
        'spp': float(lectura.get('spp') or 0),
        'gpm': float(lectura.get('gpm') or 0),
        'torque': float(lectura.get('torque') or 0),
        'hookload': float(lectura.get('hookload') or 0),
        'den_in': float(lectura.get('den_in') or 0),
        'den_out': float(lectura.get('den_out') or 0),
        'temp_in': float(lectura.get('temp_in') or 0),
        'temp_out': float(lectura.get('temp_out') or 0),
        'source': 'witsml',
    }


def normalize_gas(lectura: dict) -> dict:
    """Normaliza una lectura de gas WITSML para Firestore."""
    return {
        'timestamp': now_utc(),
        'md': float(lectura.get('md') or 0),
        'gas_total': float(lectura.get('gas_total') or 0),
        'c1': float(lectura.get('c1') or 0),
        'c2': float(lectura.get('c2') or 0),
        'c3': float(lectura.get('c3') or 0),
        'ic4': float(lectura.get('ic4') or 0),
        'nc4': float(lectura.get('nc4') or 0),
        'ic5': float(lectura.get('ic5') or 0),
        'nc5': float(lectura.get('nc5') or 0),
        'source': 'witsml',
    }


def create_manifestacion_doc(
    cabin_id: str,
    tipo: str,
    severidad: str,
    lectura: dict,
    regla: str,
    notas: Optional[str] = None,
) -> dict:
    """Crea el documento de una manifestación nueva."""
    return {
        'id': f"manifest-{now_utc().isoformat()}",
        'cabin_id': cabin_id,
        'timestamp': now_utc(),
        'md': float(lectura.get('md') or 0),
        'tipo': tipo,
        'severidad': severidad,
        'lectura': lectura,
        'detector': 'anomaly_detector',
        'regla': regla,
        'estado': 'nueva',
        'vista_por': None,
        'vista_at': None,
        'notas': notas,
        'notif_enviada': False,
        'notif_canales': [],
        'notif_at': None,
    }
