import Private from './Private';
import Public from './Public';
import type { NavItemType } from '@/types';

// ==============================|| MENU ITEMS ||============================== //

const PrivateItems: { items: NavItemType[] } = {
  items: [Private],
};

const PublicItems: { items: NavItemType[] } = {
  items: [Public],
};

export default PublicItems;

export { PrivateItems, PublicItems };
