import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'

import CircularProgress from './circular-progress'
import DeferredSkeleton from './deferred-skeleton'
import MobileNavigationDisclosure from './mobile-navigation'
import { PreloaderBase } from './preloader/base'
import RouteLoading from './route-loading'
import { ThemeButtonGroup } from './theme-button-group'
import { Text, Title } from './typography'

/**
 * Accessibility contract for the hand-written shared primitives.
 *
 * Radix supplies the ARIA for the base primitives; these components own their
 * own markup, so the properties the M4.1 acceptance criteria name — labels,
 * semantics, reduced motion, responsive behaviour — are the library's
 * responsibility. Each assertion below failed at least once during the audit, or
 * pins a fix made alongside it.
 */

/** Read a sibling source file; the test owns these contracts, not the caller. */
const read = (relativePath: string) => readFileSync(join(import.meta.dir, relativePath), 'utf8')

describe('custom primitives: disclosure navigation', () => {
  it('keeps the native expanded state on the menu toggle', () => {
    render(
      <MobileNavigationDisclosure id="public-mobile-navigation" label="Toggle navigation">
        <nav aria-label="Primary navigation">
          <a href="/games">Games</a>
        </nav>
      </MobileNavigationDisclosure>
    )

    // Queried directly: this DOM implementation maps `details` to `group` but
    // never maps `summary` to `button`, so a role query cannot see the control a
    // browser exposes as a disclosure.
    const toggle = document.querySelector('summary') as HTMLElement
    const details = toggle.closest('details')

    // An explicit `role="button"` replaces the browser's disclosure mapping and
    // drops aria-expanded, so the role must stay implicit.
    expect(toggle.getAttribute('role')).toBeNull()
    expect(toggle.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(details?.hasAttribute('open')).toBe(false)
    expect(toggle.textContent).toBe('Toggle navigation')
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeTruthy()
  })

  it('guards the hamburger transition for reduced motion', () => {
    const source = read('mobile-navigation/index.tsx')
    const transitions = source.match(/transition-(transform|opacity)/g) ?? []
    const guards = source.match(/motion-reduce:transition-none/g) ?? []

    expect(transitions.length).toBeGreaterThan(0)
    expect(guards).toHaveLength(transitions.length)
  })
})

describe('custom primitives: loading states', () => {
  it('hides the spinner from the accessibility tree and stops it under reduced motion', () => {
    render(<CircularProgress aria-label="Loading" />)

    const spinner = document.querySelector('[data-slot], svg') as SVGElement

    expect(spinner.getAttribute('aria-hidden')).toBe('true')
    expect(spinner.getAttribute('class')).toContain('motion-reduce:animate-none')
  })

  it('names the loading region and keeps it busy until ready', () => {
    const { rerender } = render(<PreloaderBase ready={false} percent={40} />)

    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-busy')).toBe('true')
    expect(status.textContent).toContain('Loading')
    // Progress is exposed by the bar, not by an unlabelled image.
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('40')

    // Ready: the overlay is display:none, so it leaves the accessibility tree
    // rather than announcing a stale loading state.
    rerender(<PreloaderBase ready />)
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('stops the preloader animation under reduced motion', () => {
    const css = read('preloader/index.module.css')
    const guard = css.slice(css.indexOf('@media (prefers-reduced-motion'))

    expect(guard).toContain('@media (prefers-reduced-motion: reduce)')
    for (const animated of ['.preloader_inner', '.pong_loader_left', '.pong_loader_right']) {
      expect(guard).toContain(animated)
    }
    expect(guard).toContain('animation: none')
  })

  it('announces route loading once, with a status and a label', () => {
    render(<RouteLoading label="Loading dashboard" />)

    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('aria-busy')).toBe('true')
    expect(screen.getByText('Loading dashboard')).toBeTruthy()
    // The placeholders inside are decorative.
    expect(
      screen.getByRole('status').querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
  })

  it('keeps the deferred placeholder motion-safe without silencing callers', () => {
    render(<DeferredSkeleton className="h-5 w-20" />)

    const placeholder = document.querySelector('[data-slot="skeleton"]') as HTMLElement

    expect(placeholder.getAttribute('class')).toContain('motion-reduce:animate-none')
    // Callers use this as the announced loading state, so it must not hide
    // itself the way the decorative base Skeleton does.
    expect(placeholder.getAttribute('aria-hidden')).toBeNull()
  })

  it('lets a boundary name the deferred placeholder it announces', () => {
    render(<DeferredSkeleton role="status" aria-live="polite" aria-label="Loading trailer" />)

    const status = screen.getByRole('status', { name: 'Loading trailer' })

    expect(status.getAttribute('aria-live')).toBe('polite')
  })
})

describe('custom primitives: links and buttons', () => {
  it('gives a disabled action the button role and no link', () => {
    render(
      <ThemeButtonGroup
        primary={{ title: 'Play now', href: '/games' }}
        secondary={{ title: 'Coming soon', disabled: true }}
      />
    )

    const play = screen.getByRole('link', { name: 'Play now' })
    expect(play.getAttribute('href')).toBe('/games')
    expect(play.getAttribute('target')).toBeNull()

    const soon = screen.getByRole('button', { name: /Coming soon/ })
    expect((soon as HTMLButtonElement).disabled).toBe(true)
  })

  it('announces that an external action opens a new tab', () => {
    render(
      <ThemeButtonGroup
        primary={{ title: 'Discord', href: 'https://discord.gg/niftyleague', external: true }}
      />
    )

    const link = screen.getByRole('link', { name: /Discord/ })

    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    // The icon is decorative, so the behaviour needs its own text.
    expect(link.textContent).toContain('opens in a new tab')
  })
})

describe('custom primitives: typography semantics', () => {
  it('renders the requested heading level', () => {
    render(
      <>
        <Title level={1}>DEGENs</Title>
        <Title level={3}>Traits</Title>
        <Text>Body copy</Text>
      </>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'DEGENs' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Traits' })).toBeTruthy()
    expect(screen.getByText('Body copy')).toBeTruthy()
  })
})
