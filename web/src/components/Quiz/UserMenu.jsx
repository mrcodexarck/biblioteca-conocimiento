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

import useBaseUrl from '@docusaurus/useBaseUrl';
import { listenNotifications, markAsRead, markAllAsRead } from '@site/src/utils/notifications';
import Link from '@docusaurus/Link';

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const homePath = useBaseUrl('/');
  const perfilPath = useBaseUrl('/perfil');
  const loginPath = useBaseUrl('/login');
  const sugerenciasPath = useBaseUrl('/sugerencias');

  useEffect(() => {
    let active = true;

    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setIsOpen(false);
      if (!currentUser) {
        setDisplayName('');
        setIsAdmin(false);
        setLoadingProfile(false);
        return;
      }

      const authName = currentUser.displayName?.trim() ||
        currentUser.email?.split('@')[0] ||
        'Usuario';
      setDisplayName(authName);
      setIsAdmin(false);
      setLoadingProfile(true);

      try {
        const profileRef = doc(db, 'users', currentUser.uid);
        const profileSnapshot = await getDoc(profileRef);
        if (!active) return;
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          const firestoreName = profileData.displayName?.trim();
          if (firestoreName) setDisplayName(firestoreName);
          setIsAdmin(profileData.role === 'admin');
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setIsAdmin(false);
      } finally {
        if (active) setLoadingProfile(false);
      }
    });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      active = false;
      unsubscribeAuth();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const unsubscribeNotifications = listenNotifications(user.uid, (notifs) => {
      setNotifications(notifs);
    });
    return () => {
      unsubscribeNotifications();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      await auth.signOut();
      window.location.href = homePath;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      setIsOpen(false);
      // Redirigir a sugerencias con el ID de la sugerencia (puedes usar un hash o query param)
      window.location.href = `${sugerenciasPath}?highlight=${notification.suggestionId}`;
    } catch (error) {
      console.error('Error al manejar notificación:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.uid);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  if (loadingProfile && !user) {
    return <div className="user-menu-loading">Cargando…</div>;
  }

  if (!user) {
    return (
      <a href={loginPath} className="user-menu-login">
        Iniciar sesión
      </a>
    );
  }

  const unreadCount = notifications.length;

  return (
    <div ref={menuRef} className="user-menu-container">
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="user-menu-avatar" aria-hidden="true">👤</span>
        <span className="user-menu-name">{displayName || 'Usuario'}</span>
        {unreadCount > 0 && (
          <span className="user-menu-badge">{unreadCount}</span>
        )}
        <span className="user-menu-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-header">
            <div className="user-menu-header__avatar">👤</div>
            <div className="user-menu-header__info">
              <strong>{displayName || 'Usuario'}</strong>
              <span>{isAdmin ? '🔑 Administrador' : '👤 Usuario'}</span>
            </div>
          </div>

          <div className="user-menu-divider" />

          {/* --- SECCIÓN NOTIFICACIONES --- */}
          <div className="user-menu-notifications-header">
            <span>📬 Notificaciones</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="user-menu-mark-all"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="user-menu-notification-empty">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            <ul className="user-menu-notification-list">
              {notifications.slice(0, 5).map((notif) => (
                <li key={notif.id} className="user-menu-notification-item">
                  <button
                    type="button"
                    className="user-menu-notification-link"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <span className="user-menu-notification-icon">
                      {notif.type === 'status_change' ? '🔄' : '💬'}
                    </span>
                    <div className="user-menu-notification-content">
                      <div className="user-menu-notification-message">
                        {notif.message}
                      </div>
                      <div className="user-menu-notification-suggestion">
                        {notif.suggestionTitle}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
              {notifications.length > 5 && (
                <li className="user-menu-notification-more">
                  <Link to="/sugerencias" onClick={() => setIsOpen(false)}>
                    Ver todas ({notifications.length})
                  </Link>
                </li>
              )}
            </ul>
          )}

          <div className="user-menu-divider" />

          <a
            href={perfilPath}
            className="user-menu-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <span className="user-menu-item__icon" aria-hidden="true">⚙️</span>
            <span>Mis datos</span>
          </a>

          <button
            type="button"
            className="user-menu-item user-menu-item--logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <span className="user-menu-item__icon" aria-hidden="true">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}