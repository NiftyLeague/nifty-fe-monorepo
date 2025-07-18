'use client';

// third party
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { useAccount, useSwitchChain } from 'wagmi';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Redux
import { openDrawer } from '@/store/slices/menu';
import { useDispatch, useSelector } from '@/store/hooks';

// material-ui
import { styled, appDrawerWidth, appHeaderHeight, container } from '@nl/theme';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

// React Toastify
import { ToastContainer } from 'react-toastify';

// project imports
import { cn } from '@nl/ui/utils';
import { gtm } from '@nl/ui/gtm';
import useMediaQuery from '@nl/ui/hooks/useMediaQuery';
import navigation from '@/constants/menu-items';
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider';
import { TARGET_NETWORK } from '@/constants/networks';

// components
import Icon from '@nl/ui/base/Icon';
import Breadcrumbs from '@/components/extended/Breadcrumbs';
import Snackbar from '@/components/extended/Snackbar';
import Header from './_Header';
import Sidebar from './_Sidebar';

// styles
const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{ open: boolean }>(({ theme }) => ({
  ...theme.typography.mainContent,

  variants: [
    {
      props: ({ open }: { open: boolean }) => !open,

      style: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.shorter,
        }),
        marginTop: appHeaderHeight,
        height: `calc(100vh - ${appHeaderHeight}px)`,
        [theme.breakpoints.up('lg')]: { marginLeft: -appDrawerWidth, width: `calc(100% - ${appDrawerWidth}px)` },
        [theme.breakpoints.down('lg')]: { marginLeft: '20px', width: `calc(100% - ${appDrawerWidth}px)` },
        [theme.breakpoints.down('md')]: {
          marginTop: '60px',
          marginLeft: '10px',
          width: `calc(100% - ${appDrawerWidth}px)`,
        },
      },
    },
    {
      props: ({ open }: { open: boolean }) => open,

      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.shorter,
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginTop: appHeaderHeight,
        height: `calc(100vh - ${appHeaderHeight}px)`,
        width: `calc(100% - ${appDrawerWidth}px)`,
        [theme.breakpoints.down('lg')]: { marginLeft: '20px' },
        [theme.breakpoints.down('md')]: { marginTop: '60px', marginLeft: '10px' },
      },
    },
  ],
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }: PropsWithChildren) => {
  useReportWebVitals(metric => gtm.sendWebVitals(metric));
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const isConnectedToIMX = useConnectedToIMXCheck();

  const matchDownXL = useMediaQuery('(max-width:1280px)');
  const { drawerOpen } = useSelector(state => state.menu);

  useEffect(() => {
    dispatch(openDrawer(!matchDownXL));
  }, [matchDownXL, dispatch]);

  const header = useMemo(
    () => (
      <Toolbar sx={{ py: { xs: 1, lg: 0 } }}>
        <Header />
      </Toolbar>
    ),
    [],
  );
  const isNoFilterPage = pathname && /(degens|dashboard\/degens)/.test(pathname);

  const getContent = () => {
    if (container && !isNoFilterPage) {
      return (
        <div className="container">
          <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
          {children}
        </div>
      );
    }
    return (
      <>
        <Breadcrumbs separator="chevron-right" navigation={navigation} icon title rightAlign />
        {children}
      </>
    );
  };

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
            bgcolor: 'var(--color-background-2)',
            transition: theme => (drawerOpen ? theme.transitions.create('width') : 'none'),
          }}
        >
          {address && TARGET_NETWORK.chainId !== chain?.id && (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className={isConnectedToIMX ? 'bg-success-dark/[80%]' : 'bg-error/[80%]'}
              height={appHeaderHeight}
              zIndex={1}
            >
              <Icon name={isConnectedToIMX ? 'info' : 'triangle-alert'} size="lg" strokeWidth={2.5} />

              <Typography px={2} fontSize={20} fontWeight={600}>
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
        <Main open={drawerOpen}>
          {!isNoFilterPage ? (
            <PerfectScrollbar className={cn('py-5 md:py-10', !container && 'px-5 md:px-20')}>
              {getContent()}
            </PerfectScrollbar>
          ) : (
            getContent()
          )}
        </Main>
      </Box>

      <Snackbar />

      <ToastContainer closeOnClick draggable />
    </>
  );
};

export default MainLayout;
