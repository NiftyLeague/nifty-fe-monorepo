const tribes = [
  { name: 'Ape', icon: '/icons/tribes/ape.svg' },
  { name: 'Alien', icon: '/icons/tribes/alien.svg' },
  { name: 'Cat', icon: '/icons/tribes/cat.svg' },
  { name: 'Doge', icon: '/icons/tribes/doge.svg' },
  { name: 'Frog', icon: '/icons/tribes/frog.svg' },
  { name: 'Human', icon: '/icons/tribes/human.svg' },
  { name: 'Hydra', icon: '/icons/tribes/filters/hydra.webp' },
  { name: 'Rugman', icon: '/icons/tribes/filters/rugman.webp' },
  { name: 'Satoshi', icon: '/icons/tribes/filters/satoshi.webp' },
]

const backgrounds = ['Common', 'Rare', 'Meta', 'Legendary']

export type FilterSource =
  | 'prices'
  | 'multipliers'
  | 'rentals'
  | 'tribes'
  | 'backgrounds'
  | 'cosmetics'
  | 'wearables'
  | 'searchTerm'
  | 'walletAddress'

export { tribes, backgrounds }
