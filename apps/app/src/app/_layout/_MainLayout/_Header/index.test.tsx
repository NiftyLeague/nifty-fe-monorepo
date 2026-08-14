import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

const navigationState = {
  drawerOpen: true,
  isDesktopNavigation: false,
  toggleDrawer: mock(),
}

let Header: typeof import('./index').default

beforeEach(async () => {
  mock.module('@/contexts/NavigationContext', () => ({ useNavigation: () => navigationState }))
  mock.module('@/app/_layout/_MainLayout/_LogoSection', () => ({
    default: () => <span>Logo</span>,
  }))
  mock.module('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => null }))

  Header = (await import('./index')).default
})

afterEach(() => {
  navigationState.toggleDrawer.mockClear()
  mock.restore()
})

describe('private app header', () => {
  it('connects the sidebar toggle to the navigation landmark', () => {
    render(<Header />)

    const toggle = screen.getByRole('button', { name: 'toggle sidebar' })

    expect(toggle.getAttribute('aria-controls')).toBe('app-primary-navigation')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
  })
})
