import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomepageFeatures from './HomepageFeatures';
import HomepageGuides, { GITHUB_LINKS, GUIDE_LINKS, QUICK_LINKS } from './HomepageGuides';

vi.mock('@site/public/icons/socials/github.svg', () => ({ default: () => <svg aria-label="GitHub" /> }));
vi.mock('@site/public/img/logos/NFTL/logo.svg', () => ({ default: () => <svg aria-label="NFTL" /> }));
vi.mock('@site/public/img/logos/NL/logo.svg', () => ({ default: () => <svg aria-label="Nifty League" /> }));

describe('documentation homepage content', () => {
  it('renders every guide, repository, and quick link', () => {
    render(<HomepageGuides />);

    expect(screen.getByRole('heading', { name: 'Getting Started' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Developer Links' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(GUIDE_LINKS.length + GITHUB_LINKS.length + QUICK_LINKS.length);
    expect(screen.getByRole('link', { name: /nifty-fe-monorepo/i })).toHaveAttribute(
      'href',
      'https://github.com/NiftyLeague/nifty-fe-monorepo',
    );
  });

  it('renders the three primary product feature cards', () => {
    render(<HomepageFeatures />);
    expect(screen.getByRole('link', { name: /What is Nifty League/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Developers or Creators/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^NFTL/i })).toBeInTheDocument();
  });
});
