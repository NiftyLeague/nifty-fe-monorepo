import {
  Attribute,
  ItemType,
  ItemSource,
  ItemTier,
  CharacterItemSlotType,
  Metadata,
} from '@/types/metadata'
import { ITEMS_IMAGES_CID } from '../ipfs'

const ATTRIBUTES = (
  type: ItemType,
  source: ItemSource,
  tier = ItemTier.None,
  slot = CharacterItemSlotType.None
): Attribute[] => {
  return [
    {
      trait_type: 'Type',
      value: type,
    },
    {
      trait_type: 'Source',
      value: source,
    },
    {
      trait_type: 'Tier',
      value: tier,
    },
    {
      trait_type: 'Slot',
      value: slot,
    },
  ]
}

export const ITEMS_METADATA: Metadata[] = [
  {
    id: 101,
    token_id: '101',
    name: 'Cape',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/101.gif`,
    external_url: 'https://niftyleague.com',
    description: 'Nifty League CAPE awarded to hero Degens who burned Comic #1.',
    attributes: ATTRIBUTES(
      ItemType.Wearable,
      ItemSource.ComicsBurn1,
      ItemTier.Legendary,
      CharacterItemSlotType.Back
    ),
  },
  {
    id: 102,
    token_id: '102',
    name: 'Halo',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/102.gif`,
    external_url: 'https://niftyleague.com',
    description: 'Nifty League HALO bestowed on angel Degens who burned Comic #2.',
    attributes: ATTRIBUTES(
      ItemType.Wearable,
      ItemSource.ComicsBurn2,
      ItemTier.Epic,
      CharacterItemSlotType.Hat
    ),
  },
  {
    id: 103,
    token_id: '103',
    name: 'Diamond Bat',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/103.gif`,
    external_url: 'https://niftyleague.com',
    description: 'Nifty League DIAMOND BAT directed to diamond-handed Degens who burned Comic #3.',
    attributes: ATTRIBUTES(
      ItemType.Weapon,
      ItemSource.ComicsBurn3,
      ItemTier.Mythic,
      CharacterItemSlotType.Primary
    ),
  },
  {
    id: 104,
    token_id: '104',
    name: 'Bread Bat',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/104.gif`,
    external_url: 'https://niftyleague.com',
    description: 'Nifty League BREAD BAT gifted to hungry Degens who burned Comic #4.',
    attributes: ATTRIBUTES(
      ItemType.Weapon,
      ItemSource.ComicsBurn4,
      ItemTier.Legendary,
      CharacterItemSlotType.Primary
    ),
  },
  {
    id: 105,
    token_id: '105',
    name: 'Purple Bat',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/105.gif`,
    external_url: 'https://niftyleague.com',
    description:
      'Nifty League special edition PURPLE BAT presented to supportive Degens who burned Comic #5.',
    attributes: ATTRIBUTES(
      ItemType.Weapon,
      ItemSource.ComicsBurn5,
      ItemTier.Epic,
      CharacterItemSlotType.Primary
    ),
  },
  {
    id: 106,
    token_id: '106',
    name: 'Companion',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/106.gif`,
    external_url: 'https://niftyleague.com',
    description:
      'Nifty League COMPANION pet entrusted to courageous Degens who burned the rare Comic #6.',
    attributes: ATTRIBUTES(
      ItemType.Wearable,
      ItemSource.ComicsBurn6,
      ItemTier.Mythic,
      CharacterItemSlotType.Special
    ),
  },
  {
    id: 107,
    token_id: '107',
    name: 'Citadel Key',
    image: `ipfs://${ITEMS_IMAGES_CID}/items/107.gif`,
    external_url: 'https://niftyleague.com',
    description:
      'Nifty League KEY TO THE CITADEL [comic edition], granted to elite Degens who burned a full set of 6 comics.',
    attributes: ATTRIBUTES(ItemType.Item, ItemSource.ComicsBurnSet),
  },
]
