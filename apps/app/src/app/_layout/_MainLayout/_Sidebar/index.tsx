import { memo, useMemo } from 'react';

// material-ui
import { useTheme, appDrawerWidth, appHeaderHeight } from '@nl/theme';
import { Drawer, useMediaQuery, Stack, Box } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuList from './_MenuList';
import LogoSection from '../_LogoSection';
import { openDrawer } from '@/store/slices/menu';
import { useDispatch, useSelector } from '@/store/hooks';
import UserProfile from './_UserProfile';
import LogoutButton from './_LogoutButton';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector(state => state.menu);

  const logo = useMemo(
    () => (
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
    ),
    [],
  );

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 100px)',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <Stack sx={{ justifyContent: 'space-between', height: '100%' }}>
          <Box>
            <UserProfile />
            <MenuList />
          </Box>
          <Stack sx={{ alignItems: 'center' }}>
            <LogoutButton sx={{ marginBottom: 3, width: '85%' }} />
          </Stack>
        </Stack>
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchUpMd],
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? appDrawerWidth : 'auto' }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={() => dispatch(openDrawer(!drawerOpen))}
        sx={{
          '& .MuiDrawer-paper': {
            width: appDrawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: appHeaderHeight,
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawerOpen && logo}
        {drawerOpen && drawer}
      </Drawer>
    </Box>
  );
};

export default memo(Sidebar);
