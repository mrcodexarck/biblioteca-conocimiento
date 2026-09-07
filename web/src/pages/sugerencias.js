import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebase';

import '../css/suggestions.css';

const STATUS = {
  PENDING: 'pending',
  REVIEW: 'review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

const STATUS_LABELS = {
  [STATUS.PENDING]: 'Pendiente',
  [STATUS.REVIEW]: 'En revisión',
  [STATUS.APPROVED]: 'Aprobada',
  [STATUS.REJECTED]: 'Rechazada',
  [STATUS.IN_PROGRESS]: 'En desarrollo',
  [STATUS.COMPLETED]: 'Completada',
};

const STATUS_EMOJIS = {
  [STATUS.PENDING]: '🟡',
  [STATUS.REVIEW]: '🔵',
  [STATUS.APPROVED]: '🟢',
  [STATUS.REJECTED]: '🔴',
  [STATUS.IN_PROGRESS]: '🟣',
  [STATUS.COMPLETED]: '✅',
};

const CATEGORIES = [
  'Funcionalidad',
  'Mejora',
  'Otro',
];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Funcionalidad',
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) {
    return 'Fecha pendiente';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(timestamp.toDate());
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || 'Sin estado';
}

function getStatusEmoji(status) {
  return STATUS_EMOJIS[status] || '⚪';
}

