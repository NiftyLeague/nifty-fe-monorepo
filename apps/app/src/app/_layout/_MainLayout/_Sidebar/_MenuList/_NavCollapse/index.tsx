'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// material-ui
import { useTheme, borderRadius } from '@nl/theme';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// project imports
import NavItem from '../_NavItem';
import { NavGroupProps } from '../_NavGroup';

// assets
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

interface NavCollapseProps {
  menu: NavGroupProps['item'];
  level: number;
}

const NavCollapse = ({ menu, level }: NavCollapseProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null | undefined>(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
  };

  const pathname = usePathname();

  useEffect(() => {
    const children = menu?.children || [];
    children.forEach((item: NavGroupProps['item']) => {
      if (pathname && pathname.includes('product-details')) {
        if (item.url && item.url.includes('product-details')) {
          setOpen(true);
        }
      }
      if (item.url === pathname) {
        setOpen(true);
      }
    });
  }, [pathname, menu?.children]);

  // menu collapse & item
  const menus = (menu?.children || []).map(item => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" sx={{ color: theme => theme.palette.error.main }} align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon!;
  const menuIcon = menu.icon ? (
    <Icon strokeWidth={1.5} size={20} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6,
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${borderRadius}px`,
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body1"
              fontWeight={selected === menu.id ? 'bold' : 'normal'}
              color="inherit"
              sx={{ my: 'auto' }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <IconChevronUp stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        ) : (
          <IconChevronDown stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {open && (
          <List
            component="div"
            disablePadding
            sx={{
              position: 'relative',
              '&:after': {
                content: "''",
                position: 'absolute',
                left: '27px',
                top: 0,
                height: '100%',
                width: '1px',
                opacity: 1,
                background: theme.palette.divider,
              },
            }}
          >
            {menus}
          </List>
        )}
      </Collapse>
    </>
  );
};

export default NavCollapse;
