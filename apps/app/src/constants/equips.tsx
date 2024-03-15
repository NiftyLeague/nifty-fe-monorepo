import type { EquipItemSlot } from '@/types/equip';
import Image from 'next/image';
import { GOOGLE_ANALYTICS } from './google-analytics';

export const SLOTS: EquipItemSlot[] = [
  {
    name: 'Back',
    empty: <Image src="/images/equips/cape-slot.svg" alt="Cape Slot" width={40} height={40} />,
    filled: <Image src="/images/equips/cape.png" width={40} height={40} alt="Back" />,
  },
  {
    name: 'Head',
    empty: <Image src="/images/equips/halo-slot.svg" alt="Halo Slot" width={40} height={40} />,
    filled: <Image src="/images/equips/halo.png" width={40} height={40} alt="Head" />,
  },
  {
    name: 'Pet',
    empty: <Image src="/images/equips/companion-slot.svg" alt="Companion Slot" width={40} height={40} />,
    filled: <Image src="/images/equips/companion.png" width={40} height={40} alt="Pet" />,
  },
  {
    name: 'Weapon',
    empty: <Image src="/images/equips/bat-slot.svg" alt="Bat Slot" width={40} height={40} />,
    filledArr: [
      <Image src="/images/equips/diamond-bat.png" width={40} height={40} alt="Diamond Bat" key="diamond" />,
      <Image src="/images/equips/purple-bat.png" width={40} height={40} alt="Purple Bat" key="purple" />,
      <Image src="/images/equips/bread-bat.png" width={40} height={40} alt="Bread Bat" key="bread" />,
    ],
  },
];

export const INVENTORIES: EquipItemSlot[] = [
  {
    name: 'Cape',
    empty: <Image src="/images/equips/cape-inventory-empty.svg" alt="Cape Inventory Empty" width={30} height={30} />,
    filled: <Image src="/images/equips/cape.png" alt="Cape" className="inventory" width={30} height={30} />,
  },
  {
    name: 'Halo',
    empty: <Image src="/images/equips/halo-inventory-empty.svg" alt="Halo Inventory Empty" width={30} height={30} />,
    filled: <Image src="/images/equips/halo.png" alt="Halo" className="inventory" width={30} height={30} />,
  },
  {
    name: 'Companion',
    empty: (
      <Image
        src="/images/equips/companion-inventory-empty.svg"
        alt="Companion Inventory Empty"
        width={30}
        height={30}
      />
    ),
    filled: <Image src="/images/equips/companion.png" alt="Companion" className="inventory" width={30} height={30} />,
  },
  {
    name: 'Diamond Bat',
    empty: <Image src="/images/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: (
      <Image src="/images/equips/diamond-bat.png" alt="Diamond Bat" className="inventory" width={30} height={30} />
    ),
  },
  {
    name: 'Purple Bat',
    empty: <Image src="/images/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: <Image src="/images/equips/purple-bat.png" alt="Purple Bat" className="inventory" width={30} height={30} />,
  },
  {
    name: 'Bread Bat',
    empty: <Image src="/images/equips/bat-inventory-empty.svg" alt="Bat Inventory Empty" width={30} height={30} />,
    filled: <Image src="/images/equips/bread-bat.png" alt="Bread Bat" className="inventory" width={30} height={30} />,
  },
];

export const getInventoryAnalyticsEventName = (inventory: string) => {
  let eventName = '';
  switch (inventory) {
    case 'Cape':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_CAPE_EQUIPPED;
      break;
    case 'Halo':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_HALO_EQUIPPED;
      break;
    case 'Companion':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_COMPANION_EQUIPPED;
      break;
    case 'Diamond Bat':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_DIAMOND_BAT_EQUIPPED;
      break;
    case 'Purple Bat':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_PURPLE_BAT_EQUIPPED;
      break;
    case 'Bread Bat':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_INVENTORY_BREAD_BAT_EQUIPPED;
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
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_SLOT_BACK_UNEQUIPPED;
      break;
    case 'Head':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_SLOT_HEAD_UNEQUIPPED;
      break;
    case 'Pet':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_SLOT_PET_UNEQUIPPED;
      break;
    case 'Weapon':
      eventName = GOOGLE_ANALYTICS.EVENTS.DEGEN_SLOT_WEAPON_UNEQUIPPED;
      break;
    default:
      break;
  }
  return eventName;
};