export default function Sugerencias() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState('recent');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  const [votedSuggestions, setVotedSuggestions] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const currentUser = auth.currentUser;

  async function loadSuggestions() {
    setLoading(true);
    setError('');

    try {
      const snapshot = await getDocs(collection(db, 'suggestions'));

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setSuggestions(data);
    } catch (loadError) {
      console.error(loadError);
      setError(
        'No pudimos cargar las sugerencias. Revisa tu conexión e inténtalo nuevamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadUserState() {
    setAdminLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setIsAdmin(false);
        return;
      }

      const userProfileRef = doc(db, 'users', user.uid);
      const userProfileSnapshot = await getDoc(userProfileRef);

      setIsAdmin(
        userProfileSnapshot.exists() &&
          userProfileSnapshot.data()?.role === 'admin',
      );
    } catch (profileError) {
      console.error(profileError);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }

  async function loadVotes() {
    const user = auth.currentUser;

    if (!user) {
      setVotedSuggestions({});
      return;
    }

    const voteState = {};

    await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          const voteRef = doc(
            db,
            'suggestions',
            suggestion.id,
            'votes',
            user.uid,
          );

          const voteSnapshot = await getDoc(voteRef);

          voteState[suggestion.id] = voteSnapshot.exists();
        } catch (voteError) {
          console.error(voteError);
          voteState[suggestion.id] = false;
        }
      }),
    );

    setVotedSuggestions(voteState);
  }

  useEffect(() => {
    loadSuggestions();
    loadUserState();
  }, []);

  useEffect(() => {
    if (suggestions.length > 0) {
      loadVotes();
    } else {
      setVotedSuggestions({});
    }
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = suggestions.filter((suggestion) => {
      const matchesSearch =
        !normalizedSearch ||
        String(suggestion.title || '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(suggestion.description || '')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || suggestion.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' ||
        suggestion.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortMode === 'votes') {
        return Number(b.votesCount || 0) - Number(a.votesCount || 0);
      }

      if (sortMode === 'comments') {
        return (
          Number(b.commentsCount || 0) -
          Number(a.commentsCount || 0)
        );
      }

      const aDate = a.createdAt?.toMillis?.() || 0;
      const bDate = b.createdAt?.toMillis?.() || 0;

      return bDate - aDate;
    });

    return result;
  }, [
    suggestions,
    search,
    statusFilter,
    categoryFilter,
    sortMode,
  ]);

  const stats = useMemo(() => {
    return {
      total: suggestions.length,
      review: suggestions.filter(
        (item) => item.status === STATUS.REVIEW,
      ).length,
      approved: suggestions.filter(
        (item) =>
          item.status === STATUS.APPROVED ||
          item.status === STATUS.IN_PROGRESS ||
          item.status === STATUS.COMPLETED,
      ).length,
      votes: suggestions.reduce(
        (total, item) => total + Number(item.votesCount || 0),
        0,
      ),
    };
  }, [suggestions]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormMessage('');
    setFormError('');
  };

  const handleCreateSuggestion = async (event) => {
    event.preventDefault();

    if (loadingAction) {
      return;
    }

    setFormMessage('');
    setFormError('');

    const user = auth.currentUser;

    if (!user) {
      setFormError(
        'Debes iniciar sesión para crear una sugerencia.',
      );
      return;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category.trim();

    if (!title) {
      setFormError('Escribe un título para la sugerencia.');
      return;
    }

    if (title.length < 5) {
      setFormError('El título debe tener al menos 5 caracteres.');
      return;
    }

    if (title.length > 120) {
      setFormError(
        'El título no puede superar los 120 caracteres.',
      );
      return;
    }

    if (!description) {
      setFormError('Escribe una descripción.');
      return;
    }

    if (description.length < 15) {
      setFormError(
        'La descripción debe tener al menos 15 caracteres.',
      );
      return;
    }

    if (description.length > 2000) {
      setFormError(
        'La descripción no puede superar los 2000 caracteres.',
      );
      return;
    }

    if (!category) {
      setFormError('Selecciona una categoría.');
      return;
    }

    setLoadingAction(true);

    try {
      const suggestionRef = doc(collection(db, 'suggestions'));

      await setDoc(suggestionRef, {
        title,
        description,
        category,
        status: STATUS.PENDING,
        authorId: user.uid,
        authorName:
          user.displayName ||
          user.email?.split('@')[0] ||
          'Usuario',
        authorEmail: user.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        votesCount: 0,
        commentsCount: 0,
      });

      setForm(EMPTY_FORM);
      setFormMessage(
        'Tu sugerencia fue enviada correctamente y quedó pendiente de revisión.',
      );

      await loadSuggestions();

      setTimeout(() => {
        setShowForm(false);
        setFormMessage('');
      }, 1200);
    } catch (createError) {
      console.error(createError);

      setFormError(
        'No pudimos guardar la sugerencia. Inténtalo nuevamente.',
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleVote = async (suggestion) => {
    const user = auth.currentUser;

    if (!user) {
      window.alert(
        'Debes iniciar sesión para votar una sugerencia.',
      );
      return;
    }

    if (loadingAction) {
      return;
    }

    setLoadingAction(true);

    try {
      const suggestionRef = doc(
        db,
        'suggestions',
        suggestion.id,
      );

      const voteRef = doc(
        db,
        'suggestions',
        suggestion.id,
        'votes',
        user.uid,
      );

      await runTransaction(db, async (transaction) => {
        const suggestionSnapshot =
          await transaction.get(suggestionRef);

        if (!suggestionSnapshot.exists()) {
          throw new Error('La sugerencia no existe.');
        }

        const voteSnapshot = await transaction.get(voteRef);

        const currentCount = Number(
          suggestionSnapshot.data()?.votesCount || 0,
        );

        if (voteSnapshot.exists()) {
          transaction.delete(voteRef);

          transaction.update(suggestionRef, {
            votesCount: Math.max(currentCount - 1, 0),
            updatedAt: serverTimestamp(),
          });
        } else {
          transaction.set(voteRef, {
            userId: user.uid,
            createdAt: serverTimestamp(),
          });

          transaction.update(suggestionRef, {
            votesCount: currentCount + 1,
            updatedAt: serverTimestamp(),
          });
        }
      });

      await loadSuggestions();
    } catch (voteError) {
      console.error(voteError);

      window.alert(
        'No pudimos actualizar tu voto. Inténtalo nuevamente.',
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const changeSuggestionStatus = async (
    suggestionId,
    nextStatus,
  ) => {
    if (!isAdmin || loadingAction) {
      return;
    }

    setLoadingAction(true);

    try {
      const suggestionRef = doc(
        db,
        'suggestions',
        suggestionId,
      );

      await updateDoc(suggestionRef, {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });

      await loadSuggestions();
    } catch (statusError) {
      console.error(statusError);

      window.alert(
        'No pudimos actualizar el estado de la sugerencia.',
      );
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Layout
      title="Sugerencias"
      description="Comparte ideas y sugerencias para mejorar la Biblioteca de Conocimiento"
    >
      <main className="suggestions-page">
        <div className="container margin-vert--xl">

          <header className="suggestions-hero">
            <span className="auth-eyebrow">
              BIBLIOTECA DE CONOCIMIENTO
            </span>

            <h1>¿Y si tu próxima idea cambia todo?</h1>

            <p>
              Comparte tus ideas, vota por las propuestas que más
              aportan y ayúdanos a mejorar la experiencia del equipo.
            </p>
          </header>

          <section
            className="suggestions-stats"
            aria-label="Estadísticas de sugerencias"
          >
            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">
                {stats.total}
              </span>
              <span className="suggestions-stat__label">
                Sugerencias
              </span>
            </article>

            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">
                {stats.review}
              </span>
              <span className="suggestions-stat__label">
                En revisión
              </span>
            </article>

            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">
                {stats.approved}
              </span>
              <span className="suggestions-stat__label">
                Aprobadas
              </span>
            </article>

            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">
                {stats.votes}
              </span>
              <span className="suggestions-stat__label">
                Votos
              </span>
            </article>
          </section>

          <section className="suggestions-toolbar">
            <div className="suggestions-search">
              <label htmlFor="suggestions-search">
                Buscar sugerencias
              </label>

              <input
                id="suggestions-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Busca por título o descripción..."
              />
            </div>

            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                setShowForm(true);
                setFormMessage('');
                setFormError('');
              }}
            >
              + Proponer idea
            </button>
          </section>

          <section className="suggestions-filters">
            <div className="suggestions-filter-group">
              <label htmlFor="suggestions-sort">
                Ordenar
              </label>

              <select
                id="suggestions-sort"
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value)
                }
              >
                <option value="recent">Más recientes</option>
                <option value="votes">Más votadas</option>
                <option value="comments">
                  Más comentadas
                </option>
              </select>
            </div>

            <div className="suggestions-filter-group">
              <label htmlFor="suggestions-status">
                Estado
              </label>

              <select
                id="suggestions-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">Todos</option>
                <option value={STATUS.PENDING}>
                  Pendientes
                </option>
                <option value={STATUS.REVIEW}>
                  En revisión
                </option>
                <option value={STATUS.APPROVED}>
                  Aprobadas
                </option>
                <option value={STATUS.IN_PROGRESS}>
                  En desarrollo
                </option>
                <option value={STATUS.COMPLETED}>
                  Completadas
                </option>
                <option value={STATUS.REJECTED}>
                  Rechazadas
                </option>
              </select>
            </div>

            <div className="suggestions-filter-group">
              <label htmlFor="suggestions-category">
                Categoría
              </label>

              <select
                id="suggestions-category"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                <option value="all">Todas</option>

                {CATEGORIES.map((category) => (
                  <option
                    value={category}
                    key={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {error && (
            <div
              className="alert alert--danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <section
            className="suggestions-list"
            aria-label="Listado de sugerencias"
          >
            {loading ? (
              <div className="suggestions-empty card">
                <div
                  className="suggestions-spinner"
                  aria-hidden="true"
                />
                <h2>Cargando sugerencias...</h2>
                <p>
                  Estamos consultando las ideas disponibles.
                </p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="suggestions-empty card">
                <div
                  className="suggestions-empty__icon"
                  aria-hidden="true"
                >
                  💡
                </div>

                <h2>
                  {suggestions.length === 0
                    ? 'Todavía no hay sugerencias'
                    : 'No encontramos resultados'}
                </h2>

                <p>
                  {suggestions.length === 0
                    ? 'Sé la primera persona en compartir una idea.'
                    : 'Prueba cambiando los filtros o el texto de búsqueda.'}
                </p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => {
                const hasVoted =
                  votedSuggestions[suggestion.id] === true;

                return (
                  <article
                    className="suggestions-card card"
                    key={suggestion.id}
                  >
                    <div className="suggestions-card__body">
                      <div className="suggestions-card__top">
                        <div>
                          <span className="badge badge--secondary">
                            {suggestion.category || 'General'}
                          </span>

                          <h2>{suggestion.title}</h2>
                        </div>

                        <span
                          className={`suggestions-status suggestions-status--${suggestion.status}`}
                        >
                          {getStatusEmoji(suggestion.status)}{' '}
                          {getStatusLabel(suggestion.status)}
                        </span>
                      </div>

                      <p className="suggestions-card__description">
                        {suggestion.description}
                      </p>

                      <div className="suggestions-card__footer">
                        <div className="suggestions-card__meta">
                          <span>
                            Propuesta por{' '}
                            <strong>
                              {suggestion.authorName ||
                                'Usuario'}
                            </strong>
                          </span>

                          <span>
                            {formatDate(suggestion.createdAt)}
                          </span>
                        </div>

                        <div className="suggestions-card__actions">
                          <button
                            type="button"
                            className={`suggestions-vote ${
                              hasVoted
                                ? 'suggestions-vote--active'
                                : ''
                            }`}
                            onClick={() =>
                              toggleVote(suggestion)
                            }
                            disabled={
                              loadingAction ||
                              adminLoading
                            }
                            aria-pressed={hasVoted}
                          >
                            {hasVoted
                              ? '✓ Votaste'
                              : '👍 Votar'}

                            <span>
                              {Number(
                                suggestion.votesCount || 0,
                              )}
                            </span>
                          </button>

                          <span className="suggestions-comments">
                            💬{' '}
                            {Number(
                              suggestion.commentsCount || 0,
                            )}
                          </span>
                        </div>
                      </div>

                      {isAdmin && !adminLoading && (
                        <div className="suggestions-admin">
                          <div>
                            <strong>
                              Administración
                            </strong>

                            <span>
                              Solo visible para administradores.
                            </span>
                          </div>

                          <div className="suggestions-admin__actions">
                            <button
                              type="button"
                              className="button button--sm button--outline"
                              onClick={() =>
                                changeSuggestionStatus(
                                  suggestion.id,
                                  STATUS.REVIEW,
                                )
                              }
                            >
                              Revisar
                            </button>

                            <button
                              type="button"
                              className="button button--sm button--primary"
                              onClick={() =>
                                changeSuggestionStatus(
                                  suggestion.id,
                                  STATUS.APPROVED,
                                )
                              }
                            >
                              Aprobar
                            </button>

                            <button
                              type="button"
                              className="button button--sm button--outline"
                              onClick={() =>
                                changeSuggestionStatus(
                                  suggestion.id,
                                  STATUS.IN_PROGRESS,
                                )
                              }
                            >
                              En desarrollo
                            </button>

                            <button
                              type="button"
                              className="button button--sm button--primary"
                              onClick={() =>
                                changeSuggestionStatus(
                                  suggestion.id,
                                  STATUS.COMPLETED,
                                )
                              }
                            >
                              Completar
                            </button>

                            <button
                              type="button"
                              className="button button--sm button--outline"
                              onClick={() =>
                                changeSuggestionStatus(
                                  suggestion.id,
                                  STATUS.REJECTED,
                                )
                              }
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <div
          className="suggestions-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggestions-modal-title"
        >
          <button
            type="button"
            className="suggestions-modal__backdrop"
            aria-label="Cerrar formulario"
            onClick={() => {
              if (!loadingAction) {
                setShowForm(false);
              }
            }}
          />

          <div className="suggestions-modal__content card">
            <header className="suggestions-modal__header">
              <div>
                <span className="auth-eyebrow">
                  NUEVA PROPUESTA
                </span>

                <h2 id="suggestions-modal-title">
                  Comparte tu idea
                </h2>
              </div>

              <button
                type="button"
                className="suggestions-modal__close"
                onClick={() => {
                  if (!loadingAction) {
                    setShowForm(false);
                  }
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>

            <form
              className="suggestions-form"
              onSubmit={handleCreateSuggestion}
            >
              <div className="suggestions-field">
                <label htmlFor="suggestion-title">
                  Título
                </label>

                <input
                  id="suggestion-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleFormChange}
                  maxLength={120}
                  placeholder="Ej. Agregar exportación a Excel"
                  disabled={loadingAction}
                />
              </div>

              <div className="suggestions-field">
                <label htmlFor="suggestion-category">
                  Categoría
                </label>

                <select
                  id="suggestion-category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  disabled={loadingAction}
                >
                  {CATEGORIES.map((category) => (
                    <option
                      value={category}
                      key={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="suggestions-field">
                <label htmlFor="suggestion-description">
                  Descripción
                </label>

                <textarea
                  id="suggestion-description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={6}
                  maxLength={2000}
                  placeholder="Cuéntanos qué propones, qué problema resolvería y cómo podría ayudarte."
                  disabled={loadingAction}
                />
              </div>

              {formError && (
                <div
                  className="alert alert--danger"
                  role="alert"
                >
                  {formError}
                </div>
              )}

              {formMessage && (
                <div
                  className="alert alert--success"
                  role="status"
                >
                  {formMessage}
                </div>
              )}

              <div className="suggestions-form__actions">
                <button
                  type="button"
                  className="button button--outline"
                  onClick={() => {
                    if (!loadingAction) {
                      setShowForm(false);
                    }
                  }}
                  disabled={loadingAction}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button--primary"
                  disabled={loadingAction}
                >
                  {loadingAction
                    ? 'Enviando…'
                    : 'Enviar sugerencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}