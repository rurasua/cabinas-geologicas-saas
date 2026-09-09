# Arquitectura WITSML — SaaS de Cabinas Geológicas

> Diseño completo de la integración con WITSML para el SaaS. Documento de handoff para implementar cuando se active la conexión en tiempo real con cabinas reales.

---

## 1. Arquitectura general

```
┌────────────────────┐                                    ┌──────────────────────────────────┐
│  CABINA FÍSICA      │                                    │  GOOGLE CLOUD                    │
│  (GERSEMI, NJORD)   │                                    │                                  │
│                    │                                    │  ┌────────────────────────────┐ │
│  ┌──────────────┐  │                                    │  │ Cloud Scheduler             │ │
│  │ Wellsight /  │  │   HTTPS + Basic Auth              │  │ "*/1 * * * *" cada minuto   │ │
│  │ TLog /       │──┼───────────────────────────────► │  └─────────────┬──────────────┘ │
│  │ Geo-Draft    │  │   WITSML 1.4.1 (XML over HTTP)   │                │                 │
│  │              │  │                                    │                ▼                 │
│  │ ┌──────────┐ │  │                                    │  ┌────────────────────────────┐ │
│  │ │ WITSML   │ │                                    │  │ Cloud Function              │ │
│  │ │ Server   │ │                                    │  │ pollWitsmlData              │ │
│  │ └──────────┘ │                                    │  │ 1. Lee config de la cabina  │ │
│  └──────────────┘  │                                    │  │ 2. Hace query WITSML        │ │
│                    │                                    │  │ 3. Parsea XML → JSON        │ │
└────────────────────┘                                    │  │ 4. Escribe en Firestore     │ │
                                                            │  └─────────────┬──────────────┘ │
                                                            │                │                 │
                                                            │                ▼                 │
                                                            │  ┌────────────────────────────┐ │
                                                            │  │ Cloud Function              │ │
                                                            │  │ detectAnomaly (trigger)     │ │
                                                            │  │ 1. Lee nueva lectura        │ │
                                                            │  │ 2. Compara con baseline     │ │
                                                            │  │ 3. Crea alerta si anómalo   │ │
                                                            │  └─────────────┬──────────────┘ │
                                                            │                │                 │
                                                            │                ▼                 │
                                                            │  ┌────────────────────────────┐ │
                                                            │  │ Firestore                   │ │
                                                            │  │ /cabins/{id}/datos_realtime │ │
                                                            │  │ /cabins/{id}/manifestaciones│ │
                                                            │  └─────────────┬──────────────┘ │
                                                            │                │                 │
                                                            │                ▼                 │
                                                            │  ┌────────────────────────────┐ │
                                                            │  │ Dashboard Web (Firebase     │ │
                                                            │  │ Hosting / index.html)       │ │
                                                            │  │ Auto-refresh cada 30s       │ │
                                                            │  └────────────────────────────┘ │
                                                            │                                  │
                                                            │  ┌────────────────────────────┐ │
                                                            │  │ Cloud Function              │ │
                                                            │  │ sendAlerts                  │ │
                                                            │  │ Email + SMS (Twilio)        │ │
                                                            │  └────────────────────────────┘ │
                                                            └──────────────────────────────────┘
```

---

## 2. Estructura de archivos

```
witsml-arquitectura/
├── README.md                          ← este archivo
├── firestore.rules                    ← reglas de seguridad
├── firestore.indexes.json             ← índices
├── .env.example                       ← variables de entorno
├── functions/
│   ├── main.py                        ← entrypoint Cloud Functions
│   ├── witsml_client.py                ← cliente WITSML puro
│   ├── firestore_schema.py            ← esquema y helpers de Firestore
│   ├── anomaly_detector.py            ← reglas de detección
│   ├── alerts.py                       ← envío de email/SMS
│   ├── config.py                       ← configuración
│   ├── requirements.txt                ← dependencias Python
│   ├── .runtimeconfig.json            ← config de Cloud Functions
│   └── tests/
│       ├── test_witsml_client.py
│       ├── test_anomaly_detector.py
│       └── test_firestore_schema.py
```

