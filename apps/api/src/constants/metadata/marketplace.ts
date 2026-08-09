// Import the traced JSON config (see src/config.ts) instead of node-config-ts.
// node-config-ts reads config/default.json from disk relative to the cwd, so
// tests running from the repo root (bun test --isolate at the monorepo root)
// would get an empty config and crash on `config.imx.mainnet`.
import config from '../../config'
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
