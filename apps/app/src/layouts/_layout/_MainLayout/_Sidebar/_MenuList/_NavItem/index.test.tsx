import { render, screen } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { NavItemType } from '@/types'
import type { JSX } from 'solid-js'

describe('private navigation item', () => {
  let NavItem: typeof import('./index').default

  beforeEach(async () => {
    mock.module('@/runtime/Link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('@/runtime/navigation', () => ({ usePathname: () => () => '/dashboard' }))
    mock.module('@/components/AppNavIcon', () => ({ AppNavIcon: () => null }))
    mock.module('@/contexts/NavigationContext', () => ({
      useIsDesktopNavigation: () => true,
      useSetDrawerOpen: () => () => undefined,
    }))

    NavItem = (await import('./index')).default
  })

  it('leaves sidebar preloading to the router intent default', () => {
    const item: NavItemType = { type: 'item', title: 'Dashboard', url: '/dashboard' }

    render(() => <NavItem item={item} level={0} />)

    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('data-prefetch')).toBe(
      'undefined'
    )
  })
})
