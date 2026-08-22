'use client'

import { memo, type PropsWithChildren, type ReactNode } from 'react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { cx } from '@nl/ui/class-names'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import AppBar from '@nl/ui/custom/app-bar'

import Breadcrumbs from '@/components/extended/Breadcrumbs'
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import navigation from '@/constants/menu-items'
import styles from './_MainLayout/MainLayout.module.css'

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
  const { drawerOpen, isDesktopNavigation, setDrawerOpen } = useNavigation()

  useEffect(() => {
    setDrawerOpen(isDesktopNavigation)
  }, [isDesktopNavigation, setDrawerOpen])

  const isNoFilterPage = Boolean(pathname && /(degens|dashboard\/degens)/.test(pathname))

  return (
    <>
      <div className="flex" data-sidebar-open={drawerOpen}>
        <header className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
          {networkWarning}
          <AppBar>{header}</AppBar>
        </header>

        {sidebar}

        <main className={cx(styles.main, drawerOpen ? styles.mainOpen : styles.mainClosed)}>
          <AppMainContent pathname={pathname ?? ''} isNoFilterPage={isNoFilterPage}>
            {children}
          </AppMainContent>
        </main>
      </div>
    </>
  )
}

interface AppMainContentProps {
  children: ReactNode
  isNoFilterPage: boolean
  pathname: string
}

const AppMainContent = memo(function AppMainContent({
  children,
  isNoFilterPage,
  pathname,
}: AppMainContentProps) {
  const content = (
    <>
      <Breadcrumbs
        pathname={pathname}
        separator="chevron-right"
        navigation={navigation}
        icon
        title
        rightAlign
      />
      {children}
    </>
  )

  if (isNoFilterPage) return content

  return (
    <ScrollArea className="h-full" viewportClassName="py-5 md:py-10">
      <div className="container">{content}</div>
    </ScrollArea>
  )
})
