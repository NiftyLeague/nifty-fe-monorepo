import { Drawer, Stack, useMediaQuery } from '@mui/material';
import { useEffect, ReactNode, SetStateAction, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTheme } from '@nl/theme';

interface Props {
  drawerWidth?: number;
  renderDrawer: () => ReactNode;
  renderMain: () => ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CollapsibleSidebarLayout = ({
  drawerWidth = 320,
  renderDrawer,
  renderMain,
  isDrawerOpen,
  setIsDrawerOpen,
}: Props): React.ReactNode => {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down('md'));
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  // toggle sidebar
  const handleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(prevState => !prevState);
  }, [setIsDrawerOpen]);

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setIsDrawerOpen(!matchDownSm);
  }, [matchDownSm, setIsDrawerOpen]);

  return (
    <Stack direction="row" position="relative" sx={{ alignItems: 'start' }}>
      {/* Filter drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: isDrawerOpen ? 1100 : -1,
          ...(!matchDownSm && {
            position: 'fixed',
            // Follows how mainLayout sets the marginTop value
            // top: theme.typography.mainContent.marginTop || 108,
          }),
          '& .MuiDrawer-paper': {
            height: matchDownSm ? '100%' : 'auto',
            backgroundColor: theme.palette.background.paper,
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            border: 'none',
          },
        }}
        variant={matchDownSm ? 'temporary' : 'persistent'}
        anchor="left"
        open={isDrawerOpen}
        ModalProps={{ keepMounted: true }}
        onClose={handleDrawerOpen}
      >
        <PerfectScrollbar style={{ height: matchDownSm ? '100vh' : 'calc(100vh - 152px)', padding: '20px 16px' }}>
          {renderDrawer()}
        </PerfectScrollbar>
      </Drawer>

      {/* Main grid */}
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          paddingLeft: isDrawerOpen ? theme.spacing(3) : 0,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isDrawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.shorter,
            }),
            marginLeft: `${matchDownSm ? 0 : drawerWidth}px`,
          }),
          [theme.breakpoints.down('md')]: { paddingLeft: 0, marginLeft: 0 },
        }}
      >
        <PerfectScrollbar
          style={{
            padding: matchDownSm ? '10px 16px' : '16px 24px',
            height: !matchUpMd ? 'calc(100vh - 280px)' : 'calc(100vh - 152px)',
          }}
        >
          {renderMain()}
        </PerfectScrollbar>
      </Stack>
    </Stack>
  );
};

export default CollapsibleSidebarLayout;
