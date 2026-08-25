import type { ComponentProps, PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

/* eslint-disable @next/next/no-img-element */

describe('home page', () => {
  let Home: typeof import('./page').default
  let optimizedImageCalls: ComponentProps<'img'>[] = []

  beforeEach(async () => {
    optimizedImageCalls = []
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
    mock.module('@/components/DeferredHomeSections', () => {
      const DeferredHomeSection = ({ label }: { label: string }) => (
        <div role="status" aria-label={`Loading ${label}`} />
      )

      return {
        DeferredHomeCommunity: () => <DeferredHomeSection label="community section" />,
        DeferredHomeCompete: () => <DeferredHomeSection label="compete and earn section" />,
        DeferredHomeDashboard: () => <DeferredHomeSection label="dashboard section" />,
        DeferredHomeDegens: () => <DeferredHomeSection label="community DEGEN section" />,
        DeferredHomeNiftyWorld: () => <DeferredHomeSection label="NiftyWorld section" />,
        DeferredHomeSponsors: () => <DeferredHomeSection label="sponsors section" />,
        DeferredHomeToken: () => <DeferredHomeSection label="NFTL token section" />,
      }
    })
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
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ alt, loading, fetchPriority, ...props }: ComponentProps<'img'>) => (
        <img
          alt={alt}
          loading={loading}
          data-loading={loading}
          data-fetch-priority={fetchPriority}
          {...props}
        />
      ),
      getOptimizedImageProps: (props: ComponentProps<'img'>) => {
        optimizedImageCalls.push(props)

        const { src, alt, width, height, sizes, fetchPriority, quality } = props

        return {
          quality,
          src,
          alt,
          width,
          height,
          sizes,
          srcSet: `${src} 1x`,
          fetchPriority,
        }
      },
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

  it('keeps below-fold sections behind accessible deferred boundaries', () => {
    render(<Home />)

    expect(screen.queryByText('OWN YOUR AVATAR')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'NFTL TOKEN' })).toBeNull()
    expect(screen.getAllByRole('status')).toHaveLength(7)
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

  it('defers decorative desktop hero artwork behind the LCP background', () => {
    render(<Home />)

    const heroArtwork = screen.getByAltText('Nifty Hero Characters')
    expect(heroArtwork.getAttribute('loading')).not.toBe('eager')
    expect(heroArtwork.getAttribute('fetchpriority')).not.toBe('high')
  })

  it('uses the compact quality profile for the desktop hero raster artwork', () => {
    render(<Home />)

    const heroSources = optimizedImageCalls.filter(({ src }) =>
      ['/img/hero/bg.webp', '/img/hero/characters.webp'].includes(src as string)
    )

    expect(heroSources).toHaveLength(2)
    expect(heroSources.every(({ quality }) => quality === 60)).toBe(true)
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

  it('keeps below-fold artwork out of the initial render', () => {
    render(<Home />)

    for (const alt of [
      'ape degen overlay',
      'Scrolling NFTL Token',
      'Land in NiftyWorld',
      'App Dashboard',
      'The Best Community on Earth',
      'Community DEGENs',
    ]) {
      expect(screen.queryByAltText(alt)).toBeNull()
    }
  })

  it('uses the compact quality profile for the above-the-fold call to action', () => {
    render(<Home />)

    const callToAction = optimizedImageCalls.find(
      ({ src }) => src === '/img/hero/speech-bubble.webp'
    )
    expect(callToAction?.quality).toBe(60)
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
