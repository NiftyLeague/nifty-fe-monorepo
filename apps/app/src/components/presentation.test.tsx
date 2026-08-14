import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'
import type { ComponentProps } from 'react'

let GameCard: typeof import('./cards/GameCard').default
let MainCard: typeof import('./cards/MainCard').default
let SubCard: typeof import('./cards/SubCard').default
let Breadcrumbs: typeof import('./extended/Breadcrumbs').default

beforeEach(async () => {
  mock.module('next/image', () => ({
    default: ({
      fill: _fill,
      sizes: _sizes,
      alt,
      ...props
    }: ComponentProps<'img'> & { fill?: boolean }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ''} {...props} />
    ),
  }))
  mock.module('@/components/AppNavIcon', () => ({
    AppNavIcon: ({ name }: { name: string }) => <span data-icon={name}>{name}</span>,
  }))
  mock.module('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => <span>external</span> }))
  window.history.replaceState({}, '', '/')

  const gameCard = await import('./cards/GameCard')
  const mainCard = await import('./cards/MainCard')
  const subCard = await import('./cards/SubCard')
  const breadcrumbs = await import('./extended/Breadcrumbs')

  GameCard = gameCard.default
  MainCard = mainCard.default
  SubCard = subCard.default
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

  it('resolves nested routes and renders the full title and icon variants', async () => {
    const originalLoc = document.location
    const loc = { pathname: '/profile' } as Location
    Object.defineProperty(document, 'location', { value: loc, writable: true, configurable: true })
    const { rerender } = render(
      <Breadcrumbs
        navigation={navigation as never}
        card={false}
        icons
        rightAlign
        title
        separator="chevron-right"
      />
    )

    expect(await screen.findAllByText('Profile')).toHaveLength(2)
    expect(screen.getByText('Settings')).not.toBeNull()
    expect(screen.getByText('Dashboard')).not.toBeNull()
    expect(screen.getAllByText('chevron-right')).toHaveLength(2)

    rerender(
      <Breadcrumbs
        navigation={navigation as never}
        card={false}
        divider={false}
        icon
        title
        titleBottom
        maxItems={3}
      />
    )
    expect(screen.getByText('house')).not.toBeNull()
    expect(screen.getAllByText('Profile')).toHaveLength(2)

    Object.defineProperty(document, 'location', {
      value: originalLoc,
      writable: true,
      configurable: true,
    })
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
    const { container, rerender } = render(<Breadcrumbs navigation={hiddenNavigation as never} />)
    await Promise.resolve()
    expect(container.querySelector('[aria-label="breadcrumb"]')).toBeNull()

    window.history.replaceState({}, '', '/missing')
    rerender(<Breadcrumbs navigation={navigation as never} />)
    expect(container.querySelector('[aria-label="breadcrumb"]')).toBeNull()
  })
})

describe('card presentation', () => {
  it('restores the app card spacing contract over shadcn defaults', () => {
    const { container, rerender } = render(
      <MainCard title="Main" secondary="Action">
        Main body
      </MainCard>
    )

    const mainCard = container.querySelector('[data-slot="card"]')
    expect(mainCard?.className).toContain('gap-0')
    expect(mainCard?.className).toContain('py-0')
    expect(mainCard?.querySelector('[data-slot="card-header"]')?.className).toContain('p-4')
    expect(mainCard?.querySelector('[data-slot="card-content"]')?.className).toContain('p-4')

    rerender(
      <SubCard title="Sub" secondary="Action">
        Sub body
      </SubCard>
    )

    const subCard = container.querySelector('[data-slot="card"]')
    expect(subCard?.className).toContain('gap-0')
    expect(subCard?.className).toContain('py-0')
  })

  it('renders all MainCard and SubCard content modes in light and dark themes', () => {
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

    rerender(
      <SubCard title="Sub" secondary="Action">
        Sub body
      </SubCard>
    )
    expect(screen.getByText('Sub body')).not.toBeNull()

    rerender(
      <SubCard title="Dark sub" darkTitle content={false}>
        Raw sub body
      </SubCard>
    )
    expect(screen.getByText('Raw sub body')).not.toBeNull()
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
    expect(guideLink.querySelector('button')).toBeNull()
    expect(screen.getByAltText('Smashers').getAttribute('loading')).toBe('eager')
    expect(screen.getByAltText('Smashers').getAttribute('fetchpriority')).toBe('high')

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
