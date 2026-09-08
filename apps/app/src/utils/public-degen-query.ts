import {
  applySeventhTribesFix,
  transformDataByFilter,
} from '@/components/extended/DegensFilter/utils'
import type { DegenFilter } from '@/types/degenFilter'
import type { PublicDegen } from '@/types/degens'
import { getPublicDegenCatalog } from '@/utils/degen-catalog'
import {
  toPublicDegenPageWire,
  type PublicDegenPage,
  type PublicDegenPageWire,
} from '@/utils/public-degens'

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 48

const parsePositiveInteger = (value: string | null, fallback: number, maximum?: number) => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return fallback
  return maximum ? Math.min(parsed, maximum) : parsed
}

const getListFilter = (params: URLSearchParams, key: string) =>
  params.get(key)?.split('-').filter(Boolean) ?? []

const getSingleFilter = (params: URLSearchParams, key: string) => {
  const value = params.get(key)
  return value ? [value] : []
}

const getCatalogFilter = (params: URLSearchParams): DegenFilter => ({
  backgrounds: getListFilter(params, 'backgrounds'),
  cosmetics: getListFilter(params, 'cosmetics'),
  multipliers: [],
  prices: [],
  rentals: [],
  searchTerm: getSingleFilter(params, 'searchTerm'),
  sort: params.get('sort') === 'idDown' ? 'idDown' : 'idUp',
  tokenId: getSingleFilter(params, 'tokenId'),
  tribes: getListFilter(params, 'tribes'),
  walletAddress: getSingleFilter(params, 'walletAddress'),
  wearables: [],
})

const getPriceRange = (catalog: Pick<PublicDegen, 'price'>[]): [number, number] => {
  if (!catalog.length) return [0, 0]

  let min = catalog[0]?.price ?? 0
  let max = min
  for (const degen of catalog) {
    min = Math.min(min, degen.price)
    max = Math.max(max, degen.price)
  }
  return [min, max]
}

export async function getPublicDegenPage(params: URLSearchParams): Promise<PublicDegenPage> {
  const catalog = await getPublicDegenCatalog()
  const pageSize = parsePositiveInteger(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
  const requestedPage = parsePositiveInteger(params.get('page'), 1)
  const fixedCatalog = catalog.map(applySeventhTribesFix)
  const filteredCatalog = transformDataByFilter(fixedCatalog, getCatalogFilter(params))
  const maxPage = Math.ceil(filteredCatalog.length / pageSize)
  const page = maxPage ? Math.min(requestedPage, maxPage) : 1
  const start = (page - 1) * pageSize

  return {
    items: filteredCatalog.slice(start, start + pageSize),
    total: filteredCatalog.length,
    page,
    pageSize,
    priceRange: getPriceRange(catalog),
  }
}

export async function getPublicDegenPageWire(
  params: URLSearchParams
): Promise<PublicDegenPageWire> {
  return toPublicDegenPageWire(await getPublicDegenPage(params))
}
