import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Detecta el "grupo" al que pertenece una ruta.
 * Todas las páginas dentro del mismo grupo se consideran una sola sección.
 */
function getGroup(pathname) {
  const parts = pathname.split('/').filter(Boolean);

  // Docs → agrupa por nivel superior de docs
  if (parts[0] === 'docs') {
    if (parts[1] === 'cursos') return 'docs/cursos';
    if (parts[1]) return `docs/${parts[1]}`;
    return 'docs';
  }

  // Todo lo demás no se agrupa
  return null;
}

export default function BackButton() {
  const history = useHistory();
  const location = useLocation();
  const homePath = useBaseUrl('/');

  // Guardamos la ruta anterior en un ref
  const previousPathRef = useRef(location.pathname);
  const isFirstRenderRef = useRef(true);

  /* =========================================================
     RASTREAR CAMBIOS DE RUTA PARA GUARDAR "ENTRY" DEL GRUPO
     ========================================================= */
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    const currentGroup = getGroup(currentPath);
    const savedGroup = sessionStorage.getItem('nav_group');
    const savedEntry = sessionStorage.getItem('nav_entry');

    // Primera carga: si estamos en un grupo, guardamos homePath como entry
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (currentGroup) {
        sessionStorage.setItem('nav_group', currentGroup);
        sessionStorage.setItem('nav_entry', homePath);
      }
      previousPathRef.current = currentPath;
      return;
    }

    if (currentGroup) {
      if (currentGroup !== savedGroup) {
        // Entramos a un grupo nuevo → guardamos la URL desde la que venimos
        sessionStorage.setItem('nav_group', currentGroup);
        sessionStorage.setItem('nav_entry', previousPath || homePath);
      }
      // Si ya estábamos en el mismo grupo, NO cambiamos el entry
    } else {
      // Salimos de cualquier grupo → limpiamos
      sessionStorage.removeItem('nav_group');
      sessionStorage.removeItem('nav_entry');
    }

    previousPathRef.current = currentPath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* =========================================================
     HANDLER DEL BOTÓN
     ========================================================= */
  const handleBack = () => {
    const entry = sessionStorage.getItem('nav_entry');
    const savedGroup = sessionStorage.getItem('nav_group');
    const currentGroup = getGroup(location.pathname);

    // Si estamos dentro de un grupo, volvemos a la URL de entrada
    if (savedGroup && currentGroup === savedGroup && entry) {
      history.push(entry);
      // Limpiamos para que la próxima vez funcione desde cero
      sessionStorage.removeItem('nav_group');
      sessionStorage.removeItem('nav_entry');
      return;
    }

    // Comportamiento por defecto
    if (window.history.length > 1) {
      history.goBack();
    } else {
      history.push(homePath);
    }
  };

  /* =========================================================
     OCULTAR EN CIERTAS PÁGINAS
     ========================================================= */
  const pathname = location.pathname;
  const isHome = pathname === '/' || pathname === homePath;
  const isAuthPage =
    pathname.includes('/login') || pathname.includes('/logout');

  if (isHome || isAuthPage) {
    return null;
  }

  return (
    <button
      type="button"
      className="back-button"
      onClick={handleBack}
      aria-label="Volver a la página anterior"
      title="Volver atrás"
    >
      <span className="back-button__icon" aria-hidden="true">
        ←
      </span>
      <span className="back-button__text">Volver</span>
    </button>
  );
}