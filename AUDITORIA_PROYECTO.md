# Auditoría y limpieza del proyecto

## Resultado

Se realizó una limpieza estructural del sitio y una revisión estática de rutas, documentos, configuración y autenticación.

### Validaciones ejecutadas en este entorno

- `package.json` válido: **OK**
- `package-lock.json` válido: **OK**
- Sintaxis Node de configuración Firebase/sidebar: **OK / OK / OK**
- Archivos críticos faltantes: **0**
- Documentos encontrados: **12**
- Documentos vacíos: **0**
- Enlaces internos explícitos con destino inexistente: **0**
- Directorios generados/dependencias incluidos: **1**

> La instalación `npm ci` no pudo completarse en este entorno porque el acceso al registro de paquetes no terminó a tiempo. Por eso no afirmo que el build final haya sido ejecutado aquí después de los cambios. En tu equipo, la primera validación debe ser `npm ci` y luego `npm run build`.

## Cambios principales

1. Corregido el custom theme de `src/them/root.js` a `src/theme/Root.js`.
2. Guard de autenticación centralizado con `onIdTokenChanged`.
3. Acceso normal solo después de verificar el correo.
4. Registro con confirmación de contraseña.
5. Política de contraseña fuerte en cliente + `validatePassword()` de Firebase.
6. Recuperación de contraseña con respuesta genérica para reducir enumeración.
7. Reenvío de verificación y botón para comprobar la verificación.
8. Persistencia local o de sesión.
9. Cierre de sesión robusto.
10. Configuración Docusaurus estricta: enlaces, anclas y rutas duplicadas hacen fallar el build.
11. Corregidos enlaces de cursos que apuntaban a rutas inexistentes.
12. Eliminadas páginas de prueba y assets de plantilla que no se utilizaban.
13. Documentos vacíos o improvisados reemplazados por una estructura limpia y preparada para contenido oficial.
14. Estilos globales centralizados y responsive.
15. Añadido workflow de GitHub Actions para validar el build en cada push/PR.
16. Eliminados `node_modules`, `build` y `.docusaurus` del paquete entregable.

## Límite de seguridad importante

Docusaurus genera archivos estáticos. El guard de Firebase protege la navegación y la experiencia de usuario, pero no convierte el contenido generado en secreto. Si los documentos contienen información verdaderamente confidencial, la arquitectura debe cambiar a contenido servido después de autenticación y autorización del lado servidor.

## Pendientes fuera del código

En Firebase Console hay que comprobar:

- Email/Password habilitado.
- Política de contraseñas configurada.
- Protección contra enumeración de correos habilitada.
- Dominios autorizados limitados a los reales.
- Cuotas de autenticación revisadas para reducir abuso.
- API key de Firebase restringida a APIs de Firebase.
- Security Rules configuradas para cualquier Firestore, Storage o Realtime Database que se agregue.
- MFA/Identity Platform considerado si el sitio pasa a un uso empresarial sensible.
