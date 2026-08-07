'use client'

// third party
import { type PropsWithChildren, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAccount, useSwitchChain } from 'wagmi'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Redux
import { openDrawer } from '@/store/slices/menu'
import { useDispatch, useSelector } from '@/store/hooks'

// material-ui
import { appHeaderHeight, container } from '@nl/theme'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'

// React Toastify
import { ToastContainer } from 'react-toastify'

// project imports
import { cn } from '@nl/ui/utils'
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
      <Toolbar sx={{ py: { xs: 1, lg: 0 } }}>
        <Header />
      </Toolbar>
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
      <Box sx={{ display: 'flex' }}>
        {/* header */}
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: 'var(--color-sidebar)',
            transition: (theme) => (drawerOpen ? theme.transitions.create('width') : 'none'),
          }}
        >
          {address && TARGET_NETWORK.chainId !== chain?.id && (
            <Box
              className={isConnectedToIMX ? 'bg-success-dark/[80%]' : 'bg-error/[80%]'}
              sx={{
                height: appHeaderHeight,
                zIndex: 1,
                display: 'flex',
                width: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name={isConnectedToIMX ? 'info' : 'triangle-alert'}
                size="lg"
                strokeWidth={2.5}
              />

              <Typography sx={{ px: 2, fontSize: 20, fontWeight: 600 }}>
                {isConnectedToIMX
                  ? `You're connected to Immutable zkEVM! Switch back to ${TARGET_NETWORK.label}`
                  : `Please switch to ${TARGET_NETWORK.label}`}
              </Typography>
              <Button
                sx={{ padding: '2px 16px' }}
                variant="contained"
                onClick={() => switchChain?.({ chainId: TARGET_NETWORK.chainId })}
              >
                Switch
              </Button>
            </Box>
          )}
          {header}
        </AppBar>

        {/* drawer */}
        <Sidebar />

        {/* main content */}
        <main className={cn(styles.main, drawerOpen ? styles.mainOpen : styles.mainClosed)}>
          {!isNoFilterPage ? (
            <PerfectScrollbar className={cn('py-5 md:py-10', !container && 'px-5 md:px-20')}>
              {getContent()}
            </PerfectScrollbar>
          ) : (
            getContent()
          )}
        </main>
      </Box>
      <Snackbar />
      <ToastContainer closeOnClick draggable />
    </>
  )
}

export default MainLayout
