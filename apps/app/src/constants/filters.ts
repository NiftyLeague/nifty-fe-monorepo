const tribes = [
  {
    name: 'Ape',
    icon: '/images/tribe/ape.svg',
  },
  {
    name: 'Alien',
    icon: '/images/tribe/alien.svg',
  },
  {
    name: 'Cat',
    icon: '/images/tribe/cat.svg',
  },
  {
    name: 'Doge',
    icon: '/images/tribe/doge.svg',
  },
  {
    name: 'Frog',
    icon: '/images/tribe/frog.svg',
  },
  {
    name: 'Human',
    icon: '/images/tribe/human.svg',
  },
  {
    name: 'Hydra',
    icon: '/images/tribe/hydra.svg',
  },
  {
    name: 'Rugman',
    icon: '/images/tribe/rugman.svg',
  },
  {
    name: 'Satoshi',
    icon: '/images/tribe/satoshi.svg',
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
