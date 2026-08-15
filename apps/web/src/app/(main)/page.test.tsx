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
    mock.module('@nl/ui/custom/theme-button-group', () => ({
      default: () => null,
      ThemeButtonGroup: () => null,
    }))
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
      default: ({ alt, loading, fetchPriority, ...props }: ComponentProps<'img'>) => (
        <img
          alt={alt}
          loading={loading}
          data-loading={loading}
          data-fetch-priority={fetchPriority}
          {...props}
        />
      ),
      getImageProps: ({
        src,
        alt,
        width,
        height,
        sizes,
        fetchPriority,
      }: ComponentProps<'img'>) => ({
        props: {
          src,
          alt,
          width,
          height,
          sizes,
          srcSet: `${src} 1x`,
          fetchPriority,
        },
      }),
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

  it('keeps the selected hero background fetch high priority', () => {
    render(<Home />)

    const heroImage = document.querySelector('.home-intro-background img')
    expect(heroImage?.getAttribute('fetchpriority')).toBe('high')
    expect(heroImage?.getAttribute('loading')).toBe('eager')
  })

  it('keeps the desktop hero artwork wrapper full width', () => {
    render(<Home />)

    expect(
      document.querySelector('.home-hero-characters-image')?.parentElement?.className
    ).toContain('w-full')
  })

  it('loads the desktop hero artwork at high priority for LCP', () => {
    render(<Home />)

    const heroArtwork = screen.getByAltText('Nifty Hero Characters')
    expect(heroArtwork.getAttribute('data-loading')).toBeNull()
    expect(heroArtwork.getAttribute('data-fetch-priority')).toBeNull()
  })

  it('keeps desktop-only hero artwork out of the mobile image request path', () => {
    render(<Home />)

    const heroArtwork = screen.getByAltText('Nifty Hero Characters')
    const desktopSource = heroArtwork.closest('picture')?.querySelector('source')

    expect(desktopSource?.getAttribute('media')).toBe('(min-width: 769px)')
    expect(heroArtwork.getAttribute('src')).toContain('data:image/gif;base64,')
  })

  it('does not compete with the hero background for high-priority loading', () => {
    render(<Home />)

    const callToActionImage = screen.getByAltText('Learn More')
    expect(callToActionImage.getAttribute('data-loading')).not.toBe('eager')
    expect(callToActionImage.getAttribute('data-fetch-priority')).not.toBe('high')
  })

  it('uses an art-directed mobile source for the shared intro background', () => {
    render(<Home />)

    const mobileSource = document.querySelector('source[media="(max-width: 768px)"]')
    expect(mobileSource?.getAttribute('srcset')).toContain('/img/backgrounds/banner-dark.webp')
    expect(document.querySelector('.home-intro-background img')?.getAttribute('src')).toContain(
      '/img/hero/bg.webp'
    )
  })

  it('keeps below-the-fold visual effects free from paint containment', () => {
    render(<Home />)

    expect(document.getElementById('gaming-section')?.className).not.toContain('home-below-fold')
    expect(document.querySelectorAll('.home-below-fold')).toHaveLength(0)
  })
})
