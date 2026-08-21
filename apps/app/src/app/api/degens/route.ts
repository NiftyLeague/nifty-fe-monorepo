import { NextResponse } from 'next/server'

import { DEGEN_BASE_API_URL } from '@/constants/api'
import type { Degen } from '@/types/degens'
import {
  PUBLIC_DEGENS_WIRE_MEDIA_TYPE,
  toPublicDegen,
  toPublicDegenWire,
} from '@/utils/public-degens'

const SOURCE_URL = `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`

export const revalidate = 300
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // The upstream catalog is larger than Next's persistent Data Cache limit.
    // Cache the compact response at the CDN boundary instead of attempting to
    // persist the full source payload during builds or route revalidation.
    const response = await fetch(SOURCE_URL, { cache: 'no-store' })

    if (!response.ok) {
      return NextResponse.json({ error: 'Degen catalog unavailable' }, { status: 502 })
    }

    const source = (await response.json()) as Record<string, Degen>
    const catalog = Object.entries(source).map(([id, degen]) => toPublicDegen(degen, id))
    const acceptsCompactWireFormat = request.headers
      .get('accept')
      ?.includes(PUBLIC_DEGENS_WIRE_MEDIA_TYPE)

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
