import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'
import type { ComponentProps } from 'solid-js'

let GameCard: typeof import('./cards/GameCard').default
let MainCard: typeof import('./cards/MainCard').default
let Breadcrumbs: typeof import('./extended/Breadcrumbs').default

beforeEach(async () => {
  mock.module('@nl/ui/custom/optimized-image', () => ({
    default: ({
      fill: _fill,
      quality: _quality,
      alt,
      ...props
    }: ComponentProps<'img'> & { fill?: boolean; quality?: number }) => (
      <img data-optimized-image="true" alt={alt ?? ''} {...props} />
    ),
  }))
  mock.module('@/components/AppNavIcon', () => ({
    AppNavIcon: ({ name }: { name: string }) => <span data-icon={name}>{name}</span>,
  }))
  // The router-backed Link needs a RouterProvider; render a plain anchor here.
  mock.module('@/runtime/Link', () => ({
    default: ({
      children,
      href,
      prefetch,
      ...props
    }: ComponentProps<'a'> & { href: string; prefetch?: boolean }) => (
      <a href={href} data-prefetch={String(prefetch)} {...props}>
        {children}
      </a>
    ),
  }))
  mock.module('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => <span>external</span> }))
  window.history.replaceState({}, '', '/')

  const gameCard = await import('./cards/GameCard')
  const mainCard = await import('./cards/MainCard')
  const breadcrumbs = await import('./extended/Breadcrumbs')

  GameCard = gameCard.default
  MainCard = mainCard.default
  Breadcrumbs = breadcrumbs.default
})

afterEach(() => {
  mock.restore()
})

describe('Breadcrumbs', () => {
  const navigation = {
    items: [
      {
        type: 'group',
        children: [
          {
            type: 'collapse',
            title: 'Settings',
            icon: 'settings',
            children: [{ type: 'item', title: 'Profile', icon: 'user', url: '/profile' }],
          },
        ],
      },
    ],
  }

  it('resolves nested routes and renders the full title and icon variants', () => {
    const { rerender } = render(
      <Breadcrumbs
        navigation={navigation as never}
        pathname="/profile"
        card={false}
        icons
        rightAlign
        title
        separator="chevron-right"
      />
    )

    expect(screen.getAllByText('Profile')).toHaveLength(2)
    expect(screen.getByText('Settings')).not.toBeNull()
    expect(screen.getByText('Dashboard')).not.toBeNull()
    expect(screen.getAllByText('chevron-right')).toHaveLength(2)

    rerender(
      <Breadcrumbs
        navigation={navigation as never}
        pathname="/profile"
        card={false}
        divider={false}
        icon
        title
        titleBottom
      />
    )
    expect(screen.getByText('house')).not.toBeNull()
    expect(screen.getAllByText('Profile')).toHaveLength(2)
  })

  it('omits the card when an item disables breadcrumbs or no route matches', async () => {
    window.history.replaceState({}, '', '/hidden')
    const hiddenNavigation = {
      items: [
        {
          type: 'group',
          children: [
            {
              type: 'collapse',
              children: [{ type: 'item', title: 'Hidden', url: '/hidden', breadcrumbs: false }],
            },
          ],
        },
      ],
    }
    const { container, rerender } = render(
      <Breadcrumbs navigation={hiddenNavigation as never} pathname="/hidden" />
    )
    expect(container.querySelector('[aria-label="breadcrumb"]')).toBeNull()

    rerender(<Breadcrumbs navigation={navigation as never} pathname="/missing" />)
    expect(container.querySelector('[aria-label="breadcrumb"]')).toBeNull()
  })
})

describe('card presentation', () => {
  it('restores the app card spacing contract over shadcn defaults', () => {
    const { container } = render(
      <MainCard title="Main" secondary="Action">
        Main body
      </MainCard>
    )

    const mainCard = container.querySelector('[data-slot="card"]')
    expect(mainCard?.className).toContain('gap-0')
    expect(mainCard?.className).toContain('py-0')
    expect(mainCard?.querySelector('[data-slot="card-header"]')?.className).toContain('p-4')
    expect(mainCard?.querySelector('[data-slot="card-content"]')?.className).toContain('p-4')

    const card = container.querySelector('[data-slot="card"]')
    expect(card?.className).toContain('gap-0')
    expect(card?.className).toContain('py-0')
  })

  it('renders all MainCard content modes in light and dark themes', () => {
    const { rerender } = render(
      <MainCard title="Main" secondary="Action" boxShadow shadow="custom-shadow">
        Main body
      </MainCard>
    )
    expect(screen.getByText('Main body')).not.toBeNull()

    rerender(
      <MainCard title="Dark main" darkTitle border={false} boxShadow content={false}>
        Raw body
      </MainCard>
    )
    expect(screen.getByText('Raw body')).not.toBeNull()
  })

  it('accepts server-rendered artwork without changing the card layout contract', () => {
    render(
      <GameCard
        title="Optimized artwork"
        imageContent={<img src="/optimized-artwork.webp" alt="Optimized artwork" />}
      />
    )

    expect(screen.getByRole('img', { name: 'Optimized artwork' }).getAttribute('src')).toBe(
      '/optimized-artwork.webp'
    )
  })

  it('keeps lazy game artwork at low network priority by default', () => {
    render(<GameCard title="Deferred artwork" image="/deferred-artwork.webp" />)

    expect(screen.getByAltText('Deferred artwork').getAttribute('loading')).toBe('lazy')
    expect(screen.getByAltText('Deferred artwork').getAttribute('fetchpriority')).toBe('low')
  })

  it('supports a full-card scene link with a visible hover cue', () => {
    render(
      <GameCard
        title="Isla Azul"
        description="Explore the island"
        image="/isla-azul.webp"
        href="/world/isla-azul"
        prefetch={false}
      />
    )

    const sceneLink = screen.getByRole('link', { name: 'Explore Isla Azul' })

    expect(sceneLink.getAttribute('href')).toBe('/world/isla-azul')
    expect(sceneLink.getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByText('Explore map')).not.toBeNull()
    expect(screen.queryByRole('button', { name: /Play on/ })).toBeNull()

    const sceneCard = sceneLink.firstElementChild
    expect(sceneCard?.getAttribute('class')).toContain('group-hover:border-purple/70')
    expect(sceneCard?.getAttribute('class')).not.toContain('translate-y')
    expect(sceneCard?.querySelector('img')?.getAttribute('class')).toContain(
      'group-hover:scale-105'
    )
  })

  it('renders scene artwork full-bleed with the content in a translucent lower overlay', () => {
    render(
      <GameCard
        title="Isla Azul"
        description="Explore the island"
        image="/isla-azul.webp"
        href="/world/isla-azul"
        overlayContent
        prefetch={false}
      />
    )

    const sceneCard = screen.getByRole('link', { name: 'Explore Isla Azul' }).firstElementChild
    const overlay = screen.getByText('Explore the island').parentElement?.parentElement

    expect(sceneCard?.getAttribute('class')).toContain('aspect-[16/10]')
    expect(sceneCard?.querySelector('img')?.parentElement?.getAttribute('class')).toContain(
      'absolute'
    )
    expect(overlay?.getAttribute('class')).not.toContain('min-h-[50%]')
    expect(overlay?.querySelector('[data-slot="card-content"]')?.getAttribute('class')).toContain(
      'pb-3'
    )
    expect(overlay?.getAttribute('class')).toContain('bg-black/65')
  })

  it('keeps store badges clickable when a flagship card links externally', () => {
    render(
      <GameCard
        title="Nifty Smashers (Beta)"
        image="/smashers.webp"
        externalHref="https://niftysmashers.com/"
        cardLinkLabel="Open Nifty Smashers"
        actions={<a href="https://niftysmashers.com/ios">App Store badge</a>}
      />
    )

    const cardLink = screen.getByRole('link', { name: 'Open Nifty Smashers' })
    const badgeLink = screen.getByRole('link', { name: 'App Store badge' })

    expect(cardLink.getAttribute('href')).toBe('https://niftysmashers.com/')
    expect(cardLink.getAttribute('target')).toBe('_blank')
    expect(cardLink.closest('[data-slot="card"]')?.getAttribute('class')).toContain(
      'hover:border-purple/70'
    )
    expect(badgeLink.getAttribute('href')).toBe('https://niftysmashers.com/ios')
    expect(cardLink.contains(badgeLink)).toBe(false)
    expect(badgeLink.parentElement?.parentElement?.getAttribute('class')).toContain(
      'pointer-events-auto'
    )
  })

  it('accepts server-rendered artwork without changing the card layout contract', () => {
    render(
      <GameCard
        title="Optimized artwork"
        imageContent={<img src="/optimized-artwork.webp" alt="Optimized artwork" />}
      />
    )

    expect(screen.getByRole('img', { name: 'Optimized artwork' }).getAttribute('src')).toBe(
      '/optimized-artwork.webp'
    )
  })

  it('renders game calls to action, expands descriptions, and supports custom content', () => {
    const desktop = mock()
    const web = mock()
    const { rerender } = render(
      <GameCard
        title="Smashers"
        image="/smashers.png"
        description="A long description"
        externalLink={{ title: 'Guide', src: '/guide' }}
        imageFetchPriority="high"
        imageLoading="eager"
        isComingSoon
        required="Wallet required"
        showMore
        onPlayOnDesktopClick={desktop}
        onPlayOnWebClick={web}
      />
    )
    const disclosureLabel = screen.getByText('more..')
    const disclosure = disclosureLabel.closest('summary')
    const details = disclosure?.closest('details')
    expect(disclosure).not.toBeNull()
    expect(details?.hasAttribute('open')).toBe(false)
    fireEvent.click(disclosureLabel)
    expect(details?.hasAttribute('open')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Play on Desktop' }))
    fireEvent.click(screen.getByRole('button', { name: 'Play on Web' }))
    expect(desktop).toHaveBeenCalledOnce()
    expect(web).toHaveBeenCalledOnce()
    const guideLink = screen.getByRole('link', { name: /Guide/ })
    expect(guideLink.getAttribute('href')).toBe('/guide')
    expect(guideLink.getAttribute('target')).toBe('_blank')
    expect(guideLink.getAttribute('rel')).toBe('noreferrer')
    expect(guideLink.querySelector('button')).toBeNull()
    expect(guideLink.className).not.toContain('w-full')
    expect(guideLink.className).toContain('h-8')
    expect(guideLink.parentElement?.className).toContain('md:flex-nowrap')
    expect(screen.getByAltText('Smashers').getAttribute('loading')).toBe('eager')
    expect(screen.getByAltText('Smashers').getAttribute('fetchpriority')).toBe('high')
    expect(screen.getByAltText('Smashers').getAttribute('sizes')).toBe(
      '(min-width: 768px) 410px, 100vw'
    )
    expect(screen.getByAltText('Smashers').getAttribute('data-optimized-image')).toBe('true')

    rerender(
      <GameCard
        title="Custom"
        image="/custom.png"
        autoHeight
        contents={<div>Custom content</div>}
      />
    )
    expect(screen.getByText('Custom content')).not.toBeNull()

    rerender(
      <GameCard title="Actions" image="/actions.png" actions={<button>Custom action</button>} />
    )
    expect(screen.getByRole('button', { name: 'Custom action' })).not.toBeNull()
  })
})
