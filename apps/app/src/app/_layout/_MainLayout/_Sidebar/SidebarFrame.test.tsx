import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

const navigationState = {
  drawerOpen: false,
  isDesktopNavigation: false,
  setDrawerOpen: mock(),
  toggleDrawer: mock(),
}

let SidebarFrame: typeof import('./SidebarFrame').default

beforeEach(async () => {
  navigationState.isDesktopNavigation = false
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
  navigationState.isDesktopNavigation = false
  navigationState.setDrawerOpen.mockClear()
  navigationState.toggleDrawer.mockClear()
  mock.restore()
})

describe('private sidebar frame', () => {
  it('exposes a controlled landmark while closed', () => {
    const { rerender } = render(<SidebarFrame>Navigation</SidebarFrame>)
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })

    expect(navigation.id).toBe('')
    expect(navigation.getAttribute('data-state')).toBe('closed')
    expect(screen.queryByRole('button', { name: 'Close sidebar' })).toBeNull()
    rerender(<SidebarFrame>Navigation updated</SidebarFrame>)
  })

  it('renders an accessible compact close action while open', async () => {
    navigationState.drawerOpen = true
    render(<SidebarFrame>Navigation</SidebarFrame>)

    fireEvent.click(await screen.findByRole('button', { name: 'Close sidebar' }))
    expect(navigationState.setDrawerOpen).toHaveBeenCalledWith(false)
  })

  it('renders the compact drawer backdrop below the app bar', async () => {
    navigationState.drawerOpen = true
    render(<SidebarFrame>Navigation</SidebarFrame>)

    await screen.findByRole('button', { name: 'Close sidebar' })
    const backdrop = document.querySelector('[data-slot="sheet-overlay"]')

    expect(backdrop).not.toBeNull()
    expect((backdrop as HTMLElement).className).toContain('bg-black/50')
    expect((backdrop as HTMLElement).style.top).toBe('56px')
  })

  it('keeps the compact drawer below the app bar', async () => {
    navigationState.drawerOpen = true
    render(<SidebarFrame>Navigation</SidebarFrame>)

    const panel = await screen.findByRole('dialog', { name: 'Primary navigation' })
    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    const scrollArea = panel.querySelector('[style*="height"]')

    expect((overlay as HTMLElement | null)?.style.top).toBe('56px')
    expect((scrollArea as HTMLElement | null)?.style.height).toBe('calc(100dvh - 56px)')
  })

  it('keeps the desktop drawer interactive only while open', () => {
    navigationState.isDesktopNavigation = true
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
