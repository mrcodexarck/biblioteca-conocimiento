import React, {
  useEffect,
  useState,
} from 'react';

import {
  useHistory,
  useLocation,
} from '@docusaurus/router';

import useBaseUrl from '@docusaurus/useBaseUrl';

import { onIdTokenChanged } from 'firebase/auth';

import { createPortal } from 'react-dom';

import { auth } from '@site/src/firebase';

import UserMenu from '@site/src/components/UserMenu';

import {
  isTestInProgress,
} from '@site/src/utils/courseprogress';

/*
 * =========================================================
 * CONFIGURACIÓN DE CURSOS / EXÁMENES
 * =========================================================
 */

const COURSE_TESTS = {
  'curso-contabilidad': {
    testPath:
      '/docs/cursos/curso-contabilidad/modulo-uno',

    coursePrefixes: [
      '/docs/cursos/curso-contabilidad',
    ],
  },

  'curso-nomina': {
    testPath:
      '/docs/cursos/curso-nomina/bienvenida',

    coursePrefixes: [
      '/docs/cursos/curso-nomina/bienvenida',
    ],
  },

  'curso-isv': {
    testPath:
      '/docs/cursos/curso-isv/modulo-uno',

    coursePrefixes: [
      '/docs/cursos/curso-isv',
    ],
  },
};

/*
 * =========================================================
 * RUTAS DE AUTENTICACIÓN
 * =========================================================
 */

function isAuthRoute(pathname) {
  return (
    pathname.includes('/login') ||
    pathname.includes('/logout')
  );
}

/*
 * =========================================================
 * DETECCIÓN DE CURSOS BLOQUEADOS
 * =========================================================
 */

function getActiveLockedCourse(pathname) {
  for (
    const [courseId, course]
    of Object.entries(COURSE_TESTS)
  ) {
    const isCourseArea =
      course.coursePrefixes.some(
        (prefix) =>
          pathname.startsWith(prefix),
      );

    const isTestPath =
      pathname.startsWith(
        course.testPath,
      );

    if (
      isTestInProgress(courseId) &&
      isCourseArea &&
      !isTestPath
    ) {
      return courseId;
    }
  }

  return null;
}

/*
 * =========================================================
 * ROOT PRINCIPAL
 * =========================================================
 */

export default function Root({
  children,
}) {
  const history = useHistory();
  const location = useLocation();

  /*
   * Rutas construidas respetando el baseUrl de Docusaurus.
   */
  const loginPath =
    useBaseUrl('/login');

  const homePath =
    useBaseUrl('/');

  const contabilidadTestPath =
    useBaseUrl(
      COURSE_TESTS[
        'curso-contabilidad'
      ].testPath,
    );

  /*
   * =======================================================
   * ESTADO DE AUTENTICACIÓN
   * =======================================================
   */

  const [
    authReady,
    setAuthReady,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState(null);

  /*
   * =======================================================
   * ESTADO DEL CONTENEDOR DEL USER MENU
   * =======================================================
   *
   * Aquí guardamos el elemento del navbar en el cual
   * queremos renderizar UserMenu mediante createPortal().
   */

  const [
    userMenuContainer,
    setUserMenuContainer,
  ] = useState(null);

  /*
   * =======================================================
   * FIREBASE AUTHENTICATION
   * =======================================================
   */

  useEffect(() => {
    const unsubscribe =
      onIdTokenChanged(
        auth,
        (nextUser) => {
          setUser(nextUser);
          setAuthReady(true);
        },
      );

    return unsubscribe;
  }, []);

  /*
   * =======================================================
   * PROTECCIÓN DE RUTAS
   * =======================================================
   */

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const authRoute =
      isAuthRoute(
        location.pathname,
      );

    const verified =
      Boolean(
        user?.emailVerified,
      );

    /*
     * -----------------------------------------------------
     * USUARIO NO AUTENTICADO
     * -----------------------------------------------------
     */

    if (!user) {
      if (!authRoute) {
        history.replace(
          loginPath,
        );
      }

      return;
    }

    /*
     * -----------------------------------------------------
     * CORREO NO VERIFICADO
     * -----------------------------------------------------
     */

    if (!verified) {
      if (
        !authRoute ||
        location.pathname.includes(
          '/logout',
        )
      ) {
        history.replace(
          loginPath,
        );
      }

      return;
    }

    /*
     * -----------------------------------------------------
     * CURSO BLOQUEADO POR EXAMEN
     * -----------------------------------------------------
     */

    const lockedCourse =
      getActiveLockedCourse(
        location.pathname,
      );

    if (
      lockedCourse ===
      'curso-contabilidad'
    ) {
      history.replace(
        contabilidadTestPath,
      );

      return;
    }

    /*
     * -----------------------------------------------------
     * SI EL USUARIO YA ESTÁ AUTENTICADO
     * Y ENTRA A /login, LO LLEVAMOS AL INICIO.
     * -----------------------------------------------------
     */

    if (
      location.pathname.includes(
        '/login',
      )
    ) {
      history.replace(
        homePath,
      );
    }
  }, [
    authReady,
    history,
    location.pathname,
    loginPath,
    homePath,
    contabilidadTestPath,
    user,
  ]);

  /*
   * =======================================================
   * LOCALIZAR EL CONTENEDOR DEL USER MENU
   * =======================================================
   *
   * Docusaurus genera el navbar.
   *
   * Como el navbar puede reconstruirse al cambiar de sección,
   * observamos el DOM y volvemos a localizar:
   *
   *     #user-menu-root
   *
   * No creamos otro React root.
   * Utilizamos un Portal.
   */

  useEffect(() => {
    let active = true;

    let observer = null;

    const findUserMenuContainer = () => {
      if (!active) {
        return;
      }

      /*
       * En login no necesitamos montar el menú.
       */

      if (
        isAuthRoute(
          location.pathname,
        )
      ) {
        setUserMenuContainer(null);
        return;
      }

      const container =
        document.getElementById(
          'user-menu-root',
        );

      /*
       * Si todavía no existe, esperamos
       * a que Docusaurus termine de crear
       * el navbar.
       */

      if (!container) {
        setUserMenuContainer(null);
        return;
      }

      setUserMenuContainer(
        container,
      );
    };

    /*
     * Primer intento.
     */

    findUserMenuContainer();

    /*
     * Observamos el DOM para detectar:
     *
     * - creación del navbar
     * - reemplazo del navbar
     * - navegación entre secciones
     */

    observer =
      new MutationObserver(() => {
        findUserMenuContainer();
      });

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    return () => {
      active = false;

      if (observer) {
        observer.disconnect();
      }

      setUserMenuContainer(null);
    };
  }, [
    location.pathname,
  ]);

  /*
   * =======================================================
   * PANTALLA DE CARGA
   * =======================================================
   */

  if (!authReady) {
    return (
      <div
        className="auth-screen auth-screen--loading"
        role="status"
        aria-live="polite"
      >
        <div className="auth-loading">
          <span
            className="auth-spinner"
            aria-hidden="true"
          />

          <span>
            Comprobando sesión…
          </span>
        </div>
      </div>
    );
  }

  /*
   * =======================================================
   * RENDER FINAL
   * =======================================================
   */

  const isLoginPage =
    isAuthRoute(
      location.pathname,
    );

  return (
    <div
      className={
        user?.emailVerified
          ? 'app-usuario-conectado'
          : 'app-usuario-desconectado'
      }
    >
      {children}

      {user?.emailVerified &&
        !isLoginPage &&
        userMenuContainer &&
        createPortal(
          <UserMenu />,
          userMenuContainer,
        )}
    </div>
  );
}