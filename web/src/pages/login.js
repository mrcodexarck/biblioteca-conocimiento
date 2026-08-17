import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useHistory } from '@docusaurus/router';
import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  validatePassword,
} from 'firebase/auth';
import { auth, configurePersistence } from '../firebase';

const MODES = { LOGIN: 'login', REGISTER: 'register', RESET: 'reset' };

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function getFirebaseErrorMessage(code, mode) {
  const messages = {
    'auth/invalid-email': 'Escribe un correo electrónico válido.',
    'auth/missing-password': 'Escribe tu contraseña.',
    'auth/weak-password': 'La contraseña no cumple los requisitos de seguridad.',
    'auth/password-does-not-meet-requirements':
      'La contraseña no cumple la política de seguridad configurada en Firebase.',
    'auth/invalid-credential': 'No fue posible validar esas credenciales.',
    'auth/wrong-password': 'No fue posible validar esas credenciales.',
    'auth/user-disabled': 'Esta cuenta está deshabilitada. Contacta al administrador.',
    'auth/too-many-requests':
      'Se detectaron demasiados intentos. Espera un momento y vuelve a intentarlo.',
    'auth/network-request-failed':
      'No hay conexión con el servicio de autenticación. Comprueba tu internet.',
    'auth/operation-not-allowed':
      'El acceso por correo y contraseña no está habilitado en Firebase.',
    'auth/email-already-in-use': 'No fue posible crear la cuenta con esos datos.',
  };
  if (mode === MODES.RESET) {
    return 'No fue posible procesar la solicitud. Si la cuenta existe, recibirás instrucciones por correo.';
  }
  return messages[code] || 'No fue posible completar la operación. Inténtalo nuevamente.';
}

