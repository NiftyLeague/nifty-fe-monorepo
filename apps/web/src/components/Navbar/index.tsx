'use client';

import { Navbar as NiftyNavbar, type NavItemData } from '@nl/ui/custom/navbar';

const ACTION_BUTTON = { title: 'Web3 App', href: '/app', external: true };

const NAV_ITEMS: NavItemData[] = [
  { type: 'single', title: 'Home', href: '/' },
  {
    type: 'group',
    group: 'Products',
    pages: [
      { title: 'Games', href: '/games', description: 'Explore and play Nifty League games' },
      { title: 'DEGENs', href: '/degens', description: 'Discover our flagship NFT collection' },
      { title: 'NiftyVerse', href: '/niftyverse', description: 'Take a sneak peek of our virtual world' },
    ],
  },
  {
    type: 'group',
    group: 'About',
    pages: [
      { title: 'Overview / FAQ', href: '/overview', description: 'Quick introduction and common Q/As' },
      { title: 'Roadmap', href: '/roadmap', description: 'Track our progress and future plans' },
      { title: 'Community', href: '/community', description: 'Join and connect with other players' },
      { title: 'Nifty Lore', href: '/lore', description: "Dive into Nifty League's rich history" },
      { title: 'Docs', href: '/docs', external: true, description: 'Platform technical documentation' },
      { title: 'Blog', href: '/blog', external: true, description: 'Latest news and announcements' },
      { title: 'Contact', href: '/contact', external: true, description: 'Get in touch with our team' },
    ],
  },
  {
    type: 'group',
    group: 'DAO',
    pages: [
      {
        title: 'DAO Docs',
        href: '/docs/overview/nifty-dao/about',
        external: true,
        description: 'Nifty DAO full documentation',
      },
      { title: 'Snapshot', href: '/snapshot', external: true, description: 'Off-chain temperature checks' },
      { title: 'Tally', href: '/tally', external: true, description: 'On-chain governance protocol' },
    ],
  },
];

export default function Navbar() {
  return <NiftyNavbar actionButton={ACTION_BUTTON} navItems={NAV_ITEMS} />;
}
