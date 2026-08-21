import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import type { Degen } from '@/types/degens'
import { PUBLIC_DEGENS_WIRE_MEDIA_TYPE } from '@/utils/public-degens'

import { GET } from './route'

const originalFetch = globalThis.fetch

const sourceDegen = {
  id: '101',
  stats: {},
  rental_count: 1,
  is_active: true,
  last_rented_at: 0,
  total_rented: 2,
  price: 125,
  price_daily: 18,
  tribe: 'Ape',
  background: 'Common',
  traits_string: 'blue,cap',
  multiplier: 1,
  multipliers: { background: 1 },
  name: 'Audit Ape',
  owner: '0xowner',
  earning_cap: 1000,
  earning_cap_daily: 100,
} satisfies Degen

const secondSourceDegen = {
  ...sourceDegen,
  id: '102',
  name: 'Audit Cat',
  tribe: 'Cat',
  background: 'Rare',
  price: 250,
} satisfies Degen

describe('public degen catalog route', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('serves compact records to the app while keeping the object response compatible', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ '101': sourceDegen }), { status: 200 }))
    )

    const compactResponse = await GET(
      new Request('http://localhost/api/degens', {
        headers: { Accept: PUBLIC_DEGENS_WIRE_MEDIA_TYPE },
      })
    )
    expect(await compactResponse.json()).toEqual([
      ['101', 'Audit Ape', '0xowner', 'Common', 'Ape', 'blue,cap', 125],
    ])
    expect(compactResponse.headers.get('Vary')).toContain('Accept')

    const objectResponse = await GET(new Request('http://localhost/api/degens'))
    expect(await objectResponse.json()).toEqual([
      {
        id: '101',
        name: 'Audit Ape',
        owner: '0xowner',
        background: 'Common',
        tribe: 'Ape',
        traits_string: 'blue,cap',
        price: 125,
      },
    ])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('filters and paginates the compact response on the server', async () => {
    spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ '101': sourceDegen, '102': secondSourceDegen }), {
          status: 200,
        })
      )
    )

    const response = await GET(
      new Request('http://localhost/api/degens?page=4&pageSize=1&tribes=cat', {
        headers: { Accept: PUBLIC_DEGENS_WIRE_MEDIA_TYPE },
      })
    )

    expect(await response.json()).toEqual({
      items: [['102', 'Audit Cat', '0xowner', 'Rare', 'Cat', 'blue,cap', 250]],
      total: 1,
      page: 1,
      pageSize: 1,
      priceRange: [125, 250],
    })
  })

  it('returns only requested dashboard records for an id-scoped catalog request', async () => {
    spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            '101': sourceDegen,
            '102': secondSourceDegen,
          }),
          { status: 200 }
        )
      )
    )

    try {
      const response = await GET(new Request('https://app.example/api/degens?ids=102,101,missing'))

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual([
        {
          id: '102',
          name: 'Audit Cat',
          owner: '0xowner',
          background: 'Rare',
          tribe: 'Cat',
          traits_string: 'blue,cap',
          price: 250,
          price_daily: 18,
          multiplier: 1,
          rental_count: 1,
        },
        {
          id: '101',
          name: 'Audit Ape',
          owner: '0xowner',
          background: 'Common',
          tribe: 'Ape',
          traits_string: 'blue,cap',
          price: 125,
          price_daily: 18,
          multiplier: 1,
          rental_count: 1,
        },
      ])
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
