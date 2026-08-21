import { describe, expect, it } from 'bun:test'

import { fromPublicDegenWire, toPublicDegen, toPublicDegenWire } from './public-degens'

import type { Degen } from '@/types/degens'

describe('public degen payloads', () => {
  it('keeps only fields required by the public catalog', () => {
    expect(
      toPublicDegen(
        {
          id: '',
          stats: { wins: 3 },
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
          url: 'https://example.com/private',
        } satisfies Degen,
        '101'
      )
    ).toEqual({
      id: '101',
      name: 'Audit Ape',
      owner: '0xowner',
      background: 'Common',
      tribe: 'Ape',
      traits_string: 'blue,cap',
      price: 125,
    })
  })

  it('round-trips the compact catalog representation without losing filter fields', () => {
    const degen = toPublicDegen({
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
    } satisfies Degen)

    expect(fromPublicDegenWire(toPublicDegenWire(degen))).toEqual(degen)
    expect(fromPublicDegenWire(degen)).toBe(degen)
  })
})
