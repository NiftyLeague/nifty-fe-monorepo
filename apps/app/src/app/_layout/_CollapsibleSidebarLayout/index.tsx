import { Drawer, Stack } from '@mui/material';
import { useEffect, ReactNode, SetStateAction, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import { appHeaderHeight, useTheme } from '@nl/theme';

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
  const matchDownLG = useMediaQuery('(max-width:1024px)');

  // toggle sidebar
  const handleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(prevState => !prevState);
  }, [setIsDrawerOpen]);

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setIsDrawerOpen(!matchDownLG);
  }, [matchDownLG, setIsDrawerOpen]);

  return (
    <Stack direction="row" position="relative" sx={{ alignItems: 'start' }}>
      {/* Filter drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          marginLeft: '16px',
          flexShrink: 0,
          zIndex: isDrawerOpen ? 1100 : -1,
          ...(!matchDownLG && {
            position: 'fixed',
            // Follows how mainLayout sets the marginTop value
            // top: theme.typography.mainContent.marginTop || 108,
          }),
          '& .MuiDrawer-paper': {
            height: matchDownLG ? '100%' : 'auto',
            backgroundColor: 'var(--color-sidebar)',
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            border: 'none',
            borderRadius: 'var(--radius-default)',
          },
        }}
        variant={matchDownLG ? 'temporary' : 'persistent'}
        anchor="left"
        open={isDrawerOpen}
        ModalProps={{ keepMounted: true }}
        onClose={handleDrawerOpen}
      >
        <PerfectScrollbar
          style={{ height: matchDownLG ? '100vh' : `calc(100vh - ${appHeaderHeight + 100}px)`, padding: '20px 16px' }}
        >
          {renderDrawer()}
        </PerfectScrollbar>
      </Drawer>

      {/* Main grid */}
      <Stack
        component="div"
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
            marginLeft: `${matchDownLG ? 0 : drawerWidth}px`,
          }),
          [theme.breakpoints.down('lg')]: { paddingLeft: 0, marginLeft: 0 },
        }}
      >
        <PerfectScrollbar
          style={{
            padding: matchDownLG ? '10px 16px' : '16px 24px',
            height: `calc(100vh - ${appHeaderHeight + 100}px)`,
            borderRadius: '10px',
            backgroundColor: 'var(--color-sidebar)',
            marginRight: '24px',
          }}
        >
          {renderMain()}
        </PerfectScrollbar>
      </Stack>
    </Stack>
  );
};

export default CollapsibleSidebarLayout;
