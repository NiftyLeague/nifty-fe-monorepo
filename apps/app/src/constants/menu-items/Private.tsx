import type { NavItemType } from '@/types';

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const PrivateItems: NavItemType = {
  id: 'private-items',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'My Dashboard',
      type: 'collapse',
      icon: 'layout-grid',
      children: [
        { id: 'dashboard', title: 'Overview', type: 'item', url: '/dashboard' },
        { id: 'degens', title: 'DEGENs', type: 'item', url: '/dashboard/degens' },
        { id: 'items', title: 'Comics & Items', type: 'item', url: '/dashboard/items' },
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
