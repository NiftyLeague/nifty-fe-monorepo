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
    mock.module('@nl/ui/custom/theme-button-group', () => ({ default: () => null }))
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

  it('eagerly loads the above-the-fold hero call-to-action image', () => {
    render(<Home />)

    const callToActionImage = screen.getByAltText('Learn More')
    expect(callToActionImage.getAttribute('data-loading')).toBe('eager')
    expect(callToActionImage.getAttribute('data-fetch-priority')).toBe('high')
  })

  it('uses an art-directed mobile source for the shared intro background', () => {
    render(<Home />)

    const mobileSource = document.querySelector('source[media="(max-width: 768px)"]')
    expect(mobileSource?.getAttribute('srcset')).toContain('/img/backgrounds/banner-dark.webp')
    expect(document.querySelector('.home-intro-background img')?.getAttribute('src')).toContain(
      '/img/hero/bg.webp'
    )
  })
})
