import type { ComponentProps } from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { mock } from 'bun:test'

beforeEach(() => {
  mock.module('@nl/ui/base/button', () => ({
    default: undefined,
    Button: (props: ComponentProps<'button'>) => <button {...props} />,
  }))
  mock.module('@nl/ui/base/card', () => ({
    Card: (props: ComponentProps<'div'>) => <div {...props} />,
    CardTitle: (props: ComponentProps<'h3'>) => <h3 {...props} />,
    CardDescription: (props: ComponentProps<'p'>) => <p {...props} />,
  }))
  mock.module('@nl/ui/base/icon', () => ({
    Icon: ({ name }: { name: string }) => <span>{name}</span>,
  }))
  mock.module('@nl/ui/custom/preloader', () => ({
    Preloader: ({ progress, ready }: { progress: number; ready: boolean }) => (
      <output data-ready={ready}>{progress}</output>
    ),
  }))
  mock.module('@nl/ui/custom/typography', () => ({
    Text: ({ code: _code, ...props }: ComponentProps<'code'> & { code?: boolean }) => (
      <code {...props} />
    ),
  }))
  mock.module('@nl/ui/custom/theme', () => ({ ThemeToggle: () => <button>Toggle theme</button> }))
})

afterEach(() => {
  mock.restore()
})

describe('template page', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('renders starter links, component variants, and completed preload state', async () => {
    const Page = (await import('./page')).default
    const { container } = render(<Page />)

    expect(screen.getByRole('link', { name: /Docs/i })?.getAttribute('href')).toBe(
      'https://turbo.build/repo/docs'
    )
    expect(screen.getByRole('button', { name: /Primary/i })).not.toBeNull()
    expect(screen.getByRole('button', { name: /Destructive/i })).not.toBeNull()
    const vercelLogo = screen.getByAltText('Vercel Logo')
    const circles = screen.getByAltText('Turborepo')
    const prioritizedLogos = container.querySelectorAll('img[loading="eager"]')

    expect(vercelLogo.getAttribute('loading')).toBe('eager')
    expect(vercelLogo.getAttribute('fetchpriority')).toBe('high')
    expect(prioritizedLogos).toHaveLength(2)
    expect(
      [...prioritizedLogos].every((logo) => logo.getAttribute('fetchpriority') === 'high')
    ).toBe(true)
    expect(circles.getAttribute('loading')).toBe('lazy')
    expect(circles.getAttribute('fetchpriority')).toBe('low')
    expect(screen.getByRole('status')?.textContent).toContain('0')

    act(() => jest.advanceTimersByTime(1_600))
    expect(screen.getByRole('status')?.getAttribute('data-ready')).toBe('true')
    expect(screen.getByRole('status')?.textContent).toContain('100')
  })
})
