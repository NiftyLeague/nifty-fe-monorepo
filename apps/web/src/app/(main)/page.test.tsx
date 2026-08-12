import type { ComponentProps, PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

/* eslint-disable @next/next/no-img-element */

describe('home page', () => {
  let Home: typeof import('./page').default

  beforeEach(async () => {
    mock.module('@/components/MainLayout', () => ({
      default: ({ children }: PropsWithChildren) => <>{children}</>,
    }))
    mock.module('@/components/BouncingNFTL', () => ({ default: () => null }))
    mock.module('@/components/MintOMatic', () => ({ default: () => null }))
    mock.module('@/components/Sponsors', () => ({ default: () => null }))
    mock.module('@/components/ThemeBtnGroup', () => ({ default: () => null }))
    mock.module('@nl/ui/custom/deferred-console-game', () => ({ DeferredConsoleGame: () => null }))
    mock.module('next/link', () => ({
      default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
        <a href={href} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('next/navigation', () => ({
      usePathname: () => '/',
    }))
    mock.module('next/image', () => ({
      default: ({ alt, priority, ...props }: ComponentProps<'img'> & { priority?: boolean }) => (
        <img alt={alt} data-priority={priority ? 'true' : undefined} {...props} />
      ),
    }))

    const pageModule = await import('./page')
    Home = pageModule.default
  })

  it('links the hero call-to-action to the gaming section anchor', () => {
    render(<Home />)

    const learnMore = screen.getByRole('link', { name: 'Learn more about Nifty League' })
    expect(learnMore.getAttribute('href')).toBe('#gaming-section')
    expect(document.getElementById('gaming-section')).not.toBeNull()
  })

  it('renders CSS-driven responsive labels for both breakpoints', () => {
    render(<Home />)

    const mobileLabel = screen.getByText('OWN YOUR AVATAR')
    const desktopLabel = screen.getByText('COMMUNITY-GENERATED AVATARS')
    expect(mobileLabel.className).toContain('responsive-label-mobile')
    expect(desktopLabel.className).toContain('responsive-label-desktop')
  })

  it('preloads only the primary hero background image', () => {
    render(<Home />)

    expect(document.querySelectorAll('[data-priority="true"]')).toHaveLength(1)
    expect(document.querySelector('[data-priority="true"]')?.getAttribute('alt')).toBe(
      'Nifty Home Banner'
    )
  })
})
