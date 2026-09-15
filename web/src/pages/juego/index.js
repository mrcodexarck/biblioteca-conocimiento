import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { auth } from '@site/src/firebase';
import { getProgress, getPlayerStats } from '@site/src/utils/juego/storage';
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

  const cards = [
    { icon: '🎮', title: 'Nueva partida', text: 'Elige un caso para investigar.', to: '/juego/casos', disabled: false },
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
    { icon: '🏆', title: 'Logros', text: 'Ranking de detectives y medallas.', to: '/juego/logros', disabled: false },
    { icon: '⚙️', title: 'Opciones', text: 'Ajustes de sonido, dificultad y más.', to: '/juego/opciones', disabled: true },
  ];

  return (
    <Layout title="Juego" description="Panel principal del juego de detectives">
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">PANEL PRINCIPAL</span>
            <h1>Bienvenido, detective</h1>
            <p>Elige qué hacer a continuación.</p>
          </header>

          {stats && (
            <section className="player-summary">
              <div className="player-summary__item">
                <span className="player-summary__icon">⭐</span>
                <div>
                  <div className="player-summary__label">Puntos totales</div>
                  <div className="player-summary__value">{stats.xp || 0}</div>
                </div>
              </div>
              <div className="player-summary__item">
                <span className="player-summary__icon">🔍</span>
                <div>
                  <div className="player-summary__label">Casos resueltos</div>
                  <div className="player-summary__value">
                    {(stats.completedCases || []).length} / 4
                  </div>
                </div>
              </div>
              <div className="player-summary__item">
                <span className="player-summary__icon">🏅</span>
                <div>
                  <div className="player-summary__label">Rango</div>
                  <div className="player-summary__value">
                    {getRankLabel(stats.xp || 0)}
                  </div>
                </div>
              </div>
            </section>
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