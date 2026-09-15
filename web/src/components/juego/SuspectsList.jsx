import React, { useState } from 'react';

export default function SuspectsList({
  caseData,
  interrogatedSuspects,
  onInterrogate,
}) {
  const [active, setActive] = useState(null);

  const handleClick = (suspect) => {
    setActive(suspect);
    onInterrogate(suspect.id);
  };

  return (
    <div className="side-panel">
      <h3>🕵️ Sospechosos ({caseData.suspects.length})</h3>

      {caseData.suspects.map((s) => (
        <div
          key={s.id}
          className="suspect-card"
          onClick={() => handleClick(s)}
        >
          <div className="suspect-card__avatar">{s.name.charAt(0)}</div>
          <div>
            <div className="suspect-card__name">{s.name}</div>
            <div className="suspect-card__status">
              {interrogatedSuspects.includes(s.id)
                ? '✓ Interrogado'
                : 'Sin interrogar'}
            </div>
          </div>
        </div>
      ))}

      {active && (
        <div className="modal-overlay" onClick={() => setActive(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Interrogatorio: {active.name}</h2>
            <p className="interrogation-quote">"{active.alibi}"</p>
            <button
              className="button button--primary"
              onClick={() => setActive(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}