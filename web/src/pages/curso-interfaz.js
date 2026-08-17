import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function CursoInterfaz() {
  return (
    <Layout title="Curso de interfaz" description="Introducción a la interfaz y al entorno de trabajo">
      <main>
        <div className="container margin-vert--xl">
          <header className="page-heading">
            <span className="auth-eyebrow">CURSO</span>
            <h1>Introducción a la interfaz</h1>
            <p>Comprende el entorno, organiza tus paneles y prepara el escenario principal del proyecto.</p>
            <div className="course-meta">
              <span className="badge badge--secondary">Nivel básico</span>
              <span className="badge badge--secondary">1 clase disponible</span>
            </div>
          </header>

          <section className="card course-lesson">
            <div className="course-preview__icon" aria-hidden="true">🎮</div>
            <div>
              <h2>Qué es un Game Object y sus componentes</h2>
              <p>Introducción a los elementos principales que componen una escena.</p>
              <Link to="/docs/cursos/curso-contabilidad/1-modulo-uno" className="button button--primary">
                Abrir contenido
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
