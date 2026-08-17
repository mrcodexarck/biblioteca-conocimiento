import React, { useMemo, useState } from 'react';

export default function Quiz({ pregunta, opciones = [], correcta }) {
  const [seleccionado, setSeleccionado] = useState(null);
  const [revisado, setRevisado] = useState(false);
  const valido = useMemo(
    () => Number.isInteger(correcta) && correcta >= 0 && correcta < opciones.length,
    [correcta, opciones.length],
  );

  return (
    <section className="card quiz-card" aria-labelledby="quiz-title">
      <div className="card__body">
        <h2 id="quiz-title">🧠 {pregunta}</h2>
        <div className="quiz-options" role="radiogroup" aria-label="Opciones de respuesta">
          {opciones.map((opcion, index) => (
            <button key={`${index}-${opcion}`} type="button" role="radio"
              aria-checked={seleccionado === index}
              className={`quiz-option ${seleccionado === index ? 'quiz-option--selected' : ''}`}
              onClick={() => { setSeleccionado(index); setRevisado(false); }}>
              <span className="quiz-option__marker">{String.fromCharCode(65 + index)}</span>
              <span>{opcion}</span>
            </button>
          ))}
        </div>
        <button className="button button--primary margin-top--md" type="button"
          onClick={() => seleccionado !== null && valido && setRevisado(true)}
          disabled={seleccionado === null || !valido}>
          Verificar respuesta
        </button>
        {revisado && (
          <div className={`alert margin-top--md ${seleccionado === correcta ? 'alert--success' : 'alert--danger'}`}
            role="status">
            {seleccionado === correcta
              ? '¡Correcto! Excelente trabajo. 🎉'
              : 'Respuesta incorrecta. Repasa el material e inténtalo de nuevo. 💡'}
          </div>
        )}
      </div>
    </section>
  );
}
