'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { X } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'

import { useNavigation } from '@/contexts/NavigationContext'
import { desktopNavigationMediaQuery } from '@/app/_layout/navigation-breakpoints'
import LogoSection from '../_LogoSection'

const appDrawerWidth = 260
const appHeaderHeight = 60

interface SidebarFrameProps extends PropsWithChildren {
  footer?: ReactNode
}

function SidebarFrame({ children, footer }: SidebarFrameProps) {
  const isDesktopNavigation = useMediaQuery(desktopNavigationMediaQuery)
  const isCompactScreen = !isDesktopNavigation
  const { drawerOpen, toggleDrawer } = useNavigation()

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
        style={{
          height: isCompactScreen ? 'calc(100vh - 56px)' : 'calc(100vh - 60px)',
        }}
        viewportClassName="px-4"
      >
        <div className="flex h-full flex-col justify-between">
          <div>{children}</div>
          {footer && <div className="flex flex-col items-center">{footer}</div>}
        </div>
      </ScrollArea>
    ),
    [children, footer, isCompactScreen]
  )

  return (
    <nav
      id="app-primary-navigation"
      aria-label="Primary navigation"
      data-state={drawerOpen ? 'open' : 'closed'}
      className={cn('shrink-0', isCompactScreen ? 'w-0' : 'w-[260px]')}
    >
      {isCompactScreen && (
        <div
          className={cn(
            'fixed top-14 right-0 bottom-0 left-0 z-40 transition-opacity',
            drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          )}
          aria-hidden={!drawerOpen}
        >
          {drawerOpen && (
            <button
              type="button"
              aria-label="Close sidebar by clicking outside"
              className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/50 p-0"
              onClick={toggleDrawer}
            />
          )}
          <div
            className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 z-10 border-r-0"
            style={{ width: appDrawerWidth }}
          >
            {drawerOpen && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close sidebar"
                className="absolute top-2 right-2 z-20 h-8 w-8"
                onClick={toggleDrawer}
              >
                <X aria-hidden="true" size={18} strokeWidth={1.5} />
              </Button>
            )}
            {drawerOpen && logo}
            {drawerOpen && drawer}
          </div>
        </div>
      )}

      {isDesktopNavigation && (
        <aside
          className={cn(
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
