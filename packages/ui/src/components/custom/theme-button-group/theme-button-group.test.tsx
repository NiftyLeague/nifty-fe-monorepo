import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let ThemeButtonGroup: typeof import('./index').default
const nextLinkPrefetches: Array<boolean | undefined> = []

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({
      children,
      prefetch,
      ...props
    }: { children: ReactNode; prefetch?: boolean } & Record<string, unknown>) => {
      nextLinkPrefetches.push(prefetch)
      return <a {...props}>{children}</a>
    },
  }))

  return import('./index').then((module) => {
    ThemeButtonGroup = module.default
  })
})

describe('ThemeButtonGroup', () => {
  it('renders linked CTAs through the shared shadcn button recipe', () => {
    render(
      <ThemeButtonGroup
        primary={{ href: '/games', title: 'Play now' }}
        secondary={{ href: 'https://niftysmashers.com', title: 'Smashers', external: true }}
      />
    )

    expect(screen.getByRole('link', { name: 'Play now' }).getAttribute('href')).toBe('/games')
    expect(nextLinkPrefetches).toEqual([false])
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('rel')).toBe('noreferrer')
  })

  it('renders unavailable CTAs as disabled buttons instead of empty links', () => {
    render(<ThemeButtonGroup primary={{ title: 'Coming soon', disabled: true }} />)

    const button = screen.getByRole('button', { name: 'Coming soon' })
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('href')).toBeNull()
  })
})
