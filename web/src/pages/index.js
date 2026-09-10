import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

const highlights = [
  {
    icon: '📚',
    title: 'Cursos y talleres',
    text: 'Rutas de aprendizaje por módulos con contenido progresivo y ejercicios prácticos.',
    url: '/Cursos/curso-contabilidad/3-modulo-tres',
  },
  {
    icon: '🧭',
    title: 'Documentación',
    text: 'Guías organizadas para consultar procesos, conceptos y soluciones de soporte.',
    url: '/docs/documentacion/isvleo/pruebasleo',
  },
  {
    icon: '🛠️',
    title: 'Casos comunes',
    text: 'Respuestas rápidas para incidentes frecuentes y tareas repetitivas del equipo.',
    url: '/docs/casos/acceso-usuarios',
  },
  {
    icon: '💡',
    title: 'Sugerencias',
    text: 'Comparte ideas para mejorar la experiencia del equipo.',
    url: '/sugerencias',
  },
];

export default function Home() {
  return (
    <Layout title="Inicio" description="Biblioteca de conocimiento y soporte asistido">
      <main>
        {/* Hero */}
        <section className="home-hero">
          <div className="container">
            <div className="home-hero__content">
              <span className="auth-eyebrow">BIBLIOTECA DE CONOCIMIENTO</span>
              <h1>Soporte asistido</h1>
              <p>Tutoriales, documentación y rutas de aprendizaje para el equipo.</p>
              <Link className="button button--primary button--lg" to={useBaseUrl('/Cursos')}>
                Explorar la biblioteca
              </Link>
            </div>
          </div>
        </section>

        {/* Tarjetas */}
        <section className="container margin-vert--xl">
          <div className="row">
            {highlights.map((item) => {
              const url = useBaseUrl(item.url);
              return (
                <div className="col col--4 margin-bottom--lg" key={item.title}>
                  <Link to={url} style={{ textDecoration: 'none', display: 'block' }}>
                    <article className="home-feature card">
                      <div className="home-feature__icon" aria-hidden="true">
                        {item.icon}
                      </div>
                      <h2>{item.title}</h2>
                      <p>{item.text}</p>
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}