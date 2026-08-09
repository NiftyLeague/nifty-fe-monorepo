import { CID } from 'multiformats/cid'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const mockAdd = mock<() => Promise<any>>()
const mockCat = mock()
const mockPinAdd = mock<() => Promise<any>>()
const mockPinRm = mock<() => Promise<any>>()
const mockPinLs = mock()
const mockFetch = mock<() => Promise<any>>()

const mockCreate = mock().mockReturnValue({
  add: mockAdd,
  cat: mockCat,
  pin: { add: mockPinAdd, rm: mockPinRm, ls: mockPinLs },
})

mock.module('kubo-rpc-client', () => ({
  create: mockCreate,
}))

mock.module('node-config-ts', () => ({
  config: {
    ipfs: {
      protocol: 'https',
      host: 'api.ipfs.io',
      port: 5001,
      path: '',
      authorization: 'Bearer test-token',
      gatewayURL: 'https://nifty-league.infura-ipfs.io/ipfs',
      pinata: { pinataApiKey: '***', pinataSecretApiKey: '***' },
    },
  },
}))

mock.module('node-fetch', () => ({
  default: mockFetch,
}))

mock.module('@/contracts', () => ({
  getContractFactory: mock<() => Promise<null>>().mockResolvedValue(null),
}))

mock.module('@/utils/refreshMetadata', () => ({
  refreshOpenSea: mock(),
}))

mock.module('@/utils/uploadToS3', () => ({
  uploadToS3: mock(),
}))

const SAMPLE_CID = 'bafybeih75ntopwuggljajz3p2y2mh2ylxfv6joqlbvo2wxtabxkxm6igaa'

const { Minty } = await import('./minty')

function makeMinty() {
  return new Minty('mainnet', 'NiftyDegen')
}

beforeEach(() => {
  ;(mockAdd.mockClear(),
    mockCat.mockClear(),
    mockPinAdd.mockClear(),
    mockPinRm.mockClear(),
    mockPinLs.mockClear(),
    mockFetch.mockClear(),
    mockCreate.mockClear())

  mockAdd.mockClear()
  mockCat.mockClear()
  mockPinAdd.mockClear()
  mockPinRm.mockClear()
  mockPinLs.mockClear()
  mockFetch.mockClear()
})

describe('Minty.init', () => {
  it('creates an IPFS client via kubo-rpc-client', async () => {
    const minty = makeMinty()
    await minty.init()
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(minty.ipfs).toBeTruthy()
  })

  it('is idempotent', async () => {
    const minty = makeMinty()
    await minty.init()
    await minty.init()
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })
})

