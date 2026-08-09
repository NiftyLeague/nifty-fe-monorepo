import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { Degen } from './degen'

function makeDegen() {
  return new Degen('mainnet', 'NiftyDegen')
}

beforeEach(() => {})

describe('Degen metadata', () => {
  it('builds metadata from non-zero traits and uploads it', async () => {
    const degen = makeDegen()
    degen.contract = { getName: mock().mockResolvedValue('Custom Name') } as never
    const upload = spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)

    const metadata = await degen.makeNFTMetadata(42, [1, 0, 2], 1, 'https://images.example/42.png')

    expect(metadata.name).toBe('Custom Name')
    expect(metadata.image).toBe('https://images.example/42.png')
    expect(metadata.attributes).toHaveLength(3)
    expect(upload).toHaveBeenCalledWith(
      'mainnet/metadata/42.json',
      expect.stringContaining('"Custom Name"'),
      expect.any(String)
    )
  })

  it('falls back to the token label when the contract has no name', async () => {
    const degen = makeDegen()
    spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)

    await expect(degen.makeNFTMetadata(7, [], 0, 'ipfs://asset')).resolves.toMatchObject({
      name: 'DEGEN #7',
    })
  })

  it('updates names and complete metadata before refreshing OpenSea', async () => {
    const degen = makeDegen()
    spyOn(degen, 'getName').mockResolvedValue('Renamed')
    const upload = spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)
    const refresh = spyOn(degen, 'refreshOpenSea').mockResolvedValue(undefined)

    const original = {
      id: 12,
      token_id: '12',
      name: 'Old',
      description: 'A Degen',
      image: 'ipfs://image',
      attributes: [{ trait_type: 'Background', value: 'Blue' }],
    }
    const named = await degen.updateDegenName(12, original)
    expect(named.newMetadata.name).toBe('Renamed')

    const updated = await degen.updateDegenMetadata(12, { ...original, name: 'Renamed' })
    expect(updated.newMetadata).toMatchObject({
      name: 'Renamed',
      image: 'ipfs://image',
    })
    expect(upload).toHaveBeenCalledTimes(2)
    expect(refresh).toHaveBeenCalledTimes(2)
  })
})

describe('Degen contract helpers', () => {
  it('protects reserved names while preserving their canonical token ids', async () => {
    const degen = makeDegen()
    const getName = mock().mockResolvedValue('Satoshi')
    degen.contract = { getName } as never

    await expect(degen.getName(10000)).resolves.toBe('Satoshi')
    await expect(degen.getName(9999)).resolves.toBe('RugMan')
    await expect(degen.getName(5)).resolves.toBe('DEGEN #5')
    getName.mockResolvedValue('Alice')
    await expect(degen.getName(6)).resolves.toBe('Alice')
  })

  it('delegates trait lookup to the contract', async () => {
    const getCharacterTraits = mock().mockResolvedValue([1, 2, 3])
    const degen = makeDegen()
    degen.contract = { getCharacterTraits } as never

    await expect(degen.getCharacterTraits(9)).resolves.toEqual([1, 2, 3])
    expect(getCharacterTraits).toHaveBeenCalledWith(9)
  })
})