export default function Login() {
  const history = useHistory();
  const homePath = useBaseUrl('/');
  const [mode, setMode] = useState(MODES.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationUser, setVerificationUser] = useState(null);
  const [resendingVerification, setResendingVerification] = useState(false);

  const isLogin = mode === MODES.LOGIN;
  const isRegister = mode === MODES.REGISTER;
  const isReset = mode === MODES.RESET;

  const passwordHints = useMemo(() => ({
    length: password.length >= 8,
    lower: /[a-záéíóúüñ]/.test(password),
    upper: /[A-ZÁÉÍÓÚÜÑ]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]/.test(password),
  }), [password]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) setVerificationUser(currentUser);
  }, []);

  const clearFeedback = () => { setMessage(''); setIsError(false); };

  const changeMode = (nextMode) => {
    if (loading) return;
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    clearFeedback();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    clearFeedback();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setIsError(true);
      setMessage('Escribe tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      if (isReset) {
        await sendPasswordResetEmail(auth, normalizedEmail);
        setMessage(
          'Si la cuenta existe, recibirás un correo con instrucciones para restablecer la contraseña.',
        );
        return;
      }

      if (isRegister) {
        if (password !== confirmPassword) {
          setIsError(true);
          setMessage('Las contraseñas no coinciden.');
          return;
        }

        if (!Object.values(passwordHints).every(Boolean)) {
          setIsError(true);
          setMessage('La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y carácter especial.');
          return;
        }

        const status = await validatePassword(auth, password);
        if (!status.isValid) {
          setIsError(true);
          setMessage('La contraseña no cumple la política de seguridad configurada en Firebase.');
          return;
        }

        await configurePersistence(rememberSession);
        const credential = await createUserWithEmailAndPassword(
          auth, normalizedEmail, password,
        );
        await sendEmailVerification(credential.user);
        setVerificationUser(credential.user);
        setMessage(
          'Cuenta creada. Te enviamos un enlace para verificar tu correo antes de entrar a la biblioteca.',
        );
        return;
      }

      await configurePersistence(rememberSession);
      const credential = await signInWithEmailAndPassword(
        auth, normalizedEmail, password,
      );

      if (!credential.user.emailVerified) {
        setVerificationUser(credential.user);
        setIsError(true);
        setMessage(
          'Tu correo todavía no está verificado. Revisa tu bandeja de entrada para completar el acceso.',
        );
        return;
      }

      history.replace(homePath);
    } catch (error) {
      setIsError(true);
      setMessage(getFirebaseErrorMessage(error?.code, mode));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || resendingVerification) return;
    setResendingVerification(true);
    clearFeedback();
    try {
      await sendEmailVerification(currentUser);
      setMessage('Correo de verificación reenviado. Revisa también Spam o Correo no deseado.');
    } catch (error) {
      setIsError(true);
      setMessage(getFirebaseErrorMessage(error?.code, MODES.LOGIN));
    } finally {
      setResendingVerification(false);
    }
  };

  const checkVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setVerificationUser(null);
      return;
    }

    setLoading(true);
    clearFeedback();
    try {
      await reload(currentUser);
      if (auth.currentUser?.emailVerified) {
        setVerificationUser(null);
        history.replace(homePath);
        return;
      }
      setVerificationUser(auth.currentUser);
      setIsError(true);
      setMessage('Todavía no aparece la verificación. Abre el enlace del correo y vuelve a intentarlo.');
    } catch {
      setIsError(true);
      setMessage('No pudimos actualizar el estado de tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const cancelVerification = async () => {
    await signOut(auth);
    setVerificationUser(null);
    setPassword('');
    setConfirmPassword('');
    clearFeedback();
  };

  return (
    <Layout title={isReset ? 'Recuperar acceso' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}>
      <main className="auth-page">
        <section className="container">
          <div className="auth-card">
            <header className="auth-card__header">
              <span className="auth-eyebrow">BIBLIOTECA DE CONOCIMIENTO</span>
              <h1>{isReset ? 'Recupera tu acceso' : isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
              <p>
                {isReset
                  ? 'Te enviaremos instrucciones para crear una contraseña nueva.'
                  : 'Accede a cursos, documentación y soluciones del equipo.'}
              </p>
            </header>

            {verificationUser ? (
              <div className="auth-verification">
                <div className="auth-verification__icon" aria-hidden="true">✉</div>
                <h2>Verifica tu correo</h2>
                <p>
                  Enviamos el enlace a <strong>{verificationUser.email}</strong>. Verifica la cuenta y pulsa
                  “Ya verifiqué mi correo”.
                </p>
                {message && (
                  <div className={`alert ${isError ? 'alert--danger' : 'alert--success'}`} role="alert">
                    {message}
                  </div>
                )}
                <div className="auth-actions">
                  <button className="button button--primary button--block" type="button"
                    onClick={checkVerification} disabled={loading}>
                    {loading ? 'Comprobando…' : 'Ya verifiqué mi correo'}
                  </button>
                  <button className="button button--outline button--block" type="button"
                    onClick={resendVerification} disabled={resendingVerification}>
                    {resendingVerification ? 'Reenviando…' : 'Reenviar correo de verificación'}
                  </button>
                  <button className="button button--link button--block" type="button"
                    onClick={cancelVerification} disabled={loading || resendingVerification}>
                    Salir de esta cuenta
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div className="auth-field">
                    <label htmlFor="auth-email">Correo electrónico</label>
                    <input id="auth-email" name="email" type="email" inputMode="email"
                      autoComplete={isRegister ? 'email' : 'username'} placeholder="tu@correo.com"
                      value={email} onChange={(event) => setEmail(event.target.value)}
                      disabled={loading} required />
                  </div>

                  {!isReset && (
                    <div className="auth-field">
                      <div className="auth-field__label-row">
                        <label htmlFor="auth-password">Contraseña</label>
                        {isLogin && (
                          <button type="button" className="auth-inline-button"
                            onClick={() => changeMode(MODES.RESET)} disabled={loading}>
                            ¿Olvidaste tu contraseña?
                          </button>
                        )}
                      </div>
                      <div className="auth-password">
                        <input id="auth-password" name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete={isRegister ? 'new-password' : 'current-password'}
                          placeholder={isRegister ? 'Crea una contraseña segura' : 'Tu contraseña'}
                          value={password} onChange={(event) => setPassword(event.target.value)}
                          disabled={loading} minLength={8} required />
                        <button type="button" className="auth-password__toggle"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          disabled={loading}>
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {isRegister && (
                    <>
                      <ul className="password-requirements" aria-label="Requisitos de contraseña">
                        <li className={passwordHints.length ? 'is-valid' : ''}>8 caracteres o más</li>
                        <li className={passwordHints.lower ? 'is-valid' : ''}>Una letra minúscula</li>
                        <li className={passwordHints.upper ? 'is-valid' : ''}>Una letra mayúscula</li>
                        <li className={passwordHints.number ? 'is-valid' : ''}>Un número</li>
                        <li className={passwordHints.special ? 'is-valid' : ''}>Un carácter especial</li>
                      </ul>
                      <div className="auth-field">
                        <label htmlFor="auth-confirm-password">Confirmar contraseña</label>
                        <input id="auth-confirm-password" name="confirmPassword"
                          type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                          placeholder="Repite tu contraseña" value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          disabled={loading} minLength={8} required />
                      </div>
                    </>
                  )}

                  {!isReset && (
                    <label className="auth-checkbox">
                      <input type="checkbox" checked={rememberSession}
                        onChange={(event) => setRememberSession(event.target.checked)}
                        disabled={loading} />
                      <span>Recordar mi sesión en este dispositivo</span>
                    </label>
                  )}

                  <button type="submit" className="button button--primary button--block auth-submit"
                    disabled={loading}>
                    {loading
                      ? 'Procesando…'
                      : isReset
                        ? 'Enviar instrucciones'
                        : isRegister
                          ? 'Crear cuenta'
                          : 'Iniciar sesión'}
                  </button>
                </form>

                {message && (
                  <div className={`alert ${isError ? 'alert--danger' : 'alert--success'}`} role="alert" aria-live="polite">
                    {message}
                  </div>
                )}

                <div className="auth-switch">
                  {isReset ? (
                    <button className="auth-link" type="button" onClick={() => changeMode(MODES.LOGIN)} disabled={loading}>
                      Volver a iniciar sesión
                    </button>
                  ) : isLogin ? (
                    <>
                      <span>¿Aún no tienes cuenta?</span>
                      <button className="auth-link" type="button" onClick={() => changeMode(MODES.REGISTER)} disabled={loading}>
                        Crear una cuenta
                      </button>
                    </>
                  ) : (
                    <>
                      <span>¿Ya tienes una cuenta?</span>
                      <button className="auth-link" type="button" onClick={() => changeMode(MODES.LOGIN)} disabled={loading}>
                        Iniciar sesión
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
