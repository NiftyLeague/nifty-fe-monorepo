'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// material-ui
import { useTheme } from '@nl/theme';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import { Icon } from '@nl/ui/base/icon';
import { NavGroupProps } from '../_NavGroup';
import NavItem from '../_NavItem';

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
          <Typography key={item.id} variant="h6" sx={{ color: 'var(--color-error)' }} align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: 'var(--border-radius-default)',
          mb: 0.5,
          alignItems: 'center',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
          <Icon name={menu?.icon ?? 'dot'} size="lg" className="ml-1" />
        </ListItemIcon>
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
        <Icon name="chevron-down" size="md" className={`transition-transform ${open ? 'transform rotate-180' : ''}`} />
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
                background: 'var(--color-separator)',
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
