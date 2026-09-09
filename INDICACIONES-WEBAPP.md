# Indicaciones para construir la web app — proyecto Cabinas Geológicas

> Archivo de handoff para retomar en otra task. Contiene todo lo necesario para construir el esqueleto navegable de la web app sin necesidad de releer la conversación completa.

---

## 1. Lo que hay que construir (en una frase)

**El esqueleto navegable de la web app del SaaS de automatización de cabinas geológicas.** No es una landing de marketing. Es la base de UI del producto, con 7 vistas funcionales navegables, datos mock realistas, lista para ir reemplazando mocks por Firebase y Cloud Functions en fases siguientes.

---

## 2. Stack y arquitectura (decididos, no se mueven)

| Decisión | Valor | Por qué |
|----------|-------|---------|
| **Tipo de app** | Single Page Application (SPA) | Un solo HTML, navegación con hash routing (`#/dashboard`). Más simple que múltiples HTMLs porque no repite el layout. |
| **Lenguaje** | HTML + CSS + JS vanilla | Sin frameworks. Sin React, sin Vue, sin Tailwind, sin Svelte. Cada línea depurable. |
| **Single file** | Todo en un solo `index.html` | CSS en `<style>`, JS en `<script>`, datos mock como constantes. Rubén puede abrir y editar todo en un archivo. |
| **Routing** | Hash-based (`#/dashboard`, `#/cabin/mulach-12`, etc.) | No requiere servidor, funciona desde `file://` y desde Drive. |
| **Persistencia inicial** | Constantes JS en el mismo archivo | Después migra a Firestore, pero el primer esqueleto no necesita DB. |
| **Auth inicial** | Mock — un botón "Entrar con Google" que simplemente redirige a `#/dashboard` | Después se conecta a Firebase Auth. |
| **Sin build step** | Listo para abrirse directamente en el navegador | Sin npm, sin webpack, sin nada. |

---

## 3. Ubicación y archivo

| Concepto | Valor |
|----------|-------|
| **Ruta del archivo** | `C:\projects\Cabinas Geologicas\landing\index.html` |
| **Cómo abrir** | Doble clic en el archivo, o click derecho → Abrir con → Chrome/Edge |
| **Tamaño esperado** | ~600-800 líneas, ~30-40 KB |
| **Mobile** | Debe verse bien en celular (Rubén lo va a mostrar probablemente desde su teléfono) |

---

## 4. Las 7 vistas que debe tener (orden de prioridad)

| # | Vista | URL hash | Qué muestra | Datos mock que debe usar |
|---|-------|----------|-------------|--------------------------|
| 1 | **Login** | `#/login` | Pantalla simple con logo, tagline, botón "Entrar con Google" (mock) | — |
| 2 | **Dashboard** | `#/dashboard` | Saludo, métricas globales (cabinas activas, reportes del mes, gas máximo, manifestaciones), lista de cabinas con su estado | 2 cabinas: GERSEMI (Mulach-12), PAE NJORD (Pokche-12) |
| 3 | **Detalle de cabina** | `#/cabin/mulach-12` | Header con datos del pozo + tabs: Resumen, Parámetros, Reportes, Manifestaciones, Config | Datos reales de Mulach-12 del CSV BASE GENERAL (3,007 filas) y TABLA CROMATOGRAFIA (5,847 filas) |
| 4 | **Subir CSV** | `#/cabin/mulach-12/upload` | Zona de drag & drop, preview del CSV, botón "Generar SIOP" (mock por ahora) | Muestra un preview del primer CSV |
| 5 | **Detalle de reporte** | `#/report/siop-2022-07-15` | El SIOP renderizado bonito, con tabla de parámetros, gas, litología, y botones "Validar" y "Exportar PDF" | Texto del SIOP real de Mulach-12 del 15/07/2022 |
| 6 | **Detalle de manifestación** | `#/manifestation/2022-07-26` | La detección con lecturas, profundidad, factor de pico, y reporte generado | Datos del Reporte de Manifestación Mulach-12 No.2 (26/07/2022) |
| 7 | **Configuración** | `#/settings` | Datos de la empresa, plan actual, facturación, usuarios del equipo | Mock con datos de OAE |

