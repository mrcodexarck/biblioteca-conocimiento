import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  increment,
} from 'firebase/firestore';

import { auth, db } from '../firebase';
import '../css/suggestions.css';

const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const STATUS_LABELS = {
  [STATUS.PENDING]: 'Pendiente',
  [STATUS.APPROVED]: 'Aprobada',
  [STATUS.REJECTED]: 'Rechazada',
};

const STATUS_EMOJIS = {
  [STATUS.PENDING]: '🟡',
  [STATUS.APPROVED]: '🟢',
  [STATUS.REJECTED]: '🔴',
};

const CATEGORIES = ['Funcionalidad', 'Mejora', 'Otro'];
const EMPTY_FORM = { title: '', description: '', category: 'Funcionalidad' };

function formatDate(timestamp) {
  if (!timestamp?.toDate) return 'Fecha pendiente';
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(timestamp.toDate());
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

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // Estado para mensajes por sugerencia
  const [messages, setMessages] = useState({}); // { suggestionId: [message, ...] }
  const [expandedMessages, setExpandedMessages] = useState({}); // { suggestionId: true/false }
  const [messageText, setMessageText] = useState({}); // { suggestionId: string }
  const [loadingMessages, setLoadingMessages] = useState({}); // { suggestionId: true/false }
  const [sendingMessage, setSendingMessage] = useState({}); // { suggestionId: true/false }

  async function loadSuggestions() {
    setLoading(true);
    setError('');
    try {
      const snapshot = await getDocs(collection(db, 'suggestions'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar las sugerencias. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  async function loadUserState() {
    setAdminLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) { setIsAdmin(false); return; }
      const userProfileRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userProfileRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('Datos del usuario:', data);
        setIsAdmin(data?.role === 'admin');
      } else {
        console.warn('No existe documento de usuario para UID:', user.uid);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error(err);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }

  useEffect(() => {
    loadSuggestions();
    loadUserState();
  }, []);

  const filteredSuggestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = suggestions.filter((s) => {
      const matchSearch =
        !normalizedSearch ||
        (s.title || '').toLowerCase().includes(normalizedSearch) ||
        (s.description || '').toLowerCase().includes(normalizedSearch);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || s.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });

    result.sort((a, b) => {
      if (sortMode === 'recent') {
        const aDate = a.createdAt?.toMillis?.() || 0;
        const bDate = b.createdAt?.toMillis?.() || 0;
        return bDate - aDate;
      }
      return 0;
    });
    return result;
  }, [suggestions, search, statusFilter, categoryFilter, sortMode]);

  const stats = useMemo(() => {
    const total = suggestions.length;
    const pending = suggestions.filter(s => s.status === STATUS.PENDING).length;
    const approved = suggestions.filter(s => s.status === STATUS.APPROVED).length;
    const rejected = suggestions.filter(s => s.status === STATUS.REJECTED).length;
    return { total, pending, approved, rejected };
  }, [suggestions]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormMessage('');
    setFormError('');
  };

  const handleCreateSuggestion = async (e) => {
    e.preventDefault();
    if (loadingAction) return;
    setFormMessage('');
    setFormError('');

    const user = auth.currentUser;
    if (!user) {
      setFormError('Debes iniciar sesión para crear una sugerencia.');
      return;
    }

    const { title, description, category } = form;
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) return setFormError('Escribe un título.');
    if (trimmedTitle.length < 5) return setFormError('El título debe tener al menos 5 caracteres.');
    if (trimmedTitle.length > 120) return setFormError('El título no puede superar los 120 caracteres.');
    if (!trimmedDesc) return setFormError('Escribe una descripción.');
    if (trimmedDesc.length < 15) return setFormError('La descripción debe tener al menos 15 caracteres.');
    if (trimmedDesc.length > 2000) return setFormError('La descripción no puede superar los 2000 caracteres.');
    if (!category) return setFormError('Selecciona una categoría.');

    setLoadingAction(true);
    try {
      const ref = doc(collection(db, 'suggestions'));
      await setDoc(ref, {
        title: trimmedTitle,
        description: trimmedDesc,
        category,
        status: STATUS.PENDING,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        authorEmail: user.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messagesCount: 0, // inicializamos el contador
      });
      setForm(EMPTY_FORM);
      setFormMessage('¡Sugerencia enviada! Queda pendiente de revisión.');
      await loadSuggestions();
      setTimeout(() => {
        setShowForm(false);
        setFormMessage('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError('No pudimos guardar la sugerencia. Inténtalo de nuevo.');
    } finally {
      setLoadingAction(false);
    }
  };

  const changeSuggestionStatus = async (suggestionId, newStatus) => {
    if (!isAdmin || loadingAction) return;

    const currentSuggestion = suggestions.find(s => s.id === suggestionId);
    if (!currentSuggestion) return;
    if (currentSuggestion.status !== STATUS.PENDING) {
      window.alert('Esta sugerencia ya no está pendiente. Su estado es definitivo.');
      return;
    }

    setLoadingAction(true);
    try {
      const ref = doc(db, 'suggestions', suggestionId);
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      await loadSuggestions();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      window.alert('No se pudo actualizar el estado.');
    } finally {
      setLoadingAction(false);
    }
  };

  // ---------- Funciones para mensajes ----------
  const toggleMessages = async (suggestionId) => {
    const isExpanded = expandedMessages[suggestionId];
    setExpandedMessages(prev => ({ ...prev, [suggestionId]: !isExpanded }));

    if (!isExpanded && !messages[suggestionId]) {
      await loadMessages(suggestionId);
    }
  };

  const loadMessages = async (suggestionId) => {
    setLoadingMessages(prev => ({ ...prev, [suggestionId]: true }));
    try {
      const messagesRef = collection(db, 'suggestions', suggestionId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(prev => ({ ...prev, [suggestionId]: msgs }));
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    } finally {
      setLoadingMessages(prev => ({ ...prev, [suggestionId]: false }));
    }
  };

  const sendMessage = async (suggestionId) => {
    const text = messageText[suggestionId]?.trim();
    if (!text) return;
    if (!isAdmin) {
      window.alert('Solo los administradores pueden dejar mensajes.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setSendingMessage(prev => ({ ...prev, [suggestionId]: true }));
    try {
      const messagesRef = collection(db, 'suggestions', suggestionId, 'messages');
      await addDoc(messagesRef, {
        text,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Admin',
        createdAt: serverTimestamp(),
      });

      // Actualizar el contador de mensajes en el documento de la sugerencia
      const suggestionRef = doc(db, 'suggestions', suggestionId);
      await updateDoc(suggestionRef, {
        messagesCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      setMessageText(prev => ({ ...prev, [suggestionId]: '' }));
      // Recargar mensajes y sugerencias para actualizar el contador
      await loadMessages(suggestionId);
      await loadSuggestions();
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      window.alert('No se pudo enviar el mensaje.');
    } finally {
      setSendingMessage(prev => ({ ...prev, [suggestionId]: false }));
    }
  };

  return (
    <Layout title="Sugerencias" description="Comparte ideas para mejorar la Biblioteca">
      <main className="suggestions-page">
        <div className="container margin-vert--xl">
          <header className="suggestions-hero">
            <span className="auth-eyebrow">BIBLIOTECA DE CONOCIMIENTO</span>
            <h1>¿Y si tu próxima idea cambia todo?</h1>
            <p>Comparte tus ideas y ayúdanos a mejorar la experiencia del equipo.</p>
          </header>

          <section className="suggestions-stats" aria-label="Estadísticas">
            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">{stats.total}</span>
              <span className="suggestions-stat__label">Sugerencias</span>
            </article>
            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">{stats.pending}</span>
              <span className="suggestions-stat__label">Pendientes</span>
            </article>
            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">{stats.approved}</span>
              <span className="suggestions-stat__label">Aprobadas</span>
            </article>
            <article className="suggestions-stat card">
              <span className="suggestions-stat__value">{stats.rejected}</span>
              <span className="suggestions-stat__label">Rechazadas</span>
            </article>
          </section>

          <section className="suggestions-toolbar">
            <div className="suggestions-search">
              <label htmlFor="suggestions-search">Buscar sugerencias</label>
              <input
                id="suggestions-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <label htmlFor="suggestions-sort">Ordenar</label>
              <select
                id="suggestions-sort"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="recent">Más recientes</option>
              </select>
            </div>

            <div className="suggestions-filter-group">
              <label htmlFor="suggestions-status">Estado</label>
              <select
                id="suggestions-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={STATUS.PENDING}>Pendientes</option>
                <option value={STATUS.APPROVED}>Aprobadas</option>
                <option value={STATUS.REJECTED}>Rechazadas</option>
              </select>
            </div>

            <div className="suggestions-filter-group">
              <label htmlFor="suggestions-category">Categoría</label>
              <select
                id="suggestions-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </section>

          {error && <div className="alert alert--danger" role="alert">{error}</div>}

          <section className="suggestions-list" aria-label="Listado">
            {loading ? (
              <div className="suggestions-empty card">
                <div className="suggestions-spinner" aria-hidden="true" />
                <h2>Cargando sugerencias...</h2>
                <p>Estamos consultando las ideas disponibles.</p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="suggestions-empty card">
                <div className="suggestions-empty__icon" aria-hidden="true">💡</div>
                <h2>{suggestions.length === 0 ? 'Todavía no hay sugerencias' : 'No encontramos resultados'}</h2>
                <p>
                  {suggestions.length === 0
                    ? 'Sé la primera persona en compartir una idea.'
                    : 'Prueba cambiando los filtros o el texto de búsqueda.'}
                </p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => {
                const isPending = suggestion.status === STATUS.PENDING;
                const msgList = messages[suggestion.id] || [];
                const isExpanded = expandedMessages[suggestion.id] || false;
                const isLoadingMsgs = loadingMessages[suggestion.id] || false;
                const isSending = sendingMessage[suggestion.id] || false;
                const currentMsgText = messageText[suggestion.id] || '';
                const count = suggestion.messagesCount || 0;

                return (
                  <article className="suggestions-card card" key={suggestion.id}>
                    <div className="suggestions-card__body">
                      <div className="suggestions-card__top">
                        <div>
                          <span className="badge badge--secondary">
                            {suggestion.category || 'General'}
                          </span>
                          <h2>{suggestion.title}</h2>
                        </div>
                        <span className={`suggestions-status suggestions-status--${suggestion.status}`}>
                          {getStatusEmoji(suggestion.status)} {getStatusLabel(suggestion.status)}
                        </span>
                      </div>

                      <p className="suggestions-card__description">{suggestion.description}</p>

                      <div className="suggestions-card__footer">
                        <div className="suggestions-card__meta">
                          <span>Propuesta por <strong>{suggestion.authorName || 'Usuario'}</strong></span>
                          <span>{formatDate(suggestion.createdAt)}</span>
                        </div>

                        {/* Botón de respuestas visible para todos los autenticados */}
                        {auth.currentUser && (
                          <button
                            className="button button--sm button-messages"
                            onClick={() => toggleMessages(suggestion.id)}
                          >
                            {isExpanded ? 'Ocultar respuestas' : 'Ver respuestas'} ({count})
                          </button>
                        )}
                      </div>

                      {/* Panel de administración: solo visible si la sugerencia está pendiente y es admin */}
                      {isAdmin && !adminLoading && isPending && (
                        <div className="suggestions-admin">
                          <div>
                            <strong>Administración</strong>
                            <span>Cambiar estado de la sugerencia:</span>
                          </div>
                          <div className="suggestions-admin__actions">
                            <button
                              type="button"
                              className="button button--sm button-approve"
                              onClick={() => changeSuggestionStatus(suggestion.id, STATUS.APPROVED)}
                              disabled={!isPending}
                            >
                              Aprobar
                            </button>
                            <button
                              type="button"
                              className="button button--sm button-reject"
                              onClick={() => changeSuggestionStatus(suggestion.id, STATUS.REJECTED)}
                              disabled={!isPending}
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Panel de mensajes desplegable */}
                      {isExpanded && (
                        <div className="suggestions-messages-panel">
                          {isLoadingMsgs ? (
                            <p className="suggestions-messages-loading">Cargando mensajes...</p>
                          ) : msgList.length === 0 ? (
                            <p className="suggestions-messages-empty">No hay respuestas aún.</p>
                          ) : (
                            <ul className="suggestions-messages-list">
                              {msgList.map((msg) => (
                                <li key={msg.id} className="suggestions-message-item">
                                  <div className="suggestions-message-author">
                                    <strong>{msg.authorName || 'Admin'}</strong>
                                    <span>{formatDate(msg.createdAt)}</span>
                                  </div>
                                  <p className="suggestions-message-text">{msg.text}</p>
                                </li>
                              ))}
                            </ul>
                          )}

                          {isAdmin && (
                            <div className="suggestions-message-form">
                              <input
                                type="text"
                                value={currentMsgText}
                                onChange={(e) => setMessageText(prev => ({ ...prev, [suggestion.id]: e.target.value }))}
                                placeholder="Escribe una respuesta..."
                                disabled={isSending}
                              />
                              <button
                                className="button button--sm button--primary"
                                onClick={() => sendMessage(suggestion.id)}
                                disabled={isSending || !currentMsgText.trim()}
                              >
                                {isSending ? 'Enviando...' : 'Responder'}
                              </button>
                            </div>
                          )}
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
            onClick={() => !loadingAction && setShowForm(false)}
          />
          <div className="suggestions-modal__content card">
            <header className="suggestions-modal__header">
              <div>
                <span className="auth-eyebrow">NUEVA PROPUESTA</span>
                <h2 id="suggestions-modal-title">Comparte tu idea</h2>
              </div>
              <button
                type="button"
                className="suggestions-modal__close"
                onClick={() => !loadingAction && setShowForm(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>
            <form className="suggestions-form" onSubmit={handleCreateSuggestion}>
              <div className="suggestions-field">
                <label htmlFor="suggestion-title">Título</label>
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
                <label htmlFor="suggestion-category">Categoría</label>
                <select
                  id="suggestion-category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  disabled={loadingAction}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="suggestions-field">
                <label htmlFor="suggestion-description">Descripción</label>
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

              {formError && <div className="alert alert--danger" role="alert">{formError}</div>}
              {formMessage && <div className="alert alert--success" role="status">{formMessage}</div>}

              <div className="suggestions-form__actions">
                <button
                  type="button"
                  className="button button--outline"
                  onClick={() => !loadingAction && setShowForm(false)}
                  disabled={loadingAction}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button--primary" disabled={loadingAction}>
                  {loadingAction ? 'Enviando…' : 'Enviar sugerencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}