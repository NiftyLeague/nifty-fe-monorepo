import { Attribute, ItemType, ItemSource, Metadata } from '@/types/metadata'
import { COMICS_IMAGES_CID } from '../ipfs'

const COMICS_DESCRIPTION =
  '📚 Each comic can be burned for a special in-game item! You can also burn a full set (Comics #1-6) for a Citadel Key.'

const ATTRIBUTES = (type: ItemType, source: ItemSource): Attribute[] => {
  return [
    {
      trait_type: 'Type',
      value: type,
    },
    {
      trait_type: 'Source',
      value: source,
    },
  ]
}

export const COMICS_METADATA: Metadata[] = [
  {
    id: 1,
    token_id: '1',
    name: 'Comic #1',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/1.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
  {
    id: 2,
    token_id: '2',
    name: 'Comic #2',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/2.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
  {
    id: 3,
    token_id: '3',
    name: 'Comic #3',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/3.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
  {
    id: 4,
    token_id: '4',
    name: 'Comic #4',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/4.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
  {
    id: 5,
    token_id: '5',
    name: 'Comic #5',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/5.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
  {
    id: 6,
    token_id: '6',
    name: 'Comic #6',
    image: `ipfs://${COMICS_IMAGES_CID}/comics/6.png`,
    external_url: 'https://niftyleague.com',
    description: COMICS_DESCRIPTION,
    attributes: ATTRIBUTES(ItemType.Comic, ItemSource.DegenMint),
  },
]
