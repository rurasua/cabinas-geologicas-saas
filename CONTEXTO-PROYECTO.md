# Proyecto: Cabinas Geológicas — SaaS de automatización

> Documento de contexto del proyecto. Léelo completo antes de hacer cualquier cambio. Contiene decisiones de negocio, arquitectura técnica, estado de archivos, y plan de fases.

---

## 1. El proyecto en una frase

Construir un **SaaS que automatiza la generación de reportes diarios (SIOP), detección de manifestaciones y planeación operativa (lookahead) en cabinas geológicas petroleras de México**, vendido a las PyMEs que operan cabinas para Pemex, no a Pemex directamente.

---

## 2. Archivos del proyecto

Todos viven en `C:\projects\Cabinas Geologicas\`.

| Archivo | Tipo | Estado | Para qué sirve |
|---------|------|--------|----------------|
| `guia-mvp-cabinas-geologicas.html` | HTML | ✅ Listo | Manual personal con los 14 servicios explicados, glosario, abreviaturas, arquitectura |
| `propuesta-alianza-cabinas.html` | HTML | ✅ Listo (con números corregidos) | Documento de 4 hojas para llevar a la reunión con el contacto |
| `CONTEXTO-PROYECTO.md` | Markdown | ✅ Este archivo | Handoff doc para retomar en otra task |
| `landing/` | Directorio | 🟡 Vacío, listo para landing page | Carpeta para la landing page del producto |
| `24 documentos originales` | PDF/XLS/XLSX | ✅ Fuente primaria | Mulach-12, Pokche-12 — datos reales de una cabina Pemex |

**Archivo de trabajo temporal de la skill deep-research (en otra carpeta, no en el proyecto):**
- `C:\Users\Geo Estratos\.minimax\workspaces\mavis-deep-research\20260907_110016_cabinas-geologicas-pozos\final_turn_001.md` — Reporte completo de investigación.

---

## 3. Decisiones de negocio (NO se mueven)

### Servicio a automatizar primero (de los 14 que ofrece una cabina geológica)
- **Módulo 2:** Reporte diario SIOP (formato Pemex)
- **Módulo 5:** Reporte de manifestaciones (kicks)
- **Módulo 12:** Lookahead operativo 24-72h
- **Módulo 14:** Digitalización OCR de archivos históricos (Litoteca CNH)

Los otros 10 servicios (litología de cuttings, paleontología, geomecánica, geosteering, etc.) quedan fuera del MVP y se manejan con software especializado o humanos.

### Cliente objetivo
**PyMEs operadoras de cabinas geológicas en México**, NO Pemex directamente.
- Geolog International (Villahermosa, Tabasco)
- eTech México (Tecnoparque Villahermosa)
- ROGII México (Villahermosa)
- Strata Logging de México
- AD-P
- DS Servicios Petroleros (Sinopec-Diavaz)
- Oil Assessment (OAE) — la empresa donde trabajó el contacto

### Modelo de alianza con el contacto
**Revenue share 60/40 sin equity.** Específicamente:
- Rubén es dueño del software 100% siempre.
- El contacto refiere clientes, da feedback, opcionalmente co-vende.
- 60% del fee mensual va a Rubén, 40% al contacto.
- Sin acciones, sin consejo, sin contrato de socios.
- Cualquiera puede salir con 30 días de aviso.
- Acuerdos escritos en 1 página, no statements of work de 30 páginas.

**Por qué NO equity:** el contacto salió de una sociedad anterior que "no resultó". Ofrecerle otra sociedad sería contraproducente. Solo revenue share, nada más.

### Pitch de ROI (el correcto, NO el inflado)
**Frase principal:** "Tu gasto en 4-6 geólogos ya está en el presupuesto. Con este sistema, ese mismo equipo opera 2 cabinas en lugar de 1. La siguiente cabina que tomes es revenue nuevo con margen prácticamente intacto, porque el SaaS cuesta $50K MXN/mes contra $300-500K MXN/mes de revenue adicional."

**Por qué NO "ahorra en personal":** el personal es costo hundido, no se despide. El ahorro viene de crecer sin contratar, no de reducir.

**El "plus" de retención:** el contacto también lo ve como herramienta para retener geólogos (mercado con escasez y rotación 30-50% anual).

### Precio del SaaS
- **Lista:** $50,000 MXN/mes por cabina
- **Costo operativo real:** ~$8,360 MXN/mes al inicio, ~$1,820 MXN/mes a escala
- **Margen:** 83% al inicio, 96% a escala
- **Versión piloto reducido:** $30,000 MXN/mes × 3 meses, solo Módulo 2
- **Versión premium:** $80,000 MXN/mes, los 4 módulos + consultor a tiempo parcial

---

## 4. Decisiones técnicas

### Stack del MVP: Google + Firebase (todo en un solo ecosistema)

| Capa | Servicio | Notas |
|------|----------|-------|
| Auth | Firebase Authentication | Login con Gmail del cliente (1 click) |
| Base de datos | Firestore | Colecciones: cabins, daily_data, reports, manifestations, wells |
| Storage | Cloud Storage para Firebase | PDFs generados, archivos originales |
| Lógica backend | Cloud Functions (Python 3.11) | Procesa CSVs, llama Gemini, detecta manifestaciones |
| LLM | Vertex AI (Gemini) | $5 USD/mes por cabina, prompt + few-shot examples |
| OCR | Document AI | Para digitalizar PDFs históricos de Litoteca |
| Hosting dashboard | Firebase Hosting | `tu-proyecto.web.app` gratis |
| Visualización rápida | Streamlit o Gradio | Para el MVP, sin aprender React |
| Lenguaje backend | Python | Por familiaridad y librerías (pandas, reportlab) |
| Plantillas originales | Google Drive | SIOPs originales de Mulach-12 subidos a Storage |

### Estructura de Firestore (diseñada, no implementada)

```
/cabins/{cabinId}
    nombre, empresa, contacto, pozo_actual, activa
  /daily_data/{YYYY-MM-DD}
    profundidad_inicial, profundidad_final, metros_perforados,
    rop_promedio, gas_total_promedio, gas_total_max,
    c1, c2, c3, densidad_entrada, densidad_salida, ...
  /reports/{YYYY-MM-DD}
    tipo, contenido_md, pdf_url, generado_por, validado_por,
    validado_timestamp, campos_editados, tasa_campos_correctos
  /manifestations/{YYYY-MM-DDTHH-MM}
    profundidad, tipo, gas_lectura, gas_background, factor_pico, pdf_url
