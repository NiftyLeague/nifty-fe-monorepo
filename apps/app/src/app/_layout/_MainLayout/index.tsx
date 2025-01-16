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
import { useTheme, styled, appDrawerWidth, container } from '@nl/theme';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/InfoRounded';
import { AppBar, Box, Button, Container, Icon, Toolbar, Typography, useMediaQuery, Theme } from '@mui/material';
import { alpha } from '@mui/system';

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

interface MainStyleProps {
  theme: Theme;
  open: boolean;
}

// styles
const Main = styled<any>('main', {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme }: MainStyleProps) => ({
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
        marginTop: '80px',
        [theme.breakpoints.up('md')]: {
          marginLeft: -(appDrawerWidth - 20),
          width: `calc(100% - ${appDrawerWidth}px)`,
        },
        [theme.breakpoints.down('md')]: {
          marginLeft: '20px',
          width: `calc(100% - ${appDrawerWidth}px)`,
        },
        [theme.breakpoints.down('sm')]: {
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
        width: `calc(100% - ${appDrawerWidth}px)`,
        marginTop: '80px',
        [theme.breakpoints.down('md')]: {
          marginLeft: '20px',
        },
        [theme.breakpoints.down('sm')]: {
          marginTop: '60px',
          marginLeft: '10px',
        },
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
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
  const matchDownSm = useMediaQuery(theme.breakpoints.down('md'));
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const { drawerOpen } = useSelector(state => state.menu);

  useEffect(() => {
    dispatch(openDrawer(!matchDownMd));
  }, [matchDownMd, dispatch]);

  const header = useMemo(
    () => (
      <Toolbar sx={{ py: { xs: 1, md: 0 } }}>
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
            bgcolor: theme => theme.palette.background.default,
            transition: theme => (drawerOpen ? theme.transitions.create('width') : 'none'),
          }}
        >
          {address && TARGET_NETWORK.chainId !== chain?.id && (
            <Box
              sx={{
                display: 'flex',
                backgroundColor: theme =>
                  isConnectedToIMX ? alpha(theme.palette.success.dark, 0.8) : alpha(theme.palette.error.light, 0.8),
                width: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              height={50}
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
            <PerfectScrollbar
              style={{
                padding: matchDownSm ? '10px 20px' : '20px 40px',
                height: !matchUpMd ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)',
              }}
            >
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
