import { render } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { createSignal, type JSX } from 'solid-js'

const [drawerOpen, setDrawerOpen] = createSignal(false)
let breadcrumbRenderCount = 0

beforeEach(() => {
  setDrawerOpen(false)
  breadcrumbRenderCount = 0

  mock.module('@/runtime/navigation', () => ({ usePathname: () => () => '/dashboard' }))
  mock.module('@nl/ui/base/scroll-area', () => ({
    ScrollArea: ({ children }: { children?: JSX.Element }) => (
      <div data-scroll-area>{children}</div>
    ),
  }))
  mock.module('@nl/ui/custom/app-bar', () => ({
    default: ({ children }: { children?: JSX.Element }) => <div data-app-bar>{children}</div>,
  }))
  mock.module('@nl/ui/class-names', () => ({
    cx: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
  }))
  mock.module('@/components/extended/Breadcrumbs', () => ({
    default: () => {
      breadcrumbRenderCount += 1
      return <div data-breadcrumbs />
    },
  }))
  mock.module('@/constants/menu-items', () => ({ default: [] }))
  mock.module('@/contexts/NavigationContext', () => ({
    NavigationProvider: ({ children }: { children?: JSX.Element }) => children,
    useDrawerOpen: () => drawerOpen,
    useIsDesktopNavigation: () => () => false,
    useSetDrawerOpen: () => mock(),
  }))
})

afterEach(() => {
  mock.restore()
})

describe('app shell rendering', () => {
  it('does not rebuild the main content when only the drawer changes', async () => {
    const AppShell = (await import('./AppShell')).default
    const header = <div data-header />
    const sidebar = <aside data-sidebar />
    const children = <p>Dashboard</p>

    const view = render(() => (
      <AppShell header={header} sidebar={sidebar}>
        {children}
      </AppShell>
    ))

    expect(breadcrumbRenderCount).toBe(1)
    expect(view.container.querySelector('[data-scroll-area]')).not.toBeNull()

    // Solid updates the signal in place; the shell must not remount content.
    setDrawerOpen(true)

    expect(breadcrumbRenderCount).toBe(1)
    expect(view.container.querySelector('[data-sidebar-open="true"]')).not.toBeNull()
    expect(view.container.textContent).toContain('Dashboard')
  })
})
