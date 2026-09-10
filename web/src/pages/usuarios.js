import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { auth, db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import '../css/usuarios.css';

const ROLES = {
  PROPIETARIO: 'propietario',
  ADMIN: 'admin',
  USER: 'user',
};

const ROLE_LABELS = {
  [ROLES.PROPIETARIO]: '👑 Propietario',
  [ROLES.ADMIN]: '🔑 Administrador',
  [ROLES.USER]: '👤 Usuario',
};

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('Debes iniciar sesión para acceder a esta página.');
      setLoading(false);
      return;
    }
    setCurrentUserId(user.uid);

    const loadData = async () => {
      try {
        // Cargar rol del usuario actual
        const myDoc = await getDoc(doc(db, 'users', user.uid));
        if (myDoc.exists()) {
          setCurrentUserRole(myDoc.data().role || 'user');
        } else {
          setCurrentUserRole('user');
        }

        // Cargar todos los usuarios
        const snapshot = await getDocs(collection(db, 'users'));
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(list);
      } catch (err) {
        console.error(err);
        setError('No pudimos cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.displayName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const isOwner = currentUserRole === ROLES.PROPIETARIO;

  const handleRoleChange = async (userId, newRole) => {
    if (!isOwner) {
      window.alert('Solo el propietario puede cambiar roles.');
      return;
    }
    if (userId === currentUserId) {
      window.alert('No puedes cambiar tu propio rol.');
      return;
    }

    setSavingId(userId);
    setSuccessMessage('');
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMessage(`Rol actualizado a "${ROLE_LABELS[newRole]}"`);
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err) {
      console.error(err);
      window.alert('No se pudo actualizar el rol.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Layout title="Usuarios" description="Gestión de usuarios y roles">
      <main className="usuarios-page">
        <div className="container margin-vert--xl">
          <header className="usuarios-hero">
            <span className="auth-eyebrow">ADMINISTRACIÓN</span>
            <h1>Gestión de usuarios</h1>
            <p>
              {isOwner
                ? 'Como propietario, puedes cambiar el rol de cualquier usuario.'
                : 'Aquí puedes ver la lista de usuarios registrados.'}
            </p>
          </header>

          {error && <div className="alert alert--danger">{error}</div>}
          {successMessage && (
            <div className="alert alert--success">{successMessage}</div>
          )}

          <section className="usuarios-toolbar">
            <div className="usuarios-search">
              <label htmlFor="usuarios-search">Buscar usuario</label>
              <input
                id="usuarios-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por nombre o correo..."
              />
            </div>
          </section>

          <section className="usuarios-list">
            {loading ? (
              <div className="usuarios-empty card">
                <div className="suggestions-spinner" />
                <h2>Cargando usuarios...</h2>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="usuarios-empty card">
                <div className="suggestions-empty__icon">👥</div>
                <h2>No encontramos usuarios</h2>
                <p>Prueba cambiando el texto de búsqueda.</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isMe = u.id === currentUserId;
                const currentRole = u.role || ROLES.USER;

                return (
                  <article className="usuarios-card card" key={u.id}>
                    <div className="usuarios-card__body">
                      <div className="usuarios-card__info">
                        <div className="usuarios-card__avatar">
                          {u.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3>
                            {u.displayName || 'Sin nombre'}{' '}
                            {isMe && <span className="badge">Tú</span>}
                          </h3>
                          <p>{u.email || 'Sin correo'}</p>
                        </div>
                      </div>

                      <div className="usuarios-card__role">
                        {isOwner && !isMe ? (
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value)
                            }
                            disabled={savingId === u.id}
                            className="usuarios-role-select"
                          >
                            <option value={ROLES.USER}>
                              {ROLE_LABELS[ROLES.USER]}
                            </option>
                            <option value={ROLES.ADMIN}>
                              {ROLE_LABELS[ROLES.ADMIN]}
                            </option>
                            <option value={ROLES.PROPIETARIO}>
                              {ROLE_LABELS[ROLES.PROPIETARIO]}
                            </option>
                          </select>
                        ) : (
                          <span className={`rol-badge rol-badge--${currentRole}`}>
                            {ROLE_LABELS[currentRole] || 'Sin rol'}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}