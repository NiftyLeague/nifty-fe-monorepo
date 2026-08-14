'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { X } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { cn } from '@nl/ui/utils'

import { useNavigation } from '@/contexts/NavigationContext'
import LogoSection from '../_LogoSection'

const appDrawerWidth = 260
const desktopAppHeaderHeight = 60
const compactAppHeaderHeight = 56

interface SidebarFrameProps extends PropsWithChildren {
  footer?: ReactNode
}

function SidebarFrame({ children, footer }: SidebarFrameProps) {
  const { drawerOpen, isDesktopNavigation, toggleDrawer } = useNavigation()
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
      id="app-primary-navigation"
      aria-label="Primary navigation"
      data-state={drawerOpen ? 'open' : 'closed'}
      className={cn('shrink-0', isCompactScreen ? 'w-0' : 'w-[260px]')}
    >
      {isCompactScreen && (
        <div
          className={cn(
            'fixed right-0 bottom-0 left-0 z-40 bg-black/50 transition-opacity',
            drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          )}
          aria-hidden={!drawerOpen}
          onClick={toggleDrawer}
          style={{ top: appHeaderHeight }}
        >
          <div
            className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 z-10 border-r-0"
            style={{ width: appDrawerWidth }}
            onClick={(event) => event.stopPropagation()}
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
