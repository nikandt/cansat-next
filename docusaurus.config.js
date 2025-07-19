// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CanSat NeXT',
  tagline: 'By Spacelab Nextdoor Inc.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://cansat.fi',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nikandt', // Usually your GitHub org/user name.
  projectName: 'cansat-next', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en', 'es', 'et', 'fi', 'fr', 'hu', 'it', 'pl', 'pt', 'sv']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/netnspace/CanSatNeXT_library',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],  
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/netnspace/CanSatNeXT_library'
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-Q7ENXM284R',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      metadata: [
        {name: 'keywords', content: 'cansat,space,arduino,blog,education'},
      ],
      image: 'img/CanSat_NeXT.png',
      navbar: {
        title: 'CanSat NeXT',
        logo: {
          alt: 'Logo, showing a simplified drawing of CanSat NeXT',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/netnspace/CanSatNeXT_library',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/landing',
              },
            ],
          },
          {
            title: 'Contact us',
            items: [
              {
                label: 'Support',
                to: 'mailto:support@kitsat.fi',
              },
              {
                label: 'Sales',
                to: 'mailto:sales@kitsat.fi',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Instagram',
                href: 'https://instagram.com/spacelabnext',
              },
              {
                label: 'Spaceplace',
                href: 'https://arcticastronautics.fi/spaceplace',
              },
            ],
          },
          {
            title: 'Help Improve This Site',
            items: [
              {
                label: 'Send Translation Feedback',
                href: 'mailto:support@kitsat.fi?subject=Translation Feedback',
              },
              {
                label: 'Contribute to Translations',
                href: '/docs/translate-help',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Spacelab Nextdoor, Inc. Built with Docusaurus. <br/>
          This site includes machine-translated content – <a href="/docs/translate-help" style="color: #ccc;">help us improve it</a>.`,
        },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
