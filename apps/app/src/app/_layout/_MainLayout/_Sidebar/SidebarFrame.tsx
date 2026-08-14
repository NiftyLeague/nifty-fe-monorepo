'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { lazy, memo, Suspense, useMemo } from 'react'

import { ScrollArea } from '@nl/ui/base/scroll-area'
import { cx } from '@nl/ui/class-names'

import { useNavigation } from '@/contexts/NavigationContext'
import LogoSection from '../_LogoSection'

const appDrawerWidth = 260
const desktopAppHeaderHeight = 60
const compactAppHeaderHeight = 56

const MobileSidebarSheet = lazy(() => import('./MobileSidebarSheet'))

interface SidebarFrameProps extends PropsWithChildren {
  footer?: ReactNode
}

function SidebarFrame({ children, footer }: SidebarFrameProps) {
  const { drawerOpen, isDesktopNavigation, setDrawerOpen } = useNavigation()
  const isCompactScreen = !isDesktopNavigation
  const appHeaderHeight = isCompactScreen ? compactAppHeaderHeight : desktopAppHeaderHeight

  const logo = useMemo(
    () => (
      <div className="block lg:hidden">
        <div className="mx-auto flex p-2">
          <LogoSection />
        </div>
      </div>
    ),
    []
  )

  const drawer = useMemo(
    () => (
      <ScrollArea
        style={{ height: `calc(100dvh - ${appHeaderHeight}px)` }}
        viewportClassName="px-4"
      >
        <div className="flex h-full flex-col justify-between">
          <div>{children}</div>
          {footer && <div className="flex flex-col items-center">{footer}</div>}
        </div>
      </ScrollArea>
    ),
    [appHeaderHeight, children, footer]
  )

  return (
    <nav
      aria-label="Primary navigation"
      data-state={drawerOpen ? 'open' : 'closed'}
      className={cx('shrink-0', isCompactScreen ? 'w-0' : 'w-[260px]')}
    >
      {isCompactScreen && drawerOpen && (
        <Suspense fallback={null}>
          <MobileSidebarSheet
            appHeaderHeight={appHeaderHeight}
            drawer={drawer}
            logo={logo}
            onOpenChange={setDrawerOpen}
            open={drawerOpen}
          />
        </Suspense>
      )}

      {isDesktopNavigation && (
        <aside
          id="app-primary-navigation"
          className={cx(
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200',
            drawerOpen
              ? 'pointer-events-auto translate-x-0'
              : 'pointer-events-none -translate-x-full'
          )}
          aria-hidden={!drawerOpen}
          style={{ width: appDrawerWidth, top: appHeaderHeight }}
        >
          {drawerOpen && logo}
          {drawerOpen && drawer}
        </aside>
      )}
    </nav>
  )
}

export default memo(SidebarFrame)
