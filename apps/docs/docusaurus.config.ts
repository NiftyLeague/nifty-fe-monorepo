import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Nifty League Docs',
  tagline: 'Documentation and Guides',
  favicon: 'icons/favicon.ico',
  url: 'https://docs.niftyleague.com/',
  baseUrl: '/docs/',
  organizationName: 'NiftyLeague',
  projectName: 'docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown: { mermaid: true },
  themes: ['@docusaurus/theme-mermaid'],

  // i18n: {
  //   defaultLocale: 'en',
  //   locales: [
  //     'af',
  //     'ar',
  //     'cs',
  //     'da',
  //     'nl',
  //     'en',
  //     'fi',
  //     'fr',
  //     'de',
  //     'el',
  //     'he',
  //     'hu',
  //     'id',
  //     'it',
  //     'ja',
  //     'ko',
  //     'no',
  //     'pl',
  //     'pt-BR',
  //     'ro',
  //     'ru',
  //     'sr',
  //     'es-ES',
  //     'sv-SE',
  //     'tr',
  //     'uk',
  //     'vi',
  //     'zh-CN',
  //   ],
  // },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/NiftyLeague/docs/tree/main/',
        },
        googleAnalytics: {
          trackingID: 'G-DKL8WWG236',
          anonymizeIP: true,
        },
        theme: {
          customCss: ['./src/css/colors.css', './src/css/fonts.css', './src/css/custom.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/twitter_card_bg.png',
    navbar: {
      title: 'Nifty League Docs',
      logo: {
        alt: 'Nifty League Logo',
        src: 'icons/logo.svg',
      },
      items: [
        // {
        //   type: 'docsVersionDropdown',
        //   //// Optional
        //   position: 'left',
        //   dropdownActiveClassDisabled: true,
        //   docsPluginId: 'default',
        //   className: 'persistent',
        // },
        {
          to: '/docs/overview/intro',
          label: 'Overview',
          position: 'left',
          className: 'persistent',
        },
        {
          to: '/docs/guides/set-up',
          label: 'Guides',
          position: 'left',
          className: 'persistent',
        },
        {
          to: '/docs/faq/general',
          label: 'FAQ',
          position: 'left',
          className: 'persistent',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        //   className: 'persistent',
        // },
        {
          href: 'https://niftyleague.com/',
          label: 'Website',
          position: 'right',
          className: 'persistent',
        },
        {
          href: 'https://github.com/NiftyLeague/docs',
          label: 'GitHub',
          position: 'right',
          className: 'persistent',
        },
        {
          href: 'https://discord.gg/niftyleague',
          label: 'Discord',
          position: 'right',
          className: 'persistent',
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        //   className: 'persistent',
        // },
      ],
    },
    footer: {
      links: [
        {
          title: 'Official',
          items: [
            {
              label: 'Nifty League Website',
              href: 'https://niftyleague.com',
            },
            {
              label: 'Nifty Smashers Website',
              href: 'https://niftysmashers.com',
            },
            {
              label: 'Dune Analytics',
              href: 'https://dune.com/niftyleague/dashboard',
            },
            {
              label: 'Subgraph',
              href: 'https://thegraph.com/explorer/subgraphs/Fv2ptHrpfiYGwMumJry3XjS8kS1WfjQ3jAhJCyPcyvTT?view=Overview&chain=arbitrum-one',
            },
            {
              label: 'Nifty DAO Treasury',
              href: 'https://etherscan.io/address/0xd06ae6fb7eade890f3e295d69a6679380c9456c1',
            },
            // {
            //   label: 'Brand Assets',
            //   href: 'https://niftyleague.com/brand_assets.zip',
            // },
          ],
        },
        {
          title: 'Socials',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/niftyleague',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/NiftyLeague',
            },
            {
              label: 'Twitch',
              href: 'https://www.twitch.tv/NiftyLeagueOfficial',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/c/NiftyLeague',
            },
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/niftyleague',
            },
          ],
        },
        {
          title: 'NFTL',
          items: [
            {
              label: 'Uniswap NFTL/ETH LP',
              href: 'https://info.uniswap.org/#/pools/0x1bcf855445335f72841cdecaed71f5901a807a7f',
            },
            {
              label: 'CoinGecko',
              href: 'https://www.coingecko.com/en/coins/nifty-league',
            },
            {
              label: 'CoinMarketCap',
              href: 'https://coinmarketcap.com/currencies/nifty-league',
            },
            {
              label: 'Etherscan Token Contract',
              href: 'https://etherscan.io/token/0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
            },
            {
              label: 'Dextools',
              href: 'https://www.dextools.io/app/ether/pair-explorer/0xf79321e80acd5fa590936f09acb90ec6471fcbc4',
            },
          ],
        },
        {
          title: 'NFTs',
          items: [
            {
              label: 'OpenSea - DEGENS',
              href: 'https://opensea.io/collection/niftydegen',
            },
            {
              label: 'OpenSea - COMICS',
              href: 'https://opensea.io/collection/nifty-league-comics',
            },
            {
              label: 'Immutable - ITEMS',
              href: 'https://market.immutable.com/collections/0xc21909b7E596000C01318668293A7DFB4B37A578',
            },
            {
              label: 'NiftyDegen NFT Contract',
              href: 'https://etherscan.io/token/0x986aea67C7d6A15036e18678065eb663Fc5BE883',
            },
            {
              label: 'Nifty Launch Comics Contract',
              href: 'https://etherscan.io/address/0xBc8542e65ab801f7c9e3edd23238d37a2e3972d6',
            },
          ],
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} Nifty League Inc. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'dark', // "light" | "dark"
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity'],
    },
    algolia: {
      // Search only api key
      apiKey: '2c367ae53326c8a85e805323aee56a75',
      indexName: 'docs',
      appId: 'R1BEZXQES6',
    },
    mermaid: {
      theme: { light: 'forest', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
