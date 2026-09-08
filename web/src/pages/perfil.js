import React, {
  useEffect,
  useState,
} from 'react';

import Layout from '@theme/Layout';

import Link from '@docusaurus/Link';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  updateProfile,
} from 'firebase/auth';

import { auth, db } from '../firebase';

import '../css/profile.css';

const MAX_NAME_LENGTH = 80;

export default function Perfil() {
  const [
    displayName,
    setDisplayName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    role,
    setRole,
  ] = useState('user');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const user =
        auth.currentUser;

      if (!user) {
        if (active) {
          setLoading(false);
        }

        return;
      }

      if (active) {
        setEmail(
          user.email || '',
        );

        setDisplayName(
          user.displayName ||
            user.email?.split('@')[0] ||
            '',
        );
      }

      try {
        const profileRef =
          doc(
            db,
            'users',
            user.uid,
          );

        const profileSnapshot =
          await getDoc(
            profileRef,
          );

        if (!active) {
          return;
        }

        if (
          profileSnapshot.exists()
        ) {
          const data =
            profileSnapshot.data();

          if (
            data.displayName?.trim()
          ) {
            setDisplayName(
              data.displayName.trim(),
            );
          }

          setRole(
            data.role || 'user',
          );
        }
      } catch (profileError) {
        console.error(
          'Error cargando perfil:',
          profileError,
        );

        if (active) {
          setError(
            'No pudimos cargar todos los datos del perfil.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setMessage('');
    setError('');

    const user =
      auth.currentUser;

    if (!user) {
      setError(
        'Tu sesión ya no está disponible. Inicia sesión nuevamente.',
      );

      return;
    }

    const cleanName =
      displayName.trim();

    if (!cleanName) {
      setError(
        'Escribe el nombre que quieres utilizar.',
      );

      return;
    }

    if (cleanName.length < 2) {
      setError(
        'El nombre debe tener al menos 2 caracteres.',
      );

      return;
    }

    if (
      cleanName.length >
      MAX_NAME_LENGTH
    ) {
      setError(
        `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres.`,
      );

      return;
    }

    setSaving(true);

    try {
      /*
       * Actualiza Firebase Authentication.
       */
      await updateProfile(
        user,
        {
          displayName:
            cleanName,
        },
      );

      /*
       * Guarda el nombre en Firestore.
       *
       * merge:true evita eliminar role u otros
       * campos existentes del usuario.
       */
      const profileRef =
        doc(
          db,
          'users',
          user.uid,
        );

      await setDoc(
        profileRef,
        {
          displayName:
            cleanName,

          email:
            user.email || '',

          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        },
      );

      setDisplayName(
        cleanName,
      );

      setMessage(
        'Tu nombre se actualizó correctamente.',
      );
    } catch (saveError) {
      console.error(
        'Error guardando perfil:',
        saveError,
      );

      setError(
        'No pudimos guardar el cambio. Inténtalo nuevamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout
        title="Mis datos"
        description="Gestiona tus datos personales"
      >
        <main className="profile-page">
          <div className="container margin-vert--xl">
            <section className="profile-card profile-loading card">
              <div className="profile-loading__spinner" />

              <h1>
                Cargando tu perfil...
              </h1>

              <p>
                Estamos consultando tus datos.
              </p>
            </section>
          </div>
        </main>
      </Layout>
    );
  }

  if (!auth.currentUser) {
    return (
      <Layout
        title="Mis datos"
        description="Gestiona tus datos personales"
      >
        <main className="profile-page">
          <div className="container margin-vert--xl">
            <section className="profile-card card">
              <span className="auth-eyebrow">
                MI PERFIL
              </span>

              <h1>
                Sesión no disponible
              </h1>

              <p>
                Debes iniciar sesión para
                consultar tus datos.
              </p>

              <Link
                to="/login"
                className="button button--primary"
              >
                Iniciar sesión
              </Link>
            </section>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout
      title="Mis datos"
      description="Gestiona tus datos personales"
    >
      <main className="profile-page">
        <div className="container margin-vert--xl">
          <div className="profile-layout">
            <section className="profile-card card">
              <header className="profile-header">
                <div className="profile-avatar">
                  👤
                </div>

                <div>
                  <span className="auth-eyebrow">
                    MI PERFIL
                  </span>

                  <h1>
                    Mis datos
                  </h1>

                  <p>
                    Configura el nombre que
                    aparecerá en tus sugerencias.
                  </p>
                </div>
              </header>

              <form
                className="profile-form"
                onSubmit={
                  handleSubmit
                }
              >
                <div className="profile-field">
                  <label htmlFor="profile-name">
                    Nombre para mostrar
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={displayName}
                    onChange={(event) => {
                      setDisplayName(
                        event.target.value,
                      );

                      setMessage('');
                      setError('');
                    }}
                    maxLength={
                      MAX_NAME_LENGTH
                    }
                    autoComplete="name"
                    placeholder="Ej. Juan Sandoval"
                    disabled={saving}
                  />

                  <small>
                    Este será el nombre visible
                    en tus nuevas sugerencias.
                  </small>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-email">
                    Correo electrónico
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                  />

                  <small>
                    Tu correo pertenece a tu cuenta
                    de autenticación.
                  </small>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-role">
                    Rol
                  </label>

                  <input
                    id="profile-role"
                    type="text"
                    value={
                      role === 'admin'
                        ? 'Administrador'
                        : 'Usuario'
                    }
                    readOnly
                    disabled
                  />

                  <small>
                    El rol no puede modificarse desde
                    esta pantalla.
                  </small>
                </div>

                {error && (
                  <div
                    className="alert alert--danger"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {message && (
                  <div
                    className="alert alert--success"
                    role="status"
                  >
                    {message}
                  </div>
                )}

                <div className="profile-actions">
                  <Link
                    to="/sugerencias"
                    className="button button--outline"
                  >
                    Volver
                  </Link>

                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={saving}
                  >
                    {saving
                      ? 'Guardando…'
                      : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </section>

            <aside className="profile-info card">
              <div className="profile-info__icon">
                💡
              </div>

              <h2>
                Así aparecerás
              </h2>

              <p>
                El nombre configurado aquí se
                utilizará cuando publiques nuevas
                sugerencias.
              </p>

              <div className="profile-preview">
                <span>
                  Vista previa
                </span>

                <strong>
                  Propuesta por{' '}
                  {displayName ||
                    'Usuario'}
                </strong>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
}