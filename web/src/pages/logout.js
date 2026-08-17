import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Logout() {
  const history = useHistory();
  const loginPath = useBaseUrl('/login');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    signOut(auth)
      .catch(() => {
        if (active) setError('No pudimos cerrar la sesión correctamente.');
      })
      .finally(() => {
        if (active) history.replace(loginPath);
      });
    return () => { active = false; };
  }, [history, loginPath]);

  return (
    <Layout title="Cerrar sesión">
      <main className="auth-screen">
        <div className="auth-loading">
          <span className="auth-spinner" aria-hidden="true" />
          <span>{error || 'Cerrando sesión…'}</span>
        </div>
      </main>
    </Layout>
  );
}
