import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { auth } from '@site/src/firebase';
import { getLeaderboard } from '@site/src/utils/juego/storage';
import '../../css/juego.css';

export default function Logros() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (user) setCurrentUserId(user.uid);

      const data = await getLeaderboard(20);
      setLeaderboard(data);
      setLoading(false);
    };
    load();
  }, []);

  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getPodiumOrder = () => {
    // Orden visual: 2° - 1° - 3°
    return [podium[1], podium[0], podium[2]];
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <Layout title="Logros">
        <main className="juego-page">
          <div className="container margin-vert--xl" style={{ textAlign: 'center' }}>
            <p>Cargando ranking...</p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Logros" description="Ranking de detectives">
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">SALÓN DE LA FAMA</span>
            <h1>Ranking de detectives</h1>
            <p>Los mejores investigadores de la academia.</p>
          </header>

          {/* ============================================
              PODIO (top 3)
              ============================================ */}
          {podium.length > 0 && (
            <section className="podium">
              {getPodiumOrder().map((entry, idx) => {
                if (!entry) return <div key={idx} className="podium__empty" />;
                const place = entry.rank;
                const height = place === 1 ? 'tall' : place === 2 ? 'medium' : 'short';
                const isMe = entry.userId === currentUserId;

                return (
                  <div
                    key={entry.id}
                    className={`podium__slot podium__slot--${height} ${
                      isMe ? 'podium__slot--me' : ''
                    }`}
                  >
                    <div className="podium__avatar">
                      {entry.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="podium__name">{entry.displayName}</div>
                    <div className="podium__xp">⭐ {entry.xp || 0} pts</div>
                    <div className="podium__block">
                      <span className="podium__medal">{getMedal(place)}</span>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ============================================
              TABLA COMPLETA
              ============================================ */}
          <section className="leaderboard">
            <div className="leaderboard__head">
              <div className="leaderboard__col leaderboard__col--rank">#</div>
              <div className="leaderboard__col leaderboard__col--name">Detective</div>
              <div className="leaderboard__col leaderboard__col--cases">Casos</div>
              <div className="leaderboard__col leaderboard__col--xp">Puntos</div>
            </div>

            {leaderboard.map((entry) => {
              const isMe = entry.userId === currentUserId;
              return (
                <div
                  key={entry.id}
                  className={`leaderboard__row ${
                    isMe ? 'leaderboard__row--me' : ''
                  }`}
                >
                  <div className="leaderboard__col leaderboard__col--rank">
                    {getMedal(entry.rank)}
                  </div>
                  <div className="leaderboard__col leaderboard__col--name">
                    {entry.displayName || 'Anónimo'}
                    {isMe && <span className="leaderboard__you">Tú</span>}
                  </div>
                  <div className="leaderboard__col leaderboard__col--cases">
                    {entry.casesSolved || 0}
                  </div>
                  <div className="leaderboard__col leaderboard__col--xp">
                    ⭐ {entry.xp || 0}
                  </div>
                </div>
              );
            })}

            {leaderboard.length === 0 && (
              <div className="leaderboard__empty">
                Nadie ha resuelto ningún caso todavía. ¡Sé el primero!
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}