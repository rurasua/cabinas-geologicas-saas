"""
alerts.py — Despacho de notificaciones de manifestaciones.

Input shape (viene de main.py send_alerts):
    {
        "id":          "manifest-2026-09-15T14:23:00.000000+00:00",
        "cabin_id":    "cabin_abc",
        "tipo":        "gas_pico",
        "severidad":   "critica",       # "critica" | "alta" | "media"
        "regla":       "gas_factor_5x",
        "notas":       "Gas 12000 ppm = 8.0× sobre background 1500 ppm",
        "timestamp":   <datetime>,
        "depth_m":     3580.0,
    }

Estrategia de canales:
- Email vía Gmail SMTP (App Password de 16 chars)
- WhatsApp vía Twilio (sandbox para pruebas, producción con templates aprobados)
- Si falla un canal, intenta el otro. Si todos fallan, log + no marcamos notif_enviada.

Severidad:
    critica → email + WhatsApp a TODOS los contactos suscritos
    alta    → email + WhatsApp solo si channel_pref in (whatsapp, both)
    media   → solo email
"""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage
from typing import Any, Dict, List

import requests

from config import cfg

log = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Renderers — manifestación dict → texto humano
# ──────────────────────────────────────────────────────────────────────────────


_SEVERITY_LABEL = {
    "critica": "CRÍTICA",
    "alta":    "ALTA",
    "media":   "MEDIA",
    "baja":    "BAJA",
}


def _sev_label(sev: str) -> str:
    return _SEVERITY_LABEL.get(sev, sev.upper())


def render_email_subject(manif: Dict[str, Any]) -> str:
    cabin = manif.get("cabin_id", "?")
    tipo = manif.get("tipo", "?").replace("_", " ").title()
    sev = _sev_label(manif.get("severidad", ""))
    return f"[{sev}] {cabin} — {tipo}"


def render_email_body(manif: Dict[str, Any]) -> str:
    depth = manif.get("depth_m")
    depth_str = f"{depth:.0f} m" if isinstance(depth, (int, float)) else "?"
    ts = manif.get("timestamp", "")
    if hasattr(ts, "isoformat"):
        ts = ts.isoformat()

    lines = [
        f"⚠ Manifestación detectada — Cabina {manif.get('cabin_id', '?')}",
        "",
        f"  Severidad : {_sev_label(manif.get('severidad', ''))}",
        f"  Tipo      : {manif.get('tipo', '?')}",
        f"  Regla     : {manif.get('regla', '?')}",
        f"  Detectado : {ts}",
        f"  Profund.  : {depth_str}",
        "",
        f"  Detalle: {manif.get('notas', '')}",
        "",
        f"  Ver en el visor: https://app.cabinas-geologicas.com/cabin/{manif.get('cabin_id', '')}",
        "",
        "— Sistema Cabinas Geológicas SaaS",
    ]
    return "\n".join(lines)


def render_whatsapp_body(manif: Dict[str, Any]) -> str:
    sev = _sev_label(manif.get("severidad", ""))
    cabin = manif.get("cabin_id", "?")
    tipo = manif.get("tipo", "?").replace("_", " ")
    depth = manif.get("depth_m")
    depth_str = f"{depth:.0f} m" if isinstance(depth, (int, float)) else "?"
    notas = manif.get("notas", "")
    return (
        f"⚠️ *{sev}* — Cabina {cabin}\n"
        f"Tipo: {tipo}\n"
        f"Prof: {depth_str}\n"
        f"{notas}\n"
        f"Ver: https://app.cabinas-geologicas.com/cabin/{cabin}"
    )


# ──────────────────────────────────────────────────────────────────────────────
# Canales individuales
# ──────────────────────────────────────────────────────────────────────────────


def send_email(to: str, manif: Dict[str, Any]) -> bool:
    """Retorna True si Gmail SMTP aceptó el mensaje."""
    c = cfg()
    if not c["SMTP_USER"] or not c["SMTP_PASS"]:
        log.warning("SMTP no configurado, manif %s no enviada por email", manif.get("id"))
        return False

    msg = EmailMessage()
    msg["From"] = c["ALERT_FROM_EMAIL"]
    msg["To"] = to
    msg["Subject"] = render_email_subject(manif)
    msg.set_content(render_email_body(manif))

    for attempt in (1, 2):
        try:
            with smtplib.SMTP(c["SMTP_HOST"], c["SMTP_PORT"], timeout=15) as s:
                s.starttls()
                s.login(c["SMTP_USER"], c["SMTP_PASS"])
                s.send_message(msg)
            log.info("Email enviado a %s (manif %s)", to, manif.get("id"))
            return True
        except (smtplib.SMTPException, OSError) as e:
            log.warning("SMTP intento %d falló para %s: %s", attempt, to, e)
    return False


def send_whatsapp(to: str, manif: Dict[str, Any]) -> bool:
    """
    `to` debe venir en formato E.164 con prefijo `+52...` (México +52).
    Si Twilio no está configurado, retorna False sin lanzar.
    """
    c = cfg()
    if not c["TWILIO_ACCOUNT_SID"] or not c["TWILIO_AUTH_TOKEN"]:
        log.warning("Twilio no configurado, manif %s no enviada por WhatsApp", manif.get("id"))
        return False

    url = f"https://api.twilio.com/2010-04-01/Accounts/{c['TWILIO_ACCOUNT_SID']}/Messages.json"
    payload = {
        "From": c["TWILIO_WHATSAPP_FROM"],
        "To": to if to.startswith("whatsapp:") else f"whatsapp:{to}",
        "Body": render_whatsapp_body(manif),
    }
    try:
        r = requests.post(
            url,
            data=payload,
            auth=(c["TWILIO_ACCOUNT_SID"], c["TWILIO_AUTH_TOKEN"]),
            timeout=15,
        )
        if r.status_code in (200, 201):
            log.info("WhatsApp enviado a %s (manif %s)", to, manif.get("id"))
            return True
        log.warning("Twilio rechazó mensaje a %s: %s %s", to, r.status_code, r.text[:200])
        return False
    except requests.RequestException as e:
        log.error("Twilio request falló para %s: %s", to, e)
        return False


# ──────────────────────────────────────────────────────────────────────────────
# Dispatcher — elige canales según severidad y pref del contacto
# ──────────────────────────────────────────────────────────────────────────────


def _should_use_whatsapp(severidad: str, pref: str) -> bool:
    """Solo severidad alta/crítica justifican WhatsApp si el contacto lo permite."""
    if severidad == "critica":
        return True
    if severidad == "alta":
        return pref in ("whatsapp", "both")
    # media/baja: solo email, noWhatsApp
    return False


def dispatch(manif: Dict[str, Any], recipients: List[Dict[str, str]]) -> Dict[str, bool]:
    """
    `recipients` es una lista de dicts con shape:
       [{"contact_id":"abc","email":"a@b.com","phone":"+52...","channel_pref":"whatsapp"}]

    Retorna dict {contact_id: ok}.
    """
    severidad = manif.get("severidad", "media")
    results: Dict[str, bool] = {}

    for r in recipients:
        cid = r.get("contact_id", r.get("email", r.get("phone", "?")))
        pref = r.get("channel_pref", "email")
        ok = False

        # Email: todos
        if r.get("email"):
            ok = send_email(r["email"], manif) or ok

        # WhatsApp: solo si severidad lo amerita Y el contacto lo permite
        if r.get("phone") and _should_use_whatsapp(severidad, pref):
            ok = send_whatsapp(r["phone"], manif) or ok

        results[cid] = ok

    return results
