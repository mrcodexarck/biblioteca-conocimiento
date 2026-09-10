import React, {
  useState,
} from 'react';

import Layout from '@theme/Layout';

import Link from '@docusaurus/Link';

const cursos = [

  {
    id: 'contabilidad',

    titulo:
      'Curso de Contabilidad',

    descripcion:
      'Aprende los fundamentos y desarrolla ejercicios prácticos de contabilidad.',

    etiqueta:
      'Administrativo',

    icono:
      '📊',

    enlace:
      '/docs/cursos/curso-contabilidad/modulo-uno',
  },

  {
    id: 'nomina',

    titulo:
      'Curso de Nómina',

    descripcion:
      'Recorre los conceptos, procesos y talleres prácticos relacionados con nómina.',

    etiqueta:
      'Administrativo',

    icono:
      '🧾',

    enlace:
      '/docs/cursos/curso-nomina/bienvenida',
  },

  {
    id: 'isv',

    titulo:
      'Curso de ISV',

    descripcion:
      'Aprende los fundamentos y desarrolla ejercicios prácticos de ISV.',

    etiqueta:
      'Administrativo',

    icono:
      '💼',

    enlace:
      '/docs/cursos/curso-isv/modulo-uno',
  },

];

export default function Cursos() {

  const [
    cursoId,
    setCursoId,
  ] = useState(
    cursos[0].id,
  );

  const cursoSeleccionado =
    cursos.find(
      (curso) =>
        curso.id === cursoId,
    ) ?? cursos[0];

  return (

    <Layout
      title="Cursos y talleres"
      description="Rutas de aprendizaje de la biblioteca de conocimiento"
    >

      <main className="courses-page">

        <div className="container margin-vert--xl">

          <header className="page-heading">

            <span className="auth-eyebrow">
              ACADEMIA
            </span>

            <h1>
              Rutas de aprendizaje
            </h1>

            <p>
              Contenido organizado para aprender,
              practicar y resolver casos frecuentes.
            </p>

          </header>

          <div className="courses-layout">

            <section
              className="card courses-list"
              aria-label="Cursos disponibles"
            >

              <div className="card__header">

                <h2 className="margin-bottom--none">
                  Cursos disponibles
                </h2>

              </div>

              <div className="card__body">

                <div
                  className="courses-tabs"
                  role="tablist"
                  aria-label="Seleccionar curso"
                >

                  {cursos.map(
                    (curso) => (

                      <button
                        key={curso.id}
                        type="button"
                        role="tab"
                        aria-selected={
                          curso.id ===
                          cursoId
                        }
                        className={
                          `course-tab ${
                            curso.id ===
                            cursoId
                              ? 'course-tab--active'
                              : ''
                          }`
                        }
                        onClick={() =>
                          setCursoId(
                            curso.id,
                          )
                        }
                      >

                        <span
                          className="course-tab__icon"
                          aria-hidden="true"
                        >
                          {curso.icono}
                        </span>

                        <span>

                          <strong>
                            {curso.titulo}
                          </strong>

                          <small>
                            {curso.etiqueta}
                          </small>

                        </span>

                      </button>

                    ),
                  )}

                </div>

              </div>

            </section>

            <article className="card course-preview">

              <div
                className="course-preview__icon"
                aria-hidden="true"
              >
                {cursoSeleccionado.icono}
              </div>

              <span className="badge badge--secondary">
                {cursoSeleccionado.etiqueta}
              </span>

              <h2>
                {cursoSeleccionado.titulo}
              </h2>

              <p>
                {cursoSeleccionado.descripcion}
              </p>

              <Link
                to={cursoSeleccionado.enlace}
                className="button button--primary button--block"
              >
                Empezar curso
              </Link>

            </article>

          </div>

        </div>

      </main>

    </Layout>
  );
}