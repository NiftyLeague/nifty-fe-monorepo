// material-ui
import { useTheme, appHeaderHeight } from '@nl/theme';
import { Avatar, Box, Stack, Link } from '@mui/material';

import { useDispatch, useSelector } from '@/store/hooks';
import { openDrawer } from '@/store/slices/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import AddNFTL from './AddNFTLToMetamask';
import ExternalIcon from '@/components/ExternalIcon';
import LogoSection from '../_LogoSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const pages = [
  { name: 'Website', link: 'https://niftyleague.com/' },
  { name: 'Mobile Smashers', link: 'https://niftysmashers.com/' },
  { name: 'Docs', link: 'https://niftyleague.com/docs' },
] as { name: string; link: string }[];

const Header = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector(state => state.menu);

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: 'space-between', [theme.breakpoints.up('md')]: { height: appHeaderHeight }, width: '100%' }}
    >
      {/* logo & toggler button */}
      <Box
        sx={{ width: drawerOpen ? 228 : 80, display: 'flex', [theme.breakpoints.down('md')]: { width: 'auto' } }}
        alignItems="center"
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            background: 'var(--color-background-3)',
            color: 'var(--color-blue)',
            '&:hover': { background: 'var(--color-purple)', color: 'var(--color-foreground)' },
          }}
          onClick={() => dispatch(openDrawer(!drawerOpen))}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', gap: 4, alignItems: 'center' }}>
        <AddNFTL />
        {pages.map(page => (
          <Link
            key={page.name}
            href={page.link}
            target="_blank"
            color="var(--color-foreground)"
            underline="hover"
            className="flex flex-nowrap gap-2"
          >
            {page.name}{' '}
            <span className="mt-0.5">
              <ExternalIcon />
            </span>
          </Link>
        ))}
      </Box>
    </Stack>
  );
};

export default Header;
