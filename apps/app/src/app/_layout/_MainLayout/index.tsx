'use client';

// third party
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAccount, useSwitchChain } from 'wagmi';

// Redux
import { openDrawer } from '@/store/slices/menu';
import { useDispatch, useSelector } from '@/store/hooks';

// material-ui
import { IconChevronRight } from '@tabler/icons-react';
import { useTheme, styled, appDrawerWidth, appHeaderHeight, container } from '@nl/theme';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/InfoRounded';
import { AppBar, Box, Button, Container, Icon, Toolbar, Typography, useMediaQuery } from '@mui/material';

// React Toastify
import { ToastContainer } from 'react-toastify';

// project imports
import navigation from '@/constants/menu-items';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider';
import { TARGET_NETWORK } from '@/constants/networks';

// components
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
  useGoogleAnalytics();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const isConnectedToIMX = useConnectedToIMXCheck();

  const theme = useTheme();
  const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
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
    if (container) {
      return (
        <Container maxWidth="lg">
          <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
          {children}
        </Container>
      );
    }
    return (
      <>
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
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
              <Icon sx={{ width: 24, height: 24, display: 'flex' }}>
                {isConnectedToIMX ? (
                  <InfoIcon sx={{ width: 'inherit', height: 'inherit' }} />
                ) : (
                  <WarningIcon sx={{ width: 'inherit', height: 'inherit' }} />
                )}
              </Icon>
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
            <PerfectScrollbar style={{ padding: matchDownLG ? '10px 20px' : '20px 40px' }}>
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
