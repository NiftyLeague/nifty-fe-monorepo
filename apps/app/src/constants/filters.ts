const tribes = [
  {
    name: 'Ape',
    icon: '/icons/tribes/ape.svg',
  },
  {
    name: 'Alien',
    icon: '/icons/tribes/alien.svg',
  },
  {
    name: 'Cat',
    icon: '/icons/tribes/cat.svg',
  },
  {
    name: 'Doge',
    icon: '/icons/tribes/doge.svg',
  },
  {
    name: 'Frog',
    icon: '/icons/tribes/frog.svg',
  },
  {
    name: 'Human',
    icon: '/icons/tribes/human.svg',
  },
  {
    name: 'Hydra',
    icon: '/icons/tribes/hydra.svg',
  },
  {
    name: 'Rugman',
    icon: '/icons/tribes/rugman.svg',
  },
  {
    name: 'Satoshi',
    icon: '/icons/tribes/satoshi.svg',
  },
];

const backgrounds = ['Common', 'Rare', 'Meta', 'Legendary'];

const rentals = ['1', '2', '3+'];

const multipliers = ['1', '2', '3+'];

const wearables = ['Hand', 'Back', 'Head', 'Pet'];

export type FilterSource =
  | 'prices'
  | 'multipliers'
  | 'rentals'
  | 'tribes'
  | 'backgrounds'
  | 'cosmetics'
  | 'wearables'
  | 'searchTerm'
  | 'walletAddress';

export { tribes, backgrounds, rentals, multipliers, wearables };
