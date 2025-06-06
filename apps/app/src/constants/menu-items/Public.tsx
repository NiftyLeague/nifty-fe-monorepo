// assets
import {
  IconDeviceGamepad,
  IconListNumbers,
  IconMoodCrazyHappy,
  IconSquarePlus,
  IconTag,
  IconTicket,
} from '@tabler/icons-react';

// constant
const icons = { IconDeviceGamepad, IconListNumbers, IconMoodCrazyHappy, IconSquarePlus, IconTag, IconTicket };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const PublicItems = {
  id: 'public-items',
  type: 'group',
  children: [
    { id: '', title: 'Games', type: 'item', url: '/', icon: icons.IconDeviceGamepad, breadcrumbs: false },
    { id: 'degens', title: 'DEGENs', type: 'item', url: '/degens', icon: icons.IconMoodCrazyHappy, breadcrumbs: false },
    {
      id: 'leaderboards',
      title: 'Leaderboards',
      type: 'item',
      url: '/leaderboards',
      icon: icons.IconListNumbers,
      breadcrumbs: false,
    },
    {
      id: 'mint-o-matic',
      title: 'Mint-O-Matic',
      type: 'item',
      url: '/mint-o-matic',
      icon: icons.IconSquarePlus,
      breadcrumbs: false,
    },
  ],
};

export default PublicItems;
