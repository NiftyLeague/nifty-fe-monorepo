import { getDegenCatalogSource, getPublicDegenCatalog } from '@/utils/degen-catalog'
import { getPublicDegenPage } from '@/utils/public-degen-query'
import {
  PUBLIC_DEGENS_WIRE_MEDIA_TYPE,
  toDashboardDegen,
  toPublicDegenPageWire,
  toPublicDegenWire,
} from '@/utils/public-degens'
import type { Degen } from '@/types/degens'

/** Keep the query within normal URL limits while covering realistic wallets. */
const MAX_ID_REQUEST_SIZE = 1000

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
  Vary: 'Accept',
} as const

const getRequestedIds = (params: URLSearchParams) =>
  [
    ...new Set(
      params
        .getAll('ids')
        .flatMap((value) => value.split(','))
        .filter(Boolean)
    ),
  ].slice(0, MAX_ID_REQUEST_SIZE)

/**
 * Public DEGEN catalog endpoint.
 *
 * `GET /api/degens` serves the catalog, `?page=&pageSize=` serves a paginated
 * slice, and `?ids=` serves the dashboard records for specific tokens. Clients
 * that send the wire media type in `Accept` get the compact array form.
 *
 * Kept as a plain function so it can be unit tested without a running server.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const params = new URL(request.url).searchParams
    const requestedIds = getRequestedIds(params)

    if (params.has('ids')) {
      const source = await getDegenCatalogSource()
      const selectedDegens = requestedIds.flatMap((id) => {
        const degen = Object.hasOwn(source, id) ? (source[id] as Degen | undefined) : undefined
        return degen ? [toDashboardDegen(degen, id)] : []
      })

      return Response.json(selectedDegens, { headers: CACHE_HEADERS })
    }

    const isPagedRequest = params.has('page') || params.has('pageSize')
    const acceptsCompactWireFormat = request.headers
      .get('accept')
      ?.includes(PUBLIC_DEGENS_WIRE_MEDIA_TYPE)

    if (isPagedRequest) {
      const pageData = await getPublicDegenPage(params)

      return Response.json(acceptsCompactWireFormat ? toPublicDegenPageWire(pageData) : pageData, {
        headers: CACHE_HEADERS,
      })
    }

    const catalog = await getPublicDegenCatalog()
    return Response.json(acceptsCompactWireFormat ? catalog.map(toPublicDegenWire) : catalog, {
      headers: CACHE_HEADERS,
    })
  } catch {
    return Response.json({ error: 'Degen catalog unavailable' }, { status: 502 })
  }
}
