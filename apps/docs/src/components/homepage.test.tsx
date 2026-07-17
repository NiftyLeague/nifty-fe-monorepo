import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
;
import HomepageFeatures from './HomepageFeatures';
import HomepageGuides, { GITHUB_LINKS, GUIDE_LINKS, QUICK_LINKS } from './HomepageGuides';

mock.module('@site/public/icons/socials/github.svg', () => ({ default: () => <svg aria-label="GitHub" /> }));
mock.module('@site/public/img/logos/NFTL/logo.svg', () => ({ default: () => <svg aria-label="NFTL" /> }));
mock.module('@site/public/img/logos/NL/logo.svg', () => ({ default: () => <svg aria-label="Nifty League" /> }));

describe('documentation homepage content', () => {
  it('renders every guide, repository, and quick link', () => {
    render(<HomepageGuides />);

    expect(screen.getByRole('heading', { name: 'Getting Started' })).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Developer Links' })).not.toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(GUIDE_LINKS.length + GITHUB_LINKS.length + QUICK_LINKS.length);
    expect(screen.getByRole('link', { name: /nifty-fe-monorepo/i })?.getAttribute('href')).toBe('https://github.com/NiftyLeague/nifty-fe-monorepo',);
  });

  it('renders the three primary product feature cards', () => {
    render(<HomepageFeatures />);
    expect(screen.getByRole('link', { name: /What is Nifty League/i })).not.toBeNull();
    expect(screen.getByRole('link', { name: /Developers or Creators/i })).not.toBeNull();
    expect(screen.getByRole('link', { name: /^NFTL/i })).not.toBeNull();
  });
});
