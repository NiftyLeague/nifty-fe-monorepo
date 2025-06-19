import { ForwardRefExoticComponent, RefAttributes, forwardRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// material-ui
import { useTheme } from '@nl/theme';
import { Avatar, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Chip from '@/components/extended/Chip';

// project imports
import useMediaQuery from '@nl/ui/hooks/useMediaQuery';
import { useDispatch, useSelector } from '@/store/hooks';
import { activeItem, openDrawer } from '@/store/slices/menu';

// types
import type { LinkTarget, NavItemType } from '@/types';
import type { IconProps } from '@tabler/icons-react';

interface NavItemProps {
  item: NavItemType;
  level: number;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: NavItemProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const matchesSM = useMediaQuery('(max-width:1024px)');
  const dispatch = useDispatch();
  const isSelected = pathname === item.url;

  const Icon = item?.icon as (props: IconProps) => React.ReactNode | undefined;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="20px" />
  ) : (
    <FiberManualRecordIcon
      sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget: LinkTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps: {
    component: ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string;
    href?: string;
    target?: LinkTarget;
  } = {
    // eslint-disable-next-line react/display-name
    component: forwardRef((props, ref) => <Link ref={ref} {...props} href={item.url!} target={itemTarget} />),
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id: string) => {
    dispatch(activeItem([id]));
    matchesSM && dispatch(openDrawer(false));
  };

  // active menu item when page load and route is changed
  useEffect(() => {
    if (pathname.toString().split('/').includes(item.id!)) {
      dispatch(activeItem([item.id!]));
    }
  }, [item.id, pathname, dispatch]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: 'var(--border-radius-default)',
        border: '1px solid transparent',
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        zIndex: 1,
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        '&:hover': { border: 'var(--border-purple)', backgroundColor: 'var(--color-background-3)' },
      }}
      selected={isSelected}
      onClick={() => itemHandler(item.id!)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight={isSelected ? 'bold' : 'normal'} sx={{ color: 'inherit' }}>
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          colorType={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