---

## 3. Esquema de Firestore

### Colección `cabins/{cabinId}`

```javascript
{
  id: "mulach-12",
  nombre: "Mulach-12",
  campo: "Mulach",
  empresa: "OAE",
  equipo: "GERSEMI",
  operador: "OPEX",
  estado: "active",
  profundidad_total: 4162,
  formacion: "Mioceno Superior",
  etapa: '8.5"',
  
  // ============ WITSML CONFIG ============
  witsml: {
    enabled: true,
    base_url: "https://192.168.10.50/witsml/store",  // o URL pública
    username: "agenthinkos_ro",                       // solo lectura
    password_secret: "projects/xxx/secrets/witsml-mulach",  // Secret Manager
    namespace: "eml://OAE/Mulach-12",                  // EML format
    version: "1.4.1",                                  // 1.4.1 o 2.0
    poll_interval_sec: 60,                             // 30-300
    last_poll_at: Timestamp,                            // updated by poller
    last_poll_status: "success" | "error" | "never",
    last_error: null,
    cert_pinning: false,                               // true para cabinas con CA propio
  },
  
  // ============ ANOMALY CONFIG ============
  anomaly_rules: {
    gas_factor_pico: 5,           // alerta si gas > N * background
    gas_umbral_absoluto: 5000,     // alerta si gas > N ppm
    densidad_caida_pct: 5,        // alerta si densidad salida cae N%
    rop_caida_sudita: 80,         // alerta si ROP cae > N% en 5 min
    notif_email: ["gerencia@oae.com"],
    notif_sms: ["+5219931234567"],
  },
  
  // ============ METADATA ============
  archivos: { /* archivos cargados */ },
  archivos_cargados: 2,
  created_at: Timestamp,
  updated_at: Timestamp,
}
```

### Subcolección `cabins/{cabinId}/datos_realtime/{docId}`

```javascript
{
  timestamp: Timestamp,           // server timestamp
  md: 3580,                        // measured depth (m)
  
  // Parámetros de perforación (cada 1-10s)
  wob_ton: 8.5,
  rpm: 145,
  rop_mh: 95,
  spp_psi: 3450,
  gpm: 950,
  torque_lbft: 5800,
  hook_load_ton: 86,
  
  // Fluido
  den_in: 1.55,
  den_out: 1.55,
  temp_in_c: 44.5,
  temp_out_c: 55.9,
  ecd: 1.57,
  
  // Cromatografía
  gas_total: 250,
  c1: 245, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0,
  
  // Fuente
  source: "witsml",               // witsml | csv | manual
  raw_id: "witsml-mwdRealtime-uuid-xxx",
}
```

### Subcolección `cabins/{cabinId}/manifestaciones/{manifestId}`

```javascript
{
  id: "manifest-2026-09-15T14-23-00",
  timestamp: Timestamp,
  md: 3580,
  tipo: "gas_pico" | "densidad_caida" | "rop_caida" | "manual",
  severidad: "alta" | "media" | "critica",
  
  // Lectura que disparó
  lectura: {
    gas_total: 10260,
    gas_background: 245,
    factor: 41.9,
    densidad_entrada: 1.55,
    densidad_salida: 1.55,
    rop: 95,
  },
  
  // Generado por
  detector: "anomaly_detector" | "manual",
  regla: "gas_factor_pico",
  
  // Estado
  estado: "nueva" | "vista" | "resuelta" | "descartada",
  vista_por: null,
  vista_at: null,
  notas: null,
  
  // Notificación
  notif_enviada: true,
  notif_canales: ["email"],
  notif_at: Timestamp,
}
```

---

## 4. Variables de entorno (`.env.example`)

