import type { EquipItemSlot } from '@/types/equip';
import Image from 'next/image';
import { GTM_EVENTS } from '@nl/ui/gtm';

import styles from './index.module.css';

export const SLOTS: EquipItemSlot[] = [
  {
    name: 'Back',
    empty: <Image src="/img/items/equips/cape-slot.svg" alt="Cape Slot" width={40} height={40} />,
    filled: <Image src="/img/items/equips/cape.webp" width={40} height={40} alt="Back" />,
  },
  {
    name: 'Head',
    empty: <Image src="/img/items/equips/halo-slot.svg" alt="Halo Slot" width={40} height={40} />,
    filled: <Image src="/img/items/equips/halo.webp" width={40} height={40} alt="Head" />,
  },
  {
    name: 'Pet',
    empty: <Image src="/img/items/equips/companion-slot.svg" alt="Companion Slot" width={40} height={40} />,
    filled: <Image src="/img/items/equips/companion.webp" width={40} height={40} alt="Pet" />,
  },
  {
    name: 'Weapon',
    empty: <Image src="/img/items/equips/bat-slot.svg" alt="Bat Slot" width={40} height={40} />,
    filledArr: [
      <Image src="/img/items/equips/diamond-bat.webp" width={40} height={40} alt="Diamond Bat" key="diamond" />,
      <Image src="/img/items/equips/purple-bat.webp" width={40} height={40} alt="Purple Bat" key="purple" />,
      <Image src="/img/items/equips/bread-bat.webp" width={40} height={40} alt="Bread Bat" key="bread" />,
    ],
  },
];

export const INVENTORIES: EquipItemSlot[] = [
  {
    name: 'Cape',
    empty: <Image src="/img/items/equips/cape-inventory-empty.svg" alt="Cape Inventory Empty" width={30} height={30} />,
    filled: <Image src="/img/items/equips/cape.webp" alt="Cape" className={styles.inventory} width={30} height={30} />,
  },
  {
    name: 'Halo',
    empty: <Image src="/img/items/equips/halo-inventory-empty.svg" alt="Halo Inventory Empty" width={30} height={30} />,
    filled: <Image src="/img/items/equips/halo.webp" alt="Halo" className={styles.inventory} width={30} height={30} />,
  },
  {
    name: 'Companion',
    empty: (
      <Image
        src="/img/items/equips/companion-inventory-empty.svg"
        alt="Companion Inventory Empty"
        width={30}
        height={30}
      />
    ),
    filled: (
      <Image
        src="/img/items/equips/companion.webp"
        alt="Companion"
        className={styles.inventory}
        width={30}
        height={30}
      />
    ),
  },
  {
    name: 'Diamond Bat',
    empty: <Image src="/img/items/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: (
      <Image
        src="/img/items/equips/diamond-bat.webp"
        alt="Diamond Bat"
        className={styles.inventory}
        width={30}
        height={30}
      />
    ),
  },
  {
    name: 'Purple Bat',
    empty: <Image src="/img/items/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: (
      <Image
        src="/img/items/equips/purple-bat.webp"
        alt="Purple Bat"
        className={styles.inventory}
        width={30}
        height={30}
      />
    ),
  },
  {
    name: 'Bread Bat',
    empty: <Image src="/img/items/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: (
      <Image
        src="/img/items/equips/bread-bat.webp"
        alt="Bread Bat"
        className={styles.inventory}
        width={30}
        height={30}
      />
    ),
  },
];

export const getInventoryAnalyticsEventName = (inventory: string) => {
  let eventName = '';
  switch (inventory) {
    case 'Cape':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_CAPE_EQUIPPED;
      break;
    case 'Halo':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_HALO_EQUIPPED;
      break;
    case 'Companion':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_COMPANION_EQUIPPED;
      break;
    case 'Diamond Bat':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_DIAMOND_BAT_EQUIPPED;
      break;
    case 'Purple Bat':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_PURPLE_BAT_EQUIPPED;
      break;
    case 'Bread Bat':
      eventName = GTM_EVENTS.DEGEN_INVENTORY_BREAD_BAT_EQUIPPED;
      break;
    default:
      break;
  }
  return eventName;
};

export const getSlotAnalyticsEventName = (slot: string) => {
  let eventName = '';
  switch (slot) {
    case 'Back':
      eventName = GTM_EVENTS.DEGEN_SLOT_BACK_UNEQUIPPED;
      break;
    case 'Head':
      eventName = GTM_EVENTS.DEGEN_SLOT_HEAD_UNEQUIPPED;
      break;
    case 'Pet':
      eventName = GTM_EVENTS.DEGEN_SLOT_PET_UNEQUIPPED;
      break;
    case 'Weapon':
      eventName = GTM_EVENTS.DEGEN_SLOT_WEAPON_UNEQUIPPED;
      break;
    default:
      break;
  }
  return eventName;
};
