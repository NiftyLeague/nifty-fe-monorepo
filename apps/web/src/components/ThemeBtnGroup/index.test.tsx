import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let ThemeBtnGroup: typeof import('./index').default

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => (
      <a {...props}>{children}</a>
    ),
  }))

  return import('./index').then((module) => {
    ThemeBtnGroup = module.default
  })
})

describe('ThemeBtnGroup', () => {
  it('renders linked CTAs through the shared button primitive', () => {
    render(
      <ThemeBtnGroup
        primary={{ href: '/games', title: 'Play now' }}
        secondary={{ href: 'https://niftysmashers.com', title: 'Smashers', external: true }}
      />
    )

    expect(screen.getByRole('link', { name: 'Play now' }).getAttribute('href')).toBe('/games')
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('rel')).toBe('noreferrer')
  })

  it('renders unavailable CTAs as disabled buttons instead of empty links', () => {
    render(<ThemeBtnGroup primary={{ title: 'Coming soon', disabled: true }} />)

    const button = screen.getByRole('button', { name: 'Coming soon' })
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('href')).toBeNull()
  })
})
