import { memo } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './_NavGroup';
import { PublicItems, PrivateItems } from '@/constants/menu-items';
import useAuth from '@/hooks/useAuth';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const getMenuItemsByLoginStatus = (loginStatus: boolean) => {
  if (loginStatus) {
    return { items: [...PublicItems.items, ...PrivateItems.items] };
  }

  return { items: [...PublicItems.items] };
};

const MenuList = () => {
  const { isLoggedIn } = useAuth();
  const lastItems = getMenuItemsByLoginStatus(isLoggedIn).items;
  const lastItem = lastItems.length > 1 ? lastItems[1] : undefined;
  if (lastItem) {
    const childs = lastItem.children && lastItem.children[0] && lastItem.children[0].children;
    if (childs && !childs.find(t => t.id === 'gamer-profile')) {
      childs.splice(1, 0, {
        id: 'gamer-profile',
        title: 'Gamer Profile',
        type: 'item',
        url: '/dashboard/gamer-profile',
      });
    }
  }

  const navItems = lastItems.map(item => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default memo(MenuList);
