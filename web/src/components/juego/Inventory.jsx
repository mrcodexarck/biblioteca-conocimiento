import React, { useState } from 'react';

export default function Inventory({
  caseData,
  discoveredItems,
  analyzedItems,
  onAnalyze,
}) {
  const [analyzing, setAnalyzing] = useState(null);
  const [progress, setProgress] = useState(0);

  const items = caseData.items.filter((i) =>
    discoveredItems.includes(i.id)
  );

  const startAnalysis = (item) => {
    if (analyzing) return;
    setAnalyzing(item);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        onAnalyze(item.id);
      }
    }, 130);
  };

  return (
    <div className="side-panel">
      <h3>🔬 Evidencia ({items.length})</h3>

      {items.length === 0 ? (
        <p className="panel-empty">
          Examina la escena para encontrar pistas.
        </p>
      ) : (
        items.map((item) => {
          const analyzed = analyzedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="inventory-item"
              onClick={() => !analyzed && startAnalysis(item)}
            >
              <span className="inventory-item__icon">{item.icon}</span>
              <span className="inventory-item__name">{item.name}</span>
              <span
                className={`inventory-item__status ${
                  analyzed ? 'is-analyzed' : ''
                }`}
              >
                {analyzed ? '✓' : 'Analizar'}
              </span>
            </div>
          );
        })
      )}

      {analyzing && (
        <div className="analysis-box">
          <p>Analizando {analyzing.name}...</p>
          <div className="analysis-progress">
            <div
              className="analysis-progress__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress >= 100 && (
            <>
              <p className="analysis-result">{analyzing.result}</p>
              <button
                type="button"
                className="button button--sm button--primary"
                onClick={() => setAnalyzing(null)}
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}