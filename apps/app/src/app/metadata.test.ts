import { describe, expect, it } from 'vitest';

import robots from './robots';
import sitemap from './sitemap';

describe('application metadata routes', () => {
  it('publishes crawler rules and the canonical sitemap URL', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: '/private/' },
      sitemap: 'https://app.niftyleague.com/sitemap.xml',
    });
  });

  it('lists unique canonical routes with valid priorities', () => {
    const entries = sitemap();
    const urls = entries.map(entry => entry.url);

    expect(entries).toHaveLength(16);
    expect(new Set(urls).size).toBe(entries.length);
    expect(urls).toContain('https://app.niftyleague.com/dashboard');
    expect(urls).toContain('https://app.niftyleague.com/mint-o-matic');
    expect(entries.every(entry => entry.lastModified instanceof Date)).toBe(true);
    expect(entries.every(entry => Number(entry.priority) > 0 && Number(entry.priority) <= 1)).toBe(true);
  });
});