```bash
# === GCP / Firebase ===
GCP_PROJECT_ID=your-project-id
FIREBASE_REGION=us-central1

# === SMTP (para emails de alertas) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@your-domain.com
SMTP_PASSWORD=app-specific-password

# === Twilio (para SMS de alertas) ===
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_FROM_NUMBER=+1234567890

# === Logging ===
LOG_LEVEL=INFO
```

---

## 5. Configuración de Cloud Functions (`.runtimeconfig.json`)

```json
{
  "poller": {
    "min_poll_interval_sec": "30",
    "max_cabins_per_invocation": "10",
    "request_timeout_sec": "25"
  },
  "alerts": {
    "email_from": "alerts@cabinasgeologicas.com",
    "rate_limit_per_cabin_per_hour": "10"
  }
}
```

Para setearlo:

```bash
firebase functions:config:set poller.min_poll_interval_sec=30
firebase functions:config:set alerts.email_from="alerts@cabinasgeologicas.com"
```

---

## 6. Dependencias Python (`requirements.txt`)

```
# === Core ===
functions-framework==3.*
firebase-admin==6.*
google-cloud-firestore==2.*

# === WITSML ===
requests==2.31.*
lxml==4.9.*
python-dateutil==2.8.*

# === Email / SMS ===
sendgrid==6.*
twilio==8.*

# === Utils ===
pydantic==2.*
python-dotenv==1.*
```

---

