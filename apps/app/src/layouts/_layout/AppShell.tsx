'use client'

import { type JSX } from 'solid-js'
import { createEffect } from 'solid-js'
import { usePathname } from '@/runtime/navigation'

import { cx } from '@nl/ui/class-names'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import AppBar from '@nl/ui/custom/app-bar'

import Breadcrumbs from '@/components/extended/Breadcrumbs'
import {
  NavigationProvider,
  useDrawerOpen,
  useIsDesktopNavigation,
  useSetDrawerOpen,
} from '@/contexts/NavigationContext'
import navigation from '@/constants/menu-items'
import styles from './_MainLayout/MainLayout.module.css'

interface AppShellProps { children?: JSX.Element; 
  header: JSX.Element
  sidebar: JSX.Element
  networkWarning?: JSX.Element
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
  const drawerOpen = useDrawerOpen()
  const isDesktopNavigation = useIsDesktopNavigation()
  const setDrawerOpen = useSetDrawerOpen()

  createEffect(() => {
    setDrawerOpen(isDesktopNavigation)
  }, [isDesktopNavigation, setDrawerOpen])

  const isNoFilterPage = Boolean(pathname && /(degens|dashboard\/degens)/.test(pathname))

  return (
    <>
      <div class="flex" data-sidebar-open={drawerOpen}>
        <header class="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
          {networkWarning}
          <AppBar>{header}</AppBar>
        </header>

        {sidebar}

        <main class={cx(styles.main, drawerOpen ? styles.mainOpen : styles.mainClosed)}>
          <AppMainContent pathname={pathname ?? ''} isNoFilterPage={isNoFilterPage}>
            {children}
          </AppMainContent>
        </main>
      </div>
    </>
  )
}

interface AppMainContentProps {
  children: JSX.Element
  isNoFilterPage: boolean
  pathname: string
}

const AppMainContent = (function AppMainContent({
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
    <ScrollArea class="h-full" viewportClassName="py-5 md:py-10">
      <div class="container">{content}</div>
    </ScrollArea>
  )
})
