import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import PublicNavigation from './PublicNavigation'

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  }))
  mock.module('next/image', () => ({
    default: ({ alt }: { alt?: string }) => <span data-image-alt={alt ?? ''} />,
  }))
})

describe('PublicNavigation', () => {
  it('keeps the desktop sidebar open by default with a native disclosure control', () => {
    render(
      <PublicNavigation>
        <p>Public content</p>
      </PublicNavigation>
    )

    const toggle = screen.getByLabelText('Toggle sidebar')
    const disclosure = toggle.closest('details')

    expect(disclosure?.open).toBe(true)
    expect(toggle.getAttribute('aria-controls')).toBe('public-desktop-navigation')
    expect(document.getElementById('public-desktop-navigation')).toBeTruthy()
  })
})
