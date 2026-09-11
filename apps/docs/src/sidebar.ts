import type { StarlightUserConfig } from '@astrojs/starlight/types'

/**
 * Sidebar trees copied from the previous Docusaurus sidebars (one per section).
 *
 * Docusaurus rendered a section-scoped sidebar, so this list contains every
 * section's items at the top level; `src/lib/navigation.ts` filters it down to
 * the section that owns the current page. Labels and order mirror the old
 * `_category_.json` files and `sidebar_position` frontmatter exactly.
 */
type Item = NonNullable<StarlightUserConfig['sidebar']>[number]

const overview: Item[] = [
  { label: 'About Nifty League', slug: 'overview/intro' },
  {
    label: 'Games',
    collapsed: false,
    items: [
      { label: 'Our Games', slug: 'overview/games/games-overview' },
      {
        label: 'Mobile / PC Games',
        collapsed: true,
        items: [
          { label: 'Nifty Smashers', slug: 'overview/games/mobile-games/nifty-smashers' },
          { label: 'Nifty Royale', slug: 'overview/games/mobile-games/nifty-royale' },
          { label: 'Future Games', slug: 'overview/games/mobile-games/future-games' },
        ],
      },
      {
        label: 'Mini Games',
        collapsed: true,
        items: [
          { label: 'Arcade Tokens', slug: 'overview/games/mini-games/arcade-tokens' },
          { label: 'WEN Game', slug: 'overview/games/mini-games/wen-game' },
          { label: 'Crypto Winter', slug: 'overview/games/mini-games/crypto-winter' },
        ],
      },
      { label: 'NiftyWorld', slug: 'overview/games/niftyworld' },
    ],
  },
  {
    label: 'Nifty DAO',
    collapsed: false,
    items: [
      { label: 'About', slug: 'overview/nifty-dao/about' },
      {
        label: 'NFTL',
        collapsed: true,
        items: [
          { label: 'Overview', slug: 'overview/nifty-dao/nftl/overview' },
          { label: 'Contract & Trading', slug: 'overview/nifty-dao/nftl/trading' },
          { label: 'Supply', slug: 'overview/nifty-dao/nftl/supply' },
          { label: 'Initial Distribution', slug: 'overview/nifty-dao/nftl/distribution' },
          { label: 'Emissions', slug: 'overview/nifty-dao/nftl/emissions' },
        ],
      },
      { label: 'Guidelines', slug: 'overview/nifty-dao/guidelines' },
      { label: 'Contributions', slug: 'overview/nifty-dao/contributions' },
      { label: 'Code of Conduct', slug: 'overview/nifty-dao/conduct' },
      { label: 'Security Policy', slug: 'overview/nifty-dao/security' },
      { label: 'Proposal Template', slug: 'overview/nifty-dao/proposal-template' },
    ],
  },
  {
    label: 'NFT Collections',
    collapsed: false,
    items: [
      {
        label: 'DEGENs',
        collapsed: true,
        items: [
          { label: 'Overview', slug: 'overview/nfts/degens/about' },
          { label: 'Tribes', slug: 'overview/nfts/degens/tribes' },
          { label: 'Backgrounds', slug: 'overview/nfts/degens/backgrounds' },
          { label: 'Character Traits', slug: 'overview/nfts/degens/traits' },
          { label: 'Future Tribes', slug: 'overview/nfts/degens/gen2' },
        ],
      },
      {
        label: 'Nifty Marketplace',
        collapsed: false,
        items: [
          { label: 'Comics', slug: 'overview/nfts/nifty-marketplace/comics' },
          { label: 'Items', slug: 'overview/nfts/nifty-marketplace/items' },
        ],
      },
      { label: 'NFT Contract Addresses', slug: 'overview/nfts/contract-addresses' },
      { label: 'IP Rights', slug: 'overview/nfts/ip-rights' },
    ],
  },
  { label: 'Roadmap', slug: 'overview/roadmap' },
]

const guides: Item[] = [
  { label: 'Setup a Wallet', slug: 'guides/set-up' },
  { label: 'Connect Your Wallet', slug: 'guides/connect' },
  { label: 'Buying NFTL', slug: 'guides/buying-nftl' },
  { label: 'Claiming NFTL', slug: 'guides/claiming-nftl' },
  {
    label: 'Nifty Smashers Guide',
    collapsed: true,
    items: [
      { label: 'General Info', slug: 'guides/nifty-smashers/general-info' },
      { label: 'Battle Basics', slug: 'guides/nifty-smashers/battle-basics' },
      { label: 'Tribe Special Abilities', slug: 'guides/nifty-smashers/tribes' },
    ],
  },
]

const faq: Item[] = [
  { label: 'General', slug: 'faq/general' },
  { label: 'NFTL', slug: 'faq/nftl' },
  { label: 'Comics', slug: 'faq/comics' },
]

const tutorial: Item[] = [
  { label: 'Create a Page', slug: 'tutorial/create-a-page' },
  { label: 'Create a Document', slug: 'tutorial/create-a-document' },
  { label: 'Create a Blog Post', slug: 'tutorial/create-a-blog-post' },
  { label: 'Markdown Features', slug: 'tutorial/markdown-features' },
  { label: 'Deploy your site', slug: 'tutorial/deploy-your-site' },
  { label: 'Manage Docs Versions', slug: 'tutorial/manage-docs-versions' },
  { label: 'Translate your site', slug: 'tutorial/translate-your-site' },
  { label: 'Congratulations!', slug: 'tutorial/congratulations' },
]

const archive: Item[] = [
  {
    label: 'Rentals',
    collapsed: true,
    items: [
      { label: 'Overview', slug: 'archive/rentals/rental-overview' },
      { label: 'Tokenomics', slug: 'archive/rentals/tokenomics' },
      // The Docusaurus category index page: promoted to the group label link.
      { label: 'Rentals', slug: 'archive/rentals' },
    ],
  },
]

export const sidebar: StarlightUserConfig['sidebar'] = [
  ...overview,
  ...guides,
  ...faq,
  ...tutorial,
  ...archive,
]
