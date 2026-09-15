import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { auth } from '@site/src/firebase';
import { getProgress } from '@site/src/utils/juego/storage';
import '../../css/juego.css';

const CASE_ID = 'case-001';

export default function Juego() {
  const [pendingCase, setPendingCase] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingProgress(false);
        return;
      }
      const p = await getProgress(user.uid, CASE_ID);
      if (p && p.status === 'in_progress') {
        setPendingCase({
          caseTitle: p.caseTitle || 'Caso en curso',
          caseId: p.caseId,
          discovered: (p.discoveredItems || []).length,
        });
      }
      setLoadingProgress(false);
    };
    load();
  }, []);

  const cards = [
    {
      icon: '🎮',
      title: 'Nueva partida',
      text: 'Comienza un nuevo caso desde cero.',
      to: '/juego/nueva-partida',
      disabled: false,
    },
    {
      icon: '📁',
      title: 'Continuar',
      text: pendingCase
        ? `Retomar "${pendingCase.caseTitle}" — ${pendingCase.discovered} pistas encontradas`
        : 'No hay casos en curso.',
      to: '/juego/nueva-partida?resume=1',
      disabled: !pendingCase,
      highlight: Boolean(pendingCase),
    },
    {
      icon: '🏆',
      title: 'Logros',
      text: 'Revisa tus medallas y progreso.',
      to: '/juego/logros',
      disabled: true,
    },
    {
      icon: '⚙️',
      title: 'Opciones',
      text: 'Ajustes de sonido, dificultad y más.',
      to: '/juego/opciones',
      disabled: true,
    },
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

          <section className="juego-grid">
            {cards.map((card) => {
              const url = useBaseUrl(card.to);
              const isDisabled = card.disabled;

              if (isDisabled) {
                return (
                  <div key={card.title} className="juego-card juego-card--disabled">
                    <div className="juego-card__icon" aria-hidden="true">
                      {card.icon}
                    </div>
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
                  className={`juego-card ${
                    card.highlight ? 'juego-card--highlight' : ''
                  }`}
                >
                  <div className="juego-card__icon" aria-hidden="true">
                    {card.icon}
                  </div>
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