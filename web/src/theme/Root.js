import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '../firebase';

function isAuthRoute(pathname) {
  return pathname.includes('/login') || pathname.includes('/logout');
}

export default function Root({ children }) {
  const history = useHistory();
  const location = useLocation();
  const loginPath = useBaseUrl('/login');
  const homePath = useBaseUrl('/');
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const authRoute = isAuthRoute(location.pathname);
    const verified = Boolean(user?.emailVerified);

    if (!user) {
      if (!authRoute) history.replace(loginPath);
      return;
    }

    if (!verified) {
      if (!authRoute || location.pathname.includes('/logout')) {
        history.replace(loginPath);
      }
      return;
    }

    if (location.pathname.includes('/login')) {
      history.replace(homePath);
    }
  }, [authReady, history, homePath, location.pathname, loginPath, user]);

  if (!authReady) {
    return (
      <div className="auth-screen auth-screen--loading" role="status" aria-live="polite">
        <div className="auth-loading">
          <span className="auth-spinner" aria-hidden="true" />
          <span>Comprobando sesión…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={user?.emailVerified ? 'app-usuario-conectado' : 'app-usuario-desconectado'}>
      {children}
    </div>
  );
}