---

## 5. Estructura interna del HTML (orden de bloques)

```
<!DOCTYPE html>
<html>
<head>
  <meta>
  <title>
  <link Google Fonts (DM Serif Display + Outfit)>
  <style>
    /* CSS variables (paleta) */
    /* Reset */
    /* Layout (sidebar + main) */
    /* Sidebar (nav, items) */
    /* Header */
    /* Componentes (cards, badges, tablas, botones) */
    /* Vistas (estilos específicos) */
    /* Responsive (mobile-first) */
  </style>
</head>
<body>
  <div id="app">
    <aside id="sidebar"><!-- navegación --></aside>
    <main id="main"><!-- vista actual --></main>
  </div>

  <script>
    // ========================
    // DATA MOCK (constantes)
    // ========================
    const MOCK_CABINS = [...]
    const MOCK_REPORTS = [...]
    const MOCK_MANIFESTATIONS = [...]
    const MOCK_USER = {...}

    // ========================
    // UTILIDADES
    // ========================
    function formatNumber(n, decimals) {...}
    function formatDate(d) {...}
    function getQueryParam(name) {...}

    // ========================
    // ROUTER
    // ========================
    const routes = {
      'login': renderLogin,
      'dashboard': renderDashboard,
      'cabin': renderCabin,         // lee ?id=...
      'report': renderReport,        // lee ?id=...
      'manifestation': renderManifest, // lee ?id=...
      'settings': renderSettings,
    }

    function navigate(hash) { window.location.hash = hash; }
    function renderRoute() { /* lee hash, llama función, inyecta HTML */ }
    window.addEventListener('hashchange', renderRoute);
    window.addEventListener('load', renderRoute);

    // ========================
    // VISTAS (cada una devuelve HTML string)
    // ========================
    function renderLogin() {...}
    function renderDashboard() {...}
    function renderCabin() {...}
    function renderUpload() {...}
    function renderReport() {...}
    function renderManifest() {...}
    function renderSettings() {...}

    // ========================
    // INICIALIZACIÓN
    // ========================
    renderRoute();
  </script>
</body>
</html>
```

---

## 6. Paleta de colores y tipografía (estilo petrolero, NO startup AI)

```css
:root {
  /* Backgrounds */
  --bg: #f7f5f0;           /* cream suave */
  --surface: #ffffff;
  --line: #e9e3d6;
  --line-soft: #f0ebde;
  
  /* Texto */
  --ink: #14171e;          /* casi negro, NO #000 puro */
  --ink-2: #3a4256;
  --muted: #7c7a72;
  
  /* Acento petrolero */
  --primary: #2f6f5e;      /* verde petrolero oscuro */
  --primary-deep: #1d4a3d;
  --primary-soft: rgba(47, 111, 94, 0.08);
  
  /* Acento secundario */
  --accent: #c97b3f;       /* ámbar, color de gas/flama */
  --accent-soft: rgba(201, 123, 63, 0.08);
  
  /* Estados */
  --warn: #b06367;         /* rojo petrolero, NO brillante */
  --gold: #b08a3e;
}
```

**Tipografía:**
- Headlines: `DM Serif Display` (serif, ya cargado en las páginas anteriores)
- Body: `Outfit` (sans, ya cargado)
- Mono (códigos, datos numéricos): `JetBrains Mono`

**NO usar:**
- ❌ Negro puro `#000`
- ❌ Degradados morados/azules estilo "AI startup"
- ❌ Emojis como iconos
- ❌ Inter, Roboto, Arial (prohibidos)
- ❌ Sombras llamativas
- ❌ 3 cards en fila centradas
- ❌ Tailwind CSS

**SÍ usar:**
- ✓ SVG inline de lucide.dev con `currentColor`
- ✓ Sombras suaves (`0 2px 8px rgba(0,0,0,0.04)`)
- ✓ Borders suaves (`1px solid var(--line)`)
- ✓ `rounded-2xl` en cards
- ✓ `hover:-translate-y-0.5 transition-all` en items interactivos

