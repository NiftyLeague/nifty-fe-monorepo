import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/components/Header', () => ({
  default: () => <header data-testid="hero-header" />,
}))

mock.module('@/components/DeferredHomeSections', () => ({
  DeferredDegensSection: () => <div data-testid="deferred-degens" />,
  DeferredGameSection: () => <div data-testid="deferred-game" />,
}))

mock.module('@nl/ui/custom/console-game-backdrop', () => ({
  ConsoleGameBackdrop: ({ loading = 'lazy' }: { loading?: 'eager' | 'lazy' }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="console-backdrop" loading={loading} alt="Game Console Backdrop" />
  ),
}))

mock.module('@nl/ui/custom/deferred-console-game', () => ({
  DeferredConsoleGame: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

mock.module('@nl/ui/custom/socials-footer', () => ({
  SocialsFooter: ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
}))

describe('Smashers home', () => {
  let Home: typeof import('./page').default

  beforeEach(async () => {
    Home = (await import('./page')).default
  })

  it('keeps the below-hero console backdrop lazy', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }))

    expect(screen.getByTestId('console-backdrop').getAttribute('loading')).toBe('lazy')
  })
})