/wells/{wellId}
    nombre, campo, etapa_actual, profundidad_total
```

### Costo esperado de Firebase (honesto)
- 1 cabina: ~$10 USD/mes
- 10 cabinas: ~$80 USD/mes
- AWS equivalente: $80-200 USD/mes al inicio (3-10x más caro y requiere DevOps)

### Lo que NO se hace en MVP
- ❌ No se reemplaza al geólogo de cabina
- ❌ No se hace descripción litológica de cuttings (queda para v2)
- ❌ No se interpreta paleontología (queda fuera)
- ❌ No se hace masterlog gráfico (software especializado como SLB LithoLink)
- ❌ No se hace geosteering (ROGII StarSteer ya existe)

---

## 5. El contacto clave y su historia

**Quién:** amigo personal de Rubén, ex-Gerente de **Oil Assessment (OAE)**.
**Experiencia:** operó 8 cabinas en OAE (los documentos de la carpeta son de OAE: Mulach-12, Pokche-12).
**Situación actual:** se salió de OAE, formó su propia empresa con socios, la sociedad "no resultó" (le disgustó).
**Lo que busca:** mantener su autonomía, evitar más sociedades, capitalizar su red de clientes y conocimiento del sector.
**Cómo acercarse:** como amigo, con idea suelta primero, propuesta concreta después. No presionar.

**Consideraciones legales:** los 24 documentos del proyecto son propiedad de OAE, no de Rubén ni del contacto. Antes de usarlos para entrenar o demostrar, el contacto debe confirmar que tiene autorización o que puede facilitar datos alternativos.

---

## 6. Estado actual de archivos

| Archivo | Estado | Notas |
|---------|--------|-------|
| `guia-mvp-cabinas-geologicas.html` | ✅ Listo, NO requiere cambios | Manual personal |
| `propuesta-alianza-cabinas.html` | ⚠️ Tiene la Opción B (equity) que NO se debe usar | Actualizar quitando Opción B y poniendo solo Revenue Share |
| `landing/index.html` | 🟡 Pendiente de crear | Rubén quería arrancar por aquí pero pidió pausa |
| Firebase project | 🟡 Pendiente de crear | ~1 hora de setup |
| `functions/main.py` (Cloud Function 1) | 🔴 No creado | Sube CSV → guarda en Firestore |
| `functions/main.py` (Cloud Function 2) | 🔴 No creado | Genera SIOP con Vertex AI |
| Dashboard | 🔴 No creado | Streamlit o Gradio |
| Demo video 3 min | 🔴 No creado | "subo CSV → sale SIOP firmado" |

---

## 7. Plan de fases completo

### Fase 0 — Documentación (✅ HECHO)
- Investigación de mercado global ✅
- Análisis de 24 documentos del proyecto ✅
- Recomendación del servicio a automatizar ✅
- Manual personal (HTML) ✅
- Propuesta para la reunión (HTML) ✅

### Fase 1 — Landing page (🟡 EN PAUSA, esperando指示)
- HTML + CSS inline, sin frameworks
- Paleta petrolero (verde oscuro + acentos ámbar)
- Secciones: hero, problema, 4 servicios MVP, cómo funciona, ROI, alianza, contacto
- Mobile-friendly
- Archivo: `C:\projects\Cabinas Geologicas\landing\index.html`

### Fase 2 — Setup Firebase (⏳ PENDIENTE)
- Crear proyecto en Firebase Console
- Habilitar Auth (Google), Firestore, Functions, Storage, Hosting
- Firebase CLI local
- Tiempo estimado: 1-2 horas

### Fase 3 — Cloud Functions backend (⏳ PENDIENTE)
- Function 1: `uploadCSV` — sube CSV, valida, guarda en Firestore
- Function 2: `generateSIOP` — lee datos, llama Vertex AI, devuelve SIOP
- Function 3: `detectManifestation` — reglas de detección
- Tiempo estimado: 3-4 semanas a tiempo parcial

### Fase 4 — Demo con datos reales (⏳ PENDIENTE)
- Generar 3 SIOPs de Mulach-12 (15, 16, 28 julio 2022)
- Comparar contra los originales
- Medir tasa de campos correctos
- Tiempo estimado: 1 semana

### Fase 5 — Contacto y piloto (⏳ PENDIENTE)
- Hablar informalmente con el contacto (amigo)
- Si hay interés, ofrecer piloto 30 días sin costo
- Implementar en 1 cabina real
- Tiempo: variable, depende del contacto

### Fase 6 — Producto comercial v2 (🔮 FUTURO, no se hace hasta validar)
- Migrar de Firebase a stack más robusto si Google no aguanta
- Certificación SOC 2 / ISO 27001
- Dashboard completo en Next.js
- Precios, planes, billing

---

## 8. Tareas pendientes en orden de prioridad

| # | Tarea | Tiempo estimado | Bloqueante para |
|---|-------|-----------------|-----------------|
| 1 | Hablar con el contacto (amigo) por WhatsApp/call para tantear | 30 min | Todo lo demás |
| 2 | Crear landing page (HTML, sin frameworks) | 3-4 horas | Validación visual con el contacto |
| 3 | Setup Firebase project | 1-2 horas | Backend |
| 4 | Cloud Function #1: uploadCSV | 1 semana | Demo |
| 5 | Cloud Function #2: generateSIOP | 2 semanas | Demo |
| 6 | Cloud Function #3: detectManifestation | 1 semana | Demo |
| 7 | Dashboard Streamlit | 1 semana | Demo |
| 8 | Generar 3 SIOPs demo con Mulach-12 | 1 semana | Reunión con contacto |
| 9 | Grabar video demo 3 min | 2 horas | Reunión con contacto |
| 10 | Actualizar propuesta HTML (quitar Opción B) | 30 min | Imprimir para reunión |

---

## 9. Datos importantes que recordar

### Prompts de few-shot para Gemini (a construir)
- 1 SIOP completo de Mulach-12 del 15/07/2022
- 1 Compendio Litológico de muestra
- Glosario de términos Pemex (ya está en `guia-mvp-cabinas-geologicas.html`)

### Métricas de éxito del piloto (a validar)
1. Reducción de horas-hombre dedicadas a SIOP/REPORTE/Manifestaciones ≥ 50%
2. Tiempo de entrega del reporte matutino de 4-6 horas a <30 minutos
3. % de campos del SIOP que requieren edición manual ≤ 15%
4. 100% de las manifestaciones detectadas (no perderse ninguna conocida)

### Documentos del proyecto que son propiedad de OAE
- Todos los archivos de Mulach-12 (24 documentos)
- Todos los archivos de Pokche-12
- **No usar para entrenar o demostrar sin permiso explícito del contacto o de OAE**

### Benchmarks que valen la pena recordar
- IDS Energistics 2017: 1-3 h/día dedicadas al DDR
- Intelie Auto DDR: horas → minutos
- Kwantis 2025: 90% del time log auto-poblado
- Provectus 2025: $4.2M USD ahorrados en 100 pozos
- AIQ DrillRep: drillrep.ae

### Mercados relevantes
- Geolog International: Villahermosa, Tabasco
- eTech México: Tecnoparque Villahermosa
- ROGII México: Villahermosa
- Strata Logging de México (SLM)
- AD-P
- DS Servicios Petroleros (Sinopec-Diavaz)
- Oil Assessment (OAE) — donde trabajó el contacto

---

## 10. Convenciones para futuras tasks

### Cuando se reabre este proyecto en otra task
1. **Lee este archivo primero** (`CONTEXTO-PROYECTO.md`).
2. **Verifica el estado de los archivos** en `C:\projects\Cabinas Geologicas\`.
3. **Confirma con el usuario qué tarea quiere retomar** — no asumas.
4. **Si la conversación previa al restart mencionó algo que no está aquí**, pregunta antes de actuar.

### Sobre el uso de memoria
- Las decisiones de negocio Y técnica de este proyecto están en este archivo (no en agent memory, porque son específicas de este proyecto).
- Las lecciones genéricas sobre ROI de SaaS B2B SÍ están en agent memory.
- El detalle "geólogos de cabina los contrata la PyME, no Pemex" SÍ está en agent memory.
- Antes de modificar este archivo, leerlo completo.

### Sobre cómo escribir respuestas al usuario
- **Tuteo neutro en español, NUNCA voseo rioplatense.**
- **Tono directo, sin floritura de customer service bot.**
- **Pasos exactos, comandos con ruta completa.**
- **Una pregunta por turno**, máximo.
- **Antes de avanzar, esperar respuesta** — Rubén controla el ritmo.

---

## 11. Última conversación conocida (para contexto emocional)

- Rubén está emocionado con el proyecto, ha avanzado mucho en pocas horas.
- Detectó por su cuenta un error grave en mi pitch inicial (el "ahorro en personal" siendo personal hundido). **Siempre validar las cifras con él antes de presentar como definitivas.**
- Su contacto es amigo, lo que da margen para iterar sin presión.
- Está en modo "orden antes que velocidad" — preferir control sobre avance.
- Nivel técnico: vibe coder con experiencia básica, no profesional. Requiere guías paso a paso con comandos completos.
- Prefiere que le pregunte antes de tomar decisiones grandes, no que asuma.
- Le importa el costo real, no solo el producto. Valora la honestidad sobre las cifras.

---

**Última actualización:** 7 de septiembre de 2026, sesión tarde.
**Próxima decisión pendiente:** retomar Fase 1 (landing) o saltar a hablar con el contacto, según indique Rubén.
