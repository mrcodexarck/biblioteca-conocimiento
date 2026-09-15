import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import CaseScene from '@site/src/components/juego/CaseScene';
import Inventory from '@site/src/components/juego/Inventory';
import SuspectsList from '@site/src/components/juego/SuspectsList';
import GameTimer from '@site/src/components/juego/GameTimer';
import { getCaseById } from '@site/src/utils/juego/cases';
import { auth } from '@site/src/firebase';
import {
  getProgress,
  saveProgress,
  clearProgress,
  registerCaseWin,
  calculatePoints,
} from '@site/src/utils/juego/storage';
import '../../css/juego.css';

const STEP = {
  BRIEFING: 'briefing',
  INVESTIGATION: 'investigation',
  ACCUSATION: 'accusation',
};

const TOTAL_DURATION = 15 * 60;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function NuevaPartida() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const caseId = params.get('case') || 'case-001';
  const caseData = getCaseById(caseId);

  const [step, setStep] = useState(STEP.BRIEFING);
  const [currentScene, setCurrentScene] = useState(0);
  const [discoveredItems, setDiscoveredItems] = useState([]);
  const [analyzedItems, setAnalyzedItems] = useState([]);
  const [interrogatedSuspects, setInterrogatedSuspects] = useState([]);
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedBefore, setElapsedBefore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);

  const totalElapsed = useMemo(() => {
    const currentSessionElapsed = TOTAL_DURATION - timeLeft;
    return elapsedBefore + currentSessionElapsed;
  }, [timeLeft, elapsedBefore]);

  useEffect(() => {
    const load = async () => {
      const isResume = params.get('resume') === '1';
      if (isResume) {
        const user = auth.currentUser;
        if (user) {
          const saved = await getProgress(user.uid, caseData.id);
          if (saved) {
            setStep(saved.step || STEP.INVESTIGATION);
            setCurrentScene(saved.currentScene ?? 0);
            setDiscoveredItems(saved.discoveredItems || []);
            setAnalyzedItems(saved.analyzedItems || []);
            setInterrogatedSuspects(saved.interrogatedSuspects || []);
            if (typeof saved.timeLeft === 'number') setTimeLeft(saved.timeLeft);
            if (typeof saved.elapsedBefore === 'number') setElapsedBefore(saved.elapsedBefore);
          }
        }
      }
      setLoaded(true);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, caseData.id]);

  useEffect(() => {
    if (!loaded) return;
    if (result === 'win') return;

    const user = auth.currentUser;
    if (!user) return;

    const hasStarted =
      step !== STEP.BRIEFING ||
      discoveredItems.length > 0 ||
      analyzedItems.length > 0 ||
      interrogatedSuspects.length > 0;

    if (!hasStarted) return;

    saveProgress(user.uid, {
      caseId: caseData.id,
      caseTitle: caseData.title,
      status: 'in_progress',
      step,
      currentScene,
      discoveredItems,
      analyzedItems,
      interrogatedSuspects,
      timeLeft,
      elapsedBefore,
      savedAt: Date.now(),
    });
  }, [
    loaded,
    step,
    currentScene,
    discoveredItems,
    analyzedItems,
    interrogatedSuspects,
    result,
    caseData.id,
    caseData.title,
    timeLeft,
    elapsedBefore,
  ]);

  useEffect(() => {
    if (timeLeft <= 0 && step === STEP.INVESTIGATION && !result) {
      setResult('timeout');
    }
  }, [timeLeft, step, result]);

  const handleDiscover = (itemId) => {
    if (!discoveredItems.includes(itemId)) {
      setDiscoveredItems([...discoveredItems, itemId]);
    }
  };

  const handleAnalyze = (itemId) => {
    if (!analyzedItems.includes(itemId)) {
      setAnalyzedItems([...analyzedItems, itemId]);
    }
  };

  const handleInterrogate = (suspectId) => {
    if (!interrogatedSuspects.includes(suspectId)) {
      setInterrogatedSuspects([...interrogatedSuspects, suspectId]);
    }
  };

  const handleAccuse = (suspectId) => {
    const isGuilty = suspectId === caseData.solution.guiltyId;
    const hasEvidence = caseData.solution.requiredEvidence.every((e) =>
      analyzedItems.includes(e)
    );

    if (isGuilty && hasEvidence) {
      const earned = calculatePoints(totalElapsed, caseData.difficulty);
      setPointsEarned(earned);
      setResult('win');

      const user = auth.currentUser;
      if (user) {
        const timeUsed = totalElapsed;
        const userName =
          user.displayName || user.email?.split('@')[0] || 'Detective';
        clearProgress(user.uid, caseData.id);
        registerCaseWin(
          user.uid,
          userName,
          caseData.id,
          caseData.title,
          timeUsed,
          caseData.difficulty
        );
      }
    } else if (isGuilty && !hasEvidence) {
      setResult('need_evidence');
    } else {
      setResult('wrong');
    }
  };

  const resetCase = () => {
    const user = auth.currentUser;
    if (user) clearProgress(user.uid, caseData.id);

    setStep(STEP.BRIEFING);
    setCurrentScene(0);
    setDiscoveredItems([]);
    setAnalyzedItems([]);
    setInterrogatedSuspects([]);
    setResult(null);
    setTimeLeft(TOTAL_DURATION);
    setElapsedBefore(0);
    setIsPaused(false);
    setPointsEarned(0);
  };

  if (!loaded) {
    return (
      <Layout title="Cargando...">
        <main className="juego-page">
          <div className="container margin-vert--xl" style={{ textAlign: 'center' }}>
            <p>Cargando expediente...</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (step === STEP.BRIEFING) {
    return (
      <Layout title="Nueva partida">
        <main className="juego-page">
          <div className="container margin-vert--xl">
            <div className="briefing">
              <span className="juego-eyebrow">
                EXPEDIENTE {caseData.id.toUpperCase()}
              </span>
              <h1>{caseData.title}</h1>
              <div
                className="briefing__image"
                style={{ backgroundImage: `url(${caseData.coverImage})` }}
              />
              <p className="briefing__text">{caseData.briefing}</p>

              <div className="briefing__meta">
                <div>
                  <strong>Dificultad</strong>
                  <span>
                    {'★'.repeat(caseData.difficulty)}
                    {'☆'.repeat(5 - caseData.difficulty)}
                  </span>
                </div>
                <div>
                  <strong>Sospechosos</strong>
                  <span>{caseData.suspects.length}</span>
                </div>
                <div>
                  <strong>Escenas</strong>
                  <span>{caseData.scenes.length}</span>
                </div>
              </div>

              <button
                className="button button--primary button--lg"
                onClick={() => setStep(STEP.INVESTIGATION)}
              >
                Comenzar investigación
              </button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  const scene = caseData.scenes[currentScene];

  return (
    <Layout title={caseData.title}>
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="case-header">
            <div>
              <span className="juego-eyebrow">CASO EN CURSO</span>
              <h1>{caseData.title}</h1>
            </div>

            <div className="case-header__right">
              <div className="case-header__time-total">
                <span className="case-header__time-label">⏳ Total:</span>
                <span className="case-header__time-value">
                  {formatTime(totalElapsed)}
                </span>
              </div>

              <GameTimer
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                isPaused={isPaused || Boolean(result)}
                onTimeUp={() => setResult('timeout')}
              />

              <button
                className="button button--outline button--sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>

              <button
                className="button button--outline button--sm"
                onClick={resetCase}
              >
                Reiniciar caso
              </button>
            </div>
          </header>

          <div className="scene-tabs">
            {caseData.scenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentScene(i)}
                className={`scene-tab ${
                  currentScene === i ? 'scene-tab--active' : ''
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="case-layout">
            <div className="case-layout__main">
              <CaseScene
                scene={scene}
                discoveredItems={discoveredItems}
                onDiscover={handleDiscover}
              />
            </div>

            <aside className="case-layout__side">
              <Inventory
                caseData={caseData}
                discoveredItems={discoveredItems}
                analyzedItems={analyzedItems}
                onAnalyze={handleAnalyze}
              />
              <SuspectsList
                caseData={caseData}
                interrogatedSuspects={interrogatedSuspects}
                onInterrogate={handleInterrogate}
              />
              <button
                className="accuse-button"
                disabled={discoveredItems.length === 0}
                onClick={() => setStep(STEP.ACCUSATION)}
              >
                ⚖️ Acusar
              </button>
            </aside>
          </div>

          {step === STEP.ACCUSATION && !result && (
            <div
              className="modal-overlay"
              onClick={() => setStep(STEP.INVESTIGATION)}
            >
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>¿Quién es el culpable?</h2>
                <p>Selecciona al sospechoso que crees que cometió el crimen.</p>

                <div className="accusation-list">
                  {caseData.suspects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="accusation-option"
                      onClick={() => handleAccuse(s.id)}
                    >
                      <span className="accusation-avatar">
                        {s.name.charAt(0)}
                      </span>
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  className="button button--outline"
                  onClick={() => setStep(STEP.INVESTIGATION)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="modal-overlay">
              <div className="modal-box">
                {result === 'win' && (
                  <>
                    <h2 className="modal-result modal-result--win">
                      🎉 ¡Caso resuelto!
                    </h2>
                    <p>
                      Has identificado correctamente al culpable con la
                      evidencia suficiente.
                    </p>
                    <p>
                      <strong>Tiempo total:</strong> {formatTime(totalElapsed)}
                    </p>
                    <p style={{ fontSize: '1.1rem' }}>
                      ⭐ Has ganado{' '}
                      <strong style={{ color: '#f59e0b' }}>
                        +{pointsEarned} puntos
                      </strong>
                    </p>
                    <div className="modal-actions">
                      <Link to="/juego" className="button button--primary">
                        Volver al panel
                      </Link>
                      <button
                        className="button button--outline"
                        onClick={resetCase}
                      >
                        Jugar de nuevo
                      </button>
                    </div>
                  </>
                )}

                {result === 'wrong' && (
                  <>
                    <h2 className="modal-result modal-result--wrong">
                      ❌ Acusación incorrecta
                    </h2>
                    <p>Esa persona no es el culpable. Sigue investigando.</p>
                    <button
                      className="button button--primary"
                      onClick={() => {
                        setResult(null);
                        setStep(STEP.INVESTIGATION);
                      }}
                    >
                      Seguir investigando
                    </button>
                  </>
                )}

                {result === 'need_evidence' && (
                  <>
                    <h2 className="modal-result modal-result--warn">
                      ⚠️ Falta evidencia
                    </h2>
                    <p>
                      Es el culpable, pero necesitas analizar más evidencia
                      antes de acusarlo.
                    </p>
                    <button
                      className="button button--primary"
                      onClick={() => {
                        setResult(null);
                        setStep(STEP.INVESTIGATION);
                      }}
                    >
                      Seguir investigando
                    </button>
                  </>
                )}

                {result === 'timeout' && (
                  <>
                    <h2 className="modal-result modal-result--wrong">
                      ⏰ ¡Se acabó el tiempo!
                    </h2>
                    <p>El culpable se ha escapado. Sé más rápido la próxima vez.</p>
                    <button className="button button--primary" onClick={resetCase}>
                      Intentar de nuevo
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}