# Cabinas Geológicas · SaaS

Software para automatizar los reportes operativos de cabinas geológicas en pozos petroleros. Cubre SIOP diario, detección de manifestaciones, Lookahead operativo y digitalizador de archivos históricos.

> Estado: **MVP UI mockup** + **arquitectura backend diseñada** (WITSML polling + Firebase Cloud Functions). Datos en mock hasta Fase 2 (deploy real a Firebase).

---

## Stack

- **Frontend**: HTML/CSS/JS vanilla, single-file SPA, sin frameworks. Tipografías DM Serif Display + Outfit + JetBrains Mono.
- **Backend planeado**: Google Cloud Platform
  - Cloud Functions Python 3.11 (`witsml-arquitectura/`)
  - Firestore (cabins, datos_realtime, manifestaciones, contactos)
  - Cloud Storage (archivos CSV / PDF de las cabinas)
  - Auth (Google Sign-In)
  - Vertex AI Gemini (generación de SIOP en lenguaje natural)
- **WITSML**: polling cada 5 min al WITSML Store 1.4.1 de cada cabina, normalización, detección de anomalías.

---

## Estructura del repo

```
.
├── landing/                              # SaaS web app (single-file HTML)
│   ├── index.html                        # SPA con hash routing (7 vistas + wizard)
│   ├── logo.svg                          # Logo corporativo
│   └── slogan.svg                        # Slogan "The New Generation · Mining & Geology"
│
├── witsml-arquitectura/                  # Diseño + código del backend Python
│   ├── README.md                         # Diseño completo (polling, detección, costo, sprint)
│   ├── firestore.rules                   # Security rules
│   ├── firestore.indexes.json            # Índices compuestos
│   ├── .runtimeconfig.json               # Configuración de Cloud Functions
│   ├── .env.example                      # Variables de entorno (template)
│   └── functions/
│       ├── main.py                       # 4 Cloud Functions (poll / detect / send / setup)
│       ├── witsml_client.py              # WitsmlClient class (WITSML 1.4.1 / 2.0)
│       ├── anomaly_detector.py           # 3 reglas puras (gas, densidad, ROP) + legacy
│       ├── firestore_schema.py           # Schemas: cabin, datos_realtime, manifestaciones
│       ├── alerts.py                     # Despacho email/WhatsApp (SMTP + Twilio)
│       ├── config.py                     # Lee runtimeconfig / env
│       └── tests/
│           └── test_anomaly_detector.py  # 17 tests
│
├── propuesta-alianza-cabinas.html        # Propuesta comercial de alianza (4 hojas)
├── matriz-cumplimiento-pliego.html       # Matriz de cumplimiento Pliego Pemex ↔ SaaS
├── guia-mvp-cabinas-geologicas.html      # Manual técnico del MVP (11 secciones)
│
├── Especificaciones Particulares y Generales B.docx   # Pliego de Pemex (referencia)
│
├── CONTEXTO-PROYECTO.md                  # Contexto del proyecto (handoff)
├── INDICACIONES-WEBAPP.md                # Indicaciones de build de la web app
└── README.md                             # Este archivo
```

---

## Cómo correr local

### Landing (web app)

```powershell
# Doble click en el archivo, o:
start C:\projects\Cabinas Geologicas\landing\index.html
```

No requiere servidor. Todo el JS está embebido y los datos son mock.

### WITSML backend (Cloud Functions)

```powershell
# Requiere Python 3.11+ y Firebase CLI
firebase emulators:start --only functions,firestore

# Tests del detector de anomalías (NO requiere emulador)
& 'C:\Users\Geo Estratos\AppData\Local\Python\bin\python.exe' `
  -m pytest C:\projects\Cabinas Geologicas\witsml-arquitectura\functions\tests\ -v
```

---

## Deploy

El landing es un sitio estático. Para deployar sin branding inyectado:

| Plataforma | Cómo |
|---|---|
| **Cloudflare Pages** | Conectar repo → build command vacío → output dir `landing/` |
| **Netlify** | `netlify deploy --dir=landing --prod` |
| **Vercel** | `vercel --prod` apuntando a `landing/` |

> **No usar** plataformas que inyectan overlay/branding en sitios servidos (ej. `space.minimax.io`).

---

## Modelo de negocio

- **Target**: PyMEs operadoras de cabinas geológicas para Pemex (Geolog, eTech, ROGII, Grupo Insigna, etc.), NO Pemex directamente.
- **Pricing**: $50,000 MXN/mes por cabina (83% margen).
- **Alianza**: revenue share 60/40 con el contacto comercial. **Sin equity**.
- **Pitch central**: "el mismo equipo de 6 profesionistas por cabina opera 2 cabinas con el paperwork resuelto en automático".

---

## Licencia

Privado. Todos los derechos reservados.

---

## Contacto

- Producto: Data-AgenThinkOs
- Repo: PRIVADO
