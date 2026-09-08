import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  auth,
  db,
} from '@site/src/firebase';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const menuRef = useRef(null);

  useEffect(() => {
    let active = true;

    const unsubscribe =
      auth.onAuthStateChanged(
        async (currentUser) => {
          if (!active) {
            return;
          }

          setUser(currentUser);
          setIsOpen(false);

          if (!currentUser) {
            setDisplayName('');
            setIsAdmin(false);
            setLoadingProfile(false);
            return;
          }

          /*
           * Nombre inicial:
           * 1. displayName de Firebase Auth
           * 2. parte anterior al @ del correo
           * 3. Usuario
           */
          const authName =
            currentUser.displayName?.trim() ||
            currentUser.email
              ?.split('@')[0] ||
            'Usuario';

          setDisplayName(authName);
          setIsAdmin(false);
          setLoadingProfile(true);

          try {
            /*
             * Intentamos obtener el perfil de Firestore.
             */
            const profileRef = doc(
              db,
              'users',
              currentUser.uid,
            );

            const profileSnapshot =
              await getDoc(profileRef);

            if (!active) {
              return;
            }

            if (
              profileSnapshot.exists()
            ) {
              const profileData =
                profileSnapshot.data();

              const firestoreName =
                profileData.displayName?.trim();

              /*
               * Si existe un nombre guardado
               * en Firestore, tiene prioridad.
               */
              if (firestoreName) {
                setDisplayName(
                  firestoreName,
                );
              }

              setIsAdmin(
                profileData.role ===
                  'admin',
              );
            }
          } catch (error) {
            /*
             * Si Firestore falla, no rompemos
             * el menú. Continuamos con el
             * nombre obtenido desde Auth.
             */
            console.error(
              'Error cargando perfil:',
              error,
            );

            setIsAdmin(false);
          } finally {
            if (active) {
              setLoadingProfile(false);
            }
          }
        },
      );

    const handleClickOutside =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target,
          )
        ) {
          setIsOpen(false);
        }
      };

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      active = false;

      unsubscribe();

      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  /*
   * Cerrar sesión.
   *
   * No usamos useHistory porque este
   * componente está montado fuera del Router.
   */
  const handleLogout = async () => {
    try {
      setIsOpen(false);

      await auth.signOut();

      /*
       * Recargamos la página para que Root.js
       * detecte inmediatamente que ya no existe
       * una sesión autenticada.
       */
      window.location.href = '/';
    } catch (error) {
      console.error(
        'Error cerrando sesión:',
        error,
      );
    }
  };

  /*
   * Mientras Firebase comprueba la sesión,
   * mostramos un estado pequeño.
   */
  if (
    loadingProfile &&
    !user
  ) {
    return (
      <div className="user-menu-loading">
        Cargando…
      </div>
    );
  }

  /*
   * Usuario no autenticado.
   */
  if (!user) {
    return (
      <a
        href="/login"
        className="user-menu-login"
      >
        Iniciar sesión
      </a>
    );
  }

  return (
    <div
      ref={menuRef}
      className="user-menu-container"
    >
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span
          className="user-menu-avatar"
          aria-hidden="true"
        >
          👤
        </span>

        <span className="user-menu-name">
          {displayName || 'Usuario'}
        </span>

        <span
          className="user-menu-arrow"
          aria-hidden="true"
        >
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          role="menu"
        >
          <div className="user-menu-header">
            <div className="user-menu-header__avatar">
              👤
            </div>

            <div className="user-menu-header__info">
              <strong>
                {displayName ||
                  'Usuario'}
              </strong>

              <span>
                {isAdmin
                  ? '🔑 Administrador'
                  : '👤 Usuario'}
              </span>
            </div>
          </div>

          <div className="user-menu-divider" />

          <a
            href="/biblioteca-conocimiento/perfil"
            className="user-menu-item"
            role="menuitem"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <span
              className="user-menu-item__icon"
              aria-hidden="true"
            >
              ⚙️
            </span>

            <span>
              Mis datos
            </span>
          </a>

          <button
            type="button"
            className="user-menu-item user-menu-item--logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <span
              className="user-menu-item__icon"
              aria-hidden="true"
            >
              🚪
            </span>

            <span>
              Cerrar sesión
            </span>
          </button>
        </div>
      )}
    </div>
  );
}