describe('Minty.pinImage', () => {
  it('uploads to IPFS and pins on Pinata via REST API', async () => {
    const minty = makeMinty()
    await minty.init()

    const cid = CID.parse(SAMPLE_CID)
    mockAdd.mockResolvedValue({ cid, size: 1234 })
    mockFetch.mockResolvedValue({ ok: true, status: 200, text: async () => 'OK' })

    const content = Buffer.from('fake image data')
    const result = await minty.pinImage('/degens/1.png', content)

    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(result.assetCid).toBe(cid)
    expect(result.assetURI).toContain(SAMPLE_CID)
    expect(result.assetURI).toContain('/degens/1.png')

    // Pinata REST call
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const call = mockFetch.mock.calls[0] as unknown as [string, any]
    expect(call[0]).toBe('https://api.pinata.cloud/pinning/pinByHash')
    expect(call[1].method).toBe('POST')
    const body = JSON.parse(call[1].body)
    expect(body.hashToPin).toBe(SAMPLE_CID)
    expect(body.pinataMetadata.name).toBe('/degens/1.png')
  })

  it('returns empty result when IPFS client is not initialized', async () => {
    const minty = makeMinty()
    // Don't call init()
    const result = await minty.pinImage('/degens/1.png', Buffer.from('data'))
    expect(result.assetURI).toBe('')
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('continues when Pinata pinByHash fails', async () => {
    const minty = makeMinty()
    await minty.init()

    const cid = CID.parse(SAMPLE_CID)
    mockAdd.mockResolvedValue({ cid, size: 1234 })
    mockFetch.mockResolvedValue({ ok: false, status: 403, text: async () => 'Forbidden' })

    const result = await minty.pinImage('/degens/1.png', Buffer.from('data'))
    expect(result.assetCid).toBe(cid)
    expect(result.assetURI).toContain(SAMPLE_CID)
  })
})

describe('Minty.getIPFS / getIPFSString / getIPFSJSON', () => {
  it('reads content from IPFS via cat()', async () => {
    const minty = makeMinty()
    await minty.init()

    const data = new TextEncoder().encode('hello ipfs')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const bytes = await minty.getIPFS(SAMPLE_CID)
    expect(bytes).toBeDefined()
    expect(new TextDecoder().decode(bytes!)).toBe('hello ipfs')
  })

  it('returns content as a string', async () => {
    const minty = makeMinty()
    await minty.init()

    const data = new TextEncoder().encode('{"name":"test"}')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const str = await minty.getIPFSString(SAMPLE_CID)
    expect(str).toBe('{"name":"test"}')
  })

  it('parses JSON content', async () => {
    const minty = makeMinty()
    await minty.init()

    const data = new TextEncoder().encode('{"name":"test"}')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const json = await minty.getIPFSJSON(`ipfs://${SAMPLE_CID}`)
    expect(json).toEqual({ name: 'test' })
  })
})

describe('Minty.pin / unpin / isPinned', () => {
  it('pins a CID on the IPFS node', async () => {
    const minty = makeMinty()
    await minty.init()

    mockPinLs.mockReturnValue((async function* () {})())
    mockPinAdd.mockResolvedValue(SAMPLE_CID)

    await minty.pin(SAMPLE_CID)
    expect(mockPinAdd).toHaveBeenCalledTimes(1)
  })

  it('skips pinning if already pinned', async () => {
    const minty = makeMinty()
    await minty.init()

    // isPinned returns a result → already pinned
    mockPinLs.mockReturnValue(
      (async function* () {
        yield { cid: CID.parse(SAMPLE_CID), type: 'recursive' }
      })()
    )

    await minty.pin(SAMPLE_CID)
    expect(mockPinAdd).not.toHaveBeenCalled()
  })

  it('unpins a CID', async () => {
    const minty = makeMinty()
    await minty.init()

    mockPinLs.mockReturnValue(
      (async function* () {
        yield { cid: CID.parse(SAMPLE_CID), type: 'recursive' }
      })()
    )
    mockPinRm.mockResolvedValue(SAMPLE_CID)

    await minty.unpin(SAMPLE_CID)
    expect(mockPinRm).toHaveBeenCalledTimes(1)
  })

  it('detects a pinned CID', async () => {
    const minty = makeMinty()
    await minty.init()

    mockPinLs.mockReturnValue(
      (async function* () {
        yield { cid: CID.parse(SAMPLE_CID), type: 'recursive' }
      })()
    )

    expect(await minty.isPinned(SAMPLE_CID)).toBe(true)
  })

  it('returns false for an unpinned CID', async () => {
    const minty = makeMinty()
    await minty.init()

    mockPinLs.mockReturnValue((async function* () {})())

    expect(await minty.isPinned(SAMPLE_CID)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Contract helpers — getTokenOwner, getNFTMetadata, checkTokenMetadataExists,
// getNFT, getCreationInfo
// ---------------------------------------------------------------------------

describe('Minty.getTokenOwner', () => {
  it('reads the owner address from the contract', async () => {
    const minty = makeMinty()
    minty.contract = { ownerOf: mock().mockResolvedValue('0xDeAdBeEf123') } as never
    expect(await minty.getTokenOwner(42)).toBe('0xDeAdBeEf123')
  })

  it('returns undefined when no contract is initialized', async () => {
    const minty = makeMinty()
    expect(await minty.getTokenOwner(42)).toBeUndefined()
  })
})

describe('Minty.getNFTMetadata', () => {
  it('fetches metadata from IPFS when tokenURI starts with ipfs:', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = { tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`) } as never

    const data = new TextEncoder().encode('{"name":"dood","power":9001}')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const { metadata, metadataURI } = await minty.getNFTMetadata(1)
    expect(metadata).toEqual({ name: 'dood', power: 9001 })
    expect(metadataURI).toBe(`ipfs://${SAMPLE_CID}`)
  })

  it('fetches metadata via HTTP for non-ipfs URIs', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = {
      tokenURI: mock().mockResolvedValue('https://api.example.com/nft/1'),
    } as never

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ name: 'web-nft', desc: 'fetched via http' }),
    })

    const { metadata, metadataURI } = await minty.getNFTMetadata(2)
    expect(metadata).toEqual({ name: 'web-nft', desc: 'fetched via http' })
    expect(metadataURI).toBe('https://api.example.com/nft/1')
  })

  it('skips metadata when the HTTP response status is >= 400', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = {
      tokenURI: mock().mockResolvedValue('https://api.example.com/nft/missing'),
    } as never

    mockFetch.mockResolvedValue({ status: 404 })

    const { metadata } = await minty.getNFTMetadata(3)
    expect(metadata).toBeUndefined()
  })

  it('returns empty result when contract is not initialized', async () => {
    const minty = makeMinty()
    const { metadata, metadataURI } = await minty.getNFTMetadata(1)
    expect(metadata).toBeUndefined()
    expect(metadataURI).toBeUndefined()
  })
})

describe('Minty.checkTokenMetadataExists', () => {
  it('returns exists=true when metadata is available', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = { tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`) } as never

    const data = new TextEncoder().encode('{"name":"present"}')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const result = await minty.checkTokenMetadataExists(1)
    expect(result.exists).toBe(true)
    expect(result.metadata).toEqual({ name: 'present' })
  })

  it('returns exists=false when metadata is empty', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = { tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`) } as never

    mockCat.mockReturnValue((async function* () {})())

    const result = await minty.checkTokenMetadataExists(1)
    expect(result.exists).toBe(false)
    expect(result.metadata).toBeFalsy()
  })
})

