# Biblioteca de Conocimiento del Equipo

Sitio de documentación y soporte asistido construido con Docusaurus y Firebase Authentication.

## Requisito importante de seguridad

La web se genera como archivos estáticos. El guard de autenticación protege la experiencia de usuario en el navegador, pero no convierte el contenido de `build/` en contenido privado. Si una persona puede descargar los archivos generados, también puede leer el contenido que esos archivos contienen.

No publiques información sensible en Markdown/MDX si necesitas confidencialidad real. Para contenido verdaderamente privado, necesitas entregar ese contenido desde un backend o un sistema que aplique autorización del lado servidor.

## Desarrollo

```bash
cd web
npm ci
npm run start
```

## Validación

```bash
npm run build
```

La compilación está configurada para fallar ante enlaces rotos, anclas rotas o rutas duplicadas.

## Configuración de Firebase antes de producción

En Firebase Console:

1. Authentication → Sign-in method: habilita **Email/Password**.
2. Authentication → Settings: configura una **política de contraseñas** que coincida con la interfaz (mínimo 8; mayúscula, minúscula, número y carácter especial).
3. Activa **email enumeration protection**.
4. Revisa **Authorized domains** y agrega solamente los dominios reales de la aplicación.
5. Configura una cuota razonable para los endpoints de autenticación para reducir abuso por fuerza bruta.
6. Revisa las restricciones de la API key de Firebase y deja únicamente las APIs de Firebase que realmente uses.
7. Si luego añades Firestore, Storage o Realtime Database, crea Security Rules que exijan usuarios autenticados y, cuando corresponda, `email_verified`.
8. Para mayor seguridad en un entorno empresarial, considera Identity Platform y MFA.

Estas medidas complementan el guard del navegador; no sustituyen una autorización del lado servidor para contenido realmente privado.
