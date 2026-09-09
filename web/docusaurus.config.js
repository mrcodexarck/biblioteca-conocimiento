// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Biblioteca de Conocimiento',
  tagline: 'Soporte asistido, cursos y documentación del equipo',
  favicon: 'img/logo.png',

  future: { v4: true },

  url: 'https://mrcodexarck.github.io',
  baseUrl: '/biblioteca-conocimiento/',
  trailingSlash: false,

  organizationName: 'mrcodexarck',
  projectName: 'biblioteca-conocimiento',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  i18n: { defaultLocale: 'es', locales: ['es'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Biblioteca de Conocimiento',
        logo: { alt: 'Biblioteca de Conocimiento', src: 'img/logo.png' },
        items: [
  // { to: '/Cursos', label: 'Cursos y talleres', position: 'left', className: 'ruta-privada' },
  // { type: 'docSidebar', sidebarId: 'documentacionSidebar', position: 'left', label: 'Documentación', className: 'ruta-privada' },
  // { type: 'docSidebar', sidebarId: 'casosSideba  r', position: 'left', label: 'Casos comunes', className: 'ruta-privada' },
  // { to: '/sugerencias', label: 'Sugerencias', position: 'left', className: 'ruta-privada' },
  {
    type: 'html',
    position: 'right',
    value: '<div id="user-menu-root"></div>',
  },
],
      },
      colorMode: { defaultMode: 'light', disableSwitch: false, respectPrefersColorScheme: false },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Biblioteca de Conocimiento.`,
      },
      prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    }),
};

export default config;