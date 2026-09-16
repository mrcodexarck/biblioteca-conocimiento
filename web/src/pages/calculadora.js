import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import '../css/calculadora.css';

/* =========================================================
   CONSTANTES
   ========================================================= */
const FESTIVOS = new Set([
  '2025-01-01','2025-01-06','2025-03-24','2025-04-17','2025-04-18','2025-05-01',
  '2025-06-02','2025-06-23','2025-06-30','2025-07-20','2025-08-07','2025-08-18',
  '2025-10-13','2025-11-03','2025-11-17','2025-12-08','2025-12-25',
  '2026-01-01','2026-01-12','2026-03-23','2026-04-02','2026-04-03','2026-05-01',
  '2026-05-18','2026-06-08','2026-06-15','2026-06-29','2026-07-20','2026-08-07',
  '2026-08-17','2026-10-12','2026-11-02','2026-11-16','2026-12-08','2026-12-25',
]);

const CONCEPTOS = [
  { key: 'hod',   nombre: 'Hora ordinaria diurna',              recargo: 0,   factor: 1.00, extra: false },
  { key: 'rn',    nombre: 'Recargo nocturno ordinario',         recargo: 35,  factor: 1.35, extra: false },
  { key: 'rdf',   nombre: 'Recargo dominical/festivo diurno',   recargo: 75,  factor: 1.75, extra: false },
  { key: 'rndf',  nombre: 'Recargo nocturno dominical/festivo', recargo: 110, factor: 2.10, extra: false },
  { key: 'hed',   nombre: 'Hora extra diurna',                  recargo: 25,  factor: 1.25, extra: true  },
  { key: 'hen',   nombre: 'Hora extra nocturna',                recargo: 75,  factor: 1.75, extra: true  },
  { key: 'heddf', nombre: 'Hora extra diurna festiva',          recargo: 100, factor: 2.00, extra: true  },
  { key: 'hendf', nombre: 'Hora extra nocturna festiva',        recargo: 150, factor: 2.50, extra: true  },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const MS_MINUTO = 60000;

const fmtHoras = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDinero = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/* =========================================================
   HELPERS
   ========================================================= */
function claveFecha(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function fechaKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

function calcularDia(dateKey, entrada, salida, jornadaMaxima, esFestivoManual) {
  if (!entrada || !salida) return null;

  const [y, m, d] = dateKey.split('-').map(Number);
  const [hE, mE] = entrada.split(':').map(Number);
  const [hS, mS] = salida.split(':').map(Number);

  const inicio = new Date(y, m - 1, d, hE, mE);
  let fin = new Date(y, m - 1, d, hS, mS);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return null;

  if (fin <= inicio) {
    fin = new Date(fin.getTime() + 24 * 60 * MS_MINUTO);
  }

  const totalMinutos = Math.round((fin - inicio) / MS_MINUTO);
  if (totalMinutos <= 0 || totalMinutos > 24 * 60) return null;

  const conteo = { hod: 0, rn: 0, rdf: 0, rndf: 0, hed: 0, hen: 0, heddf: 0, hendf: 0 };
  const limiteMin = jornadaMaxima * 60;

  for (let i = 0; i < totalMinutos; i++) {
    const t = new Date(inicio.getTime() + i * MS_MINUTO);
    const minutosAcumulados = i + 1;
    const esExtra = minutosAcumulados > limiteMin;
    const hora = t.getHours();
    const esNocturno = hora >= 21 || hora < 6;
    const esFestivo =
      esFestivoManual === 'si' ? true :
      esFestivoManual === 'no' ? false :
      t.getDay() === 0 || FESTIVOS.has(claveFecha(t));

    let clave;
    if (!esExtra) {
      clave = esFestivo ? (esNocturno ? 'rndf' : 'rdf') : esNocturno ? 'rn' : 'hod';
    } else {
      clave = esFestivo ? (esNocturno ? 'hendf' : 'heddf') : esNocturno ? 'hen' : 'hed';
    }
    conteo[clave]++;
  }

  return { conteo, totalMinutos };
}

function calcularEmpleado(emp, jornadaMaxima, esFestivoManual) {
  const totalConteo = { hod: 0, rn: 0, rdf: 0, rndf: 0, hed: 0, hen: 0, heddf: 0, hendf: 0 };
  let totalMinutos = 0;
  let diasTrabajados = 0;

  Object.entries(emp.days || {}).forEach(([dateKey, day]) => {
    const res = calcularDia(dateKey, day.entrada, day.salida, jornadaMaxima, esFestivoManual);
    if (!res) return;
    diasTrabajados++;
    totalMinutos += res.totalMinutos;
    Object.keys(res.conteo).forEach((k) => {
      totalConteo[k] += res.conteo[k];
    });
  });

  const salario = parseFloat(emp.salario) || 0;
  const horasMes = parseFloat(emp.horasMes) || 240;
  const valorHora = salario > 0 ? salario / horasMes : 0;

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
    tieneSalario: salario > 0,
  };
}

let empIdCounter = 1;
function nuevoEmpleado() {
  return {
    id: `emp-${empIdCounter++}`,
    nombre: '',
    salario: '',
    horasMes: '240',
    jornadaDiaria: '', // opcional por empleado
    days: {},
    expanded: true,
  };
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
export default function Calculadora() {
  const hoy = new Date();
  const [jornadaGlobal, setJornadaGlobal] = useState(8);
  const [esFestivoManual, setEsFestivoManual] = useState('auto');
  const [empleados, setEmpleados] = useState([nuevoEmpleado()]);
  const [mesActivo, setMesActivo] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const [modal, setModal] = useState(null); // { empId, dateKey }

  /* ========== Handlers ========== */
  const agregar = () => setEmpleados((p) => [...p, nuevoEmpleado()]);
  const eliminar = (id) => setEmpleados((p) => p.filter((e) => e.id !== id));
  const update = (id, field, value) =>
    setEmpleados((p) => p.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const toggleExpand = (id) =>
    setEmpleados((p) => p.map((e) => (e.id === id ? { ...e, expanded: !e.expanded } : e)));

  const guardarDia = (empId, dateKey, data) => {
    setEmpleados((p) =>
      p.map((e) => {
        if (e.id !== empId) return e;
        return { ...e, days: { ...e.days, [dateKey]: data } };
      })
    );
    setModal(null);
  };

  const borrarDia = (empId, dateKey) => {
    setEmpleados((p) =>
      p.map((e) => {
        if (e.id !== empId) return e;
        const newDays = { ...e.days };
        delete newDays[dateKey];
        return { ...e, days: newDays };
      })
    );
    setModal(null);
  };

  const navMes = (delta) => {
    setMesActivo((prev) => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };

  /* ========== Cálculo por empleado ========== */
  const resultados = useMemo(() => {
    return empleados.map((emp) => ({
      id: emp.id,
      nombre: emp.nombre || 'Sin nombre',
      result: calcularEmpleado(emp, jornadaGlobal, esFestivoManual),
    }));
  }, [empleados, jornadaGlobal, esFestivoManual]);

  const totales = useMemo(() => {
    let horas = 0, extras = 0, pago = 0, validos = 0;
    resultados.forEach((r) => {
      if (r.result && r.result.totalHoras > 0) {
        horas += r.result.totalHoras;
        extras += r.result.extraHoras;
        pago += r.result.totalPago;
        validos++;
      }
    });
    return { horas, extras, pago, validos };
  }, [resultados]);

  /* ========== Render ========== */
  return (
    <Layout title="Calculadora de Horas Extra" description="Cálculo mensual para múltiples colaboradores">
      <main className="calc-page">
        <div className="container margin-vert--xl">

          <div className="calc-hero">
            <span className="calc-hero__eyebrow">NÓMINA</span>
            <h1 className="calc-hero__title">Calculadora de Horas Extra</h1>
            <p className="calc-hero__subtitle">
              Asigna turnos por día en el calendario de cada colaborador.
            </p>
          </div>

          {/* Configuración global */}
          <section className="calc-config">
            <h2 className="calc-config__title">⚙️ Configuración</h2>
            <div className="calc-config__grid">
              <div className="calc-field">
                <label>Jornada diaria (horas)</label>
                <input
                  type="number" min="1" max="12" value={jornadaGlobal}
                  onChange={(e) => setJornadaGlobal(parseFloat(e.target.value) || 8)}
                />
              </div>
              <div className="calc-field">
                <label>Tipo de día</label>
                <select value={esFestivoManual} onChange={(e) => setEsFestivoManual(e.target.value)}>
                  <option value="auto">Automático (festivos Colombia)</option>
                  <option value="si">Todo festivo/dominical</option>
                  <option value="no">Todo día hábil</option>
                </select>
              </div>
            </div>
          </section>

          {/* Barra de acción */}
          <div className="calc-actions-bar">
            <span className="calc-actions-bar__count">
              {empleados.length} colaborador{empleados.length !== 1 ? 'es' : ''}
            </span>
            <button type="button" className="calc-btn calc-btn--primary" onClick={agregar}>
              + Agregar colaborador
            </button>
          </div>

          {/* Lista de empleados */}
          {empleados.map((emp, idx) => {
            const res = resultados.find((r) => r.id === emp.id)?.result;
            const jornadaEmp = parseFloat(emp.jornadaDiaria) || jornadaGlobal;

            return (
              <article key={emp.id} className="calc-emp">
                {/* Header */}
                <header className="calc-emp__header">
                  <div className="calc-emp__header-left" onClick={() => toggleExpand(emp.id)}>
                    <span className="calc-emp__number">#{idx + 1}</span>
                    <input
                      type="text"
                      className="calc-emp__name-input"
                      placeholder="Nombre del colaborador"
                      value={emp.nombre}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => update(emp.id, 'nombre', e.target.value)}
                    />
                  </div>
                  <div className="calc-emp__header-right">
                    {res && res.totalHoras > 0 && (
                      <>
                        <span className="calc-emp__badge">{fmtHoras.format(res.totalHoras)} h</span>
                        {res.tieneSalario && (
                          <span className="calc-emp__badge calc-emp__badge--green">
                            {fmtDinero.format(res.totalPago)}
                          </span>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      className="calc-emp__icon-btn calc-emp__icon-btn--danger"
                      title="Eliminar"
                      onClick={(e) => { e.stopPropagation(); eliminar(emp.id); }}
                    >
                      🗑️
                    </button>
                    <span className="calc-emp__chevron" onClick={() => toggleExpand(emp.id)}>
                      {emp.expanded ? '▲' : '▼'}
                    </span>
                  </div>
                </header>

                {/* Cuerpo */}
                {emp.expanded && (
                  <div className="calc-emp__body">
                    {/* CONTRATO */}
                    <div className="calc-section">
                      <div className="calc-section__title">
                        📋 Contrato
                      </div>
                      <div className="calc-section__grid calc-section__grid--3">
                        <div className="calc-field">
                          <label>Salario mensual</label>
                          <input
                            type="number" min="0" step="10000" placeholder="Ej: 1300000"
                            value={emp.salario}
                            onChange={(e) => update(emp.id, 'salario', e.target.value)}
                          />
                        </div>
                        <div className="calc-field">
                          <label>Horas al mes</label>
                          <input
                            type="number" min="1" value={emp.horasMes}
                            onChange={(e) => update(emp.id, 'horasMes', e.target.value)}
                          />
                        </div>
                        <div className="calc-field">
                          <label>Jornada diaria (h)</label>
                          <input
                            type="number" min="1" max="12"
                            placeholder={`${jornadaGlobal} (global)`}
                            value={emp.jornadaDiaria}
                            onChange={(e) => update(emp.id, 'jornadaDiaria', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CALENDARIO */}
                    <div className="calc-section">
                      <div className="calc-section__title">
                        📅 Calendario de turnos
                        <span className="calc-section__hint">
                          Haz clic en un día para asignar entrada y salida
                        </span>
                      </div>

                      <Calendar
                        year={mesActivo.year}
                        month={mesActivo.month}
                        days={emp.days}
                        jornadaEmp={jornadaEmp}
                        esFestivoManual={esFestivoManual}
                        onPrev={() => navMes(-1)}
                        onNext={() => navMes(1)}
                        onSelectDay={(dateKey) => setModal({ empId: emp.id, dateKey })}
                      />
                    </div>

                    {/* TOTALES DEL EMPLEADO */}
                    {res && res.totalHoras > 0 && (
                      <div className="calc-section">
                        <div className="calc-section__title">📊 Totales del colaborador</div>

                        <div className="calc-table-wrap">
                          <table className="calc-table">
                            <thead>
                              <tr>
                                <th>Concepto</th>
                                <th className="right">Recargo</th>
                                <th className="right">Horas</th>
                                <th className="right">Valor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.filas.map((f) => (
                                <tr key={f.key} className={f.minutos === 0 ? 'empty' : ''}>
                                  <td className={f.extra ? 'extra' : ''}>{f.nombre}</td>
                                  <td className="right muted">{f.recargo === 0 ? '—' : '+' + f.recargo + '%'}</td>
                                  <td className="right tabular">{fmtHoras.format(f.horas)} h</td>
                                  <td className={'right tabular ' + (f.extra ? 'extra' : '')}>
                                    {res.tieneSalario ? fmtDinero.format(f.valor) : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="2" className="bold">Total</td>
                                <td className="right bold tabular">{fmtHoras.format(res.totalHoras)} h</td>
                                <td className="right bold total-pago">
                                  {res.tieneSalario ? fmtDinero.format(res.totalPago) : '—'}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        <div className="calc-mini-summary">
                          <span><strong>Días trabajados:</strong> {res.diasTrabajados}</span>
                          <span><strong>Horas extra:</strong> {fmtHoras.format(res.extraHoras)} h</span>
                          {res.tieneSalario && (
                            <span><strong>Valor extra:</strong> {fmtDinero.format(res.extraPago)}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {/* TOTALES GLOBALES */}
          {totales.validos > 0 && (
            <section className="calc-totales">
              <h2 className="calc-totales__title">📊 Resumen general</h2>
              <div className="calc-totales__grid">
                <div className="calc-total-card">
                  <div className="calc-total-card__label">Colaboradores</div>
                  <div className="calc-total-card__value">{totales.validos}</div>
                </div>
                <div className="calc-total-card">
                  <div className="calc-total-card__label">Horas totales</div>
                  <div className="calc-total-card__value">{fmtHoras.format(totales.horas)} h</div>
                </div>
                <div className="calc-total-card calc-total-card--accent">
                  <div className="calc-total-card__label">Horas extra</div>
                  <div className="calc-total-card__value">{fmtHoras.format(totales.extras)} h</div>
                </div>
                {totales.pago > 0 && (
                  <div className="calc-total-card calc-total-card--green">
                    <div className="calc-total-card__label">Total a pagar</div>
                    <div className="calc-total-card__value">{fmtDinero.format(totales.pago)}</div>
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="calc-bottom-actions">
            <button type="button" className="calc-btn calc-btn--primary calc-btn--lg" onClick={agregar}>
              + Agregar otro colaborador
            </button>
          </div>
        </div>
      </main>

      {/* MODAL PARA DÍA */}
      {modal && (
        <DayModal
          dateKey={modal.dateKey}
          data={empleados.find((e) => e.id === modal.empId)?.days?.[modal.dateKey]}
          onSave={(data) => guardarDia(modal.empId, modal.dateKey, data)}
          onDelete={() => borrarDia(modal.empId, modal.dateKey)}
          onClose={() => setModal(null)}
        />
      )}
    </Layout>
  );
}

/* =========================================================
   CALENDARIO
   ========================================================= */
function Calendar({ year, month, days, jornadaEmp, esFestivoManual, onPrev, onNext, onSelectDay }) {
  const primerDia = new Date(year, month, 1);
  const startWeekday = primerDia.getDay();
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < startWeekday; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);

  const hoy = new Date();

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button type="button" className="calendar__nav" onClick={onPrev}>◀</button>
        <h3 className="calendar__month">{MESES[month]} {year}</h3>
        <button type="button" className="calendar__nav" onClick={onNext}>▶</button>
      </div>

      <div className="calendar__weekdays">
        {DIAS_SEMANA.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="calendar__grid">
        {celdas.map((d, i) => {
          if (d === null) return <div key={i} className="calendar__cell calendar__cell--empty" />;

          const dateKey = fechaKey(year, month, d);
          const dayData = days?.[dateKey];
          const dateObj = new Date(year, month, d);
          const esDomingo = dateObj.getDay() === 0;
          const esFestivo = FESTIVOS.has(dateKey) || esDomingo;
          const esHoy =
            dateObj.getFullYear() === hoy.getFullYear() &&
            dateObj.getMonth() === hoy.getMonth() &&
            dateObj.getDate() === hoy.getDate();

          // Calcular horas del día (si hay datos)
          let horasDia = 0;
          if (dayData?.entrada && dayData?.salida) {
            const res = calcularDia(dateKey, dayData.entrada, dayData.salida, jornadaEmp, esFestivoManual);
            if (res) horasDia = res.totalMinutos / 60;
          }

          return (
            <button
              key={i}
              type="button"
              className={[
                'calendar__cell',
                dayData ? 'calendar__cell--filled' : '',
                esFestivo ? 'calendar__cell--holiday' : '',
                esHoy ? 'calendar__cell--today' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectDay(dateKey)}
              title={dayData ? `${dayData.entrada} → ${dayData.salida}` : 'Sin turno'}
            >
              <span className="calendar__day">{d}</span>
              {horasDia > 0 && (
                <span className="calendar__badge">{fmtHoras.format(horasDia)}h</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MODAL DE DÍA
   ========================================================= */
function DayModal({ dateKey, data, onSave, onDelete, onClose }) {
  const [entrada, setEntrada] = useState(data?.entrada || '08:00');
  const [salida, setSalida] = useState(data?.salida || '17:00');

  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const etiqueta = dateObj.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleSave = () => {
    if (!entrada || !salida) return;
    onSave({ entrada, salida });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--day" onClick={(e) => e.stopPropagation()}>
        <header className="modal-box__header">
          <div>
            <span className="modal-box__eyebrow">Turno del día</span>
            <h3 className="modal-box__title">{etiqueta}</h3>
          </div>
          <button type="button" className="modal-box__close" onClick={onClose}>×</button>
        </header>

        <div className="modal-box__body">
          <div className="calc-grid-2">
            <div className="calc-field">
              <label>Hora de entrada</label>
              <input type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
            </div>
            <div className="calc-field">
              <label>Hora de salida</label>
              <input type="time" value={salida} onChange={(e) => setSalida(e.target.value)} />
            </div>
          </div>

          <p className="modal-box__hint">
            Si la salida es menor a la entrada, se asumirá turno nocturno (cruza medianoche).
          </p>
        </div>

        <footer className="modal-box__footer">
          {data && (
            <button type="button" className="calc-btn calc-btn--danger" onClick={onDelete}>
              🗑 Borrar día
            </button>
          )}
          <div className="modal-box__footer-right">
            <button type="button" className="calc-btn calc-btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="calc-btn calc-btn--primary" onClick={handleSave}>
              Guardar turno
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}