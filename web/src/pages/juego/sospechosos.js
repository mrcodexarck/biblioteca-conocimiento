import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { auth, db } from '@site/src/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getPlayerStats } from '@site/src/utils/juego/storage';
import { SUSPECTS, ATTRIBUTES } from '@site/src/utils/juego/suspects';
import { getKnownClues } from '@site/src/utils/juego/serialKiller';
import '../../css/juego.css';

export default function Sospechosos() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eliminated, setEliminated] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const s = await getPlayerStats(user.uid);
      setStats(s);

      try {
        const ref = doc(db, 'users', user.uid, 'gameStats', 'main');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setEliminated(snap.data().eliminatedSuspects || []);
        }
      } catch (err) {
        console.error('Error cargando eliminados:', err);
      }

      setLoading(false);
    };
    load();
  }, []);

  const persistEliminated = async (newList) => {
    const user = auth.currentUser;
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(db, 'users', user.uid, 'gameStats', 'main');
      await setDoc(
        ref,
        { eliminatedSuspects: newList, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error('Error guardando eliminados:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSuspect = (suspectId) => {
    let newList;
    if (eliminated.includes(suspectId)) {
      newList = eliminated.filter((id) => id !== suspectId);
    } else {
      newList = [...eliminated, suspectId];
    }
    setEliminated(newList);
    persistEliminated(newList);
  };

  const resetAll = () => {
    if (!window.confirm('¿Reactivar a todos los sospechosos?')) return;
    setEliminated([]);
    persistEliminated([]);
  };

  if (loading) {
    return (
      <Layout title="Sospechosos">
        <main className="juego-page">
          <div className="container margin-vert--xl" style={{ textAlign: 'center' }}>
            <p>Cargando expediente...</p>
          </div>
        </main>
      </Layout>
    );
  }

  const completedCases = stats?.completedCases || [];
  const knownClues = getKnownClues(completedCases);
  const activeCount = SUSPECTS.length - eliminated.length;

  return (
    <Layout
      title="Sospechosos"
      description="Tablero de sospechosos del Círculo de Portland"
    >
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">EXPEDIENTE CLASIFICADO</span>
            <h1>Los 30 sospechosos</h1>
            <p>
              Basándote en las pistas que has descubierto, haz clic en los
              sospechosos para <strong>eliminarlos</strong> de la lista.
            </p>
          </header>

          {/* PISTAS REVELADAS */}
          <section className="known-clues">
            <div className="known-clues__head">
              <h3>🔍 Pistas reveladas ({knownClues.length})</h3>
              <button
                type="button"
                className="button button--outline button--sm"
                onClick={resetAll}
                disabled={eliminated.length === 0}
              >
                Reactivar todos
              </button>
            </div>

            {knownClues.length === 0 ? (
              <p className="panel-empty">
                Resuelve casos para descubrir pistas sobre el asesino.
              </p>
            ) : (
              <div className="known-clues__list">
                {knownClues.map((clue, idx) => (
                  <div key={idx} className="known-clues__item">
                    <span className="known-clues__label">
                      {ATTRIBUTES[clue.attribute]?.label}:
                    </span>
                    <span className="known-clues__value">
                      {ATTRIBUTES[clue.attribute]?.options[clue.value] ||
                        clue.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ESTADO */}
          <section className="sospechosos-status">
            <div className="status-card status-card--highlight">
              <div className="status-card__label">Activos</div>
              <div className="status-card__value">{activeCount}</div>
            </div>
            <div className="status-card">
              <div className="status-card__label">Eliminados</div>
              <div className="status-card__value">{eliminated.length}</div>
            </div>
            <div className="status-card">
              <div className="status-card__label">Casos resueltos</div>
              <div className="status-card__value">
                {completedCases.length} / 20
              </div>
            </div>
          </section>

          {/* TABLERO */}
          <section className="suspect-board">
            {SUSPECTS.map((s) => {
              const isEliminated = eliminated.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`suspect-tile ${
                    isEliminated
                      ? 'suspect-tile--eliminated'
                      : 'suspect-tile--active'
                  }`}
                  onClick={() => toggleSuspect(s.id)}
                  title={
                    isEliminated
                      ? 'Clic para reactivar'
                      : 'Clic para eliminar'
                  }
                >
                  <div className="suspect-tile__avatar">
                    {s.name.charAt(0)}
                  </div>
                  <div className="suspect-tile__name">{s.name}</div>
<div className="suspect-tile__attrs">
  <span>{ATTRIBUTES.ageRange?.options[s.ageRange] || s.ageRange}</span>
  <span>{ATTRIBUTES.hair?.options[s.hair] || s.hair}</span>
  <span>{ATTRIBUTES.eyes?.options[s.eyes] || s.eyes}</span>
  <span>{ATTRIBUTES.height?.options[s.height] || s.height}</span>
  <span>{s.occupation}</span>
  <span>{s.district}</span>
  <span>{ATTRIBUTES.feature?.options[s.feature] || s.feature}</span>
  <span>{ATTRIBUTES.tattoo?.options[s.tattoo] || s.tattoo}</span>
</div>
                  {isEliminated && (
                    <div className="suspect-tile__stamp">✕</div>
                  )}
                </button>
              );
            })}
          </section>

          {/* CTA */}
          <section className="accuse-cta">
            {activeCount === 1 ? (
              <>
                <h2>🎯 Solo queda un sospechoso</h2>
                <p>
                  ¿Crees que{' '}
                  <strong>
                    {SUSPECTS.find((s) => !eliminated.includes(s.id))?.name}
                  </strong>{' '}
                  es el asesino?
                </p>
              </>
            ) : activeCount === 0 ? (
              <>
                <h2>⚠️ Todos eliminados</h2>
                <p>Debes reactivar al menos un sospechoso.</p>
              </>
            ) : (
              <>
                <h2>Sigue investigando</h2>
                <p>
                  Tienes {activeCount} sospechosos activos. Elimina más o
                  resuelve más casos para obtener pistas.
                </p>
                <Link to="/juego/casos" className="button button--outline">
                  Ir a los casos
                </Link>
              </>
            )}
          </section>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/juego" className="button button--outline">
              ← Volver al panel
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}