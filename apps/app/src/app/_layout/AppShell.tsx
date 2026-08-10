'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@nl/ui/utils'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { Toaster } from '@nl/ui/base/sonner'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import { openDrawer } from '@/store/slices/menu'
import { useDispatch, useSelector } from '@/store/hooks'
import Breadcrumbs from '@/components/extended/Breadcrumbs'
import Snackbar from '@/components/extended/Snackbar'
import navigation from '@/constants/menu-items'
import styles from './_MainLayout/MainLayout.module.css'

const container = true

interface AppShellProps extends PropsWithChildren {
  header: ReactNode
  sidebar: ReactNode
  networkWarning?: ReactNode
}

export default function AppShell({ children, header, sidebar, networkWarning }: AppShellProps) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const matchDownXL = useMediaQuery('(max-width:1280px)')
  const { drawerOpen } = useSelector((state) => state.menu)

  useEffect(() => {
    dispatch(openDrawer(!matchDownXL))
  }, [matchDownXL, dispatch])

  const isNoFilterPage = pathname && /(degens|dashboard\/degens)/.test(pathname)

  const content = (
    <>
      <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
      {children}
    </>
  )

  return (
    <>
      <div className="flex">
        <header
          className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar transition-[width]"
          style={{
            transition: drawerOpen ? 'width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms' : 'none',
          }}
        >
          {networkWarning}
          <div className="py-1 lg:py-0">{header}</div>
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
      <Snackbar />
      <Toaster position="top-right" closeButton richColors />
    </>
  )
}
