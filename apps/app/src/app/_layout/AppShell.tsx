'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@nl/ui/utils'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import Breadcrumbs from '@/components/extended/Breadcrumbs'
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import navigation from '@/constants/menu-items'
import { desktopNavigationMediaQuery } from './navigation-breakpoints'
import styles from './_MainLayout/MainLayout.module.css'

const container = true

interface AppShellProps extends PropsWithChildren {
  header: ReactNode
  sidebar: ReactNode
  networkWarning?: ReactNode
}

export default function AppShell({ children, header, sidebar, networkWarning }: AppShellProps) {
  return (
    <NavigationProvider>
      <AppShellContent header={header} sidebar={sidebar} networkWarning={networkWarning}>
        {children}
      </AppShellContent>
    </NavigationProvider>
  )
}

function AppShellContent({ children, header, sidebar, networkWarning }: AppShellProps) {
  const pathname = usePathname()
  const isDesktopNavigation = useMediaQuery(desktopNavigationMediaQuery)
  const { drawerOpen, setDrawerOpen } = useNavigation()

  useEffect(() => {
    setDrawerOpen(isDesktopNavigation)
  }, [isDesktopNavigation, setDrawerOpen])

  const isNoFilterPage = pathname && /(degens|dashboard\/degens)/.test(pathname)

  const content = (
    <>
      <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
      {children}
    </>
  )

  return (
    <>
      <div className="flex" data-sidebar-open={drawerOpen}>
        <header className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
          {networkWarning}
          <div className="flex min-h-14 w-full items-center px-4 py-2 lg:h-[60px] lg:min-h-0 lg:px-6 lg:py-0">
            {header}
          </div>
        </header>

        {sidebar}

        <main className={cn(styles.main, drawerOpen ? styles.mainOpen : styles.mainClosed)}>
          {!isNoFilterPage ? (
            <ScrollArea className="h-full" viewportClassName="py-5 md:py-10">
              {container ? <div className="container">{content}</div> : content}
            </ScrollArea>
          ) : (
            content
          )}
        </main>
      </div>
    </>
  )
}
