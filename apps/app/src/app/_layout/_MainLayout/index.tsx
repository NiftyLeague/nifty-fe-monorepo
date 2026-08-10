'use client'

// third party
import { type PropsWithChildren, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAccount, useSwitchChain } from 'wagmi'

// Redux
import { openDrawer } from '@/store/slices/menu'
import { useDispatch, useSelector } from '@/store/hooks'

// project imports
import { cn } from '@nl/ui/utils'
import { Button } from '@nl/ui/base/button'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { Toaster } from '@nl/ui/base/sonner'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import navigation from '@/constants/menu-items'
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider'
import { TARGET_NETWORK } from '@/constants/networks'

// components
import { Icon } from '@nl/ui/base/icon'
import Breadcrumbs from '@/components/extended/Breadcrumbs'
import Snackbar from '@/components/extended/Snackbar'
import Header from './_Header'
import Sidebar from './_Sidebar'
import styles from './MainLayout.module.css'

const appHeaderHeight = 60
const container = true

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const isConnectedToIMX = useConnectedToIMXCheck()

  const matchDownXL = useMediaQuery('(max-width:1280px)')
  const { drawerOpen } = useSelector((state) => state.menu)

  useEffect(() => {
    dispatch(openDrawer(!matchDownXL))
  }, [matchDownXL, dispatch])

  const header = useMemo(
    () => (
      <div className="py-1 lg:py-0">
        <Header />
      </div>
    ),
    []
  )
  const isNoFilterPage = pathname && /(degens|dashboard\/degens)/.test(pathname)

  const getContent = () => {
    if (container && !isNoFilterPage) {
      return (
        <div className="container">
          <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
          {children}
        </div>
      )
    }
    return (
      <>
        <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
        {children}
      </>
    )
  }

  return (
    <>
      <div className="flex">
        {/* header */}
        <header
          className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar transition-[width]"
          style={{
            transition: drawerOpen ? 'width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms' : 'none',
          }}
        >
          {address && TARGET_NETWORK.chainId !== chain?.id && (
            <div
              className={
                isConnectedToIMX
                  ? 'bg-success-dark/[80%] flex h-[60px] w-full items-center justify-center'
                  : 'bg-error/[80%] flex h-[60px] w-full items-center justify-center'
              }
              style={{ zIndex: 1, position: 'absolute' }}
            >
              <Icon
                name={isConnectedToIMX ? 'info' : 'triangle-alert'}
                size="lg"
                strokeWidth={2.5}
              />

              <span className="px-2 text-xl font-semibold">
                {isConnectedToIMX
                  ? `You're connected to Immutable zkEVM! Switch back to ${TARGET_NETWORK.label}`
                  : `Please switch to ${TARGET_NETWORK.label}`}
              </span>
              <Button
                className="px-4 py-0.5"
                variant="default"
                onClick={() => switchChain?.({ chainId: TARGET_NETWORK.chainId })}
              >
                Switch
              </Button>
            </div>
          )}
          {header}
        </header>

        {/* drawer */}
        <Sidebar />

        {/* main content */}
        <main className={cn(styles.main, drawerOpen ? styles.mainOpen : styles.mainClosed)}>
          {!isNoFilterPage ? (
            <ScrollArea
              className="h-full"
              viewportClassName={cn('py-5 md:py-10', !container && 'px-5 md:px-20')}
            >
              {getContent()}
            </ScrollArea>
          ) : (
            getContent()
          )}
        </main>
      </div>
      <Snackbar />
      <Toaster position="top-right" closeButton richColors />
    </>
  )
}

export default MainLayout