## 7. Reglas de seguridad de Firestore (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Cabinas: lectura solo para usuarios autenticados de la empresa dueña
    match /cabins/{cabinId} {
      allow read: if request.auth != null 
        && resource.data.empresa == request.auth.token.empresa;
      allow create, update: if request.auth != null 
        && request.auth.token.role == 'admin';
      
      // Datos en tiempo real: lectura autenticada, escritura solo desde Functions
      match /datos_realtime/{docId} {
        allow read: if request.auth != null;
        allow write: if false;  // Solo Cloud Functions (admin SDK)
      }
      
      // Manifestaciones: lectura autenticada, escritura solo desde Functions
      match /manifestaciones/{docId} {
        allow read: if request.auth != null;
        allow create, update: if false;  // Solo Cloud Functions
        // Excepción: el usuario puede marcar como vista
        allow update: if request.auth != null
          && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['estado', 'vista_por', 'vista_at', 'notas']);
      }
    }
  }
}
```

---

## 8. Índices de Firestore (`firestore.indexes.json`)

```json
{
  "indexes": [
    {
      "collectionGroup": "datos_realtime",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "manifestaciones",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "manifestaciones",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "estado", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 9. Resumen de los archivos de código

Los siguientes archivos están en este directorio:

| Archivo | Propósito |
|---------|-----------|
| `functions/main.py` | Entry point. Define las 4 Cloud Functions (pollWitsmlData, detectAnomaly, sendAlerts, setupCabinWitsml) |
| `functions/witsml_client.py` | Cliente WITSML puro (sin dependencias externas). Parsea XML, normaliza, maneja errores. |
| `functions/firestore_schema.py` | Helpers para escribir/leer en Firestore con tipos correctos. |
| `functions/anomaly_detector.py` | Reglas de detección de manifestaciones (gas, densidad, ROP). |
| `functions/alerts.py` | Envío de email (SMTP) y SMS (Twilio) con rate limiting. |
| `functions/config.py` | Lee configuración de runtime + env vars. |
| `functions/tests/test_*.py` | Tests unitarios para cada módulo. |

---

## 10. Diagrama de secuencia: detección de una manifestación

```
Cabina (Wellsight)           Cloud Scheduler           pollWitsmlData           Firestore           detectAnomaly           Email
       │                            │                          │                       │                       │                    │
       │ ─── push WITSML ────────►  │                          │                       │                       │                    │
       │   (cada 1-10s)            │                          │                       │                       │                    │
       │                            │                          │                       │                       │                    │
       │                            │ ── trigger cada 60s ──► │                       │                       │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │ GET witsml/.../mwd    │                       │                    │
       │ ◄─── XML response ─────────│                          │                       │                       │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │ Parsear XML           │                       │                    │
       │                            │                          │ Normalizar datos      │                       │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │ ── batch write ────► │                       │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │                       │ ─── onCreate ──────► │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │                       │ 1. Lee gas_background (24h)            │
       │                            │                          │                       │ 2. Calcula factor_pico  │                    │
       │                            │                          │                       │ 3. Si > 5x, crea manif   │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │                       │ ── create doc ──────► │                    │
       │                            │                          │                       │                       │                    │
       │                            │                          │                       │                       │ ─── email ────────► │
       │                            │                          │                       │                       │   "Manifestación   │
       │                            │                          │                       │                       │    detectada en   │
       │                            │                          │                       │                       │    Mulach-12 a    │
       │                            │                          │                       │                       │    3580m, factor  │
       │                            │                          │                       │                       │    42x"            │
       │                            │                          │                       │                       │                    │
```

**Tiempo total desde el evento en la cabina hasta el email: < 90 segundos.**

---

## 11. Costos estimados (10 cabinas, polling cada 60s)

| Servicio | Costo mensual | Notas |
|----------|---------------|-------|
| Cloud Scheduler | $0.10 | 1 job × 10 cabinas × 60 polls/h × 720h = ~43K jobs/mes |
| Cloud Functions invocations | $2.00 | 43K × $0.40/M |
| Cloud Functions CPU | $1.50 | ~2s por invocación promedio |
| Firestore writes | $0.50 | 60 writes/min/cabina × 1440 min × 10 cabinas = 864K writes/día |
| Firestore reads | $0.10 | Reads en dashboard, pocos |
| Cloud Storage | $0.05 | Logs y backups |
| SendGrid emails | $0.30 | 100 alertas/mes × $0.003 |
| Twilio SMS | $1.50 | 50 SMS/mes × $0.03 |
| **Total** | **~$6 USD/mes** | Para 10 cabinas |

**A 50 cabinas:** ~$30 USD/mes. Escala lineal.

---

## 12. Plan de implementación

### Sprint 1 (1 semana): Setup y polling básico
- Configurar Firebase project
- Implementar `witsml_client.py` (puro, sin dependencias externas)
- Implementar `firestore_schema.py` con tipos correctos
- Cloud Function `pollWitsmlData` que lee mwdRealtime y escribe a Firestore
- Test con 1 cabina de prueba

### Sprint 2 (1 semana): Detección de anomalías
- Implementar `anomaly_detector.py` con las 3 reglas (gas, densidad, ROP)
- Cloud Function `detectAnomaly` con trigger onCreate
- Calcular baseline (background) de las últimas 24h
- Tests con datos sintéticos de Mulach-12

### Sprint 3 (1 semana): Alertas
- Implementar `alerts.py` con SMTP y Twilio
- Cloud Function `sendAlerts` con rate limiting
- Templates de email con datos relevantes
- Configuración de Twilio

### Sprint 4 (1 semana): UI en dashboard
- Auto-refresh del visor cada 30 segundos
- Banner de "En vivo" / "Última actualización: hace X seg"
- Lista de manifestaciones recientes en dashboard
- Click en manifestación abre detalle

### Sprint 5 (1 semana): Producción
- HTTPS y certificados
- Credenciales en Secret Manager (no en env vars)
- Monitoring y alertas de errores
- Documentación para el equipo de operaciones

**Total: 5 semanas con 1 desarrollador.**

---

## 13. Cómo empezar mañana

1. Lee todos los archivos de `functions/` en este directorio
2. Crea el proyecto Firebase (tarda 10 minutos)
3. Activa Firestore, Functions, Scheduler
4. Configura SMTP y Twilio
5. Copia el código a `functions/` en tu proyecto
6. Despliega: `firebase deploy --only functions`
7. Configura 1 cabina de prueba con WITSML
8. Ve los datos llegar al dashboard

**Empezar es barato. Escalar es lineal. El estándar de la industria es WITSML. No hacerlo es irrelevante a largo plazo.**
