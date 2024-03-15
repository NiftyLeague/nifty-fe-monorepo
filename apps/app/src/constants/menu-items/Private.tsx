// assets
import { IconDashboard, IconLayoutGrid } from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard,
  IconLayoutGrid,
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const PrivateItems = {
  id: 'private-items',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'My Dashboard',
      type: 'collapse',
      icon: icons.IconLayoutGrid,
      children: [
        {
          id: 'dashboard',
          title: 'Overview',
          type: 'item',
          url: '/dashboard',
        },
        {
          id: 'degens',
          title: 'DEGENs',
          type: 'item',
          url: '/dashboard/degens',
        },
        {
          id: 'items',
          title: 'Comics & Items',
          type: 'item',
          url: '/dashboard/items',
        },
        // {
        //   id: 'rentals',
        //   title: 'Rentals',
        //   type: 'item',
        //   url: '/dashboard/rentals',
        // },
      ],
    },
  ],
};

export default PrivateItems;
