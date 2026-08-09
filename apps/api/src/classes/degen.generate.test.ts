import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { CID } from 'multiformats/cid'

const FAKE_CID = CID.parse('bafybeih75ntopwuggljajz3p2y2mh2ylxfv6joqlbvo2wxtabxkxm6igaa')

// ── Module-level mocks (MUST run before dynamic import of ./degen) ──

const mockReadFile = mock().mockResolvedValue(Buffer.from('fake-image-data'))
const mockGetAssetPath = mock((kind: string, fileName: string) => `/fake/${kind}/${fileName}`)
const mockDownloadImage = mock().mockResolvedValue(undefined)
const mockGenerateImageURL = mock(
  (_traits: number[], _rarity: number, token: number) => `https://unity.example/image/${token}`
)

mock.module('fs', () => ({
  default: {
    promises: { readFile: mockReadFile },
    existsSync: () => true,
    createReadStream: () => ({}) as any,
    createWriteStream: () => ({}) as any,
    readFileSync: () => '',
    statSync: () => ({}),
  },
  promises: { readFile: mockReadFile },
  existsSync: () => true,
  createReadStream: () => ({}) as any,
  createWriteStream: () => ({}) as any,
  readFileSync: () => '',
  statSync: () => ({}),
}))

// degen -> minty -> uploadToS3 reads config.aws.s3 at module scope. Mock it so
// this file runs from the monorepo root (CI: bun test --isolate), where
// node-config-ts cannot resolve config/ relative to the root cwd.
mock.module('node-config-ts', () => ({
  config: {
    aws: {
      s3: { bucket: 'assets-bucket', clientConfig: { region: 'us-east-1' } },
    },
  },
}))

mock.module('@/utils/assets', () => ({
  getAssetPath: mockGetAssetPath,
}))

mock.module('@/utils/imageGenerator', () => ({
  downloadImage: mockDownloadImage,
  generateImageURL: mockGenerateImageURL,
}))

const { Degen, MakeDegen } = await import('./degen')

function makeDegen() {
  return new Degen('mainnet', 'NiftyDegen')
}

beforeEach(() => {
  mockReadFile.mockClear()
  mockGetAssetPath.mockClear()
  mockDownloadImage.mockClear()
  mockGenerateImageURL.mockClear()
})

// ──────────────────────────────────────────────
//  MakeDegen factory (line 23-27)
// ──────────────────────────────────────────────

describe('MakeDegen factory', () => {
  it('creates a Degen instance and calls init()', async () => {
    const initSpy = spyOn(Degen.prototype, 'init').mockResolvedValue(undefined)
    try {
      const degen = await MakeDegen('mainnet')
      expect(degen).toBeInstanceOf(Degen)
      expect(degen.targetNetwork).toBe('mainnet')
      expect(degen.contractName).toBe('NiftyDegen')
      expect(initSpy).toHaveBeenCalledTimes(1)
    } finally {
      initSpy.mockRestore()
    }
  })
})

// ──────────────────────────────────────────────
//  generateImage (line 85-92)
// ──────────────────────────────────────────────

describe('Degen.generateImage', () => {
  it('uses .png extension for rarity < 3', async () => {
    const degen = makeDegen()
    const filePath = await degen.generateImage(42, [1, 0, 3], 1)
    expect(filePath).toBe('/fake/degens/42.png')
    expect(mockGenerateImageURL).toHaveBeenCalledWith([1, 0, 3], 1, 42)
    expect(mockDownloadImage).toHaveBeenCalledWith(
      'https://unity.example/image/42',
      '/fake/degens/42.png'
    )
  })

  it('uses .gif extension for rarity >= 3', async () => {
    const degen = makeDegen()
    const filePath = await degen.generateImage(7, [], 3)
    expect(filePath).toBe('/fake/degens/7.gif')
    expect(mockGenerateImageURL).toHaveBeenCalledWith([], 3, 7)
    expect(mockDownloadImage).toHaveBeenCalledWith(
      'https://unity.example/image/7',
      '/fake/degens/7.gif'
    )
  })
})

// ──────────────────────────────────────────────
//  generateNFT (line 54-73)
// ──────────────────────────────────────────────

