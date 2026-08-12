import { describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'
import { BURN_ADDYS } from '@/constants/addresses'
import { HYDRA_RARITIES } from '@/constants/hydra-rarities'
import { HYDRAS } from '@/constants/hydras'
import DEFAULT_STATIC_FILTER from './constants'
import {
  applySeventhTribesFix,
  getDefaultFilterValueFromData,
  tranformDataByFilter,
  updateFilterValue,
} from './utils'

const degen = {
  id: '42',
  name: 'Alpha Hydra',
  owner: '0x1111111111111111111111111111111111111111',
  background: 'Jungle',
  tribe: 'Hydra',
  traits_string: 'Crown,Laser Eyes',
  price: 12,
}

const emptyFilter = {
  backgrounds: [],
  cosmetics: [],
  searchTerm: [],
  tokenId: [],
  tribes: [],
  walletAddress: [],
}

describe('degen filtering', () => {
  it('applies identity, trait, search, and burn-address filters', () => {
    expect(tranformDataByFilter([degen] as never, emptyFilter as never)).toHaveLength(1)
    expect(
      tranformDataByFilter(
        [degen] as never,
        { ...emptyFilter, walletAddress: [degen.owner.toUpperCase()] } as never
      )
    ).toHaveLength(1)
    expect(
      tranformDataByFilter(
        [degen] as never,
        { ...emptyFilter, walletAddress: ['0x2222222222222222222222222222222222222222'] } as never
      )
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, tokenId: ['7'] } as never)
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, tribes: ['ape'] } as never)
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, backgrounds: ['space'] } as never)
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, cosmetics: ['Crown'] } as never)
    ).toHaveLength(1)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, cosmetics: ['Cape'] } as never)
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, searchTerm: ['alpha'] } as never)
    ).toHaveLength(1)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, searchTerm: ['42'] } as never)
    ).toHaveLength(1)
    expect(
      tranformDataByFilter([degen] as never, { ...emptyFilter, searchTerm: ['missing'] } as never)
    ).toHaveLength(0)
    expect(
      tranformDataByFilter([{ ...degen, owner: BURN_ADDYS[0] }] as never, emptyFilter as never)
    ).toHaveLength(0)
  })

  it('treats a missing tribe as the legacy hydra tribe and sorts IDs in both directions', () => {
    const records = [
      { ...degen, id: '9', tribe: '' },
      { ...degen, id: '2' },
    ]
    expect(
      tranformDataByFilter(
        records as never,
        { ...emptyFilter, tribes: ['hydra'], sort: 'idUp' } as never
      ).map((x) => x.id)
    ).toEqual(['2', '9'])
    expect(
      tranformDataByFilter(records as never, { ...emptyFilter, sort: 'idDown' } as never).map(
        (x) => x.id
      )
    ).toEqual(['9', '2'])
  })
})

describe('filter state helpers', () => {
  it('hydrates scalar, numeric, and list query parameters and invokes matching actions', () => {
    const tribesAction = mock()
    const result = updateFilterValue(
      DEFAULT_STATIC_FILTER,
      {
        searchTerm: 'alpha',
        walletAddress: degen.owner,
        tokenId: '42',
        prices: '2-9',
        tribes: 'hydra-ape',
      },
      { tribes: tribesAction }
    )

    expect(result).toMatchObject({
      searchTerm: ['alpha'],
      walletAddress: [degen.owner],
      tokenId: ['42'],
      prices: [2, 9],
      tribes: ['hydra', 'ape'],
    })
    expect(tribesAction).toHaveBeenCalledWith(['hydra', 'ape'])
    expect(updateFilterValue(DEFAULT_STATIC_FILTER, { tribes: '' })).toBeUndefined()
  })

  it('derives price bounds while retaining static defaults', () => {
    expect(getDefaultFilterValueFromData(undefined)).toBe(DEFAULT_STATIC_FILTER)
    expect(getDefaultFilterValueFromData([])).toBe(DEFAULT_STATIC_FILTER)
    expect(
      getDefaultFilterValueFromData([{ price: 8 }, { price: 2 }, { price: 14 }] as never)
    ).toMatchObject({
      prices: [2, 14],
    })
  })
})

describe('seventh tribe compatibility', () => {
  it('keeps the client-safe rarity map aligned with full Hydra metadata', () => {
    expect(HYDRA_RARITIES).toEqual(
      Object.fromEntries(Object.entries(HYDRAS).map(([id, hydra]) => [id, hydra.rarity]))
    )
  })

  it('preserves existing tokens and maps Hydra rarity edge cases', () => {
    const original = { id: '9900', background: 'Original', tribe: 'ape' } as Degen

    expect(applySeventhTribesFix(original)).toBe(original)
    expect(applySeventhTribesFix({ id: '9901' } as Degen)).toMatchObject({
      background: 'Meta',
      tribe: 'hydra',
    })
    expect(applySeventhTribesFix({ id: '9924' } as Degen)).toMatchObject({
      background: 'Legendary',
      tribe: 'hydra',
    })
    expect(applySeventhTribesFix({ id: '9999' } as Degen)).toMatchObject({
      background: 'Meta',
      tribe: 'rugman',
    })
    expect(applySeventhTribesFix({ id: '10000' } as Degen)).toMatchObject({
      background: 'Meta',
      tribe: 'satoshi',
    })
  })
})
