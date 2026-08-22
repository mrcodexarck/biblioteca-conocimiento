import React, { useEffect, useMemo, useState } from 'react';
import {
  completeCourseTest,
  getCourseProgress,
  saveAnswer,
  startCourseTest,
} from '@site/src/utils/courseprogress';

export default function Quiz({
  courseId,
  preguntas = [],
}) {
  const [progress, setProgress] = useState(null);
  const [resultado, setResultado] = useState(null);

  const totalPreguntas = preguntas.length;

  useEffect(() => {
    if (!courseId || totalPreguntas === 0) {
      return;
    }

    const existing = getCourseprogress(courseId);

    if (existing?.status === 'completed') {
      setProgress(existing);
      setResultado(existing);
      return;
    }

    const started = startCourseTest(
      courseId,
      totalPreguntas,
    );

    setProgress(started);
  }, [courseId, totalPreguntas]);

  const respuestas = progress?.answers ?? [];

  const preguntasRespondidas = useMemo(
    () =>
      respuestas.filter(
        (answer) => answer !== null && answer !== undefined,
      ).length,
    [respuestas],
  );

  const todasRespondidas =
    totalPreguntas > 0 &&
    preguntasRespondidas === totalPreguntas;

  function seleccionarRespuesta(
    questionIndex,
    answerIndex,
  ) {
    if (resultado) {
      return;
    }

    const updated = saveAnswer(
      courseId,
      questionIndex,
      answerIndex,
      totalPreguntas,
    );

    setProgress(updated);
  }

  function finalizarTest() {
    if (!todasRespondidas || resultado) {
      return;
    }

    const finalResult = completeCourseTest(
      courseId,
      preguntas,
      respuestas,
    );

    setProgress(finalResult);
    setResultado(finalResult);
  }

  if (!progress) {
    return (
      <section className="card quiz-card">
        <div className="card__body">
          <p>Cargando evaluación…</p>
        </div>
      </section>
    );
  }

  if (resultado) {
    return (
      <section className="card quiz-card quiz-result">
        <div className="card__body">
          <div className="quiz-result__icon" aria-hidden="true">
            🎓
          </div>

          <h2>Test finalizado</h2>

          <div className="quiz-result__percentage">
            {resultado.percentage}%
          </div>

          <p className="quiz-result__score">
            Respondiste correctamente{' '}
            <strong>
              {resultado.score} de {resultado.totalQuestions}
            </strong>{' '}
            preguntas.
          </p>

          <div
            className="alert alert--success margin-top--md"
            role="status"
          >
            ✅ El test ha sido finalizado correctamente.
          </div>

          <p className="margin-top--md">
            Los demás módulos del curso ya están disponibles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="card quiz-card"
      aria-labelledby="quiz-title"
    >
      <div className="card__body">
        <div className="quiz-header">
          <div>
            <span className="quiz-header__label">
              EVALUACIÓN FINAL
            </span>

            <h2 id="quiz-title">
              🧠 Test de conocimientos
            </h2>
          </div>

          <div className="quiz-progress">
            {preguntasRespondidas} / {totalPreguntas}
          </div>
        </div>

        <p className="quiz-instructions">
          Responde todas las preguntas antes de finalizar el test.
          Mientras la evaluación esté en progreso, los demás módulos
          permanecerán bloqueados.
        </p>

        {preguntas.map((pregunta, questionIndex) => {
          const seleccionada = respuestas[questionIndex];

          return (
            <article
              className="quiz-question"
              key={pregunta.id ?? questionIndex}
            >
              <h3>
                {questionIndex + 1}. {pregunta.pregunta}
              </h3>

              <div
                className="quiz-options"
                role="radiogroup"
                aria-label={`Pregunta ${questionIndex + 1}`}
              >
                {pregunta.opciones.map(
                  (opcion, optionIndex) => {
                    const seleccionadaActual =
                      seleccionada === optionIndex;

                    return (
                      <button
                        key={`${questionIndex}-${optionIndex}`}
                        type="button"
                        role="radio"
                        aria-checked={
                          seleccionadaActual
                        }
                        className={[
                          'quiz-option',
                          seleccionadaActual
                            ? 'quiz-option--selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() =>
                          seleccionarRespuesta(
                            questionIndex,
                            optionIndex,
                          )
                        }
                      >
                        <span className="quiz-option__marker">
                          {String.fromCharCode(
                            65 + optionIndex,
                          )}
                        </span>

                        <span>{opcion}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </article>
          );
        })}

        <div className="quiz-submit-area">
          <p
            className="quiz-answer-count"
            aria-live="polite"
          >
            {todasRespondidas
              ? '✅ Todas las preguntas están respondidas.'
              : `Faltan ${
                  totalPreguntas - preguntasRespondidas
                } pregunta(s) por responder.`}
          </p>

          <button
            className="button button--primary button--lg"
            type="button"
            onClick={finalizarTest}
            disabled={!todasRespondidas}
          >
            FINALIZAR TEST
          </button>
        </div>
      </div>
    </section>
  );
}