import type { ComponentProps, PropsWithChildren } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './page';

vi.mock('next/image', () => ({
  default: ({ alt, priority: _priority, ...props }: ComponentProps<'img'> & { priority?: boolean }) => (
    <img alt={alt} {...props} />
  ),
}));
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('@nl/ui/base/button', () => ({
  default: undefined,
  Button: (props: ComponentProps<'button'>) => <button {...props} />,
}));
vi.mock('@nl/ui/base/card', () => ({
  Card: (props: ComponentProps<'div'>) => <div {...props} />,
  CardTitle: (props: ComponentProps<'h3'>) => <h3 {...props} />,
  CardDescription: (props: ComponentProps<'p'>) => <p {...props} />,
}));
vi.mock('@nl/ui/base/icon', () => ({ Icon: ({ name }: { name: string }) => <span>{name}</span> }));
vi.mock('@nl/ui/custom/preloader', () => ({
  Preloader: ({ progress, ready }: { progress: number; ready: boolean }) => (
    <output data-ready={ready}>{progress}</output>
  ),
}));
vi.mock('@nl/ui/custom/typography', () => ({
  Text: ({ code: _code, ...props }: ComponentProps<'code'> & { code?: boolean }) => <code {...props} />,
}));
vi.mock('@nl/ui/custom/theme', () => ({ ThemeToggle: () => <button>Toggle theme</button> }));

describe('template page', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders starter links, component variants, and completed preload state', () => {
    render(<Page />);

    expect(screen.getByRole('link', { name: /Docs/i })).toHaveAttribute('href', 'https://turbo.build/repo/docs');
    expect(screen.getByRole('button', { name: /Primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Destructive/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0');

    act(() => vi.advanceTimersByTime(1_600));
    expect(screen.getByRole('status')).toHaveAttribute('data-ready', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('100');
  });
});
