import { DEGEN_BASE_API_URL } from '@/constants/api'
import type { Degen } from '@/types/degens'

const SOURCE_URL = `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`
const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000

type CatalogSource = Record<string, Degen>

let cachedCatalog: { value: CatalogSource; expiresAt: number } | undefined
let pendingCatalogRequest: Promise<CatalogSource> | undefined

/**
 * The source is larger than Next's persistent Data Cache limit. A bounded
 * process-local cache still avoids repeating the full S3 download for warm
 * instances serving different page or owned-token queries.
 */
export async function getDegenCatalogSource(): Promise<CatalogSource> {
  if (cachedCatalog && cachedCatalog.expiresAt > Date.now()) {
    return cachedCatalog.value
  }

  if (pendingCatalogRequest) return pendingCatalogRequest

  pendingCatalogRequest = fetch(SOURCE_URL, { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Degen catalog unavailable')

      const value = (await response.json()) as CatalogSource
      cachedCatalog = { value, expiresAt: Date.now() + CATALOG_CACHE_TTL_MS }
      return value
    })
    .finally(() => {
      pendingCatalogRequest = undefined
    })

  return pendingCatalogRequest
}

export function clearDegenCatalogSourceCache() {
  cachedCatalog = undefined
  pendingCatalogRequest = undefined
}
