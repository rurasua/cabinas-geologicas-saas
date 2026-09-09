
    /* ======================== ICONOS LUCIDE INLINE ======================== */
    const I = (path, size=18) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    const ICONS = {
      dashboard: I('<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
      cabin: I('<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>'),
      report: I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
      alert: I('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
      settings: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
      chevron: I('<polyline points="6 9 12 15 18 9"/>', 16),
      menu: I('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
      upload: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
      check: I('<polyline points="20 6 9 17 4 12"/>', 16),
      download: I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>', 16),
      google: I('<path d="M22 12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', 18),
      arrowUp: I('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>', 14),
      logout: I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', 16),
      fileText: I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>', 18),
    };

    /* ======================== DATA MOCK ======================== */
    const MOCK_USER = {
      nombre: 'Gerente General',
      email: 'gerencia@data-agenthinkos.com',
      empresa: 'Data-AgenThinkOs',
      plan: 'Piloto â€” 1 cabina',
    };

    const MOCK_CABINS = [
      {
        id: 'mulach-12', nombre: 'Mulach-12', campo: 'Mulach', empresa: 'Data-AgenThinkOs',
        equipo: 'GERSEMI', operador: 'OPEX', etapa: '8.5"',
        profundidad_total: 4162, inicio: '15/07/2022', fin: '28/07/2022',
        dias_op: 13, formacion: 'Mioceno Superior', estado: 'active',
        metros_hoy: 245, rop_prom: 86, gas_max: 10260, manif_count: 1,
      },
      {
        id: 'pokche-12', nombre: 'Pokche-12', campo: 'Pokche', empresa: 'Data-AgenThinkOs',
        equipo: 'PAE NJORD', operador: 'OPEX / PERFOMEX', etapa: 'TerminaciÃ³n',
        profundidad_total: 6560, inicio: 'abril 2022', fin: null,
        dias_op: 74, formacion: 'JurÃ¡sico Superior', estado: 'completed',
        metros_hoy: 0, rop_prom: 0, gas_max: 0, manif_count: 0,
      },
    ];

    const MOCK_REPORTS = [
      { id: 'siop-2022-07-15', cabin: 'mulach-12', fecha: '15/07/2022', tipo: 'SIOP', prof_ini: 2500, prof_fin: 2745, metros: 245, rop: 86, status: 'completed' },
      { id: 'siop-2022-07-16', cabin: 'mulach-12', fecha: '16/07/2022', tipo: 'SIOP', prof_ini: 2745, prof_fin: 2945, metros: 200, rop: 41, status: 'completed' },
      { id: 'siop-2022-07-28', cabin: 'mulach-12', fecha: '28/07/2022', tipo: 'SIOP', prof_ini: 3839, prof_fin: 4162, metros: 323, rop: 95, status: 'completed' },
    ];

    const MOCK_MANIFEST = {
      id: '2022-07-26', cabin: 'mulach-12', fecha: '26/07/2022',
      profundidad: 3580, gas_lectura: 10260, gas_background: 145,
      factor_pico: 70, formacion: 'Mioceno Superior',
      tiempo_respuesta: 58, causa: 'Cambio litolÃ³gico',
    };

    /* ======================== DATOS REALES MULACH-12 (BASE GENERAL + CROMATOGRAFIA) ======================== */
    // Sub-muestreados a 1 punto cada 50m. Datos 2500-3330m son reales del CSV BASE GENERAL.
    // Datos 3350-4150m son representativos consistentes con la etapa 8.5" para demo visual.
    const PARAMS_MULACH = [
      { prof: 2500, wob: 2.5, rpm: 48, spp: 2073, gpm: 698, denIn: 1.5, denOut: 1.5, tempIn: 43, tempOut: 55.55 },
      { prof: 2550, wob: 8.7, rpm: 99, spp: 3311, gpm: 918, denIn: 1.5, denOut: 1.5, tempIn: 41.72, tempOut: 53.25 },
      { prof: 2600, wob: 6.9, rpm: 110, spp: 3372, gpm: 913, denIn: 1.5, denOut: 1.5, tempIn: 42.24, tempOut: 53.02 },
      { prof: 2650, wob: 9.1, rpm: 110, spp: 3447, gpm: 915, denIn: 1.5, denOut: 1.5, tempIn: 43.68, tempOut: 54.28 },
      { prof: 2700, wob: 4.4, rpm: 120, spp: 3394, gpm: 926, denIn: 1.53, denOut: 1.53, tempIn: 43.59, tempOut: 54.4 },
      { prof: 2750, wob: 3.9, rpm: 120, spp: 3372, gpm: 913, denIn: 1.53, denOut: 1.53, tempIn: 43.33, tempOut: 54.98 },
      { prof: 2800, wob: 2.3, rpm: 150, spp: 3316, gpm: 898, denIn: 1.53, denOut: 1.53, tempIn: 43.85, tempOut: 54.69 },
      { prof: 2850, wob: 3.9, rpm: 150, spp: 3457, gpm: 913, denIn: 1.53, denOut: 1.53, tempIn: 43.85, tempOut: 55.3 },
      { prof: 2900, wob: 5.3, rpm: 150, spp: 3486, gpm: 910, denIn: 1.53, denOut: 1.53, tempIn: 43.68, tempOut: 54.98 },
      { prof: 2950, wob: 3.78, rpm: 120, spp: 3431, gpm: 923, denIn: 1.54, denOut: 1.54, tempIn: 43.85, tempOut: 54.98 },
      { prof: 3000, wob: 6.4575, rpm: 120, spp: 3475, gpm: 898, denIn: 1.54, denOut: 1.54, tempIn: 43.85, tempOut: 54.69 },
      { prof: 3050, wob: 5.54, rpm: 120, spp: 3658, gpm: 898, denIn: 1.55, denOut: 1.55, tempIn: 43.85, tempOut: 54.98 },
      { prof: 3100, wob: 4.5033, rpm: 150, spp: 3621, gpm: 898, denIn: 1.55, denOut: 1.55, tempIn: 43.85, tempOut: 54.69 },
      { prof: 3150, wob: 3.045, rpm: 150, spp: 3994, gpm: 957, denIn: 1.55, denOut: 1.55, tempIn: 43.85, tempOut: 54.98 },
      { prof: 3200, wob: 5.2, rpm: 150, spp: 3951, gpm: 958, denIn: 1.55, denOut: 1.55, tempIn: 43.85, tempOut: 54.69 },
      { prof: 3250, wob: 6.28, rpm: 150, spp: 3966, gpm: 955, denIn: 1.55, denOut: 1.55, tempIn: 43.85, tempOut: 54.98 },
      { prof: 3300, wob: 2.53, rpm: 59, spp: 437, gpm: 202, denIn: 1.55, denOut: 1.55, tempIn: 43.33, tempOut: 54.98 },
      { prof: 3350, wob: 8.5, rpm: 140, spp: 3500, gpm: 950, denIn: 1.55, denOut: 1.55, tempIn: 44, tempOut: 55.5 },
      { prof: 3400, wob: 9.2, rpm: 145, spp: 3550, gpm: 955, denIn: 1.55, denOut: 1.55, tempIn: 44.2, tempOut: 55.7 },
      { prof: 3450, wob: 7.8, rpm: 135, spp: 3450, gpm: 940, denIn: 1.55, denOut: 1.55, tempIn: 44.5, tempOut: 55.9 },
      { prof: 3500, wob: 6.5, rpm: 130, spp: 3300, gpm: 920, denIn: 1.55, denOut: 1.55, tempIn: 44.7, tempOut: 56 },
      { prof: 3550, wob: 8, rpm: 140, spp: 3400, gpm: 945, denIn: 1.55, denOut: 1.55, tempIn: 45, tempOut: 56.2 },
      { prof: 3600, wob: 9.5, rpm: 150, spp: 3500, gpm: 960, denIn: 1.55, denOut: 1.55, tempIn: 45.2, tempOut: 56.4 },
      { prof: 3650, wob: 5.5, rpm: 120, spp: 3200, gpm: 900, denIn: 1.55, denOut: 1.55, tempIn: 45.5, tempOut: 56.5 },
      { prof: 3700, wob: 7, rpm: 135, spp: 3300, gpm: 930, denIn: 1.55, denOut: 1.55, tempIn: 45.7, tempOut: 56.7 },
      { prof: 3750, wob: 8.5, rpm: 145, spp: 3450, gpm: 950, denIn: 1.55, denOut: 1.55, tempIn: 46, tempOut: 56.8 },
      { prof: 3800, wob: 6.8, rpm: 130, spp: 3250, gpm: 925, denIn: 1.55, denOut: 1.55, tempIn: 46.2, tempOut: 57 },
      { prof: 3850, wob: 9, rpm: 150, spp: 3500, gpm: 955, denIn: 1.55, denOut: 1.55, tempIn: 46.5, tempOut: 57.2 },
      { prof: 3900, wob: 7.5, rpm: 140, spp: 3350, gpm: 940, denIn: 1.55, denOut: 1.55, tempIn: 46.7, tempOut: 57.4 },
      { prof: 3950, wob: 8.2, rpm: 145, spp: 3450, gpm: 950, denIn: 1.55, denOut: 1.55, tempIn: 47, tempOut: 57.6 },
      { prof: 4000, wob: 6, rpm: 125, spp: 3200, gpm: 910, denIn: 1.55, denOut: 1.55, tempIn: 47.2, tempOut: 57.8 },
      { prof: 4050, wob: 8.8, rpm: 150, spp: 3500, gpm: 960, denIn: 1.55, denOut: 1.55, tempIn: 47.5, tempOut: 58 },
      { prof: 4100, wob: 7.3, rpm: 140, spp: 3350, gpm: 940, denIn: 1.55, denOut: 1.55, tempIn: 47.7, tempOut: 58.2 },
      { prof: 4150, wob: 9.5, rpm: 150, spp: 3550, gpm: 965, denIn: 1.55, denOut: 1.55, tempIn: 48, tempOut: 58.5 },
    ];

    // CromatografÃ­a: 2500-3300m del CSV real, 3350-4150m representativo, pico a 3580m = 10,260 ppm
    const CROMA_MULACH = [
      { prof: 2500, gas: 0, c1: 0, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2550, gas: 13, c1: 13, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2600, gas: 6, c1: 6, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2650, gas: 9, c1: 9, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2700, gas: 18, c1: 18, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2750, gas: 187, c1: 187, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2800, gas: 267, c1: 267, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2850, gas: 395, c1: 395, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2900, gas: 321, c1: 321, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 2950, gas: 180, c1: 180, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3000, gas: 290, c1: 290, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3050, gas: 346, c1: 346, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3100, gas: 530, c1: 530, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3150, gas: 527, c1: 527, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3200, gas: 556, c1: 556, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3250, gas: 494, c1: 494, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3300, gas: 740, c1: 740, c2: 0, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3276, gas: 1687, c1: 1600, c2: 70, c3: 12, ic4: 3, nc4: 1, ic5: 1, nc5: 0 },
      { prof: 3278, gas: 1441, c1: 1380, c2: 50, c3: 8, ic4: 2, nc4: 1, ic5: 0, nc5: 0 },
      { prof: 3280, gas: 1059, c1: 1010, c2: 40, c3: 6, ic4: 1, nc4: 1, ic5: 0, nc5: 0 },
      { prof: 3350, gas: 180, c1: 178, c2: 2, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3400, gas: 220, c1: 215, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3450, gas: 350, c1: 340, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3500, gas: 180, c1: 178, c2: 2, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3550, gas: 145, c1: 143, c2: 2, c3: 0, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3580, gas: 10260, c1: 9850, c2: 350, c3: 50, ic4: 8, nc4: 4, ic5: 0, nc5: 0 },
      { prof: 3600, gas: 450, c1: 440, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3650, gas: 220, c1: 215, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3700, gas: 180, c1: 175, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3750, gas: 250, c1: 240, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3800, gas: 310, c1: 295, c2: 12, c3: 3, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3850, gas: 180, c1: 175, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3900, gas: 220, c1: 210, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 3950, gas: 250, c1: 240, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 4000, gas: 180, c1: 175, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 4050, gas: 220, c1: 215, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 4100, gas: 250, c1: 240, c2: 8, c3: 2, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
      { prof: 4150, gas: 180, c1: 175, c2: 4, c3: 1, ic4: 0, nc4: 0, ic5: 0, nc5: 0 },
    ];

    /* ======================== UTILIDADES ======================== */
    const fmt = (n, d=0) => Number(n).toLocaleString('es-MX', { minimumFractionDigits: d, maximumFractionDigits: d });
    const getCabin = (id) => MOCK_CABINS.find(c => c.id === id);
    const getReport = (id) => MOCK_REPORTS.find(r => r.id === id);

    const showToast = (msg) => {
      const c = document.getElementById('toast-container');
      const t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = `${ICONS.check} <span>${msg}</span>`;
      c.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    };

    const navigate = (hash) => { window.location.hash = hash; };

    /* ======================== VISOR DE PARÃMETROS (SVG INLINE) ======================== */
    // Genera una mini-grÃ¡fica SVG con eje Y de profundidad (invertido) y eje X del parÃ¡metro.
    // opts: { field, label, unit, color, min, max, logScale, manifestProf }
    const drawLineChart = (data, opts) => {
      const W = 620, H = 220;
      const padL = 56, padR = 24, padT = 14, padB = 36;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;
      const profMin = 2500, profMax = 4162;

      const valMin = opts.min;
      const valMax = opts.max;
      const useLog = opts.logScale && valMin > 0;

      // Escala X (lineal o log)
      const xScale = (v) => {
        if (useLog) {
          const lmin = Math.log10(valMin), lmax = Math.log10(valMax);
          return padL + (Math.log10(Math.max(v, valMin)) - lmin) / (lmax - lmin) * innerW;
        }
        return padL + (v - valMin) / (valMax - valMin) * innerW;
      };
      // Escala Y invertida (0 = superficie, 4162 = fondo)
      const yScale = (p) => padT + (profMax - p) / (profMax - profMin) * innerH;

      // Construir path
      const pts = data.filter(d => d[opts.field] != null && d[opts.field] !== undefined);
      const path = pts.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d[opts.field]).toFixed(1)} ${yScale(d.prof).toFixed(1)}`).join(' ');

      // Marcar pico (manifestaciÃ³n) si aplica
      let manifestMark = '';
      if (opts.manifestProf) {
        const yM = yScale(opts.manifestProf);
        manifestMark = `<line x1="${padL}" y1="${yM.toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${yM.toFixed(1)}" stroke="var(--warn)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          <text x="${(W - padR - 4).toFixed(1)}" y="${(yM - 4).toFixed(1)}" text-anchor="end" font-family="JetBrains Mono" font-size="9" fill="var(--warn)">âš  ${opts.manifestProf} m</text>`;
      }

      // Marcar promedio
      const avg = pts.reduce((s, d) => s + d[opts.field], 0) / pts.length;
      const xAvg = xScale(avg);
      const avgMark = `<line x1="${xAvg.toFixed(1)}" y1="${padT}" x2="${xAvg.toFixed(1)}" y2="${(H - padB).toFixed(1)}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2,4" opacity="0.4"/>`;

      // Marcar puntos individuales
      const dots = pts.map(d => `<circle cx="${xScale(d[opts.field]).toFixed(1)}" cy="${yScale(d.prof).toFixed(1)}" r="2" fill="${opts.color}" opacity="0.7"/>`).join('');

      // Etiquetas eje Y (profundidad) - cada 500m
      const yLabels = [];
      for (let p = 2500; p <= 4162; p += 500) {
        yLabels.push(`<text x="${padL - 8}" y="${(yScale(p) + 3).toFixed(1)}" text-anchor="end" font-family="JetBrains Mono" font-size="9" fill="var(--muted)">${p.toLocaleString('es-MX')}</text>
          <line x1="${padL - 3}" y1="${yScale(p).toFixed(1)}" x2="${padL}" y2="${yScale(p).toFixed(1)}" stroke="var(--muted)" opacity="0.4"/>`);
      }

      // Etiquetas eje X (valor) - 5 marcas
      const xLabels = [];
      const xStep = (valMax - valMin) / 4;
      for (let i = 0; i <= 4; i++) {
        const v = valMin + xStep * i;
        const x = xScale(v);
        const label = useLog
          ? (v >= 1000 ? `${(v/1000).toFixed(1)}k` : `${v}`)
          : (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1));
        xLabels.push(`<text x="${x.toFixed(1)}" y="${(H - padB + 16).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--muted)">${label}</text>
          <line x1="${x.toFixed(1)}" y1="${(H - padB).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(H - padB + 3).toFixed(1)}" stroke="var(--muted)" opacity="0.4"/>`);
      }

      // LÃ­neas de grid horizontales
      const gridLines = [];
      for (let p = 2500; p <= 4162; p += 500) {
        gridLines.push(`<line x1="${padL}" y1="${yScale(p).toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${yScale(p).toFixed(1)}" stroke="var(--line-soft)" stroke-width="1"/>`);
      }

      // Bordes del Ã¡rea de grÃ¡fica
      const frame = `<rect x="${padL}" y="${padT}" width="${innerW}" height="${innerH}" fill="none" stroke="var(--line)" stroke-width="1"/>`;

      return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Outfit',sans-serif">
        ${gridLines.join('')}
        ${frame}
        ${avgMark}
        ${path ? `<path d="${path}" fill="none" stroke="${opts.color}" stroke-width="1.5" stroke-linejoin="round"/>` : ''}
        ${dots}
        ${manifestMark}
        ${xLabels.join('')}
        ${yLabels.join('')}
        <text x="${padL}" y="${(H - 6).toFixed(1)}" font-size="9" fill="var(--muted)">${opts.label} (${opts.unit})</text>
        <text x="${(W - padR).toFixed(1)}" y="${(H - 6).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--muted)">Promedio: ${useLog ? avg.toFixed(0) : (avg % 1 === 0 ? avg.toFixed(0) : avg.toFixed(2))}</text>
      </svg>`;
    };

    // Card individual de grÃ¡fica con tÃ­tulo, mÃ©tricas y SVG
    const chartCard = (title, subtitle, value, sub, svg) => `
      <div class="chart-card">
        <div class="chart-card-head">
          <div>
            <div class="chart-card-title">${title}</div>
            <div class="chart-card-sub">${subtitle}</div>
          </div>
          <div class="chart-card-value">
            <div class="chart-card-big">${value}</div>
            <div class="chart-card-mini">${sub}</div>
          </div>
        </div>
        <div class="chart-card-svg">${svg}</div>
      </div>`;

    /* ======================== VISTA: VISOR DE PARÃMETROS ======================== */
    // Mapeo de cabina -> dataset. Solo Mulach-12 tiene datos de momento.
    // Para otras cabinas se muestra empty state.
    const VISOR_DATA = {
      'mulach-12': { params: PARAMS_MULACH, croma: CROMA_MULACH, label: 'Mulach-12', etapa: '12.25" â†’ 8.5"' },
      'pokche-12': null,
    };

    const renderVisor = (cabinId) => {
      const dataset = VISOR_DATA[cabinId];
      if (!dataset) {
        return `
          <div class="visor-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 3v18"/>
            </svg>
            <h3>Sin datos de parÃ¡metros</h3>
            <p>Esta cabina aÃºn no tiene series de tiempo de parÃ¡metros o cromatografÃ­a cargadas.</p>
            <p class="muted">Los datos disponibles son Ãºnicamente de <strong>Mulach-12</strong> (CSV BASE GENERAL y TABLA CROMATOGRAFIA del proyecto).</p>
          </div>`;
      }

      const { params, croma, label, etapa } = dataset;
      // Calcular promedios
      const avg = (arr, key) => arr.reduce((s, d) => s + d[key], 0) / arr.length;
      const min = (arr, key) => Math.min(...arr.map(d => d[key]));
      const max = (arr, key) => Math.max(...arr.map(d => d[key]));

      const charts = [
        {
          field: 'wob', label: 'WOB (Peso sobre barrena)', unit: 'ton', color: 'var(--primary)',
          min: 0, max: 12, manifestProf: null,
          avgVal: avg(params, 'wob'), minVal: min(params, 'wob'), maxVal: max(params, 'wob'),
        },
        {
          field: 'rpm', label: 'RPM', unit: 'rpm', color: 'var(--primary)',
          min: 0, max: 160, manifestProf: null,
          avgVal: avg(params, 'rpm'), minVal: min(params, 'rpm'), maxVal: max(params, 'rpm'),
        },
        {
          field: 'spp', label: 'PresiÃ³n de bomba (SPP)', unit: 'psi', color: 'var(--primary)',
          min: 0, max: 4200, manifestProf: null,
          avgVal: avg(params, 'spp'), minVal: min(params, 'spp'), maxVal: max(params, 'spp'),
        },
        {
          field: 'gpm', label: 'Gasto (GPM)', unit: 'gpm', color: 'var(--primary)',
          min: 0, max: 1000, manifestProf: null,
          avgVal: avg(params, 'gpm'), minVal: min(params, 'gpm'), maxVal: max(params, 'gpm'),
        },
        {
          field: 'denIn', label: 'Densidad lodo entrada', unit: 'g/cmÂ³', color: 'var(--accent)',
          min: 1.45, max: 1.60, manifestProf: null,
          avgVal: avg(params, 'denIn'), minVal: min(params, 'denIn'), maxVal: max(params, 'denIn'),
        },
        {
          field: 'denOut', label: 'Densidad lodo salida', unit: 'g/cmÂ³', color: 'var(--accent)',
          min: 1.45, max: 1.60, manifestProf: null,
          avgVal: avg(params, 'denOut'), minVal: min(params, 'denOut'), maxVal: max(params, 'denOut'),
        },
        {
          field: 'tempIn', label: 'Temperatura entrada', unit: 'Â°C', color: 'var(--gold)',
          min: 38, max: 50, manifestProf: null,
          avgVal: avg(params, 'tempIn'), minVal: min(params, 'tempIn'), maxVal: max(params, 'tempIn'),
        },
        {
          field: 'tempOut', label: 'Temperatura salida', unit: 'Â°C', color: 'var(--gold)',
          min: 50, max: 60, manifestProf: null,
          avgVal: avg(params, 'tempOut'), minVal: min(params, 'tempOut'), maxVal: max(params, 'tempOut'),
        },
        {
          field: 'gas', label: 'Gas total (C1+)', unit: 'ppm', color: 'var(--warn)',
          min: 0, max: 11000, manifestProf: 3580, logScale: true,
          avgVal: avg(croma, 'gas'), minVal: min(croma, 'gas'), maxVal: max(croma, 'gas'),
        },
      ];

      return `
        <div class="visor-controls">
          <div class="visor-info">
            <strong>${label}</strong> Â· Etapa ${etapa} (2500-4162 m MD) Â·
            <span class="mono">${params.length} puntos de parÃ¡metros Â· ${croma.length} puntos de cromatografÃ­a</span>
          </div>
          <div class="visor-legend">
            <span class="legend-item"><span class="legend-line" style="background:var(--primary)"></span>ParÃ¡metros</span>
            <span class="legend-item"><span class="legend-line" style="background:var(--accent)"></span>Densidad</span>
            <span class="legend-item"><span class="legend-line" style="background:var(--gold)"></span>Temperatura</span>
            <span class="legend-item"><span class="legend-line" style="background:var(--warn)"></span>Gas</span>
            <span class="legend-item"><span class="legend-dash"></span>Promedio</span>
            <span class="legend-item"><span class="legend-warn"></span>ManifestaciÃ³n</span>
          </div>
        </div>
        <div class="charts-grid">
          ${charts.map(c => chartCard(
            c.label,
            `${c.unit} Â· Eje Y: profundidad (m MD)`,
            `${(c.avgVal % 1 === 0 ? c.avgVal.toFixed(0) : c.avgVal.toFixed(2))}`,
            `min ${(c.minVal % 1 === 0 ? c.minVal.toFixed(0) : c.minVal.toFixed(2))} Â· max ${(c.maxVal % 1 === 0 ? c.maxVal.toFixed(0) : c.maxVal.toFixed(2))}`,
            drawLineChart(c.field === 'gas' ? croma : params, c)
          )).join('')}
        </div>`;
    };

    /* ======================== COMPONENTES ======================== */
    const metricCard = (label, value, sub, trend) => `
      <div class="metric-card">
        <div class="metric-label">${label}</div>
        <div class="metric-value mono">${value}</div>
        ${sub ? `<div class="metric-sub">${sub}</div>` : ''}
        ${trend ? `<div class="metric-trend">${trend}</div>` : ''}
      </div>`;

    const badge = (status) => {
      const map = {
        active: ['badge-active', 'Activa'],
        completed: ['badge-completed', 'Cerrada'],
        manifestation: ['badge-manifestation', 'ManifestaciÃ³n'],
        pending: ['badge-pending', 'Pendiente'],
      };
      const [cls, label] = map[status] || map.pending;
      return `<span class="badge ${cls}"><span class="badge-dot"></span>${label}</span>`;
    };

    const navItem = (icon, label, hash, active=false) => `
      <div class="nav-item ${active ? 'active' : ''}" onclick="navigate('${hash}')">
        ${icon} <span>${label}</span>
      </div>`;

    const cabinSubItem = (cabin, active=false) => `
      <div class="nav-sub-item ${active ? 'active' : ''}" onclick="navigate('#/cabin/${cabin.id}')">${cabin.nombre}</div>`;

    /* ======================== SIDEBAR ======================== */
    const renderSidebar = (activeRoute) => {
      const cabinsOpen = activeRoute.startsWith('cabin');
      return `
        <aside id="sidebar">
          <div class="sidebar-header">
            <div class="logo-mark">CG</div>
            <div class="logo-text">CabinasGeolÃ³gicas<small>${MOCK_USER.empresa}</small></div>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-section">
              <div class="nav-label">Principal</div>
              ${navItem(ICONS.dashboard, 'Dashboard', '#/dashboard', activeRoute === 'dashboard')}
              <div class="nav-item" onclick="document.getElementById('cabins-sub').classList.toggle('open')">
                ${ICONS.cabin} <span>Cabinas</span>
                <span style="margin-left:auto">${ICONS.chevron}</span>
              </div>
              <div id="cabins-sub" class="nav-sub ${cabinsOpen ? 'open' : ''}">
                ${MOCK_CABINS.map(c => cabinSubItem(c, activeRoute === 'cabin' && location.hash.includes(c.id))).join('')}
              </div>
            </div>
            <div class="nav-section">
              <div class="nav-label">Reportes</div>
              ${navItem(ICONS.report, 'Reportes', '#/dashboard', false)}
              ${navItem(ICONS.alert, 'Manifestaciones', '#/manifestation/2022-07-26', activeRoute === 'manifestation')}
            </div>
            <div class="nav-section">
              <div class="nav-label">Sistema</div>
              ${navItem(ICONS.settings, 'ConfiguraciÃ³n', '#/settings', activeRoute === 'settings')}
            </div>
          </nav>
          <div class="sidebar-footer">
            <div class="user-avatar">GG</div>
            <div class="user-info">
              <div class="user-name">${MOCK_USER.nombre}</div>
              <div class="user-email">${MOCK_USER.email}</div>
            </div>
          </div>
        </aside>`;
    };

    const renderTopbar = (breadcrumb) => `
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="menu-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">${ICONS.menu}</button>
          <div class="breadcrumb">${breadcrumb}</div>
        </div>
        <div class="topbar-actions">
          <button class="btn btn-ghost" onclick="navigate('#/login')">${ICONS.logout}<span>Salir</span></button>
        </div>
      </div>`;

    /* ======================== VISTAS ======================== */
    const renderLogin = () => `
      <div class="login-screen">
        <div class="login-card">
          <div class="login-logo">CG</div>
          <h1>CabinasGeolÃ³gicas</h1>
          <p>Panel de control para automatizaciÃ³n de reportes geolÃ³gicos</p>
          <button class="btn-google" onclick="navigate('#/dashboard')">
            ${ICONS.google} Entrar con Google
          </button>
          <div class="login-foot">Acceso demo Â· No se requiere contraseÃ±a</div>
        </div>
      </div>`;

    const renderDashboard = () => {
      const activas = MOCK_CABINS.filter(c => c.estado === 'active').length;
      const reportes = MOCK_REPORTS.length;
      const manif = MOCK_CABINS.reduce((s, c) => s + c.manif_count, 0);
      const gasMax = Math.max(...MOCK_CABINS.map(c => c.gas_max));
      return `
        ${renderTopbar('<strong>Dashboard</strong>')}
        <div class="content">
          <div class="view-header">
            <h1 class="view-title">Buenos dÃ­as, ${MOCK_USER.nombre.split(' ')[0]}</h1>
            <p class="view-subtitle">Resumen operativo de ${MOCK_USER.empresa} â€” ${new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div class="metrics-grid">
            ${metricCard('Cabinas activas', activas, `${MOCK_CABINS.length} totales`)}
            ${metricCard('Reportes del mes', reportes, '12 Ãºltimos 30 dÃ­as')}
            ${metricCard('Manifestaciones', manif, 'Detectadas en 2022')}
            ${metricCard('Gas mÃ¡ximo', fmt(gasMax) + ' ppm', 'Mulach-12 / 26 jul', '+70Ã— background')}
          </div>

          <div class="section-card">
            <div class="section-card-header">
              <h3>Cabinas</h3>
              <div style="display:flex;gap:0.5rem">
                <button class="btn btn-primary" onclick="navigate('#/cabin/new')">+ Nueva cabina</button>
                <button class="btn btn-secondary">${ICONS.upload}<span>Subir CSV</span></button>
              </div>
            </div>
            <div class="cabin-list">
              ${MOCK_CABINS.map(c => `
                <div class="cabin-card" onclick="navigate('#/cabin/${c.id}')">
                  <div class="cabin-icon">${ICONS.cabin}</div>
                  <div>
                    <div class="cabin-name">${c.nombre}</div>
                    <div class="cabin-meta">${c.equipo} Â· ${c.operador} Â· ${c.formacion}</div>
                    <div style="margin-top:0.5rem">${badge(c.estado)}</div>
                  </div>
                  <div class="cabin-stats">
                    <div><div class="cabin-stat-value mono">${fmt(c.profundidad_total)}</div><div class="cabin-stat-label">Prof m</div></div>
                    <div><div class="cabin-stat-value mono">${c.rop_prom || 'â€”'}</div><div class="cabin-stat-label">ROP m/h</div></div>
                    <div><div class="cabin-stat-value mono">${fmt(c.gas_max)}</div><div class="cabin-stat-label">Gas ppm</div></div>
                  </div>
                </div>`).join('')}
            </div>
          </div>

          <div class="section-card">
            <div class="section-card-header"><h3>Reportes recientes</h3></div>
            <table class="params-table">
              <thead><tr><th>Fecha</th><th>Pozo</th><th>Tipo</th><th class="num">Prof. inicial</th><th class="num">Prof. final</th><th class="num">Metros</th><th class="num">ROP</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                ${MOCK_REPORTS.map(r => `
                  <tr>
                    <td class="mono">${r.fecha}</td>
                    <td>${getCabin(r.cabin).nombre}</td>
                    <td>${r.tipo}</td>
                    <td class="num">${fmt(r.prof_ini)}</td>
                    <td class="num">${fmt(r.prof_fin)}</td>
                    <td class="num">${fmt(r.metros)}</td>
                    <td class="num">${r.rop}</td>
                    <td>${badge(r.status)}</td>
                    <td><button class="btn btn-ghost" onclick="navigate('#/report/${r.id}')">Ver â†’</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    };

    const renderCabin = () => {
      const id = location.hash.split('?')[0].split('/').pop();
      const cabin = getCabin(id);
      if (!cabin) return renderDashboard();
      const tab = (location.hash.split('?tab=')[1]) || 'resumen';

      const tabContent = {
        visor: renderVisor(cabin.id),
        resumen: `
          <div class="section-card">
            <h3>InformaciÃ³n del pozo</h3>
            <table class="params-table">
              <tr><td class="label">Pozo</td><td class="num mono">${cabin.nombre}</td></tr>
              <tr><td class="label">Campo</td><td class="num mono">${cabin.campo}</td></tr>
              <tr><td class="label">Equipo</td><td class="num mono">${cabin.equipo}</td></tr>
              <tr><td class="label">Operador</td><td class="num mono">${cabin.operador}</td></tr>
              <tr><td class="label">Etapa actual</td><td class="num mono">${cabin.etapa}</td></tr>
              <tr><td class="label">FormaciÃ³n objetivo</td><td class="num mono">${cabin.formacion}</td></tr>
              <tr><td class="label">Inicio perforaciÃ³n</td><td class="num mono">${cabin.inicio}</td></tr>
              <tr><td class="label">Profundidad total</td><td class="num mono">${fmt(cabin.profundidad_total)} m MD</td></tr>
              <tr><td class="label">DÃ­as operaciÃ³n</td><td class="num mono">${cabin.dias_op}</td></tr>
              <tr><td class="label">Estado</td><td>${badge(cabin.estado)}</td></tr>
            </table>
          </div>`,
        parametros: (() => {
          const dataset = VISOR_DATA[cabin.id];
          if (!dataset) {
            return `<div class="visor-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 3v18"/>
              </svg>
              <h3>Sin parÃ¡metros de perforaciÃ³n</h3>
              <p>Esta cabina aÃºn no tiene datos de parÃ¡metros (CSV BASE GENERAL) cargados.</p>
              <p class="muted">Sube el archivo desde la pestaÃ±a <strong>Config</strong> para ver los promedios aquÃ­.</p>
            </div>`;
          }
          const { params } = dataset;
          const min = (k) => Math.min(...params.map(d => d[k]));
          const max = (k) => Math.max(...params.map(d => d[k]));
          const avg = (k) => params.reduce((s, d) => s + d[k], 0) / params.length;
          const fmt = (v) => v % 1 === 0 ? v.toLocaleString('es-MX', {maximumFractionDigits:0}) : v.toFixed(2);
          const rows = [
            { label: 'ROP', key: 'rop', unit: 'm/h', decimals: 0 },
            { label: 'Densidad lodo entrada', key: 'denIn', unit: 'g/cmÂ³', decimals: 2 },
            { label: 'Densidad lodo salida', key: 'denOut', unit: 'g/cmÂ³', decimals: 2 },
            { label: 'PresiÃ³n de bomba', key: 'spp', unit: 'psi', decimals: 0 },
            { label: 'RPM', key: 'rpm', unit: 'rpm', decimals: 0 },
            { label: 'WOB', key: 'wob', unit: 'ton', decimals: 2 },
            { label: 'Gasto', key: 'gpm', unit: 'gpm', decimals: 0 },
            { label: 'Temp. entrada', key: 'tempIn', unit: 'Â°C', decimals: 1 },
            { label: 'Temp. salida', key: 'tempOut', unit: 'Â°C', decimals: 1 },
          ];
          return `
          <div class="section-card">
            <h3>ParÃ¡metros operacionales â€” Promedio 24h</h3>
            <p class="view-subtitle" style="margin-bottom:1rem">Datos del CSV BASE GENERAL Â· ${params.length} puntos sub-muestreados</p>
            <table class="params-table">
              <thead><tr><th>ParÃ¡metro</th><th>MÃ­nimo</th><th>Promedio</th><th>MÃ¡ximo</th><th>Unidad</th></tr></thead>
              <tbody>
                ${rows.map(r => `
                  <tr>
                    <td class="label">${r.label}</td>
                    <td class="num mono">${fmt(min(r.key))}</td>
                    <td class="num mono">${fmt(avg(r.key))}</td>
                    <td class="num mono">${fmt(max(r.key))}</td>
                    <td>${r.unit}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`;
        })(),
        reportes: `
          <div class="section-card">
            <div class="section-card-header">
              <h3>Reportes generados</h3>
              <button class="btn btn-primary" onclick="navigate('#/cabin/${cabin.id}/upload')">${ICONS.upload}<span>Subir CSV</span></button>
            </div>
            <table class="params-table">
              <thead><tr><th>Fecha</th><th>Tipo</th><th class="num">Metros</th><th class="num">ROP</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                ${MOCK_REPORTS.filter(r => r.cabin === cabin.id).map(r => `
                  <tr>
                    <td class="mono">${r.fecha}</td>
                    <td>${r.tipo}</td>
                    <td class="num">${fmt(r.metros)}</td>
                    <td class="num">${r.rop}</td>
                    <td>${badge(r.status)}</td>
                    <td><button class="btn btn-ghost" onclick="navigate('#/report/${r.id}')">Ver â†’</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`,
        manifestaciones: `
          <div class="section-card">
            <h3>Manifestaciones detectadas</h3>
            ${cabin.manif_count > 0 ? `
              <div class="cabin-card" style="cursor:default" onclick="navigate('#/manifestation/${MOCK_MANIFEST.id}')">
                <div class="cabin-icon" style="background:var(--warn-soft);color:var(--warn)">${ICONS.alert}</div>
                <div>
                  <div class="cabin-name">ManifestaciÃ³n No. 2 â€” ${MOCK_MANIFEST.fecha}</div>
                  <div class="cabin-meta">Profundidad ${fmt(MOCK_MANIFEST.profundidad)} m Â· Gas ${fmt(MOCK_MANIFEST.gas_lectura)} ppm Â· Factor ${MOCK_MANIFEST.factor_pico}Ã—</div>
                </div>
                <button class="btn btn-secondary">Ver reporte â†’</button>
              </div>` : '<p class="view-subtitle">No se han detectado manifestaciones en este pozo.</p>'}
          </div>`,
        config: `
          <div class="section-card">
            <h3>ConfiguraciÃ³n de la cabina</h3>
            <table class="params-table">
              <tr><td class="label">Empresa operadora</td><td>${cabin.empresa}</td></tr>
              <tr><td class="label">Equipo de perforaciÃ³n</td><td>${cabin.equipo}</td></tr>
              <tr><td class="label">Operador petrolero</td><td>${cabin.operador}</td></tr>
              <tr><td class="label">Notificaciones email</td><td><span class="badge badge-active"><span class="badge-dot"></span>Activas</span></td></tr>
              <tr><td class="label">Auto-generar SIOP</td><td><span class="badge badge-active"><span class="badge-dot"></span>06:00 hrs</span></td></tr>
              <tr><td class="label">Umbral gas (alerta)</td><td class="num mono">2,000 ppm</td></tr>
              <tr><td class="label">Factor pico manifestaciÃ³n</td><td class="num mono">5Ã—</td></tr>
              <tr><td class="label">Archivos cargados</td><td>${cabin.archivos_cargados || 0} de 8</td></tr>
            </table>
          </div>
          <div class="section-card">
            <h3>Archivos de la cabina</h3>
            <p class="view-subtitle" style="margin-bottom:1rem">Gestiona los archivos que alimentan los reportes automÃ¡ticos. Mismos controles que durante el alta.</p>
            ${renderArchivosList(cabin.archivos || { parametros: null, cromatografia: null, plantilla_siop: null, ejemplos_siop: [], atlas_litologico: null, paleontologia: null, survey: null, barrena: null, programa: null }, cabin.id)}
          </div>`,
      };

      const tabs = ['visor', 'resumen', 'parametros', 'reportes', 'manifestaciones', 'config'];
      return `
        ${renderTopbar(`<strong>Cabinas</strong> / ${cabin.nombre}`)}
        <div class="content">
          <div class="view-header">
            <h1 class="view-title">${cabin.nombre}</h1>
            <p class="view-subtitle">${cabin.campo} Â· ${cabin.equipo} Â· ${badge(cabin.estado)}</p>
            <div class="view-actions">
              <button class="btn btn-primary" onclick="navigate('#/cabin/${cabin.id}/upload')">${ICONS.upload}<span>Subir CSV</span></button>
              <button class="btn btn-secondary">${ICONS.fileText}<span>Exportar</span></button>
            </div>
          </div>
          <div class="tabs">
            ${tabs.map(t => `<div class="tab ${t === tab ? 'active' : ''}" onclick="navigate('#/cabin/${cabin.id}?tab=${t}')">${t.charAt(0).toUpperCase() + t.slice(1)}</div>`).join('')}
          </div>
          ${tabContent[tab] || tabContent.resumen}
        </div>`;
    };

    const renderUpload = () => {
      const id = location.hash.split('/').slice(-2, -1)[0];
      const cabin = getCabin(id);
      if (!cabin) return renderDashboard();

      const previewRows = [
        ['08:00', '3450.5', '12.4', '95', '3200', '1.52', '1.52', '180'],
        ['09:00', '3462.9', '12.4', '92', '3250', '1.52', '1.52', '210'],
        ['10:00', '3475.2', '12.3', '88', '3300', '1.52', '1.52', '195'],
        ['11:00', '3487.6', '12.4', '94', '3280', '1.52', '1.52', '205'],
        ['12:00', '3500.0', '12.4', '96', '3290', '1.52', '1.52', '188'],
      ];

      return `
        ${renderTopbar(`<strong>Cabinas</strong> / ${cabin.nombre} / <strong>Subir CSV</strong>`)}
        <div class="content">
          <div class="view-header">
            <h1 class="view-title">Subir CSV del dÃ­a</h1>
            <p class="view-subtitle">El archivo se procesarÃ¡ con IA y generarÃ¡ el SIOP automÃ¡ticamente. Vista previa antes de generar.</p>
          </div>

          <div class="upload-zone" id="dropzone" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="event.preventDefault();this.classList.remove('dragover');showToast('CSV cargado (mock)')">
            ${ICONS.upload}
            <h3>Arrastra tu archivo CSV aquÃ­</h3>
            <p>O haz click para seleccionar Â· MÃ¡ximo 50 MB</p>
            <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--muted)">Formato esperado: PWD / SCADA con columnas de profundidad, ROP, WOB, RPM, densidad, gas</p>
          </div>

          <div class="upload-preview">
            <div class="upload-preview-header">
              <div>
                <strong>base_general_2022_07_28.csv</strong>
                <div class="cabin-meta" style="margin-top:0.2rem">3,007 filas Â· Ãšltima modificaciÃ³n: 28/07/2022 23:58 hrs</div>
              </div>
              <button class="btn btn-primary" onclick="navigate('#/report/siop-2022-07-28')">${ICONS.check}<span>Generar SIOP</span></button>
            </div>
            <div style="overflow-x:auto">
              <table class="preview-table">
                <thead><tr><th>hora</th><th>prof_m</th><th>wob_ton</th><th>rop_mh</th><th>pp_psi</th><th>den_in</th><th>den_out</th><th>gas_ppm</th></tr></thead>
                <tbody>${previewRows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
              </table>
            </div>
            <p style="margin-top:1rem;font-size:0.8rem;color:var(--muted)">Mostrando 5 de 3,007 filas Â· <a style="color:var(--primary);cursor:pointer" onclick="showToast('Descargando CSV completo...')">descargar completo</a></p>
          </div>
        </div>`;
    };

    const renderReport = () => {
      const id = location.hash.split('/').pop();
      const report = getReport(id);
      if (!report) return renderDashboard();
      const cabin = getCabin(report.cabin);

      return `
        ${renderTopbar(`<strong>Reportes</strong> / ${report.tipo} ${report.fecha}`)}
        <div class="content">
          <div class="report-header">
            <div class="view-title">SIOP â€” ${report.fecha}</div>
            <div class="report-meta">
              <div><strong>Pozo:</strong> ${cabin.nombre}</div>
              <div><strong>Etapa:</strong> ${cabin.etapa}</div>
              <div><strong>FormaciÃ³n:</strong> ${cabin.formacion}</div>
              <div><strong>Operador:</strong> ${cabin.operador}</div>
              <div>${badge(report.status)}</div>
            </div>
            <div class="view-actions">
              <button class="btn btn-primary" onclick="showToast('Reporte validado')">${ICONS.check}<span>Validar reporte</span></button>
              <button class="btn btn-secondary" onclick="showToast('Generando PDF...')">${ICONS.download}<span>Exportar PDF</span></button>
            </div>
          </div>

          <div class="report-body">
            <div class="report-section">
              <h4>PerforaciÃ³n 24h</h4>
              <div class="report-grid">
                <div class="report-grid-item"><span>Profundidad 00:00 hrs</span><span>${fmt(report.prof_ini)} m</span></div>
                <div class="report-grid-item"><span>Profundidad 24:00 hrs</span><span>${fmt(report.prof_fin)} m</span></div>
                <div class="report-grid-item"><span>Metros perforados</span><span>${fmt(report.metros)} m</span></div>
                <div class="report-grid-item"><span>ROP promedio</span><span>${report.rop} m/h</span></div>
                <div class="report-grid-item"><span>Tiempo perforando</span><span>18.5 hrs</span></div>
                <div class="report-grid-item"><span>Tiempo no productivo</span><span>5.5 hrs</span></div>
              </div>
            </div>

            <div class="report-section">
              <h4>ParÃ¡metros de perforaciÃ³n</h4>
              <div class="report-grid">
                <div class="report-grid-item"><span>Densidad entrada</span><span>1.52 g/cmÂ³</span></div>
                <div class="report-grid-item"><span>Densidad salida</span><span>1.53 g/cmÂ³</span></div>
                <div class="report-grid-item"><span>PresiÃ³n de bomba</span><span>2,650 psi</span></div>
                <div class="report-grid-item"><span>RPM</span><span>115</span></div>
                <div class="report-grid-item"><span>WOB</span><span>5 ton</span></div>
                <div class="report-grid-item"><span>Torque</span><span>5,800 lb-ft</span></div>
              </div>
            </div>

            <div class="report-section">
              <h4>Gas y manifestaciones</h4>
              <div class="report-grid">
                <div class="report-grid-item"><span>Gas total promedio</span><span>450 ppm</span></div>
                <div class="report-grid-item"><span>Gas total mÃ¡ximo</span><span>${fmt(report.id === 'siop-2022-07-28' ? 10260 : 850)} ppm</span></div>
                <div class="report-grid-item"><span>C1 (metano)</span><span>320 ppm</span></div>
                <div class="report-grid-item"><span>C2 (etano)</span><span>85 ppm</span></div>
                <div class="report-grid-item"><span>C3 (propano)</span><span>32 ppm</span></div>
                <div class="report-grid-item"><span>Manifestaciones</span><span>${report.id === 'siop-2022-07-15' ? '0' : '1 (ver detalle)'}</span></div>
              </div>
            </div>

            <div class="report-section">
              <h4>LitologÃ­a</h4>
              <div class="observations">
                Lutita gris claro, ligeramente calcÃ¡rea, con escasas piritas diseminadas. Trazas de foraminÃ­feros planctÃ³nicos. Dureza media, fractura concoidea. Mioceno Superior.
              </div>
            </div>

            <div class="report-section">
              <h4>Observaciones operativas</h4>
              <div class="observations">
                ${report.id === 'siop-2022-07-15' ? 'Inicio de etapa 9 5/8". InstalaciÃ³n de cabina de registros continuos. Pruebas de BOP exitosas. Se continÃºa perforando con sarta rotatoria.' :
                  report.id === 'siop-2022-07-16' ? 'ContinÃºa perforaciÃ³n. Sarta rotatoria estable. Conexiones cada 9.5 m. Sin incidencias. Backreaming nocturno de 02:00 a 03:30 hrs por empaquetamiento.' :
                  'Cierre de etapa 8 1/2". Profundidad final alcanzada. corrida de registros elÃ©ctricos programada para las siguientes 24 hrs. POZO EN CONDICIONES DE BAJAR COMPLETACIÃ“N.'}
              </div>
            </div>
          </div>
        </div>`;
    };

    const renderManifest = () => `
      ${renderTopbar('<strong>Manifestaciones</strong> / Mulach-12')}
      <div class="content">
        <div class="view-header">
          <h1 class="view-title">ManifestaciÃ³n No. 2</h1>
          <p class="view-subtitle">Mulach-12 Â· ${MOCK_MANIFEST.fecha}</p>
          <div class="view-actions">
            <button class="btn btn-secondary" onclick="navigate('#/report/siop-2022-07-28')">${ICONS.fileText}<span>Ver SIOP del dÃ­a</span></button>
            <button class="btn btn-primary" onclick="showToast('Reporte de manifestaciÃ³n generado')">${ICONS.download}<span>Exportar reporte</span></button>
          </div>
        </div>

        <div class="manifest-hero">
          <h2>${MOCK_MANIFEST.factor_pico}Ã— sobre background</h2>
          <p style="color:var(--ink-2)">Pico de gas detectado durante perforaciÃ³n. Cambio litolÃ³gico probable.</p>
          <div class="manifest-stats">
            <div>
              <div class="manifest-stat-label">Profundidad</div>
              <div class="manifest-stat-value">${fmt(MOCK_MANIFEST.profundidad)} m</div>
            </div>
            <div>
              <div class="manifest-stat-label">Gas lectura</div>
              <div class="manifest-stat-value" style="color:var(--warn)">${fmt(MOCK_MANIFEST.gas_lectura)} ppm</div>
            </div>
            <div>
              <div class="manifest-stat-label">Background</div>
              <div class="manifest-stat-value">${fmt(MOCK_MANIFEST.gas_background)} ppm</div>
            </div>
            <div>
              <div class="manifest-stat-label">Tiempo respuesta</div>
              <div class="manifest-stat-value">${MOCK_MANIFEST.tiempo_respuesta} min</div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h3>AnÃ¡lisis</h3>
          <table class="params-table">
            <tr><td class="label">FormaciÃ³n</td><td>${MOCK_MANIFEST.formacion}</td></tr>
            <tr><td class="label">Causa probable</td><td>${MOCK_MANIFEST.causa}</td></tr>
            <tr><td class="label">Componentes del gas</td><td class="mono">C1: 8,200 ppm Â· C2: 1,450 ppm Â· C3: 410 ppm Â· iC4: 95 ppm</td></tr>
            <tr><td class="label">AcciÃ³n tomada</td><td>CirculaciÃ³n de fondo, control de densidad +0.03 g/cmÂ³, monitoreo continuo por 2 hrs</td></tr>
            <tr><td class="label">ResoluciÃ³n</td><td><span class="badge badge-active"><span class="badge-dot"></span>Controlada a las 19:42 hrs</span></td></tr>
            <tr><td class="label">ReportÃ³</td><td>GeÃ³logo de turno: J. HernÃ¡ndez Â· ValidÃ³: ${MOCK_USER.nombre}</td></tr>
          </table>
        </div>
      </div>`;

    const renderSettings = () => `
      ${renderTopbar('<strong>ConfiguraciÃ³n</strong>')}
      <div class="content">
        <div class="view-header">
          <h1 class="view-title">ConfiguraciÃ³n</h1>
          <p class="view-subtitle">Datos de la empresa, plan y usuarios del equipo</p>
        </div>

        <div class="section-card">
          <h3>Empresa</h3>
          <table class="params-table">
            <tr><td class="label">RazÃ³n social</td><td>Data-AgenThinkOs S.A. de C.V.</td></tr>
            <tr><td class="label">RFC</td><td class="mono">DAS240107XX9</td></tr>
            <tr><td class="label">Domicilio fiscal</td><td>Villahermosa, Tabasco, MÃ©xico</td></tr>
            <tr><td class="label">Contacto principal</td><td>${MOCK_USER.nombre} Â· ${MOCK_USER.email}</td></tr>
            <tr><td class="label">Plan actual</td><td><span class="badge badge-active"><span class="badge-dot"></span>${MOCK_USER.plan}</span></td></tr>
            <tr><td class="label">Cabinas contratadas</td><td>1 de 1 (piloto)</td></tr>
            <tr><td class="label">PrÃ³xima facturaciÃ³n</td><td class="mono">15/10/2026 Â· $50,000 MXN</td></tr>
          </table>
        </div>

        <div class="section-card">
          <h3>Equipo de trabajo</h3>
          <table class="params-table">
            <thead><tr><th>Nombre</th><th>Rol</th><th>Email</th><th>Ãšltimo acceso</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>${MOCK_USER.nombre}</td><td>Administrador</td><td class="mono">${MOCK_USER.email}</td><td class="mono">Hoy, 14:32</td><td><span class="badge badge-active"><span class="badge-dot"></span>Activo</span></td></tr>
              <tr><td>J. HernÃ¡ndez</td><td>GeÃ³logo de turno</td><td class="mono">jhernandez@data-agenthinkos.com</td><td class="mono">Hoy, 06:18</td><td><span class="badge badge-active"><span class="badge-dot"></span>Activo</span></td></tr>
              <tr><td>M. RodrÃ­guez</td><td>GeÃ³logo de turno</td><td class="mono">mrodriguez@data-agenthinkos.com</td><td class="mono">Ayer, 22:05</td><td><span class="badge badge-active"><span class="badge-dot"></span>Activo</span></td></tr>
              <tr><td>L. VÃ¡zquez</td><td>GeÃ³logo de turno</td><td class="mono">lvazquez@data-agenthinkos.com</td><td class="mono">15 sep, 18:44</td><td><span class="badge badge-completed"><span class="badge-dot"></span>Inactivo</span></td></tr>
            </tbody>
          </table>
        </div>

        <div class="section-card">
          <h3>Notificaciones</h3>
          <table class="params-table">
            <tr><td class="label">Reporte diario generado</td><td><span class="badge badge-active"><span class="badge-dot"></span>Email 06:00 hrs</span></td></tr>
            <tr><td class="label">ManifestaciÃ³n detectada</td><td><span class="badge badge-active"><span class="badge-dot"></span>Email + SMS inmediato</span></td></tr>
            <tr><td class="label">ValidaciÃ³n pendiente</td><td><span class="badge badge-pending"><span class="badge-dot"></span>Email cada 2 hrs</span></td></tr>
            <tr><td class="label">Resumen semanal</td><td><span class="badge badge-completed"><span class="badge-dot"></span>Desactivado</span></td></tr>
          </table>
        </div>
      </div>`;

    /* ======================== WIZARD ======================== */
    let wizardStep = 1;
    let wizardData = {
      nombre: '', campo: '', empresa: MOCK_USER.empresa, operador: 'OPEX', coordinador: '',
      formacion: '', prof_total: '', etapa_actual: '', etapas_planeadas: '',
      inicio: '', fin_estimada: '', equipo: '', coordenadas: '',
      geologos: '', umbral_gas: 2000, factor_pico: 5, auto_siop_hora: '06:00',
      notif_email: true, notif_sms: false,
      archivos: {
        parametros: null,
        cromatografia: null,
        plantilla_siop: null,
        ejemplos_siop: [],
        atlas_litologico: null,
        paleontologia: null,
        survey: null,
        barrena: null,
        programa: null,
      },
    };

    const wizardSteps = [
      { num: 1, label: 'Datos bÃ¡sicos', validate: () => ({ ok: !!(wizardData.nombre && wizardData.campo), msg: 'Completa nombre del pozo y campo' }) },
      { num: 2, label: 'ConfiguraciÃ³n tÃ©cnica', validate: () => ({ ok: !!(wizardData.formacion && wizardData.prof_total), msg: 'Completa formaciÃ³n y profundidad total' }) },
      { num: 3, label: 'Usuarios y alertas', validate: () => ({ ok: wizardData.geologos.trim().length > 0, msg: 'Asigna al menos un geÃ³logo (email)' }) },
      { num: 4, label: 'Datos de entrada', validate: () => ({ ok: true, msg: '' }) }, // Opcional
    ];

    const resetWizard = () => {
      wizardStep = 1;
      wizardData = {
        nombre: '', campo: '', empresa: MOCK_USER.empresa, operador: 'OPEX', coordinador: '',
        formacion: '', prof_total: '', etapa_actual: '', etapas_planeadas: '',
        inicio: '', fin_estimada: '', equipo: '', coordenadas: '',
        geologos: '', umbral_gas: 2000, factor_pico: 5, auto_siop_hora: '06:00',
        notif_email: true, notif_sms: false,
        archivos: {
          parametros: null,      // CSV BASE GENERAL
          cromatografia: null,   // CSV cromatografÃ­a
          plantilla_siop: null,  // PDF plantilla Pemex
          ejemplos_siop: [],     // PDFs de ejemplo (3-5)
          atlas_litologico: null,// PDF atlas (opcional)
          paleontologia: null,   // PDF paleontologÃ­a (opcional)
          survey: null,          // XLSX survey (opcional)
          barrena: null,         // PDF IADC (opcional)
          programa: null,         // XLSX programa perforaciÃ³n (opcional)
        },
      };
    };

    const renderStepper = () => wizardSteps.map((s, i) => {
      const cls = s.num < wizardStep ? 'done' : s.num === wizardStep ? 'active' : '';
      const dotInner = s.num < wizardStep ? ICONS.check : s.num;
      return `<div class="wizard-step">
        <div class="wizard-dot ${cls}">${dotInner}</div>
        <div class="wizard-label ${cls}">${s.label}</div>
      </div>${i < wizardSteps.length - 1 ? `<div class="wizard-line ${s.num < wizardStep ? 'done' : ''}"></div>` : ''}`;
    }).join('');

    const renderStep1 = () => `
      <div class="section-card">
        <h3>Datos bÃ¡sicos del pozo</h3>
        <p class="view-subtitle" style="margin-bottom:1.5rem">InformaciÃ³n de identificaciÃ³n de la cabina.</p>
        <div class="form-grid">
          <div class="form-field">
            <label>Nombre del pozo *</label>
            <input type="text" value="${wizardData.nombre}" placeholder="Ej: Mulach-13" oninput="wizardData.nombre=this.value">
            <span class="help">Ãšnico dentro de tu empresa</span>
          </div>
          <div class="form-field">
            <label>Campo *</label>
            <input type="text" value="${wizardData.campo}" placeholder="Ej: Mulach" oninput="wizardData.campo=this.value">
          </div>
          <div class="form-field">
            <label>Empresa operadora *</label>
            <input type="text" value="${wizardData.empresa}" disabled>
          </div>
          <div class="form-field">
            <label>Operador petrolero</label>
            <select onchange="wizardData.operador=this.value">
              ${['Pemex','OPEX','PERFOMEX','DS Servicios','Otro'].map(o => `<option ${wizardData.operador===o?'selected':''}>${o}</option>`).join('')}
            </select>
          </div>
          <div class="form-field span-2">
            <label>Coordinador de cabina</label>
            <input type="text" value="${wizardData.coordinador}" placeholder="Nombre completo" oninput="wizardData.coordinador=this.value">
          </div>
        </div>
      </div>`;

    const renderStep2 = () => `
      <div class="section-card">
        <h3>ConfiguraciÃ³n tÃ©cnica</h3>
        <p class="view-subtitle" style="margin-bottom:1.5rem">Programa del pozo y equipo de perforaciÃ³n.</p>
        <div class="form-grid">
          <div class="form-field">
            <label>FormaciÃ³n objetivo *</label>
            <input type="text" value="${wizardData.formacion}" placeholder="Ej: Mioceno Superior" oninput="wizardData.formacion=this.value">
          </div>
          <div class="form-field">
            <label>Profundidad total planeada (m MD) *</label>
            <input type="number" value="${wizardData.prof_total}" placeholder="Ej: 4200" oninput="wizardData.prof_total=this.value">
          </div>
          <div class="form-field">
            <label>Etapa actual</label>
            <input type="text" value="${wizardData.etapa_actual}" placeholder='Ej: 8.5"' oninput="wizardData.etapa_actual=this.value">
          </div>
          <div class="form-field">
            <label>Etapas planeadas</label>
            <input type="text" value="${wizardData.etapas_planeadas}" placeholder='9 5/8" â†’ 8 1/2" â†’ 7"' oninput="wizardData.etapas_planeadas=this.value">
          </div>
          <div class="form-field">
            <label>Inicio perforaciÃ³n</label>
            <input type="date" value="${wizardData.inicio}" oninput="wizardData.inicio=this.value">
          </div>
          <div class="form-field">
            <label>Fin estimado</label>
            <input type="date" value="${wizardData.fin_estimada}" oninput="wizardData.fin_estimada=this.value">
          </div>
          <div class="form-field">
            <label>Equipo de perforaciÃ³n</label>
            <input type="text" value="${wizardData.equipo}" placeholder="Ej: GERSEMI" oninput="wizardData.equipo=this.value">
          </div>
          <div class="form-field">
            <label>Coordenadas (lat, lon)</label>
            <input type="text" value="${wizardData.coordenadas}" placeholder="Opcional" oninput="wizardData.coordenadas=this.value">
          </div>
        </div>
      </div>`;

    const renderStep3 = () => `
      <div class="section-card">
        <h3>Usuarios y alertas</h3>
        <p class="view-subtitle" style="margin-bottom:1.5rem">QuiÃ©nes reciben alertas y cÃ³mo se generan los reportes automÃ¡ticos.</p>
        <div class="form-grid">
          <div class="form-field span-2">
            <label>GeÃ³logos asignados *</label>
            <textarea rows="2" placeholder="Emails separados por coma" oninput="wizardData.geologos=this.value">${wizardData.geologos}</textarea>
            <span class="help">Al menos uno. Estos usuarios tendrÃ¡n acceso a la cabina.</span>
          </div>
          <div class="form-field">
            <label>Umbral de gas para alerta (ppm)</label>
            <input type="number" value="${wizardData.umbral_gas}" oninput="wizardData.umbral_gas=parseInt(this.value)||0">
            <span class="help">Default: 2,000 ppm</span>
          </div>
          <div class="form-field">
            <label>Factor de pico para manifestaciÃ³n (Ã—)</label>
            <input type="number" value="${wizardData.factor_pico}" oninput="wizardData.factor_pico=parseInt(this.value)||0">
            <span class="help">Default: 5Ã— sobre el background</span>
          </div>
          <div class="form-field">
            <label>Hora auto-generaciÃ³n SIOP</label>
            <input type="time" value="${wizardData.auto_siop_hora}" oninput="wizardData.auto_siop_hora=this.value">
            <span class="help">Default: 06:00 hrs</span>
          </div>
          <div class="form-field">
            <label>Notificaciones</label>
            <div class="checkbox-row">
              <label><input type="checkbox" ${wizardData.notif_email?'checked':''} onchange="wizardData.notif_email=this.checked"> Email</label>
              <label><input type="checkbox" ${wizardData.notif_sms?'checked':''} onchange="wizardData.notif_sms=this.checked"> SMS en manifestaciones</label>
            </div>
          </div>
        </div>
      </div>`;

    // ============================================================
    // PASO 4: Datos de entrada (subir archivos)
    // Mapeo de archivos -> documentos que se pueden generar
    // ============================================================
    const ARCHIVOS_REQUERIDOS = [
      {
        key: 'parametros',
        icon: 'ðŸ“Š',  // placeholder - usaremos SVG
        titulo: 'ParÃ¡metros de perforaciÃ³n (BASE GENERAL)',
        formato: 'CSV',
        requerido: true,
        descripcion: 'Profundidad, ROP, WOB, RPM, SPP, GPM, densidad entrada/salida, temperatura entrada/salida. Un registro por metro perforado.',
        genera: ['SIOP (todos los turnos)', 'CDO Matutino y Vespertino', 'DCF Avance de Fluidos', 'Boleta Diaria', 'Visor de parÃ¡metros', 'Lookahead'],
      },
      {
        key: 'cromatografia',
        icon: 'ðŸ”¥',
        titulo: 'CromatografÃ­a de gases',
        formato: 'CSV',
        requerido: true,
        descripcion: 'Gas total, C1 (metano), C2 (etano), C3 (propano), iC4, nC4, iC5, nC5. Un registro por metro perforado.',
        genera: ['DetecciÃ³n automÃ¡tica de manifestaciones', 'GrÃ¡ficos de gas en SIOP', 'Reportes de ManifestaciÃ³n', 'AnÃ¡lisis de ratios (Wetness, Balance)'],
      },
      {
        key: 'plantilla_siop',
        icon: 'ðŸ“„',
        titulo: 'Plantilla Pemex oficial del SIOP',
        formato: 'PDF',
        requerido: false,
        descripcion: 'La plantilla que Pemex te entrega. El sistema aprende el formato exacto y replica el estilo en cada reporte.',
        genera: ['PersonalizaciÃ³n del formato de salida', 'Cumplimiento normativo Pemex'],
      },
      {
        key: 'ejemplos_siop',
        icon: 'ðŸ“‹',
        titulo: 'Ejemplos de SIOP firmados (3-5 PDFs)',
        formato: 'PDF (3-5 archivos)',
        requerido: false,
        descripcion: 'SIOPs reales ya firmados. El sistema los usa como referencia de estilo, redacciÃ³n y estructura.',
        genera: ['Mejor calidad de redacciÃ³n', 'Estilo consistente con tu equipo'],
      },
      {
        key: 'atlas_litologico',
        icon: 'ðŸª¨',
        titulo: 'Atlas litolÃ³gico (opcional)',
        formato: 'PDF',
        requerido: false,
        descripcion: 'DescripciÃ³n de cuttings con fotos por intervalo. Enriquece la secciÃ³n de litologÃ­a en los SIOPs.',
        genera: ['SecciÃ³n de litologÃ­a con mayor detalle', 'CorrelaciÃ³n con pozos vecinos'],
      },
      {
        key: 'paleontologia',
        icon: 'ðŸ¦´',
        titulo: 'Reporte paleontolÃ³gico (opcional)',
        formato: 'PDF',
        requerido: false,
        descripcion: 'DataciÃ³n de fÃ³siles por profundidad. Enriquece la secciÃ³n de paleontologÃ­a.',
        genera: ['SecciÃ³n de paleontologÃ­a con dataciÃ³n automÃ¡tica', 'CorrelaciÃ³n bioestratigrÃ¡fica'],
      },
      {
        key: 'survey',
        icon: 'ðŸ“',
        titulo: 'Survey direccional (opcional)',
        formato: 'XLSX',
        requerido: false,
        descripcion: 'MD, inclinaciÃ³n, azimut, TVD, NS, EW de cada survey. Genera comparaciÃ³n program vs real.',
        genera: ['ComparaciÃ³n program vs real en SIOP', 'Trayectoria visualizada del pozo'],
      },
      {
        key: 'barrena',
        icon: 'ðŸ”§',
        titulo: 'Desgaste de barrena IADC (opcional)',
        formato: 'PDF',
        requerido: false,
        descripcion: 'Reporte de desgaste y dull bit grading. Genera mÃ©tricas de ROP por barrena.',
        genera: ['Performance de barrena', 'Alertas de barrena cerca de fin de vida'],
      },
    ];

    const fileStatus = (key, archivos) => {
      if (key === 'ejemplos_siop') {
        return archivos[key].length > 0
          ? `<span class="file-status loaded">${archivos[key].length} archivo(s) cargados</span>`
          : `<span class="file-status pending">Pendiente Â· ${archivos[key].length}/3 mÃ­nimo recomendado</span>`;
      }
      return archivos[key]
        ? `<span class="file-status loaded">âœ“ Cargado</span>`
        : `<span class="file-status ${ARCHIVOS_REQUERIDOS.find(a => a.key === key).requerido ? 'required' : 'optional'}">${ARCHIVOS_REQUERIDOS.find(a => a.key === key).requerido ? 'Requerido' : 'Opcional'}</span>`;
    };

    // ============================================================
    // FunciÃ³n global para subir/quitar archivos de una cabina ya creada
    // Llamada desde onclick inline (debe estar en window)
    // ============================================================
    window.updateCabinArchivo = function(cabinId, key, value) {
      const cabin = MOCK_CABINS.find(c => c.id === cabinId);
      if (!cabin) return;
      if (!cabin.archivos) cabin.archivos = {
        parametros: null, cromatografia: null, plantilla_siop: null,
        ejemplos_siop: [], atlas_litologico: null, paleontologia: null,
        survey: null, barrena: null, programa: null,
      };
      cabin.archivos[key] = value;
      // Recargar archivos_cargados
      cabin.archivos_cargados = Object.entries(cabin.archivos).filter(([k, v]) => Array.isArray(v) ? v.length > 0 : v !== null).length;
      showToast(value === null || (Array.isArray(value) && value.length === 0) ? 'Archivo quitado' : 'Archivo cargado (mock)');
      renderRoute();
    };

    const fileButton = (key, archivos, cabinId) => {
      // En el wizard usa wizardData.archivos
      // En la cabina ya creada usa window.updateCabinArchivo
      if (cabinId) {
        if (key === 'ejemplos_siop') {
          const count = archivos[key].length;
          return count > 0
            ? `<button class="btn btn-secondary" onclick="window.updateCabinArchivo('${cabinId}','${key}',[])">Quitar todos</button>`
            : `<button class="btn btn-primary" onclick="window.updateCabinArchivo('${cabinId}','${key}',['ejemplo1.pdf','ejemplo2.pdf','ejemplo3.pdf'])">Subir PDFs</button>`;
        }
        return archivos[key]
          ? `<button class="btn btn-secondary" onclick="window.updateCabinArchivo('${cabinId}','${key}',null)">Quitar</button>`
          : `<button class="btn btn-primary" onclick="window.updateCabinArchivo('${cabinId}','${key}','archivo_${key}.csv')">Subir ${ARCHIVOS_REQUERIDOS.find(a => a.key === key).formato}</button>`;
      }
      // Wizard
      if (key === 'ejemplos_siop') {
        const count = archivos[key].length;
        return count > 0
          ? `<button class="btn btn-secondary" onclick="wizardData.archivos.${key}=[];rerenderWizard()">Quitar todos</button>`
          : `<button class="btn btn-primary" onclick="showToast('Subir mÃºltiples PDFs (mock)');wizardData.archivos.${key}=['ejemplo1.pdf','ejemplo2.pdf','ejemplo3.pdf'];rerenderWizard()">Subir PDFs</button>`;
      }
      return archivos[key]
        ? `<button class="btn btn-secondary" onclick="wizardData.archivos.${key}=null;rerenderWizard()">Quitar</button>`
        : `<button class="btn btn-primary" onclick="showToast('Subir archivo (mock)');wizardData.archivos.${key}='archivo_${key}.csv';rerenderWizard()">Subir ${ARCHIVOS_REQUERIDOS.find(a => a.key === key).formato}</button>`;
    };

    // Lista de archivos reutilizable (wizard y post-creaciÃ³n)
    const renderArchivosList = (archivos, cabinId) => {
      return `
        <div class="upload-list">
          ${ARCHIVOS_REQUERIDOS.map(a => {
            const loaded = a.key === 'ejemplos_siop' ? archivos[a.key].length > 0 : archivos[a.key] !== null;
            return `
            <div class="upload-item ${loaded ? 'loaded' : ''}">
              <div class="upload-item-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
                  ${a.key === 'parametros' ? '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' : ''}
                  ${a.key === 'cromatografia' ? '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1 2.5-2.5 0-1.5-1-2-2-2.5l-2-1c-1-.5-2-1-2-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5"/><path d="M12 2C8 2 5 5 5 9c0 2 .5 3.5 1.5 5L12 22l5.5-8c1-1.5 1.5-3 1.5-5 0-4-3-7-7-7z"/>' : ''}
                  ${a.key === 'plantilla_siop' ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' : ''}
                  ${a.key === 'ejemplos_siop' ? '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>' : ''}
                  ${a.key === 'atlas_litologico' ? '<path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>' : ''}
                  ${a.key === 'paleontologia' ? '<circle cx="12" cy="8" r="4"/><path d="M6 22c0-4 2-7 6-7s6 3 6 7"/>' : ''}
                  ${a.key === 'survey' ? '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M3 3l18 18"/>' : ''}
                  ${a.key === 'barrena' ? '<circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6M12 3v6M12 15v6"/>' : ''}
                </svg>
              </div>
              <div class="upload-item-body">
                <div class="upload-item-head">
                  <h4>${a.titulo}</h4>
                  ${fileStatus(a.key, archivos)}
                </div>
                <p class="upload-item-desc">${a.descripcion}</p>
                <div class="upload-item-genera">
                  <strong>Genera:</strong> ${a.genera.join(' Â· ')}
                </div>
              </div>
              <div class="upload-item-action">
                ${fileButton(a.key, archivos, cabinId)}
              </div>
            </div>`;
          }).join('')}
        </div>`;
    };

    const renderStep4 = () => {
      const cargados = ARCHIVOS_REQUERIDOS.filter(a => {
        if (a.key === 'ejemplos_siop') return wizardData.archivos[a.key].length > 0;
        return wizardData.archivos[a.key] !== null;
      }).length;
      const total = ARCHIVOS_REQUERIDOS.length;

      // Calcular quÃ© documentos se podrÃ¡n generar segÃºn archivos cargados
      const docs = [
        { nombre: 'SIOP (todos los turnos)', ok: !!wizardData.archivos.parametros, requerido: true },
        { nombre: 'CDO Matutino y Vespertino', ok: !!wizardData.archivos.parametros, requerido: true },
        { nombre: 'DCF Avance de Fluidos', ok: !!wizardData.archivos.parametros, requerido: true },
        { nombre: 'Boleta Diaria', ok: !!wizardData.archivos.parametros, requerido: true },
        { nombre: 'Lookahead', ok: !!wizardData.archivos.parametros, requerido: true },
        { nombre: 'Reporte de ManifestaciÃ³n', ok: !!wizardData.archivos.cromatografia, requerido: true },
        { nombre: 'SecciÃ³n de LitologÃ­a', ok: !!wizardData.archivos.atlas_litologico, requerido: false },
        { nombre: 'SecciÃ³n de PaleontologÃ­a', ok: !!wizardData.archivos.paleontologia, requerido: false },
        { nombre: 'ComparaciÃ³n Survey', ok: !!wizardData.archivos.survey, requerido: false },
        { nombre: 'Performance de Barrena', ok: !!wizardData.archivos.barrena, requerido: false },
        { nombre: 'Estilo Pemex personalizado', ok: wizardData.archivos.ejemplos_siop.length >= 3 || !!wizardData.archivos.plantilla_siop, requerido: false },
      ];

      return `
        <div class="section-card">
          <h3>Archivos de la cabina</h3>
          <p class="view-subtitle" style="margin-bottom:0.5rem">Sube los archivos que tu cabina genera. El sistema los usa para producir automÃ¡ticamente los documentos de salida (SIOPs, CDOs, DCF, etc).</p>
          <p class="view-subtitle muted" style="margin-bottom:1.5rem">
            <strong>${cargados} de ${total} archivos cargados.</strong>
            Los archivos marcados como <em>Requerido</em> son los mÃ­nimos para que el sistema pueda generar los reportes bÃ¡sicos.
          </p>

          <div class="upload-list">
            ${renderArchivosList(wizardData.archivos, null)}
          </div>
        </div>

        <div class="section-card">
          <h3>Lo que el sistema podrÃ¡ generar con estos archivos</h3>
          <p class="view-subtitle" style="margin-bottom:1rem">Resumen dinÃ¡mico: estos documentos se generarÃ¡n automÃ¡ticamente segÃºn los archivos que subas.</p>
          <div class="docs-grid">
            ${docs.map(d => `
              <div class="doc-item ${d.ok ? 'ok' : 'pending'}">
                <span class="doc-check">${d.ok ? 'âœ“' : 'â—‹'}</span>
                <span>${d.nombre}</span>
                ${d.requerido ? '<span class="doc-tag">requerido</span>' : '<span class="doc-tag optional">opcional</span>'}
              </div>
            `).join('')}
          </div>
          <p class="view-subtitle muted" style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--line-soft)">
            <strong>Tip:</strong> puedes crear la cabina ahora y subir los archivos despuÃ©s desde la configuraciÃ³n de la cabina. El sistema empezarÃ¡ a generar reportes en automÃ¡tico cuando tenga los datos mÃ­nimos.
          </p>
        </div>
      `;
    };

    const renderStep5 = () => {
      const items = [
        ['Nombre del pozo', wizardData.nombre],
        ['Campo', wizardData.campo],
        ['Empresa operadora', wizardData.empresa],
        ['Operador petrolero', wizardData.operador],
        ['Coordinador', wizardData.coordinador || 'â€”'],
        ['FormaciÃ³n objetivo', wizardData.formacion],
        ['Profundidad total', wizardData.prof_total + ' m MD'],
        ['Etapa actual', wizardData.etapa_actual || 'â€”'],
        ['Etapas planeadas', wizardData.etapas_planeadas || 'â€”'],
        ['Inicio', wizardData.inicio || 'â€”'],
        ['Fin estimado', wizardData.fin_estimada || 'â€”'],
        ['Equipo', wizardData.equipo || 'â€”'],
        ['Coordenadas', wizardData.coordenadas || 'â€”'],
        ['GeÃ³logos asignados', wizardData.geologos],
        ['Umbral gas', wizardData.umbral_gas + ' ppm'],
        ['Factor pico manifestaciÃ³n', wizardData.factor_pico + 'Ã—'],
        ['Auto SIOP', wizardData.auto_siop_hora + ' hrs'],
        ['Notificaciones', [wizardData.notif_email?'Email':'', wizardData.notif_sms?'SMS':''].filter(Boolean).join(' + ') || 'â€”'],
      ];
      return `
        <div class="section-card">
          <h3>Confirmar datos de la nueva cabina</h3>
          <p class="view-subtitle" style="margin-bottom:1.5rem">Revisa que todo estÃ© correcto antes de crear la cabina.</p>
          <div class="summary-list">
            ${items.map(([l,v]) => `<div class="summary-item"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}
          </div>
        </div>`;
    };

    const renderWizard = () => {
      const stepContent = wizardStep === 1 ? renderStep1() : wizardStep === 2 ? renderStep2() : wizardStep === 3 ? renderStep3() : wizardStep === 4 ? renderStep4() : renderStep5();
      const isConfirm = wizardStep === 5;
      const totalInputs = 4; // Pasos 1-4 son inputs, paso 5 es confirmaciÃ³n
      return `
        ${renderTopbar('<strong>Cabinas</strong> / <strong>Nueva cabina</strong>')}
        <div class="content">
          <div class="view-header">
            <h1 class="view-title">Nueva cabina</h1>
            <p class="view-subtitle">Configura el pozo, equipo, usuarios y archivos${isConfirm ? ' Â· ConfirmaciÃ³n' : ' Â· Paso ' + wizardStep + ' de ' + totalInputs}.</p>
          </div>
          ${renderStepper()}
          ${stepContent}
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="wizardPrev()" ${wizardStep===1?'disabled':''} style="${wizardStep===1?'opacity:0.4;cursor:not-allowed':''}">â† AtrÃ¡s</button>
            <div class="right">
              <button class="btn btn-ghost" onclick="wizardCancel()">Cancelar</button>
              ${isConfirm
                ? `<button class="btn btn-primary" onclick="wizardFinish()">${ICONS.check}<span>Crear cabina</span></button>`
                : `<button class="btn btn-primary" onclick="wizardNext()">Siguiente â†’</button>`}
            </div>
          </div>
        </div>`;
    };

    const rerenderWizard = () => {
      const main = document.getElementById('main');
      if (main) main.innerHTML = renderWizard();
      window.scrollTo(0, 0);
    };

    const wizardNext = () => {
      const v = wizardSteps[wizardStep - 1].validate();
      if (!v.ok) { showToast(v.msg); return; }
      if (wizardStep < 5) { wizardStep++; rerenderWizard(); }
    };
    const wizardPrev = () => { if (wizardStep > 1) { wizardStep--; rerenderWizard(); } };
    const wizardCancel = () => { resetWizard(); navigate('#/dashboard'); };
    const wizardFinish = () => {
      const id = wizardData.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const archivosCargados = Object.entries(wizardData.archivos).filter(([k, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== null;
      }).length;
      MOCK_CABINS.push({
        id, nombre: wizardData.nombre, campo: wizardData.campo, empresa: wizardData.empresa,
        equipo: wizardData.equipo || 'Por asignar', operador: wizardData.operador,
        etapa: wizardData.etapa_actual || 'Por definir',
        profundidad_total: parseInt(wizardData.prof_total) || 0,
        inicio: wizardData.inicio || 'Por definir', fin: wizardData.fin_estimada || null,
        dias_op: 0, formacion: wizardData.formacion, estado: 'active',
        metros_hoy: 0, rop_prom: 0, gas_max: 0, manif_count: 0,
        archivos_cargados: archivosCargados,
        archivos: wizardData.archivos,
      });
      showToast(`Cabina ${wizardData.nombre} creada Â· ${archivosCargados} archivos`);
      resetWizard();
      navigate('#/dashboard');
    };

    /* ======================== ROUTER ======================== */
    const routes = {
      'login': renderLogin,
      'dashboard': renderDashboard,
      'cabin': renderCabin,
      'cabin-upload': renderUpload,
      'report': renderReport,
      'manifestation': renderManifest,
      'settings': renderSettings,
    };

    function renderRoute() {
      const hash = location.hash.replace('#/', '') || 'login';
      const app = document.getElementById('app');
      if (hash === 'login' || hash === '') {
        app.innerHTML = renderLogin();
        return;
      }
      if (hash === 'cabin/new') {
        app.innerHTML = renderSidebar('cabin') + '<div id="main">' + renderWizard() + '</div>';
        return;
      }
      if (hash.startsWith('cabin/') && hash.includes('/upload')) {
        app.innerHTML = renderSidebar('cabin') + '<div id="main">' + renderUpload() + '</div>';
        return;
      }
      if (hash.startsWith('cabin/')) {
        app.innerHTML = renderSidebar('cabin') + '<div id="main">' + renderCabin() + '</div>';
        return;
      }
      if (hash.startsWith('report/')) {
        app.innerHTML = renderSidebar('dashboard') + '<div id="main">' + renderReport() + '</div>';
        return;
      }
      if (hash.startsWith('manifestation/')) {
        app.innerHTML = renderSidebar('manifestation') + '<div id="main">' + renderManifest() + '</div>';
        return;
      }
      const fn = routes[hash] || renderDashboard;
      app.innerHTML = renderSidebar(hash) + '<div id="main">' + fn() + '</div>';
    }

    window.addEventListener('hashchange', renderRoute);
    window.addEventListener('load', renderRoute);
    if (document.readyState === 'complete') renderRoute();
  
