import type { NavItemType } from '@/types';

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const PublicItems: NavItemType = {
  id: 'public-items',
  type: 'group',
  children: [
    { id: '', title: 'Games', type: 'item', url: '/', icon: 'gamepad', breadcrumbs: false },
    { id: 'degens', title: 'DEGENs', type: 'item', url: '/degens', icon: 'cat', breadcrumbs: false },
    {
      id: 'leaderboards',
      title: 'Leaderboards',
      type: 'item',
      url: '/leaderboards',
      icon: 'list-ordered',
      breadcrumbs: false,
    },
    {
      id: 'mint-o-matic',
      title: 'Mint-O-Matic',
      type: 'item',
      url: '/mint-o-matic',
      icon: 'sparkles',
      breadcrumbs: false,
    },
  ],
};

export default PublicItems;
