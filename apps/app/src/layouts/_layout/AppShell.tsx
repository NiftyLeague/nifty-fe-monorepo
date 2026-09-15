'use client'

import { createEffect, type JSX } from 'solid-js'
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

interface AppShellProps {
  children?: JSX.Element
  header: JSX.Element
  sidebar: JSX.Element
  networkWarning?: JSX.Element
}

export default function AppShell(props: AppShellProps) {
  return (
    <NavigationProvider>
      <AppShellContent
        header={props.header}
        sidebar={props.sidebar}
        networkWarning={props.networkWarning}
      >
        {props.children}
      </AppShellContent>
    </NavigationProvider>
  )
}

function AppShellContent(props: AppShellProps) {
  const pathname = usePathname()
  const drawerOpen = useDrawerOpen()
  const isDesktopNavigation = useIsDesktopNavigation()
  const setDrawerOpen = useSetDrawerOpen()

  createEffect(() => {
    setDrawerOpen(isDesktopNavigation())
  })

  const isNoFilterPage = () => Boolean(pathname() && /(degens|dashboard\/degens)/.test(pathname()))

  return (
    <>
      <div class="flex" data-sidebar-open={drawerOpen()}>
        <header class="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
          {props.networkWarning}
          <AppBar>{props.header}</AppBar>
        </header>

        {props.sidebar}

        <main class={cx(styles.main, drawerOpen() ? styles.mainOpen : styles.mainClosed)}>
          <AppMainContent pathname={pathname()} isNoFilterPage={isNoFilterPage()}>
            {props.children}
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

const AppMainContent = (props: AppMainContentProps) => {
  const content = (
    <>
      <Breadcrumbs
        pathname={props.pathname}
        separator="chevron-right"
        navigation={navigation}
        icon
        title
        rightAlign
      />
      {props.children}
    </>
  )

  if (props.isNoFilterPage) return content

  return (
    <ScrollArea class="h-full" viewportClassName="py-5 md:py-10">
      <div class="container">{content}</div>
    </ScrollArea>
  )
}