---

## 7. Datos de Mulach-12 que se deben usar (reales, no inventados)

### Cabina GERSEMI - Mulach-12
```
nombre: "Mulach-12"
campo: "Mulach"
empresa: "OAE"  // Oil Assessment
equipo: "GERSEMI"
operador: "OPEX"
etapa_actual: "8.5\""
profundidad_total: 4162 m (MD)
inicio_perforacion: "15/07/2022"
fin_perforacion: "28/07/2022"
dias_operacion: 13
formacion_objetivo: "Mioceno Superior"
```

### Cabina PAE NJORD - Pokche-12
```
nombre: "Pokche-12"
campo: "Pokche"
empresa: "OAE"
equipo: "PAE NJORD"
operador: "OPEX / PERFOMEX"
etapa_actual: "post-perforacion, en terminacion"
profundidad_total: 6560 m (MD)
inicio_perforacion: "abril 2022"
dias_operacion: 74
```

### Reportes mock (3 SIOPs de muestra)
```
1. SIOP del 15/07/2022 - Mulach-12 - inicio de etapa 9 5/8"
   - Profundidad 00:00: 2,500 m → 24:00: 2,745 m
   - Metros perforados: 245
   - ROP promedio: 86 m/h
   - Observaciones: instalación de cabina de registros continuos

2. SIOP del 16/07/2022 - Mulach-12 - continúa perforación
   - Profundidad 00:00: 2,745 m → 24:00: 2,945 m
   - Metros perforados: 200
   - ROP promedio: 41 m/h
   - Observaciones: continúa perforando con sarta rotatoria

3. SIOP del 28/07/2022 - Mulach-12 - cierre de etapa 8 1/2"
   - Profundidad 00:00: 3,839 m → 24:00: 4,162 m
   - Metros perforados: 323
   - Litología: Lutita gris claro 100%, Mioceno Superior
   - Estado: fin de etapa
```

### Manifestación mock
```
fecha: 26/07/2022
pozo: Mulach-12
profundidad: 3,580 m
gas_lectura: 10,260 ppm
gas_background: 145 ppm
factor_pico: 70x
formacion: Mioceno Superior
tiempo_respuesta: 58 min
causa_probable: cambio litológico
```

### Parámetros típicos de perforación (de BASE GENERAL)
```
Profundidad: 2,500 - 4,162 m
Densidad lodo entrada: 1.50 - 1.55 g/cm³
Densidad lodo salida: 1.50 - 1.55 g/cm³
ROP promedio: 30-180 m/h
Presión de bomba: 2,000 - 3,300 psi
RPM: 80-150
WOB: 1-10 ton
```

---

## 8. Componentes UI reusables a construir

```js
// Sidebar item
function sidebarItem(icon, label, hash, isActive) {...}

// Métrica card
function metricCard(label, value, sublabel, trend) {...}

// Status badge
function statusBadge(status) {  // 'active' | 'completed' | 'manifestation' | 'pending'
  // verde, gris, rojo, ámbar
}

// Tabla de parámetros
function paramsTable(rows) {...}

// Botones
// btn-primary, btn-secondary, btn-danger

// Header de vista
function viewHeader(title, subtitle, actions) {...}

// Empty state
function emptyState(icon, title, description) {...}

// Loading skeleton
function loadingSkeleton() {...}
```

---

## 9. Navegación del sidebar (orden de arriba a abajo)

```
📊 Dashboard              #/dashboard
🛢️  Cabinas                #/dashboard (mismo, lista de cabinas)
   └─ GERSEMI - Mulach-12  #/cabin/mulach-12
   └─ PAE NJORD - Pokche-12  #/cabin/pokche-12
📄 Reportes               #/dashboard (filtrado a reportes)
⚠️  Manifestaciones        #/dashboard (filtrado)
⚙️  Configuración          #/settings
```

Los sub-items de cabina se expanden al hacer click en "Cabinas". En mobile, el sidebar se colapsa a un menú hamburguesa.

