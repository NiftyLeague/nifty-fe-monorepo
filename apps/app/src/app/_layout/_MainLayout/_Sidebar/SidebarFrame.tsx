'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { memo, useMemo } from 'react'

import { ScrollArea } from '@nl/ui/base/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@nl/ui/base/sheet'
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
      className={cn('shrink-0', isCompactScreen ? 'w-0' : 'w-[260px]')}
    >
      {isCompactScreen && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent
            id="app-primary-navigation"
            side="left"
            aria-label="Primary navigation"
            closeLabel="Close sidebar"
            closeClassName="top-2 right-2 z-20 h-8 w-8 opacity-100 hover:opacity-100"
            overlayClassName="bg-black/50"
            overlayStyle={{ top: appHeaderHeight }}
            className="w-[260px] max-w-[260px] gap-0 border-r-0 bg-sidebar p-0 text-sidebar-foreground"
            style={{ top: appHeaderHeight, bottom: 0, height: 'auto' }}
          >
            <SheetTitle className="sr-only">Primary navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate through the private app
            </SheetDescription>
            {logo}
            {drawer}
          </SheetContent>
        </Sheet>
      )}

      {isDesktopNavigation && (
        <aside
          id="app-primary-navigation"
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
