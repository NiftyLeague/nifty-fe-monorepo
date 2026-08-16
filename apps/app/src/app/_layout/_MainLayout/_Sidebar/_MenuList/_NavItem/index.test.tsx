import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { NavItemType } from '@/types'

describe('private navigation item', () => {
  let NavItem: typeof import('./index').default

  beforeEach(async () => {
    mock.module('next/link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('next/navigation', () => ({ usePathname: () => '/dashboard' }))
    mock.module('@/components/AppNavIcon', () => ({ AppNavIcon: () => null }))
    mock.module('@/contexts/NavigationContext', () => ({
      useNavigation: () => ({
        isDesktopNavigation: true,
        setDrawerOpen: () => undefined,
      }),
    }))

    NavItem = (await import('./index')).default
  })

  it('disables automatic prefetching for persistent sidebar links', () => {
    const item: NavItemType = { type: 'item', title: 'Dashboard', url: '/dashboard' }

    render(<NavItem item={item} level={0} />)

    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('data-prefetch')).toBe(
      'false'
    )
  })
})
