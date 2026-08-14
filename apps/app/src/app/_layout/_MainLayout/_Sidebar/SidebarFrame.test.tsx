import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

const navigationState = {
  drawerOpen: false,
  toggleDrawer: mock(),
}

let isDesktopNavigation = false

let SidebarFrame: typeof import('./SidebarFrame').default

beforeEach(async () => {
  isDesktopNavigation = false
  mock.module('@nl/ui/hooks/useMediaQuery', () => ({
    useMediaQuery: () => isDesktopNavigation,
  }))
  mock.module('@/contexts/NavigationContext', () => ({ useNavigation: () => navigationState }))
  mock.module('@nl/ui/base/scroll-area', () => ({
    ScrollArea: ({
      children,
      viewportClassName: _viewportClassName,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  }))
  mock.module('../_LogoSection', () => ({ default: () => <span>Logo</span> }))

  SidebarFrame = (await import('./SidebarFrame')).default
})

afterEach(() => {
  navigationState.drawerOpen = false
  navigationState.toggleDrawer.mockClear()
  mock.restore()
})

describe('private sidebar frame', () => {
  it('exposes a controlled landmark while closed', () => {
    const { rerender } = render(<SidebarFrame>Navigation</SidebarFrame>)
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })

    expect(navigation.id).toBe('app-primary-navigation')
    expect(navigation.getAttribute('data-state')).toBe('closed')
    expect(screen.queryByRole('button', { name: 'Close sidebar' })).toBeNull()
    rerender(<SidebarFrame>Navigation updated</SidebarFrame>)
  })

  it('renders an accessible compact close action while open', () => {
    navigationState.drawerOpen = true
    render(<SidebarFrame>Navigation</SidebarFrame>)
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })

    expect(navigation.getAttribute('data-state')).toBe('open')
    fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }))
    expect(navigationState.toggleDrawer).toHaveBeenCalledOnce()
  })

  it('keeps the compact drawer below the app bar', () => {
    navigationState.drawerOpen = true
    render(<SidebarFrame>Navigation</SidebarFrame>)

    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    const overlay = navigation.querySelector('[aria-hidden="false"]')

    expect((overlay as HTMLElement | null)?.style.top).toBe('60px')
  })

  it('keeps the desktop drawer interactive only while open', () => {
    isDesktopNavigation = true
    navigationState.drawerOpen = true
    const { rerender } = render(<SidebarFrame>Navigation</SidebarFrame>)

    const drawer = screen.getByRole('complementary')
    expect(drawer.className).toContain('pointer-events-auto')
    expect(drawer.className).toContain('translate-x-0')

    navigationState.drawerOpen = false
    rerender(<SidebarFrame>Navigation updated</SidebarFrame>)
    expect(drawer.className).toContain('pointer-events-none')
    expect(drawer.className).toContain('-translate-x-full')
  })
})
