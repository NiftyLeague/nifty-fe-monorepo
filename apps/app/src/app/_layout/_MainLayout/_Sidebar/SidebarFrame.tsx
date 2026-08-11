'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { memo, useMemo } from 'react'

import { ScrollArea } from '@nl/ui/base/scroll-area'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'

import { useNavigation } from '@/contexts/NavigationContext'
import LogoSection from '../_LogoSection'

const appDrawerWidth = 260
const appHeaderHeight = 60

interface SidebarFrameProps extends PropsWithChildren {
  footer?: ReactNode
}

function SidebarFrame({ children, footer }: SidebarFrameProps) {
  const isSmallScreen = useMediaQuery('(max-width:1024px)')
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
          height: isSmallScreen ? 'calc(100vh - 56px)' : 'calc(100vh - 100px)',
        }}
        viewportClassName="px-4"
      >
        <div className="flex h-full flex-col justify-between">
          <div>{children}</div>
          {footer && <div className="flex flex-col items-center">{footer}</div>}
        </div>
      </ScrollArea>
    ),
    [children, footer, isSmallScreen]
  )

  return (
    <nav
      aria-label="Primary navigation"
      className={cn('shrink-0', isSmallScreen ? 'w-auto' : 'w-[260px]')}
    >
      {isSmallScreen && (
        <div
          className={cn(
            'fixed inset-0 z-50 transition-opacity',
            drawerOpen
              ? 'pointer-events-auto bg-black/50 opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          onClick={toggleDrawer}
        >
          <div
            className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 border-r-0"
            style={{ width: appDrawerWidth }}
            onClick={(event) => event.stopPropagation()}
          >
            {drawerOpen && logo}
            {drawerOpen && drawer}
          </div>
        </div>
      )}

      {!isSmallScreen && (
        <aside
          className={cn(
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200',
            !drawerOpen && '-translate-x-full'
          )}
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
