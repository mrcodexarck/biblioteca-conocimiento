/* =========================================================
   CÁLCULO DE HORAS EXTRA Y RECARGOS - COLOMBIA
   Ley 2101 de 2021 y Ley 2466 de 2025 (vigente jul 2026)
   Soporta múltiples turnos por día.
   ========================================================= */

export const FESTIVOS = new Set([
  '2025-01-01','2025-01-06','2025-03-24','2025-04-17','2025-04-18','2025-05-01',
  '2025-06-02','2025-06-23','2025-06-30','2025-07-20','2025-08-07','2025-08-18',
  '2025-10-13','2025-11-03','2025-11-17','2025-12-08','2025-12-25',
  '2026-01-01','2026-01-12','2026-03-23','2026-04-02','2026-04-03','2026-05-01',
  '2026-05-18','2026-06-08','2026-06-15','2026-06-29','2026-07-13','2026-07-20',
  '2026-08-07','2026-08-17','2026-10-12','2026-11-02','2026-11-16','2026-12-08','2026-12-25',
]);

export const CONCEPTOS = [
  { key: 'hod',   nombre: 'Hora ordinaria diurna (día hábil) — ya incluida en salario', factor: 0,    extra: false, tipo: 'ordinario' },
  { key: 'rn',    nombre: 'Recargo nocturno (ordinario)',                                factor: 0.35, extra: false, tipo: 'ordinario' },
  { key: 'hed',   nombre: 'Hora extra diurna',                                           factor: 1.25, extra: true,  tipo: 'ordinario' },
  { key: 'hen',   nombre: 'Hora extra nocturna',                                         factor: 1.75, extra: true,  tipo: 'ordinario' },
  { key: 'rdf',   nombre: 'Recargo dominical/festivo diurno (ordinario)',                factor: 1.90, extra: false, tipo: 'festivo'   },
  { key: 'rndf',  nombre: 'Recargo dominical/festivo nocturno (ordinario)',              factor: 2.25, extra: false, tipo: 'festivo'   },
  { key: 'heddf', nombre: 'Hora extra dominical/festiva diurna',                         factor: 3.15, extra: true,  tipo: 'festivo'   },
  { key: 'hendf', nombre: 'Hora extra dominical/festiva nocturna',                       factor: 3.65, extra: true,  tipo: 'festivo'   },
];

/* =========================================================
   HELPERS
   ========================================================= */
