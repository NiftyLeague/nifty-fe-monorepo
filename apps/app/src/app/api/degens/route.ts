import { NextResponse } from 'next/server'

import { getDegenCatalogSource, getPublicDegenCatalog } from '@/utils/degen-catalog'
import { getPublicDegenPage } from '@/utils/public-degen-query'
import {
  PUBLIC_DEGENS_WIRE_MEDIA_TYPE,
  toDashboardDegen,
  toPublicDegenPageWire,
  toPublicDegenWire,
} from '@/utils/public-degens'

export const revalidate = 300
export const dynamic = 'force-dynamic'

// Keep the query within normal URL limits while covering realistic wallets.
const MAX_ID_REQUEST_SIZE = 1000

const getRequestedIds = (params: URLSearchParams) =>
  [
    ...new Set(
      params
        .getAll('ids')
        .flatMap((value) => value.split(','))
        .filter(Boolean)
    ),
  ].slice(0, MAX_ID_REQUEST_SIZE)

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

    const isPagedRequest = params.has('page') || params.has('pageSize')
    const acceptsCompactWireFormat = request.headers
      .get('accept')
      ?.includes(PUBLIC_DEGENS_WIRE_MEDIA_TYPE)

    if (isPagedRequest) {
      const pageData = await getPublicDegenPage(params)

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

    const catalog = await getPublicDegenCatalog()
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
