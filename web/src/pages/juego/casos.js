import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ALL_CASES } from '@site/src/utils/juego/cases';
import '../../css/juego.css';

export default function Casos() {
  return (
    <Layout title="Seleccionar caso" description="Elige un misterio para resolver">
      <main className="juego-page">
        <div className="container margin-vert--xl">
          <header className="juego-hero">
            <span className="juego-eyebrow">ARCHIVO DE CASOS</span>
            <h1>Elige tu próximo misterio</h1>
            <p>Pon a prueba tu ingenio con estos casos inspirados en Sherlock Holmes.</p>
          </header>

          <div className="cases-grid">
           {ALL_CASES.map((c) => {
  return (
    <Link
      key={c.id}
      to={`/juego/nueva-partida?case=${c.id}`}
      className="juego-card"
    >
      <div className="juego-card__icon" aria-hidden="true">
        🔍
      </div>
      <h2>{c.title}</h2>
      <p>{c.briefing.substring(0, 100)}...</p>
      <span className="juego-card__badge">
        Dificultad: {'★'.repeat(c.difficulty)}
      </span>
    </Link>
  );
})}
          </div>
        </div>
      </main>
    </Layout>
  );
}