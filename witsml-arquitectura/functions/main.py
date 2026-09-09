"""
main.py — Cloud Functions entry point del SaaS Cabinas Geológicas.

Estructura de datos en Firestore:
    cabins/{cabin_id}                              → metadata + witsml_config
    cabins/{cabin_id}/datos_realtime/{auto-id}     → lecturas crudas normalizadas
    cabins/{cabin_id}/manifestaciones/{auto-id}    → alertas generadas
    contactos/{contact_id}                         → a quién notificar
    reglas/{cabin_id}                              → umbrales por cabina (opcional)

Funciones:
    1) poll_witsml_data      — scheduled cada 5 min, descarga datos crudos
    2) detect_anomaly        — firestore trigger onCreate en datos_realtime
    3) send_alerts           — firestore trigger onCreate en manifestaciones
    4) setup_cabin_witsml    — https onCall para registrar/pausar cabinas

Las versiones PURAS (pure_detect_*) de anomaly_detector se usan en
detect_anomaly para mantener la lógica testeable.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from firebase_admin import initialize_app, firestore
from firebase_functions import firestore_fn, https_fn, scheduler_fn

from alerts import dispatch as dispatch_alerts
from anomaly_detector import pure_detect_todas
from firestore_schema import (
    cabin_doc,
    create_manifestacion_doc,
    datos_realtime_collection,
    manifestaciones_collection,
    normalize_gas,
    normalize_lectura,
    now_utc,
)
from witsml_client import WitsmlClient, WitsmlError

initialize_app()
db = firestore.client()
log = logging.getLogger(__name__)

# Reglas por defecto si la cabina no tiene /reglas/{cabin_id} configurado
DEFAULT_RULES: Dict[str, Any] = {
    "gas_factor_pico": 5,
    "gas_umbral_absoluto": 5000,
    "densidad_caida_pct": 5,
    "rop_caida_pct": 80,
    "ventana_history_min": 30,
}


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────


def _load_rules(cabin_id: str) -> Dict[str, Any]:
    """Carga reglas por cabina, fallback a DEFAULT_RULES."""
    doc = db.document(f"reglas/{cabin_id}").get()
    if doc.exists:
        return {**DEFAULT_RULES, **(doc.to_dict() or {})}
    return dict(DEFAULT_RULES)


def _recent_lecturas(cabin_id: str, ventana_min: int) -> List[Dict[str, Any]]:
    """Lee las últimas N lecturas de datos_realtime (sin el current)."""
    desde = now_utc() - timedelta(minutes=ventana_min)
    docs = (
        db.collection(datos_realtime_collection(cabin_id))
        .where("timestamp", ">=", desde)
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(20)
        .stream()
    )
    return [d.to_dict() for d in docs]


# ──────────────────────────────────────────────────────────────────────────────
# 1) poll_witsml_data — cada 5 min
# ──────────────────────────────────────────────────────────────────────────────


@scheduler_fn.on_schedule(schedule="every 5 minutes", timezone="America/Mexico_City")
def poll_witsml_data(event: scheduler_fn.ScheduledEvent) -> None:
    """
    Para cada cabina activa con witsml_config:
    1) Lee mwdRealtime (parámetros) desde hace 6 min
    2) Lee gas (cromatografía) desde hace 6 min
    3) Normaliza y guarda en cabins/{id}/datos_realtime/

    onCreate en esa subcolección dispara detect_anomaly automáticamente.
    """
    log.info("poll_witsml_data start")
    cabins = db.collection("cabins").where("status", "==", "active").stream()
    count_ok, count_fail, count_skip = 0, 0, 0

    since = now_utc() - timedelta(minutes=6)

    for cabin in cabins:
        cd = cabin.to_dict() or {}
        wc = cd.get("witsml_config") or {}
        if not wc.get("url") or not wc.get("username") or not wc.get("password_ref"):
            count_skip += 1
            continue

        # Lee el password desde _secrets
        secret_doc = db.document(wc["password_ref"]).get()
        password = (secret_doc.to_dict() or {}).get("password", "") if secret_doc.exists else ""
        if not password:
            log.warning("Cabina %s sin password en %s", cabin.id, wc["password_ref"])
            count_fail += 1
            continue

        client = WitsmlClient(
            base_url=wc["url"],
            username=wc["username"],
            password=password,
            namespace=wc.get("namespace", f"eml://unknown/{cabin.id}"),
            timeout=20,
        )

        try:
            # Parámetros de perforación
            params = client.get_realtime_params(since=since)
            for p in params:
                norm = normalize_lectura(p)
                norm["cabin_id"] = cabin.id
                db.collection(datos_realtime_collection(cabin.id)).add(norm)
                count_ok += 1

            # Gas / cromatografía
            gases = client.get_gas_readings(since=since)
            for g in gases:
                norm = normalize_gas(g)
                norm["cabin_id"] = cabin.id
                db.collection(datos_realtime_collection(cabin.id)).add(norm)
                count_ok += 1

        except WitsmlError as e:
            log.warning("Cabina %s WITSML error: %s", cabin.id, e)
            count_fail += 1
        except Exception as e:  # noqa: BLE001 — un fallo no debe tumbar el poll
            log.exception("Cabina %s fallo inesperado: %s", cabin.id, e)
            count_fail += 1

    log.info("poll_witsml_data end: ok=%d fail=%d skip=%d", count_ok, count_fail, count_skip)


# ──────────────────────────────────────────────────────────────────────────────
# 2) detect_anomaly — trigger onCreate en datos_realtime
# ──────────────────────────────────────────────────────────────────────────────


@firestore_fn.on_document_created(document="cabins/{cabin_id}/datos_realtime/{reading_id}")
def detect_anomaly(
    event: firestore_fn.Event[firestore_fn.Change],
    cabin_id: str,
) -> None:
    """
    Para cada nueva lectura en datos_realtime:
    - Lee ventana de historia (desde firestore)
    - Llama pure_detect_todas (lógica pura, testeable)
    - Si hay anomalía, crea doc en manifestaciones/ con shape de
      create_manifestacion_doc
    """
    lectura = event.data.to_dict() if event.data else {}
    if not lectura:
        return

    rules = _load_rules(cabin_id)
    ventana = rules.get("ventana_history_min", 30)
    history = _recent_lecturas(cabin_id, ventana_min=ventana)

    anomalias = pure_detect_todas(lectura=lectura, history=history, rules=rules)
    if not anomalias:
        return

    for anom in anomalias:
        doc = create_manifestacion_doc(
            cabin_id=cabin_id,
            tipo=anom["tipo"],
            severidad=anom["severidad"],
            lectura=anom["lectura"],
            regla=anom["regla"],
            notas=anom["notas"],
        )
        db.collection(manifestaciones_collection(cabin_id)).add(doc)
        log.info("Manifestación creada: cabin=%s tipo=%s sev=%s", cabin_id, anom["tipo"], anom["severidad"])


# ──────────────────────────────────────────────────────────────────────────────
# 3) send_alerts — trigger onCreate en manifestaciones
# ──────────────────────────────────────────────────────────────────────────────


@firestore_fn.on_document_created(document="cabins/{cabin_id}/manifestaciones/{manifest_id}")
def send_alerts(
    event: firestore_fn.Event[firestore_fn.Change],
    cabin_id: str,
    manifest_id: str,
) -> None:
    """
    Cuando se crea una manifestación, busca los contactos suscritos a la
    cabina y les envía la alerta por email/WhatsApp. Marca
    notif_enviada=True para que no se reenvíe.
    """
    manif = event.data.to_dict() if event.data else {}
    if manif.get("notif_enviada"):
        return

    # Lee contactos suscritos a esta cabina
    recipients = [
        {
            "contact_id": c.id,
            "email": cd.get("email", ""),
            "phone": cd.get("phone", ""),
            "channel_pref": cd.get("channel_pref", "email"),
        }
        for c in db.collection("contactos").where("cabinas", "array_contains", cabin_id).stream()
        for cd in [c.to_dict() or {}]
    ]

    if not recipients:
        log.info("Manifestación %s sin destinatarios", manifest_id)
        db.document(f"{manifestaciones_collection(cabin_id)}/{manifest_id}").update(
            {"notif_enviada": True, "notif_at": now_utc(), "notif_canales": []}
        )
        return

    # Adapta el shape de la manif al que espera alerts.dispatch
    alert_payload = {
        "id": manifest_id,
        "cabin_id": cabin_id,
        "tipo": manif.get("tipo"),
        "severidad": manif.get("severidad"),
        "regla": manif.get("regla"),
        "notas": manif.get("notas"),
        "timestamp": manif.get("timestamp"),
        "depth_m": manif.get("md"),
    }
    results = dispatch_alerts(alert_payload, recipients)
    enviados = [cid for cid, ok in results.items() if ok]

    db.document(f"{manifestaciones_collection(cabin_id)}/{manifest_id}").update(
        {
            "notif_enviada": True,
            "notif_at": now_utc(),
            "notif_canales": enviados,
        }
    )
    log.info("Manifestación %s notificada a %d/%d contactos", manifest_id, len(enviados), len(recipients))


# ──────────────────────────────────────────────────────────────────────────────
# 4) setup_cabin_witsml — https onCall
# ──────────────────────────────────────────────────────────────────────────────


@https_fn.on_call()
def setup_cabin_witsml(req: https_fn.CallableRequest) -> Dict[str, Any]:
    """
    Body:
       {
         "cabin_id": "abc123",
         "action":   "register" | "unregister" | "test",
         "url":      "https://rig12.empresa.com/witsml/store",
         "username": "svc_cabin01",
         "password": "secret",
         "namespace":"eml://OAE/Mulach-12"
       }
    """
    if not req.auth:
        raise https_fn.HttpsError("unauthenticated", "Login requerido")

    data = req.data or {}
    cabin_id = data.get("cabin_id")
    action = data.get("action")
    if not cabin_id or action not in ("register", "unregister", "test"):
        raise https_fn.HttpsError("invalid-argument", "cabin_id y action son requeridos")

    cabin_ref = db.collection("cabins").document(cabin_id)
    cabin = cabin_ref.get()
    if not cabin.exists:
        raise https_fn.HttpsError("not-found", f"Cabina {cabin_id} no existe")

    if action == "register":
        cabin_ref.update(
            {
                "witsml_config": {
                    "url": data["url"],
                    "username": data.get("username", ""),
                    "namespace": data.get("namespace", f"eml://unknown/{cabin_id}"),
                    "password_ref": f"_secrets/cabin_{cabin_id}_witsml",
                },
                "status": "active",
                "updated_at": now_utc(),
            }
        )
        # Password real en colección separada con rules restrictivas
        db.document(f"_secrets/cabin_{cabin_id}_witsml").set(
            {"password": data.get("password", ""), "updated_at": now_utc()}
        )
        return {"ok": True, "message": f"Cabina {cabin_id} registrada"}

    if action == "unregister":
        cabin_ref.update({"witsml_config": firestore.DELETE_FIELD, "status": "paused"})
        return {"ok": True, "message": f"Cabina {cabin_id} pausada"}

    # action == "test"
    test_url = data.get("url") or (cabin.to_dict() or {}).get("witsml_config", {}).get("url")
    username = data.get("username") or (cabin.to_dict() or {}).get("witsml_config", {}).get("username", "")
    password = data.get("password", "")
    if not test_url:
        raise https_fn.HttpsError("failed-precondition", "No hay URL para probar")
    try:
        client = WitsmlClient(
            base_url=test_url,
            username=username,
            password=password,
            namespace=data.get("namespace", "eml://test/test"),
            timeout=15,
        )
        info = client.test_connection()
        return {"ok": info.get("ok", False), "info": info}
    except WitsmlError as e:
        return {"ok": False, "error": str(e)}
