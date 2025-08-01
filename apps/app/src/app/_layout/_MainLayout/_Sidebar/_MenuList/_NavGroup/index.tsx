import { ReactNode } from 'react';

// material-ui
import { useTheme } from '@nl/theme';
import { Divider, List, Typography } from '@mui/material';

// project imports
import type { IconName } from '@nl/ui/base/icon';
import NavItem from '../_NavItem';
import NavCollapse from '../_NavCollapse';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export interface NavGroupProps {
  item: {
    id?: string;
    type?: string;
    children?: NavGroupProps['item'][];
    icon?: IconName;
    title?: ReactNode | string;
    caption?: ReactNode | string;
    color?: 'primary' | 'secondary' | 'default' | undefined;
    url?: string;
  };
}

const NavGroup = ({ item }: NavGroupProps) => {
  const theme = useTheme();

  // menu list collapse & items
  const items = (item?.children || []).map(menu => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" sx={{ color: 'var(--color-error)' }} align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
              {item.title}
              {item.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25, opacity: '0.6' }} />
    </>
  );
};

export default NavGroup;
