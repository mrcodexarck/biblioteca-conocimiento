import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { auth } from '@site/src/firebase';
import { getProgress, getPlayerStats } from '@site/src/utils/juego/storage';
import { ALL_CASES } from '@site/src/utils/juego/cases';
import { getKnownClues, TOTAL_CASES } from '@site/src/utils/juego/serialKiller';
import { SUSPECTS } from '@site/src/utils/juego/suspects';
import '../../css/juego.css';

function getRankLabel(xp) {
  if (xp >= 2000) return '🏆 Maestro';
  if (xp >= 1000) return '🥇 Experto';
  if (xp >= 500) return '🥈 Detective';
  if (xp >= 100) return '🥉 Novato';
  return '👤 Aprendiz';
}

export default function Juego() {
  const [pendingCase, setPendingCase] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const s = await getPlayerStats(user.uid);
      setStats(s);

      const p = await getProgress(user.uid, 'case-001');
      if (p && p.status === 'in_progress') {
        setPendingCase({
          caseTitle: p.caseTitle || 'Caso en curso',
          caseId: p.caseId,
          discovered: (p.discoveredItems || []).length,
        });
      }
    };
    load();
  }, []);

  const completed = stats?.completedCases || [];
  const knownClues = getKnownClues(completed);
  const eliminated = stats?.eliminatedSuspects || [];
  const activeCount = SUSPECTS.length - eliminated.length;

  const cards = [
    { icon: '🎮', title: 'Nueva partida', text: 'Elige un capítulo del caso.', to: '/juego/casos', disabled: false },
    {
      icon: '📁',
      title: 'Continuar',
      text: pendingCase
        ? `Retomar "${pendingCase.caseTitle}" — ${pendingCase.discovered} pistas`
        : 'No hay casos en curso.',
      to: '/juego/nueva-partida?resume=1',
      disabled: !pendingCase,
      highlight: Boolean(pendingCase),
    },
    {
      icon: '🕵️',
      title: 'Sospechosos',
      text: `${activeCount} activos · ${knownClues.length} pistas`,
      to: '/juego/sospechosos',
      disabled: false,
    },
    { icon: '🏆', title: 'Logros', text: 'Ranking de detectives.', to: '/juego/logros', disabled: false },
  ];

  return (
    <Layout title="Juego" description="El Círculo de Portland">
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">EL CÍRCULO DE PORTLAND</span>
            <h1>Expediente activo</h1>
            <p>Un asesino serial. 30 sospechosos. 20 capítulos para resolverlo.</p>
          </header>

          {stats && (
            <>
              {/* Progreso de la historia */}
              <section className="story-progress">
                <div className="story-progress__label">
                  <span>📖 Investigación en curso</span>
                  <span>{completed.length} / {TOTAL_CASES} capítulos</span>
                </div>
                <div className="story-progress__bar">
                  <div
                    className="story-progress__fill"
                    style={{ width: `${(completed.length / TOTAL_CASES) * 100}%` }}
                  />
                </div>

                <div className="story-progress__stats">
                  <div>
                    <span className="story-stat__value">{knownClues.length}</span>
                    <span className="story-stat__label">Pistas</span>
                  </div>
                  <div>
                    <span className="story-stat__value">{activeCount}</span>
                    <span className="story-stat__label">Sospechosos activos</span>
                  </div>
                  <div>
                    <span className="story-stat__value">{stats.xp || 0}</span>
                    <span className="story-stat__label">Puntos</span>
                  </div>
                  <div>
                    <span className="story-stat__value">{getRankLabel(stats.xp || 0)}</span>
                    <span className="story-stat__label">Rango</span>
                  </div>
                </div>
              </section>

              {/* Botón directo a sospechosos */}
              {knownClues.length > 0 && (
                <section className="story-cta">
                  <p>
                    Tienes <strong>{knownClues.length}</strong> pistas. Ya puedes
                    empezar a eliminar sospechosos.
                  </p>
                  <Link to="/juego/sospechosos" className="button button--primary">
                    🕵️ Ir al tablero de sospechosos
                  </Link>
                </section>
              )}
            </>
          )}

          <section className="juego-grid">
            {cards.map((card) => {
              const url = useBaseUrl(card.to);
              if (card.disabled) {
                return (
                  <div key={card.title} className="juego-card juego-card--disabled">
                    <div className="juego-card__icon">{card.icon}</div>
                    <h2>{card.title}</h2>
                    <p>{card.text}</p>
                    <span className="juego-card__badge">Próximamente</span>
                  </div>
                );
              }
              return (
                <Link
                  key={card.title}
                  to={url}
                  className={`juego-card ${card.highlight ? 'juego-card--highlight' : ''}`}
                >
                  <div className="juego-card__icon">{card.icon}</div>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                  {card.highlight && (
                    <span className="juego-card__badge juego-card__badge--active">
                      ● En curso
                    </span>
                  )}
                </Link>
              );
            })}
          </section>
        </div>
      </main>
    </Layout>
  );
}