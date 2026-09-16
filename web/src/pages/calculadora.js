import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import {
  calcularDia,
  calcularColaborador,
  fmtHoras,
  fmtDinero,
  fmtHora12,
  esDominicalOFestivo,
  esSabado,
} from '@site/src/utils/horasExtra';
import '../css/calculadora.css';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function fechaKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

let empIdCounter = 1;
let shiftIdCounter = 1;
function nuevoEmpleado() {
  return {
    id: `emp-${empIdCounter++}`,
    nombre: '',
    salario: '',
    days: {},
    expanded: true,
  };
}

function nuevoShift() {
  return {
    id: `sh-${shiftIdCounter++}-${Date.now()}`,
    entrada: '08:00',
    salida: '12:00',
    descansoIni: '',
    descansoFin: '',
  };
}

/* Normaliza datos (por si hay días en formato antiguo) */
function normalizarShifts(shifts) {
  if (!shifts) return [];
  if (Array.isArray(shifts)) return shifts;
  if (typeof shifts === 'object' && shifts.entrada) return [shifts];
  return [];
}

export default function Calculadora() {
  const hoy = new Date();
  const [jornadaSemanal, setJornadaSemanal] = useState(42);
  const [jornadaDiaria, setJornadaDiaria] = useState(8);
  const [salarioGlobal, setSalarioGlobal] = useState('');
  const [esFestivoManual, setEsFestivoManual] = useState('auto');
  const [empleados, setEmpleados] = useState([nuevoEmpleado()]);
  const [mesActivo, setMesActivo] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const [modal, setModal] = useState(null); // { empId, dateKey }

  const agregar = () => setEmpleados((p) => [...p, nuevoEmpleado()]);
  const eliminar = (id) => setEmpleados((p) => p.filter((e) => e.id !== id));
  const update = (id, field, value) =>
    setEmpleados((p) => p.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const toggleExpand = (id) =>
    setEmpleados((p) => p.map((e) => (e.id === id ? { ...e, expanded: !e.expanded } : e)));

  const actualizarDia = (empId, dateKey, shifts) => {
    setEmpleados((p) =>
      p.map((e) => {
        if (e.id !== empId) return e;
        const newDays = { ...e.days };
        if (shifts.length === 0) {
          delete newDays[dateKey];
        } else {
          newDays[dateKey] = shifts;
        }
        return { ...e, days: newDays };
      })
    );
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

  const resultados = useMemo(() => {
    return empleados.map((emp) => {
      const salarioFinal = emp.salario || salarioGlobal;
      return {
        id: emp.id,
        nombre: emp.nombre || 'Sin nombre',
        result: calcularColaborador({
          days: emp.days,
          salario: salarioFinal,
          jornadaSemanal,
          jornadaDiaria,
          esFestivoManual,
        }),
        usandoGlobal: !emp.salario && !!salarioGlobal,
      };
    });
  }, [empleados, jornadaSemanal, jornadaDiaria, esFestivoManual, salarioGlobal]);

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

  return (
    <Layout title="Calculadora de Horas Extra" description="Cálculo mensual multi-colaborador">
      <main className="calc-page">
        <div className="container margin-vert--xl">
          <div className="calc-hero">
            <span className="calc-hero__eyebrow">NÓMINA · LEY 2466 DE 2025</span>
            <h1 className="calc-hero__title">Calculadora de Horas Extra</h1>
            <p className="calc-hero__subtitle">
              Vigente desde julio 2026 · Jornada máxima 42h/semana · Noche 7pm–6am
            </p>
          </div>

          <section className="calc-config">
            <h2 className="calc-config__title">⚙️ Parámetros generales</h2>
            <div className="calc-config__grid calc-config__grid--4">
              <div className="calc-field">
                <label>Jornada semanal (h)</label>
                <input
                  type="number" min="1" max="48" value={jornadaSemanal}
                  onChange={(e) => setJornadaSemanal(parseFloat(e.target.value) || 42)}
                />
              </div>
              <div className="calc-field">
                <label>Jornada diaria L-V (h)</label>
                <input
                  type="number" min="1" max="12" value={jornadaDiaria}
                  onChange={(e) => setJornadaDiaria(parseFloat(e.target.value) || 8)}
                />
              </div>
              <div className="calc-field">
                <label>Salario por defecto</label>
                <input
                  type="number" min="0" step="10000" placeholder="Ej: 1750905"
                  value={salarioGlobal}
                  onChange={(e) => setSalarioGlobal(e.target.value)}
                />
              </div>
              <div className="calc-field">
                <label>Tipo de día</label>
                <select value={esFestivoManual} onChange={(e) => setEsFestivoManual(e.target.value)}>
                  <option value="auto">Automático (festivos 2026)</option>
                  <option value="si">Todo festivo/dominical</option>
                  <option value="no">Todo día hábil</option>
                </select>
              </div>
            </div>
            <p className="calc-config__hint">
              💡 Valor hora = salario ÷ (jornada semanal × 5). Sábado: jornada = 0 (contrato L-V).
              Puedes tener varios turnos por día.
            </p>
          </section>

          <div className="calc-actions-bar">
            <span className="calc-actions-bar__count">
              {empleados.length} colaborador{empleados.length !== 1 ? 'es' : ''}
            </span>
            <button type="button" className="calc-btn calc-btn--primary" onClick={agregar}>
              + Agregar colaborador
            </button>
          </div>

          {empleados.map((emp, idx) => {
            const res = resultados.find((r) => r.id === emp.id)?.result;
            const usandoGlobal = resultados.find((r) => r.id === emp.id)?.usandoGlobal;

            return (
              <article key={emp.id} className="calc-emp">
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
                        {res.tieneSalario ? (
                          <span className="calc-emp__badge calc-emp__badge--green">
                            {fmtDinero.format(res.totalPago)}
                            {usandoGlobal && ' *'}
                          </span>
                        ) : (
                          <span className="calc-emp__badge calc-emp__badge--red">⚠ Sin salario</span>
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

                {emp.expanded && (
                  <div className="calc-emp__body">
                    <div className="calc-section">
                      <div className="calc-section__title">📋 Contrato</div>
                      <div className="calc-section__grid calc-section__grid--2">
                        <div className="calc-field">
                          <label>Salario mensual {usandoGlobal && '(usando global)'}</label>
                          <input
                            type="number" min="0" step="10000"
                            placeholder={salarioGlobal ? `${salarioGlobal} (global)` : 'Ej: 1750905'}
                            value={emp.salario}
                            onChange={(e) => update(emp.id, 'salario', e.target.value)}
                          />
                        </div>
                        <div className="calc-field">
                          <label>Valor hora (calculado)</label>
                          <input
                            type="text" readOnly
                            value={res?.valorHora ? fmtDinero.format(res.valorHora) : '—'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="calc-section">
                      <div className="calc-section__title">
                        📅 Calendario de turnos
                        <span className="calc-section__hint">
                          Clic en un día para agregar varios turnos
                        </span>
                      </div>

                      <Calendar
                        year={mesActivo.year}
                        month={mesActivo.month}
                        days={emp.days}
                        jornadaDiaria={jornadaDiaria}
                        esFestivoManual={esFestivoManual}
                        onPrev={() => navMes(-1)}
                        onNext={() => navMes(1)}
                        onSelectDay={(dateKey) => setModal({ empId: emp.id, dateKey })}
                      />
                    </div>

                    {res && res.totalHoras > 0 && (
                      <div className="calc-section">
                        <div className="calc-section__title">📊 Detalle del colaborador</div>

                        <div className="calc-table-wrap">
                          <table className="calc-table">
                            <thead>
                              <tr>
                                <th>Concepto</th>
                                <th className="right">Factor</th>
                                <th className="right">Horas</th>
                                <th className="right">Valor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.filas.map((f) => (
                                <tr key={f.key} className={f.minutos === 0 ? 'empty' : ''}>
                                  <td className={f.extra ? 'extra' : ''}>{f.nombre}</td>
                                  <td className="right muted">
                                    {f.factor === 0 ? '—' : f.factor.toFixed(2)}
                                  </td>
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

                        <p className="calc-mini-note">
                          ⚠️ Este valor es el <strong>ADICIONAL al salario mensual</strong>, no el pago total.
                          Las horas ordinarias diurnas ya están cubiertas por el salario.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

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
                    <div className="calc-total-card__label">Total adicional a pagar</div>
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

      {modal && (
        <DayModal
          dateKey={modal.dateKey}
          shifts={normalizarShifts(
            empleados.find((e) => e.id === modal.empId)?.days?.[modal.dateKey]
          )}
          jornadaDiaria={jornadaDiaria}
          esFestivoManual={esFestivoManual}
          onUpdate={(newShifts) => actualizarDia(modal.empId, modal.dateKey, newShifts)}
          onClose={() => setModal(null)}
        />
      )}
    </Layout>
  );
}

/* =========================================================
   CALENDARIO
   ========================================================= */
function Calendar({ year, month, days, jornadaDiaria, esFestivoManual, onPrev, onNext, onSelectDay }) {
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
          const shifts = normalizarShifts(days?.[dateKey]);
          const dateObj = new Date(year, month, d);
          const esFestivo = esDominicalOFestivo(dateKey);
          const esSab = esSabado(dateKey);
          const esHoy =
            dateObj.getFullYear() === hoy.getFullYear() &&
            dateObj.getMonth() === hoy.getMonth() &&
            dateObj.getDate() === hoy.getDate();

          let horasDia = 0;
          if (shifts.length > 0) {
            const res = calcularDia({
              dateKey,
              shifts,
              jornadaDiaria,
              esFestivoManual,
            });
            if (res) horasDia = res.duracionNeta / 60;
          }

          return (
            <button
              key={i}
              type="button"
              className={[
                'calendar__cell',
                shifts.length > 0 ? 'calendar__cell--filled' : '',
                esFestivo ? 'calendar__cell--holiday' : '',
                esSab ? 'calendar__cell--saturday' : '',
                esHoy ? 'calendar__cell--today' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectDay(dateKey)}
              title={
                shifts.length > 0
                  ? `${shifts.length} turno${shifts.length > 1 ? 's' : ''}`
                  : 'Sin turno'
              }
            >
              <span className="calendar__day">{d}</span>
              {horasDia > 0 && (
                <span className="calendar__badge">
                  {fmtHoras.format(horasDia)}h
                  {shifts.length > 1 && <span className="calendar__badge-count">{shifts.length}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MODAL DE DÍA — MÚLTIPLES TURNOS
   ========================================================= */
function DayModal({ dateKey, shifts, jornadaDiaria, esFestivoManual, onUpdate, onClose }) {
  const [form, setForm] = useState(nuevoShift());
  const [editingId, setEditingId] = useState(null);

  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const etiqueta = dateObj.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Calcular el resultado del día con los turnos actuales
  const resDia = shifts.length > 0
    ? calcularDia({ dateKey, shifts, jornadaDiaria, esFestivoManual })
    : null;

  const handleGuardarTurno = () => {
    if (!form.entrada || !form.salida) return;

    let nuevos;
    if (editingId) {
      nuevos = shifts.map((s) => (s.id === editingId ? { ...form, id: editingId } : s));
    } else {
      nuevos = [...shifts, { ...form, id: `sh-${Date.now()}` }];
    }
    onUpdate(nuevos);
    setForm(nuevoShift());
    setEditingId(null);
  };

  const handleEditar = (shift) => {
    setForm({
      entrada: shift.entrada,
      salida: shift.salida,
      descansoIni: shift.descansoIni || '',
      descansoFin: shift.descansoFin || '',
    });
    setEditingId(shift.id);
  };

  const handleEliminar = (id) => {
    const nuevos = shifts.filter((s) => s.id !== id);
    onUpdate(nuevos);
    if (editingId === id) {
      setForm(nuevoShift());
      setEditingId(null);
    }
  };

  const handleBorrarTodos = () => {
    if (!window.confirm('¿Borrar todos los turnos de este día?')) return;
    onUpdate([]);
    setForm(nuevoShift());
    setEditingId(null);
  };

  // Calcular duración de un turno para mostrar
  const duracionTurno = (shift) => {
    const tmp = calcularDia({ dateKey, shifts: [shift], jornadaDiaria, esFestivoManual });
    return tmp ? tmp.duracionNeta / 60 : 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--day" onClick={(e) => e.stopPropagation()}>
        <header className="modal-box__header">
          <div>
            <span className="modal-box__eyebrow">Turnos del día</span>
            <h3 className="modal-box__title">{etiqueta}</h3>
            {resDia && (
              <div className="modal-box__meta">
                <span className={`modal-box__tag modal-box__tag--${resDia.tipoDia}`}>
                  {resDia.tipoDia === 'festivo' ? '🎉 Festivo/Dominical' : '📅 Día hábil'}
                </span>
                <span className="modal-box__tag">
                  ⏱ {fmtHoras.format(resDia.duracionNeta / 60)} h totales
                </span>
                {shifts.length > 1 && (
                  <span className="modal-box__tag">
                    📌 {shifts.length} turnos
                  </span>
                )}
              </div>
            )}
          </div>
          <button type="button" className="modal-box__close" onClick={onClose}>×</button>
        </header>

        <div className="modal-box__body">
          {/* Lista de turnos ya guardados */}
          {shifts.length > 0 && (
            <div className="shifts-list">
              <div className="shifts-list__header">
                <span className="shifts-list__title">Turnos asignados ({shifts.length})</span>
                <button
                  type="button"
                  className="calc-btn calc-btn--danger calc-btn--sm"
                  onClick={handleBorrarTodos}
                >
                  🗑 Borrar todos
                </button>
              </div>

              {shifts.map((shift, i) => (
                <div
                  key={shift.id}
                  className={`shift-item ${editingId === shift.id ? 'shift-item--editing' : ''}`}
                >
                  <div className="shift-item__index">{i + 1}</div>
                  <div className="shift-item__info">
                    <div className="shift-item__hours">
                      {fmtHora12(shift.entrada)} → {fmtHora12(shift.salida)}
                    </div>
                    <div className="shift-item__meta">
                      {fmtHoras.format(duracionTurno(shift))} h
                      {shift.descansoIni && shift.descansoFin && (
                        <> · descanso {fmtHora12(shift.descansoIni)}–{fmtHora12(shift.descansoFin)}</>
                      )}
                    </div>
                  </div>
                  <div className="shift-item__actions">
                    <button
                      type="button"
                      className="calc-emp__icon-btn"
                      title="Editar"
                      onClick={() => handleEditar(shift)}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="calc-emp__icon-btn calc-emp__icon-btn--danger"
                      title="Eliminar"
                      onClick={() => handleEliminar(shift.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulario */}
          <div className="shift-form">
            <div className="shift-form__title">
              {editingId ? '✏️ Editar turno' : '➕ Agregar nuevo turno'}
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <label>Hora de entrada</label>
                <input
                  type="time"
                  value={form.entrada}
                  onChange={(e) => setForm({ ...form, entrada: e.target.value })}
                />
              </div>
              <div className="calc-field">
                <label>Hora de salida</label>
                <input
                  type="time"
                  value={form.salida}
                  onChange={(e) => setForm({ ...form, salida: e.target.value })}
                />
              </div>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <label>Inicio descanso (opcional)</label>
                <input
                  type="time"
                  value={form.descansoIni}
                  onChange={(e) => setForm({ ...form, descansoIni: e.target.value })}
                />
              </div>
              <div className="calc-field">
                <label>Fin descanso (opcional)</label>
                <input
                  type="time"
                  value={form.descansoFin}
                  onChange={(e) => setForm({ ...form, descansoFin: e.target.value })}
                />
              </div>
            </div>

            <div className="shift-form__actions">
              {editingId && (
                <button
                  type="button"
                  className="calc-btn calc-btn--ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(nuevoShift());
                  }}
                >
                  Cancelar edición
                </button>
              )}
              <button
                type="button"
                className="calc-btn calc-btn--primary"
                onClick={handleGuardarTurno}
                disabled={!form.entrada || !form.salida}
              >
                {editingId ? 'Guardar cambios' : 'Guardar turno'}
              </button>
            </div>

            <p className="shift-form__hint">
              💡 Agrega todos los turnos que necesites. Ejemplo: 08:00–13:00 y 17:00–22:00.
              La jornada diaria se agota en el primer turno; lo que exceda cuenta como extra.
            </p>
          </div>
        </div>

        <footer className="modal-box__footer">
          <div className="modal-box__footer-right">
            <button type="button" className="calc-btn calc-btn--primary" onClick={onClose}>
              Listo
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}