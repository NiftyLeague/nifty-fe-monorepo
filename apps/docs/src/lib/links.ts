/**
 * Link inventories for the documentation landing page.
 *
 * Kept as plain data (rather than inline in the Astro components) so the
 * homepage contract test can assert that every entry still renders.
 */

export interface FeatureItem {
  title: string
  icon: 'logo' | 'code' | 'nftl'
  to: string
  text: string
}

export interface LinkItem {
  title: string
  text?: string
  to: string
}

export const FEATURES: FeatureItem[] = [
  {
    title: 'What is Nifty League?',
    icon: 'logo',
    to: '/docs/overview/intro',
    text: `Explore our platform's vision. Delve into core concepts, our inception, and aspirations to understand our exciting journey in Web3 gaming!`,
  },
  {
    title: 'Developers or Creators',
    icon: 'code',
    to: '/docs/overview/nifty-dao/about',
    text: `Nifty League offers game developers a streamlined platform to kickstart their development process. Start your next game's journey here!`,
  },
  {
    title: 'NFTL',
    icon: 'nftl',
    to: '/docs/overview/nifty-dao/nftl/overview',
    text: `Learn about our gaming ecosystem's native currency and governance token, NFTL. What is NFTL's utility? What does governance mean?`,
  },
]

export const GUIDE_LINKS: LinkItem[] = [
  {
    title: 'Set Up',
    text: 'Get started setting up your Ethereum wallet',
    to: '/docs/guides/set-up',
  },
  {
    title: 'Purchasing NFTL',
    text: 'Learn how to purchase NFTL tokens',
    to: '/docs/guides/buying-nftl',
  },
  {
    title: 'Playing Nifty Smashers',
    text: 'Learn how to bonk in Nifty Smashers!',
    to: '/docs/guides/nifty-smashers/general-info',
  },
]

export const GITHUB_LINKS: LinkItem[] = [
  { title: 'nifty-fe-monorepo', to: 'https://github.com/NiftyLeague/nifty-fe-monorepo' },
  { title: 'nifty-smart-contracts', to: 'https://github.com/NiftyLeague/nifty-smart-contracts' },
  { title: 'nifty-league-subgraph', to: 'https://github.com/NiftyLeague/nifty-league-subgraph' },
  { title: 'nifty-world', to: 'https://github.com/NiftyLeague/NiftyWorld' },
]

export const QUICK_LINKS: LinkItem[] = [
  { title: 'FAQ', to: '/docs/faq/general' },
  { title: 'Nifty DAO', to: '/docs/overview/nifty-dao/about' },
  { title: 'DEGEN NFTs', to: '/docs/overview/nfts/degens/about' },
  { title: 'Games', to: '/docs/overview/games/games-overview' },
  { title: 'NiftyWorld', to: '/docs/overview/games/niftyworld' },
]

export interface SocialItem {
  icon: 'discord' | 'twitter' | 'github'
  label: string
  text: string
  href: string
}

export const SOCIALS: SocialItem[] = [
  {
    icon: 'discord',
    label: 'Discord',
    text: 'Join our community for realtime Q&A.',
    href: 'https://discord.gg/niftyleague',
  },
  {
    icon: 'twitter',
    label: 'Twitter (X)',
    text: 'Follow our latest annoucements.',
    href: 'https://twitter.com/NiftyLeague',
  },
  {
    icon: 'github',
    label: 'Github',
    text: 'View all public Nifty League repositories.',
    href: 'https://github.com/NiftyLeague',
  },
]