describe('Minty.getNFT', () => {
  it('returns basic NFT info with an asset gateway URL', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = {
      tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`),
      ownerOf: mock().mockResolvedValue('0xOwner'),
    } as never

    const data = new TextEncoder().encode('{"name":"basic","image":"ipfs://QmImg"}')
    mockCat.mockReturnValue(
      (async function* () {
        yield data
      })()
    )

    const nft = await minty.getNFT(1, {})
    expect(nft.tokenId).toBe(1)
    expect(nft.ownerAddress).toBe('0xOwner')
    expect(nft.metadata).toEqual({ name: 'basic', image: 'ipfs://QmImg' })
    expect(nft.assetURI).toBe('ipfs://QmImg')
    expect(nft.assetGatewayURL).toContain('//')
    expect(nft.assetDataBase64).toBe('')
    expect(nft.creationInfo).toBeUndefined()
  })

  it('returns minimal result when metadata is unavailable', async () => {
    const minty = makeMinty()
    minty.contract = { tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`) } as never
    // no init() called → ipfs is null → getIPFSJSON returns null

    const nft = await minty.getNFT(2, {})
    expect(nft.tokenId).toBe(2)
    expect(nft.metadata).toBeNull()
    expect(nft.metadataURI).toBe(`ipfs://${SAMPLE_CID}`)
  })

  it('fetches asset base64 data when fetchAsset is true', async () => {
    const minty = makeMinty()
    await minty.init()
    minty.contract = {
      tokenURI: mock().mockResolvedValue(`ipfs://${SAMPLE_CID}`),
      ownerOf: mock().mockResolvedValue('0xOwner'),
    } as never

    const metaData = new TextEncoder().encode('{"name":"asset-test","image":"ipfs://QmAsset"}')
    mockCat.mockReturnValue(
      (async function* () {
        yield metaData
      })()
    )

    const assetData = new TextEncoder().encode('raw-asset-bytes')
    mockCat
      .mockReturnValueOnce(
        (async function* () {
          yield metaData
        })()
      ) // metadata call
      .mockReturnValueOnce(
        (async function* () {
          yield assetData
        })()
      ) // asset call

    const nft = await minty.getNFT(3, { fetchAsset: true })
    expect(nft.metadata.name).toBe('asset-test')
    // assetDataBase64 should be set — getIPFSBase64 returns base64 of 'raw-asset-bytes'
    expect(nft.assetDataBase64).toBeTruthy()
  })
})

describe('Minty.getCreationInfo', () => {
  it('extracts block number and creator from Transfer events', async () => {
    const minty = makeMinty()
    await minty.init()

    const mockFilter = {}
    const mockLog = {
      blockNumber: 77_777,
      args: { to: '0xCrEaToR' },
    }

    minty.contract = {
      filters: { Transfer: mock().mockReturnValue(mockFilter) },
      queryFilter: mock().mockResolvedValue([mockLog]),
    } as never

    const info = await minty.getCreationInfo(1)
    expect(info).toBeDefined()
    expect(info!.blockNumber).toBe(77_777)
    expect(info!.creatorAddress).toBe('0xCrEaToR')
  })

  it('returns undefined when no contract is initialized', async () => {
    const minty = makeMinty()
    expect(await minty.getCreationInfo(1)).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Remote-service wrappers and remaining uncovered branches
// ---------------------------------------------------------------------------

describe('Minty.getIPFSJSON — null return path', () => {
  it('returns null when getIPFSString yields no content', async () => {
    const minty = makeMinty()
    // No init() called → this.ipfs is null → getIPFS returns null →
    // getIPFSString returns null → str && JSON.parse(str) short-circuits to null
    const result = await minty.getIPFSJSON(`ipfs://${SAMPLE_CID}`)
    expect(result).toBeNull()
  })
})

describe('Minty.uploadToS3 wrapper', () => {
  it('delegates to the imported uploadToS3 with correct arguments', async () => {
    const { uploadToS3: mockedUploadToS3 } = await import('@/utils/uploadToS3')
    const minty = makeMinty()

    const content = Buffer.from('test-content')
    await minty.uploadToS3('degens/test.json', content, 'my-bucket')

    expect(mockedUploadToS3).toHaveBeenCalledTimes(1)
    expect(mockedUploadToS3).toHaveBeenCalledWith('degens/test.json', content, true, 'my-bucket')
  })
})

describe('Minty.refreshOpenSea wrapper', () => {
  it('delegates to refreshOpenSea with the correct target network, token ID, and contract name', async () => {
    const { refreshOpenSea: mockedRefreshOpenSea } = await import('@/utils/refreshMetadata')
    const minty = makeMinty()

    await minty.refreshOpenSea(99)

    expect(mockedRefreshOpenSea).toHaveBeenCalledTimes(1)
    expect(mockedRefreshOpenSea).toHaveBeenCalledWith('mainnet', 99, 'NiftyDegen')
  })
})
