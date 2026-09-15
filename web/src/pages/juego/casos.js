import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { auth } from '@site/src/firebase';
import { ALL_CASES } from '@site/src/utils/juego/cases';
import { getPlayerStats, getCaseXP } from '@site/src/utils/juego/storage';
import '../../css/juego.css';

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return null;
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function Casos() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const s = await getPlayerStats(user.uid);
      setStats(s);
    };
    load();
  }, []);

  const completedCases = stats?.completedCases || [];
  const bestTimes = stats?.bestTimes || {};

  return (
    <Layout title="Seleccionar caso" description="Elige un misterio para resolver">
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">ARCHIVO DE CASOS</span>
            <h1>Elige tu próximo misterio</h1>
            <p>
              Pon a prueba tu ingenio con estos casos inspirados en Sherlock
              Holmes.
            </p>
          </header>

          <div className="cases-grid">
            {ALL_CASES.map((c) => {
              const completed = completedCases.includes(c.id);
              const best = bestTimes[c.id];
              const xpValue = getCaseXP(c.id);

              return (
                <Link
                  key={c.id}
                  to={`/juego/nueva-partida?case=${c.id}`}
                  className={`juego-card case-card ${
                    completed ? 'case-card--completed' : ''
                  }`}
                >
                  <div className="case-card__top">
                    <div className="juego-card__icon">🔍</div>
                    {completed && (
                      <span className="case-card__check">✓</span>
                    )}
                  </div>

                  <h2>{c.title}</h2>
                  <p>{c.briefing.substring(0, 100)}...</p>

                  <div className="case-card__meta">
                    <span className="case-card__difficulty">
                      {'★'.repeat(c.difficulty)}
                    </span>
                    <span className="case-card__xp">+{xpValue} XP</span>
                  </div>

                  {completed && best !== undefined && (
                    <div className="case-card__best">
                      🏆 Mejor tiempo: {formatTime(best)}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}