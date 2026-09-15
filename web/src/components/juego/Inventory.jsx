import React, { useState, useEffect } from 'react';

export default function Inventory({
  caseData,
  discoveredItems,
  analyzedItems,
  onAnalyze,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const items = caseData.items.filter((i) =>
    discoveredItems.includes(i.id)
  );

  const handleClick = (item) => {
    // Si es el mismo y ya se ve el resultado, no reiniciar
    if (activeItem?.id === item.id && !isAnalyzing && progress >= 100) {
      return;
    }

    setActiveItem(item);
    const alreadyAnalyzed = analyzedItems.includes(item.id);

    if (alreadyAnalyzed) {
      // Ver resultado directo, sin análisis
      setProgress(100);
      setIsAnalyzing(false);
      return;
    }

    // Iniciar análisis desde cero
    setProgress(0);
    setIsAnalyzing(true);
  };

  // Progreso del análisis
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 130);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Al llegar al 100% -> marcar como analizado
  useEffect(() => {
    if (progress >= 100 && isAnalyzing && activeItem) {
      onAnalyze(activeItem.id);
      setIsAnalyzing(false);
    }
  }, [progress, isAnalyzing, activeItem, onAnalyze]);

  return (
    <div className="side-panel">
      <h3>
        🔬 Evidencia ({items.length} / {caseData.items.length})
      </h3>

      {items.length === 0 ? (
        <p className="panel-empty">Examina la escena para encontrar pistas.</p>
      ) : (
        items.map((item) => {
          const analyzed = analyzedItems.includes(item.id);
          const isActive = activeItem?.id === item.id;
          return (
            <div
              key={item.id}
              className={`inventory-item ${
                isActive ? 'inventory-item--active' : ''
              }`}
              onClick={() => handleClick(item)}
            >
              <span className="inventory-item__icon">{item.icon}</span>
              <span className="inventory-item__name">{item.name}</span>
              <span
                className={`inventory-item__status ${
                  analyzed ? 'is-analyzed' : ''
                }`}
              >
                {analyzed ? '✓ Ver' : 'Analizar'}
              </span>
            </div>
          );
        })
      )}

      {activeItem && (
        <div className="analysis-box">
          <div className="analysis-box__header">
            <span className="analysis-box__icon">{activeItem.icon}</span>
            <strong>{activeItem.name}</strong>
            <button
              type="button"
              className="analysis-box__close"
              onClick={(e) => {
                e.stopPropagation();
                setActiveItem(null);
                setProgress(0);
                setIsAnalyzing(false);
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {isAnalyzing ? (
            <>
              <p className="analysis-box__status">Analizando muestra...</p>
              <div className="analysis-progress">
                <div
                  className="analysis-progress__bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="analysis-result">{activeItem.result}</p>
          )}
        </div>
      )}
    </div>
  );
}