export function claveFecha(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export function esDominicalOFestivo(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getDay() === 0 || FESTIVOS.has(dateKey);
}

export function esSabado(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 6;
}

function hmAMinutos(hm) {
  if (!hm) return null;
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convierte un turno en una lista de "minutos del día" (0-1439) que efectivamente se trabajan,
 * excluyendo los minutos de descanso.
 */
function minutosDeTurno(shift) {
  if (!shift?.entrada || !shift?.salida) return [];
  const minE = hmAMinutos(shift.entrada);
  let minS = hmAMinutos(shift.salida);
  if (minS <= minE) minS += 24 * 60;

  let restStart = null, restEnd = null;
  if (shift.descansoIni && shift.descansoFin) {
    restStart = hmAMinutos(shift.descansoIni);
    restEnd = hmAMinutos(shift.descansoFin);
    if (restEnd < restStart) restEnd += 24 * 60;
    if (restStart < minE) restStart += 24 * 60;
    if (restEnd < minE) restEnd += 24 * 60;
  }

  const minutos = [];
  for (let m = minE; m < minS; m++) {
    if (restStart !== null && m >= restStart && m < restEnd) continue;
    minutos.push(m % (24 * 60)); // hora del día 0-1439
  }
  return minutos;
}

/* =========================================================
   CÁLCULO DE UN DÍA (con múltiples turnos)
   ========================================================= */
export function calcularDia({
  dateKey,
  shifts,          // array de turnos
  jornadaDiaria,
  esFestivoManual = 'auto',
}) {
  const lista = Array.isArray(shifts) ? shifts : (shifts?.entrada ? [shifts] : []);
  if (lista.length === 0) return null;

  // Tipo de día
  const esFestivoFecha = esDominicalOFestivo(dateKey);
  const esSab = esSabado(dateKey);
  const tipoDia =
    esFestivoManual === 'si' ? 'festivo' :
    esFestivoManual === 'no' ? 'ordinario' :
    esFestivoFecha ? 'festivo' : 'ordinario';

  const jornadaHoy = esSab ? 0 : jornadaDiaria;
  const jornadaMinutos = jornadaHoy * 60;

  const conteo = { hod: 0, rn: 0, hed: 0, hen: 0, rdf: 0, rndf: 0, heddf: 0, hendf: 0 };
  let minutosAcumulados = 0;
  let duracionBruta = 0;
  let duracionNeta = 0;

  // Ordenar turnos por hora de entrada
  const ordenados = [...lista].sort((a, b) => {
    const aMin = hmAMinutos(a.entrada) ?? 0;
    const bMin = hmAMinutos(b.entrada) ?? 0;
    return aMin - bMin;
  });

  ordenados.forEach((shift) => {
    const minE = hmAMinutos(shift.entrada);
    let minS = hmAMinutos(shift.salida);
    if (minS === null || minE === null) return;
    if (minS <= minE) minS += 24 * 60;
    duracionBruta += minS - minE;

    const minutos = minutosDeTurno(shift);
    duracionNeta += minutos.length;

    minutos.forEach((minDelDia) => {
      const esExtra = minutosAcumulados >= jornadaMinutos;
      const hora24 = Math.floor(minDelDia / 60);
      const esNocturno = hora24 >= 19 || hora24 < 6;

      let clave;
      if (tipoDia === 'festivo') {
        clave = esExtra
          ? (esNocturno ? 'hendf' : 'heddf')
          : (esNocturno ? 'rndf' : 'rdf');
      } else {
        clave = esExtra
          ? (esNocturno ? 'hen' : 'hed')
          : (esNocturno ? 'rn' : 'hod');
      }
      conteo[clave]++;
      minutosAcumulados++;
    });
  });

  return {
    conteo,
    duracionBruta,
    duracionNeta,
    tipoDia,
    esSabado: esSab,
    turnosCount: lista.length,
  };
}

/* =========================================================
   CÁLCULO DE UN COLABORADOR
   ========================================================= */
export function calcularColaborador({
  days,
  salario,
  jornadaSemanal,
  jornadaDiaria,
  esFestivoManual = 'auto',
}) {
  const totalConteo = { hod: 0, rn: 0, hed: 0, hen: 0, rdf: 0, rndf: 0, heddf: 0, hendf: 0 };
  let totalMinutos = 0;
  let diasTrabajados = 0;

  Object.entries(days || {}).forEach(([dateKey, shifts]) => {
    const res = calcularDia({
      dateKey,
      shifts,
      jornadaDiaria,
      esFestivoManual,
    });
    if (!res) return;
    diasTrabajados++;
    totalMinutos += res.duracionNeta;
    Object.keys(res.conteo).forEach((k) => {
      totalConteo[k] += res.conteo[k];
    });
  });

  const salarioNum = parseFloat(salario) || 0;
  const valorHora = salarioNum > 0 ? salarioNum / (jornadaSemanal * 5) : 0;

  let totalMinutosExtra = 0;
  const filas = CONCEPTOS.map((c) => {
    const minutos = totalConteo[c.key];
    const horas = minutos / 60;
    const valor = valorHora > 0 ? horas * valorHora * c.factor : 0;
    if (c.extra) totalMinutosExtra += minutos;
    return { ...c, minutos, horas, valor };
  });

  const totalPago = filas.reduce((s, f) => s + f.valor, 0);

  return {
    filas,
    totalHoras: totalMinutos / 60,
    totalPago,
    valorHora,
    extraHoras: totalMinutosExtra / 60,
    extraPago: filas.filter((f) => f.extra).reduce((s, f) => s + f.valor, 0),
    diasTrabajados,
    tieneSalario: salarioNum > 0,
  };
}

/* =========================================================
   FORMATOS
   ========================================================= */
export const fmtHoras = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmtDinero = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/* Formato "HH:MM" → "8:00 AM" */
export function fmtHora12(hm) {
  if (!hm) return '';
  const [h, m] = hm.split(':').map(Number);
  const sufijo = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}