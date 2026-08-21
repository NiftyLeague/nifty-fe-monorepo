import { NextResponse } from 'next/server'

import {
  applySeventhTribesFix,
  tranformDataByFilter,
} from '@/components/extended/DegensFilter/utils'
import type { DegenFilter } from '@/types/degenFilter'
import type { PublicDegen } from '@/types/degens'
import { getDegenCatalogSource, getPublicDegenCatalog } from '@/utils/degen-catalog'
import {
  PUBLIC_DEGENS_WIRE_MEDIA_TYPE,
  toDashboardDegen,
  toPublicDegenPageWire,
  toPublicDegenWire,
} from '@/utils/public-degens'

export const revalidate = 300
export const dynamic = 'force-dynamic'

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 48
// Keep the query within normal URL limits while covering realistic wallets.
const MAX_ID_REQUEST_SIZE = 1000

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

const getRequestedIds = (params: URLSearchParams) =>
  [
    ...new Set(
      params
        .getAll('ids')
        .flatMap((value) => value.split(','))
        .filter(Boolean)
    ),
  ].slice(0, MAX_ID_REQUEST_SIZE)

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

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    const requestedIds = getRequestedIds(params)

    if (params.has('ids')) {
      const source = await getDegenCatalogSource()
      const selectedDegens = requestedIds.flatMap((id) => {
        const degen = Object.hasOwn(source, id) ? source[id] : undefined
        return degen ? [toDashboardDegen(degen, id)] : []
      })

      return NextResponse.json(selectedDegens, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
          Vary: 'Accept',
        },
      })
    }

    const catalog = await getPublicDegenCatalog()
    const isPagedRequest = params.has('page') || params.has('pageSize')
    const acceptsCompactWireFormat = request.headers
      .get('accept')
      ?.includes(PUBLIC_DEGENS_WIRE_MEDIA_TYPE)

    if (isPagedRequest) {
      const pageSize = parsePositiveInteger(
        params.get('pageSize'),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
      )
      const requestedPage = parsePositiveInteger(params.get('page'), 1)
      const fixedCatalog = catalog.map(applySeventhTribesFix)
      const filteredCatalog = tranformDataByFilter(fixedCatalog, getCatalogFilter(params))
      const maxPage = Math.ceil(filteredCatalog.length / pageSize)
      const page = maxPage ? Math.min(requestedPage, maxPage) : 1
      const start = (page - 1) * pageSize
      const pageData = {
        items: filteredCatalog.slice(start, start + pageSize),
        total: filteredCatalog.length,
        page,
        pageSize,
        priceRange: getPriceRange(catalog),
      }

      return NextResponse.json(
        acceptsCompactWireFormat ? toPublicDegenPageWire(pageData) : pageData,
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
            Vary: 'Accept',
          },
        }
      )
    }

    return NextResponse.json(acceptsCompactWireFormat ? catalog.map(toPublicDegenWire) : catalog, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        Vary: 'Accept',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Degen catalog unavailable' }, { status: 502 })
  }
}
