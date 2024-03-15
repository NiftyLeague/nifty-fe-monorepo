import type { DegenFilter } from '@/types/degenFilter';

const DEFAULT_STATIC_FILTER: DegenFilter = {
  prices: [100, 3500],
  multipliers: [],
  rentals: [],
  tribes: [],
  backgrounds: [],
  sort: 'idUp',
  cosmetics: [],
  wearables: [],
  searchTerm: [''],
  walletAddress: undefined,
};

export default DEFAULT_STATIC_FILTER;