describe('Degen.generateNFT', () => {
  it('orchestrates the full degen minting pipeline', async () => {
    const degen = makeDegen()

    const getCharacterTraitsSpy = spyOn(degen, 'getCharacterTraits').mockResolvedValue([
      1, 0, 3, 2, 0, 0, 4,
    ])

    const pinImageSpy = spyOn(degen, 'pinImage').mockResolvedValue({
      assetCid: FAKE_CID,
      assetURI: 'ipfs://QmFakeCid/degens/42.png',
      assetGatewayURL: 'https://gateway.example/ipfs/QmFakeCid/degens/42.png',
    } as any)

    const mockMetadata = {
      name: 'DEGEN #42',
      image: 'https://gateway.example/ipfs/QmFakeCid/degens/42.png',
      description: 'A test degen',
      external_url: 'https://niftyleague.com/degens/42',
      animation_url: 'https://niftyleague.com/degens/42/animation',
      attributes: [{ trait_type: 'Background', value: 'Common' }],
    }
    const makeNFTMetadataSpy = spyOn(degen, 'makeNFTMetadata').mockResolvedValue(
      mockMetadata as any
    )

    const uploadToS3Spy = spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)

    const refreshOpenSeaSpy = spyOn(degen, 'refreshOpenSea').mockResolvedValue(undefined)

    const result = await degen.generateNFT(42)

    // 1. Traits fetched
    expect(getCharacterTraitsSpy).toHaveBeenCalledWith(42)

    // 2. Asset path resolved (rarity defaults to 1 → .png)
    expect(mockGetAssetPath).toHaveBeenCalledWith('degens', '42.png')

    // 3. File read from disk
    expect(mockReadFile).toHaveBeenCalledWith('/fake/degens/42.png')

    // 4. Image pinned to IPFS
    expect(pinImageSpy).toHaveBeenCalledWith('/degens/42.png', Buffer.from('fake-image-data'))

    // 5. Image uploaded to S3
    expect(uploadToS3Spy).toHaveBeenCalledWith(
      'mainnet/images/42.png',
      Buffer.from('fake-image-data'),
      'degens'
    )

    // 6. Metadata constructed with right args
    expect(makeNFTMetadataSpy).toHaveBeenCalledWith(
      42,
      [1, 0, 3, 2, 0, 0, 4],
      1,
      'https://gateway.example/ipfs/QmFakeCid/degens/42.png'
    )

    // 7. OpenSea refreshed
    expect(refreshOpenSeaSpy).toHaveBeenCalledWith(42)

    // 8. Return value
    expect(result).toMatchObject({
      tokenId: 42,
      metadata: mockMetadata,
      assetURI: 'ipfs://QmFakeCid/degens/42.png',
      assetGatewayURL: 'https://gateway.example/ipfs/QmFakeCid/degens/42.png',
    })
  })
})

// ──────────────────────────────────────────────
//  updateDegenImage (line 201-216)
// ──────────────────────────────────────────────

describe('Degen.updateDegenImage', () => {
  it('pins a new image and updates metadata on S3', async () => {
    const degen = makeDegen()

    const pinImageSpy = spyOn(degen, 'pinImage').mockResolvedValue({
      assetCid: FAKE_CID,
      assetURI: 'ipfs://QmNewCid/degens/42.png',
      assetGatewayURL: 'https://gateway.example/ipfs/QmNewCid/degens/42.png',
    } as any)

    const uploadToS3Spy = spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)

    const refreshOpenSeaSpy = spyOn(degen, 'refreshOpenSea').mockResolvedValue(undefined)

    const originalMetadata = {
      name: 'My Degen',
      image: 'ipfs://QmOld/image.png',
      description: 'A cool degen',
      attributes: [
        { trait_type: 'Background', value: 'Rare' },
        { trait_type: 'Skin Color', value: 'Blue' },
      ],
    } as any

    const result = await degen.updateDegenImage(42, originalMetadata)

    // Asset path resolved — rarity is 2 (Rare) → .png
    expect(mockGetAssetPath).toHaveBeenCalledWith('degens', '42.png')

    // File read
    expect(mockReadFile).toHaveBeenCalledWith('/fake/degens/42.png')

    // Pinned
    expect(pinImageSpy).toHaveBeenCalledWith('/degens/42.png', Buffer.from('fake-image-data'))

    // Image uploaded to S3 (first call)
    expect(uploadToS3Spy).toHaveBeenCalledWith(
      'mainnet/images/42.png',
      Buffer.from('fake-image-data'),
      'degens'
    )

    // Metadata uploaded to S3 with updated image URI (second call)
    expect(uploadToS3Spy).toHaveBeenLastCalledWith(
      'mainnet/metadata/42.json',
      expect.stringContaining('ipfs://QmNewCid/degens/42.png'),
      'degens'
    )

    // OpenSea refreshed
    expect(refreshOpenSeaSpy).toHaveBeenCalledWith(42)

    // Return value has updated image
    expect(result.newMetadata.image).toBe('ipfs://QmNewCid/degens/42.png')
    expect(result.newMetadata.name).toBe('My Degen')
  })

  it('uses .gif extension for legendary backgrounds', async () => {
    const degen = makeDegen()

    spyOn(degen, 'pinImage').mockResolvedValue({
      assetCid: FAKE_CID,
      assetURI: 'ipfs://QmNewCid/degens/7.gif',
      assetGatewayURL: 'https://gateway.example/ipfs/QmNewCid/degens/7.gif',
    } as any)

    spyOn(degen, 'uploadToS3').mockResolvedValue(undefined)
    spyOn(degen, 'refreshOpenSea').mockResolvedValue(undefined)

    mockGetAssetPath.mockClear()

    await degen.updateDegenImage(7, {
      name: 'Legend',
      image: 'ipfs://old.png',
      description: '',
      attributes: [{ trait_type: 'Background', value: 'Legendary' }],
    } as any)

    // Legendary → .gif
    expect(mockGetAssetPath).toHaveBeenCalledWith('degens', '7.gif')
  })
})
