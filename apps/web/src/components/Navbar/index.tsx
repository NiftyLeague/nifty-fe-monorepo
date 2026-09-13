import { Navbar as NiftyNavbar, type NavItemData } from '@nl/ui/custom/navbar'

const ACTION_BUTTON = { title: 'Game App', href: '/app', external: true }

const NAV_ITEMS: NavItemData[] = [
  { type: 'single', title: 'Home', href: '/' },
  {
    type: 'group',
    group: 'Products',
    pages: [
      { title: 'Games', href: '/games', description: 'Explore and play Nifty League games' },
      {
        title: 'Nifty World',
        href: '/niftyworld',
        description: 'Take a sneak peek of our virtual world',
      },
      { title: 'DEGENs', href: '/degens', description: 'Discover our flagship NFT collection' },
      {
        title: 'NFTL',
        href: '/compete-and-earn',
        description: 'Compete, earn, and govern across Nifty League',
      },
    ],
  },
  {
    type: 'group',
    group: 'About',
    pages: [
      {
        title: 'Overview / FAQ',
        href: '/overview',
        description: 'Quick introduction and common Q/As',
      },
      { title: 'Roadmap', href: '/roadmap', description: 'Track our progress and future plans' },
      { title: 'Nifty Lore', href: '/lore', description: "Dive into Nifty World's rich history" },
      {
        title: 'Docs',
        href: '/docs',
        external: true,
        description: 'Platform technical documentation',
      },
      {
        title: 'Blog',
        href: '/blog',
        external: true,
        description: 'Latest news and announcements',
      },
      {
        title: 'Contact',
        href: '/contact',
        external: true,
        description: 'Get in touch with our team',
      },
    ],
  },
  {
    type: 'group',
    group: 'CONTRIBUTE',
    pages: [
      {
        title: 'Community',
        href: '/community',
        description: 'Join and connect with other players',
      },
      {
        title: 'GitHub',
        href: 'https://github.com/NiftyLeague',
        external: true,
        description: 'Explore our open-source projects',
      },
      {
        title: 'DAO Docs',
        href: '/docs/overview/nifty-dao/about',
        external: true,
        description: 'Nifty DAO full documentation',
      },
      {
        title: 'Snapshot',
        href: '/snapshot',
        external: true,
        description: 'Off-chain temperature checks',
      },
      {
        title: 'Tally',
        href: '/tally',
        external: true,
        description: 'On-chain governance protocol',
      },
    ],
  },
]

export default function Navbar() {
  return <NiftyNavbar actionButton={ACTION_BUTTON} navItems={NAV_ITEMS} />
}
