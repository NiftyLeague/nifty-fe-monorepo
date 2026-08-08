import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

let GameCard: typeof import('./cards/GameCard').default
let MainCard: typeof import('./cards/MainCard').default
let SubCard: typeof import('./cards/SubCard').default
let Breadcrumbs: typeof import('./extended/Breadcrumbs').default

beforeEach(async () => {
  mock.module('@nl/ui/base/icon', () => ({
    Icon: ({ name }: { name: string }) => <span data-icon={name}>{name}</span>,
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
        isComingSoon
        required="Wallet required"
        showMore
        onPlayOnDesktopClick={desktop}
        onPlayOnWebClick={web}
      />
    )
    fireEvent.click(screen.getByText('more..'))
    fireEvent.click(screen.getByRole('button', { name: 'Play on Desktop' }))
    fireEvent.click(screen.getByRole('button', { name: 'Play on Web' }))
    expect(desktop).toHaveBeenCalledOnce()
    expect(web).toHaveBeenCalledOnce()
    expect(screen.getByRole('link', { name: /Guide/ })?.getAttribute('href')).toBe('/guide')

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
