import { describe, expect, it } from 'bun:test';
const catalogLoaders = {
  addresses: () => import('./addresses'),
  cosmetics: () => import('./cosmeticsFilters'),
  degens: () => import('./degens'),
  filters: () => import('./filters'),
  games: () => import('./games'),
  hydras: () => import('./hydras'),
  marketplace: () => import('./marketplace'),
  networks: () => import('./networks'),
  sort: () => import('./sort'),
  sponsorships: () => import('./sponsorships'),
  urls: () => import('./url'),
};

describe('application catalogs', () => {
  it.each(Object.entries(catalogLoaders))(
    '%s exposes non-empty runtime data',
    async (_name, loadModule) => {
      const catalog = await loadModule();
      expect(Object.keys(catalog).length).toBeGreaterThan(0);
      expect(Object.values(catalog).some(value => value !== undefined)).toBe(true);
    },
    15_000,
  );
});
