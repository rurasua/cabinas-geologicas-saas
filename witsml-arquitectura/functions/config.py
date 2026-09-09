"""
config.py — Configuración centralizada del SaaS.

Lee secretos desde Firebase Runtime Config (que a su vez apunta a Secret Manager
en producción). Para desarrollo local, cae a variables de entorno o defaults.

Patrón: una sola función `get_config()` que retorna un dict congelado. El resto
del código importa `CONFIG` directamente.

Reglas de uso:
1. NUNCA hardcodear umbrales de detección en otros archivos. Siempre via CONFIG.
2. Los secretos (SMTP_PASS, TWILIO_AUTH) SOLO en runtimeconfig, nunca en código.
3. Si agregas una variable nueva: añádela a .runtimeconfig.json + .env.example.
"""

from __future__ import annotations

import os
from typing import Any, Dict, Optional

try:
    # Solo disponible en el runtime de Cloud Functions
    from firebase_functions import params
except ImportError:  # pragma: no cover — fallback para tests locales
    params = None  # type: ignore[assignment]


def _secret(key: str, default: Optional[str] = None) -> Optional[str]:
    """
    Lee un secreto en este orden:
    1) Firebase params (producción / emulador)
    2) Variable de entorno (desarrollo local)
    3) Default (si se pasó)
    """
    if params is not None:
        try:
            # `params.Secret(...)` lee desde runtimeconfig.json en deploy
            # y desde process.env en emulador
            value = getattr(params, key, None)
            if value is not None:
                # En el emulador firebase-functions devuelve string directo
                return str(value).strip('"') if isinstance(value, str) else value.value  # type: ignore[union-attr]
        except Exception:  # noqa: BLE001 — el emulador puede no tener la key
            pass
    env_val = os.environ.get(key)
    if env_val is not None:
        return env_val
    return default


def _int(key: str, default: int) -> int:
    raw = _secret(key)
    if raw is None or raw == "":
        return default
    try:
        return int(raw)
    except (TypeError, ValueError):
        return default


def _float(key: str, default: float) -> float:
    raw = _secret(key)
    if raw is None or raw == "":
        return default
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def get_config() -> Dict[str, Any]:
    """
    Retorna la configuración completa del sistema.
    Cachear el resultado si se llama en hot path (poll loop).
    """
    return {
        # ── Detección de anomalías ────────────────────────────────────────
        # Gas: pico súbito (ppm en 1 muestra) o sostenido > N ppm
        "GAS_PEAK_THRESHOLD_PPM": _int("GAS_PEAK_THRESHOLD_PPM", 8000),
        "GAS_SUSTAINED_THRESHOLD_PPM": _int("GAS_SUSTAINED_THRESHOLD_PPM", 4000),
        "GAS_SUSTAINED_MIN_SAMPLES": _int("GAS_SUSTAINED_MIN_SAMPLES", 3),
        # Densidad: caída súbita > X g/cm³ entre 2 muestras consecutivas
        "DENSITY_DROP_THRESHOLD": _float("DENSITY_DROP_THRESHOLD", 0.15),
        # ROP: caída > X% respecto al promedio de la última hora
        "ROP_DROP_PCT": _float("ROP_DROP_PCT", 0.40),
        "ROP_WINDOW_MIN": _int("ROP_WINDOW_MIN", 60),
        # ── Polling ───────────────────────────────────────────────────────
        "POLL_INTERVAL_MIN": _int("POLL_INTERVAL_MIN", 5),
        "POLL_TIMEOUT_SEC": _int("POLL_TIMEOUT_SEC", 25),
        # ── Alertas ───────────────────────────────────────────────────────
        "SMTP_HOST": _secret("SMTP_HOST", "smtp.gmail.com"),
        "SMTP_PORT": _int("SMTP_PORT", 587),
        "SMTP_USER": _secret("SMTP_USER", ""),
        "SMTP_PASS": _secret("SMTP_PASS", ""),
        "ALERT_FROM_EMAIL": _secret("ALERT_FROM_EMAIL", "alertas@cabinas-geologicas.com"),
        "TWILIO_ACCOUNT_SID": _secret("TWILIO_ACCOUNT_SID", ""),
        "TWILIO_AUTH_TOKEN": _secret("TWILIO_AUTH_TOKEN", ""),
        "TWILIO_WHATSAPP_FROM": _secret("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886"),
        # ── Entorno ───────────────────────────────────────────────────────
        "ENV": _secret("ENV", "local"),  # local | dev | prod
        "FIRESTORE_PROJECT": _secret("FIRESTORE_PROJECT", "cabinas-geologicas-dev"),
    }


# Singleton lazy — se construye la primera vez que se importa
_CONFIG: Optional[Dict[str, Any]] = None


def cfg() -> Dict[str, Any]:
    """Acceso directo: from config import cfg; cfg()['GAS_PEAK_THRESHOLD_PPM']"""
    global _CONFIG
    if _CONFIG is None:
        _CONFIG = get_config()
    return _CONFIG


def reload_config() -> Dict[str, Any]:
    """Para tests: fuerza recarga desde env."""
    global _CONFIG
    _CONFIG = get_config()
    return _CONFIG
