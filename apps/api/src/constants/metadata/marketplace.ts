import { config } from 'node-config-ts'
import { COMICS_METADATA } from './comics'
import { ITEMS_METADATA } from './items'

const { name, description, imageUrl } = config.imx.mainnet.collection

export const MARKETPLACE_COLLECTION_METADATA = {
  name,
  description,
  image: imageUrl,
  external_link: 'https://niftyleague.com',
}

export const MARKETPLACE_ITEMS = [...COMICS_METADATA, ...ITEMS_METADATA]