---

## 10. Responsive breakpoints

- **Mobile:** < 768px — sidebar oculto, menú hamburguesa, 1 columna
- **Tablet:** 768-1024px — sidebar visible pero más estrecho
- **Desktop:** > 1024px — sidebar completo 280px de ancho, contenido con max-width 1200px

---

## 11. Comportamiento interactivo (mock, no real)

| Acción | Comportamiento esperado |
|--------|-------------------------|
| Click en "Entrar con Google" | Redirige a `#/dashboard` |
| Click en cabina del dashboard | Abre `#/cabin/{id}` |
| Click en tab de cabina | Cambia contenido del tab, marca activo |
| Click en "Subir CSV" | Abre vista de upload (drag & drop, sin lógica) |
| Click en un reporte | Abre `#/report/{id}` con el SIOP renderizado |
| Click en "Validar" en reporte | Muestra un toast "Reporte validado" (sin guardar nada) |
| Click en "Exportar PDF" | Muestra un toast "Generando PDF..." (sin hacer nada) |
| Click en sidebar item | Marca activo, navega a la URL |
| Navegación con hash | Re-renderiza solo el `<main>`, sin recargar la página |

---

## 12. Estructura de archivos final

```
C:\projects\Cabinas Geologicas\
├── landing\
│   └── index.html            ← CREAR ESTE ARCHIVO
├── guia-mvp-cabinas-geologicas.html  (existente, no tocar)
├── propuesta-alianza-cabinas.html   (existente, actualizar después)
├── CONTEXTO-PROYECTO.md     (existente, no tocar)
├── INDICACIONES-WEBAPP.md   (este archivo)
└── (24 documentos originales del proyecto)
```

---

## 13. Lo que NO debe hacer el esqueleto

- ❌ No debe tener backend real (todo es mock)
- ❌ No debe tener autenticación real (botón mock)
- ❌ No debe persistir datos (recargar = volver al estado inicial)
- ❌ No debe tener animaciones complejas (solo transiciones suaves)
- ❌ No debe tener dependencias externas (ni Tailwind CDN, ni jQuery, ni nada)
- ❌ No debe usar emojis (solo SVG inline de lucide)
- ❌ No debe tener más de 1000 líneas (mantener depurable)
- ❌ No debe tener código comentado o de prueba

---

## 14. Verificación final antes de entregar

Una vez escrito, verificar:

- [ ] Abre correctamente haciendo doble clic (`file://` funciona)
- [ ] Se ve bien en Chrome desktop a 1280px de ancho
- [ ] Se ve bien en celular (DevTools → modo responsive)
- [ ] Login → Dashboard funciona con un click
- [ ] Las 7 vistas se pueden navegar desde el sidebar
- [ ] Los datos de Mulach-12 aparecen correctamente
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El archivo se puede abrir desde Google Drive (compartir y abrir en otra ventana)
- [ ] No hay código comentado o muerto

---

## 15. Datos de contacto del proyecto (para el sidebar / footer)

```
empresa_usuario: "OAE"  (en modo demo, se loguea como gerente de OAE)
nombre_usuario: "Gerente General"
email: "gerencia@oae.com"
plan: "Piloto - 1 cabina"
```

---

## 16. Lo que va DESPUÉS del esqueleto (no se hace en esta task)

En orden cronológico, una vez entregado el esqueleto:

1. Validar con el usuario que se ve como espera
2. Iterar sobre colores, tipografía, copy
3. Conectar a Firebase (Firestore + Auth)
4. Reemplazar mocks con datos reales
5. Implementar generación real de SIOP con Vertex AI
6. Generar los 3 SIOPs de Mulach-12 con datos reales
7. Grabar video demo
8. Mostrar al contacto

---

**Última actualización:** 7 de septiembre de 2026.
**Estado:** listo para construir.
**Próximo paso:** en la nueva task, leer este archivo, confirmar el alcance, y crear `C:\projects\Cabinas Geologicas\landing\index.html` siguiendo todas las indicaciones arriba.
