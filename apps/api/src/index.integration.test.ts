import request from 'supertest'
import type { Express } from 'express'
import { beforeAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { DEFAULTS, getEndpoints } from './constants/api'
import {
  MARKETPLACE_COLLECTION_METADATA,
  MARKETPLACE_ITEMS,
} from './constants/metadata/marketplace'

// ---------------------------------------------------------------------------
// Mocks — isolate the app from all external services
// ---------------------------------------------------------------------------

// NFTL supply resolvers (no live Etherscan / contract RPC)
const mockResolveCirculatingSupply = mock<() => Promise<any>>()
const mockResolveUnclaimedSupply = mock<() => Promise<any>>()
const mockResolveTotalSupply = mock<() => Promise<any>>()
const mockResolveMaxSupply = mock<() => Promise<any>>()

mock.module('./utils/nftl', () => ({
  resolveCirculatingSupply: mockResolveCirculatingSupply,
  resolveUnclaimedSupply: mockResolveUnclaimedSupply,
  resolveTotalSupply: mockResolveTotalSupply,
  resolveMaxSupply: mockResolveMaxSupply,
}))

// Burned degens list (no live Alchemy RPC)
const mockGetBurnedDegens = mock<() => Promise<any>>()
mock.module('./utils/degensBurned', () => ({
  getBurnedDegens: mockGetBurnedDegens,
}))

// S3 / network helpers — pipeRequest writes mock data directly to the
// response, resolveDegenMetadata returns controlled metadata.
const MOCK_DEGEN_METADATA = {
  name: 'DEGEN #123',
  description: 'Test degen',
  image: 'ipfs://test-cid/degens/123.png',
  attributes: [{ trait_type: 'Background', value: 'Common' }],
}

const mockPipeRequest = mock((url: string, res: any) => {
  const tokenId = url.match(/(\d+)\.(json|png|gif)$/)?.[1] ?? '1'
  const ext = url.match(/(\d+)\.(json|png|gif)$/)?.[2] ?? 'json'
  if (ext === 'json') {
    // Metadata route — return the matching marketplace item when the URL
    // points at the marketplace bucket, otherwise generic degen metadata.
    const marketplaceMatch = url.match(/marketplace\/metadata\/(\d+)\.json/)
    if (marketplaceMatch) {
      const idx = Number(marketplaceMatch[1]) - 1
      const item = MARKETPLACE_ITEMS[idx] ?? { name: `Item #${marketplaceMatch[1]}` }
      res.setHeader('content-type', 'application/json')
      res.send(item)
    } else {
      res.setHeader('content-type', 'application/json')
      res.send({ ...MOCK_DEGEN_METADATA, name: `DEGEN #${tokenId}` })
    }
  } else {
    // Image route — return a tiny valid payload with the expected type.
    res.setHeader('content-type', ext === 'gif' ? 'image/gif' : 'image/png')
    res.send(Buffer.from('mock-image'))
  }
})

const mockResolveDegenMetadata = mock<() => Promise<any>>().mockResolvedValue(MOCK_DEGEN_METADATA)

mock.module('./utils/api', () => ({
  pipeRequest: mockPipeRequest,
  resolveDegenMetadata: mockResolveDegenMetadata,
  fetchMetadata: mock(),
  sleep: mock(),
}))

const mockCheckTokenMetadataExists = mock<() => Promise<any>>()
const mockUpdateDegenName = mock<() => Promise<any>>()
const mockDegenInstance = {
  checkTokenMetadataExists: mockCheckTokenMetadataExists,
  updateDegenName: mockUpdateDegenName,
}
const mockMakeDegen = mock(async () => mockDegenInstance)

mock.module('./classes/degen', () => ({
  MakeDegen: mockMakeDegen,
  Degen: class {},
}))

// ---------------------------------------------------------------------------
// Dynamic import — the app must load *after* all mocks are registered.
// ---------------------------------------------------------------------------

let app: Express
let handleNameChangeById: typeof import('./utils/handleNameChange').handleNameChangeById
beforeAll(async () => {
  ;({ handleNameChangeById } = await import('./utils/handleNameChange'))
  app = (await import('./index')).default
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NFTL_MIN_SUPPLY = 500000000000000000000000000n
const CIRCULATING = (NFTL_MIN_SUPPLY + 1n).toString()
const UNCLAIMED = '1234'
const TOTAL = (NFTL_MIN_SUPPLY + 1n + 1234n).toString()

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('API Endpoints', () => {
  // -----------------------------------------------------------------------
  // Root
  // -----------------------------------------------------------------------

  describe('Root', () => {
    it('GET / — returns API details with name, version, and endpoints', async () => {
      const response = await request(app).get('/')
      // The handler builds the base URL from X-Forwarded-Proto (defaulting to
      // https) and the Host header, so the protocol is always https here.
      const baseUrl = `https://${response.request.host}`
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        ...DEFAULTS,
        endpoints: getEndpoints(baseUrl),
      })
      expect(response.body.name).toBe('Nifty League Contracts API')
      expect(response.body.version).toBeDefined()
      expect(response.body.endpoints.NFTL).toBeDefined()
      expect(response.body.endpoints.DEGENs).toBeDefined()
      expect(response.body.endpoints.MARKETPLACE).toBeDefined()
    })
  })

  // -----------------------------------------------------------------------
  // NFTL Supply
  // -----------------------------------------------------------------------

  describe('NFTL', () => {
    beforeEach(() => {
      mockResolveCirculatingSupply.mockResolvedValue(CIRCULATING)
      mockResolveUnclaimedSupply.mockResolvedValue(UNCLAIMED)
      mockResolveTotalSupply.mockResolvedValue(TOTAL)
      mockResolveMaxSupply.mockResolvedValue(TOTAL)
    })

    it('GET /NFTL/supply — alias for circulating supply', async () => {
      const response = await request(app).get('/NFTL/supply')
      expect(response.status).toBe(200)
      expect(response.text).toBe(CIRCULATING)
    })

    it('GET /NFTL/supply/circulating — returns circulating supply', async () => {
      const response = await request(app).get('/NFTL/supply/circulating')
      expect(response.status).toBe(200)
      expect(response.text).toBe(CIRCULATING)
      expect(BigInt(response.text)).toBeGreaterThan(NFTL_MIN_SUPPLY)
    })

    it('GET /NFTL/supply/unclaimed — returns unclaimed supply', async () => {
      const response = await request(app).get('/NFTL/supply/unclaimed')
      expect(response.status).toBe(200)
      expect(response.text).toBe(UNCLAIMED)
    })

    it('GET /NFTL/supply/total — returns total supply (circulating + unclaimed)', async () => {
      const response = await request(app).get('/NFTL/supply/total')
      expect(response.status).toBe(200)
      expect(response.text).toBe(TOTAL)
      expect(BigInt(response.text)).toBe(BigInt(CIRCULATING) + BigInt(UNCLAIMED))
    })

    it('GET /NFTL/supply/max — returns max supply (total + emissions)', async () => {
      const response = await request(app).get('/NFTL/supply/max')
      expect(response.status).toBe(200)
      expect(response.text).toBe(TOTAL)
      expect(BigInt(response.text)).toBeGreaterThan(NFTL_MIN_SUPPLY)
    })

    it('returns 500 when a supply resolver fails', async () => {
      mockResolveCirculatingSupply.mockResolvedValue(null)
      const response = await request(app).get('/NFTL/supply/circulating')
      expect(response.status).toBe(500)
      expect(response.body.errors[0].message).toMatch(/supply/i)
    })

    it('returns 500 for /NFTL/supply/total when a component is missing', async () => {
      mockResolveTotalSupply.mockResolvedValue(null)
      const response = await request(app).get('/NFTL/supply/total')
      expect(response.status).toBe(500)
    })
  })

  // -----------------------------------------------------------------------
  // DEGENs
  // -----------------------------------------------------------------------

  describe('DEGENs', () => {
    const network = 'sepolia'
    const tokenId = 123

    beforeEach(() => {
      mockGetBurnedDegens.mockResolvedValue([1, 2, 3, 4, 5])
      mockResolveDegenMetadata.mockResolvedValue(MOCK_DEGEN_METADATA)
    })

    it('GET /degens/burn-list — returns burned token IDs', async () => {
      const response = await request(app).get('/degens/burn-list')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([1, 2, 3, 4, 5])
      expect(response.body).toHaveLength(5)
    })

    it('GET /:network/degen/metadata/:token_id — returns degen metadata JSON', async () => {
      const response = await request(app).get(`/${network}/degen/metadata/${tokenId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/json/)
      expect(response.body.name).toBe(`DEGEN #${tokenId}`)
      expect(response.body.description).toBeDefined()
    })

    it('GET /:network/degen/image/:token_id — returns image with correct content-type', async () => {
      const response = await request(app).get(`/${network}/degen/image/${tokenId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/image\/(png|gif)/)
    })

    it('GET /:network/degen/:token_id/background — returns background value', async () => {
      const response = await request(app).get(`/${network}/degen/${tokenId}/background`)
      expect(response.status).toBe(200)
      expect(response.text).toBe('Common')
    })

    it('GET /:network/degen/:token_id/background — returns 404 when no background attribute', async () => {
      mockResolveDegenMetadata.mockResolvedValueOnce({
        ...MOCK_DEGEN_METADATA,
        attributes: [{ trait_type: 'Other', value: 'test' }],
      })
      const response = await request(app).get(`/${network}/degen/${tokenId}/background`)
      expect(response.status).toBe(404)
      expect(response.body.errors[0].message).toMatch(/background/i)
    })

    it('returns 404 for an invalid network or token id instead of proxying it', async () => {
      const invalidNetwork = await request(app).get('/unknown/degen/image/123')
      const invalidToken = await request(app).get('/sepolia/degen/image/not-a-token')
      expect(invalidNetwork.status).toBe(404)
      expect(invalidToken.status).toBe(404)
    })
  })

  // -----------------------------------------------------------------------
  // MARKETPLACE
  // -----------------------------------------------------------------------

  describe('MARKETPLACE', () => {
    const comicId = 2
    const itemId = 101

    it('GET /imx/marketplace/collection.json — returns collection metadata', async () => {
      const response = await request(app).get('/imx/marketplace/collection.json')
      expect(response.status).toBe(200)
      expect(response.body).toEqual(MARKETPLACE_COLLECTION_METADATA)
      expect(response.body.name).toBeDefined()
      expect(response.body.description).toBeDefined()
      expect(response.body.image).toBeDefined()
      expect(response.body.external_link).toBe('https://niftyleague.com')
    })

    it('GET /imx/marketplace/metadata/:token_id — returns comic metadata (token ≤ 100)', async () => {
      const response = await request(app).get(`/imx/marketplace/metadata/${comicId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/json/)
      // The mock returns MARKETPLACE_ITEMS[tokenId - 1]
      expect(response.body.name).toBe(MARKETPLACE_ITEMS[comicId - 1].name)
    })

    it('GET /imx/marketplace/metadata/:token_id — supports .json suffix', async () => {
      const response = await request(app).get(`/imx/marketplace/metadata/${comicId}.json`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/json/)
      expect(response.body.name).toBe(MARKETPLACE_ITEMS[comicId - 1].name)
    })

    it('GET /imx/marketplace/metadata/:token_id — returns item metadata (token > 100)', async () => {
      const response = await request(app).get(`/imx/marketplace/metadata/${itemId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/json/)
      // itemId 101 exceeds the local items array — the mock returns a fallback name
      expect(response.body.name).toBeDefined()
    })

    it('GET /imx/marketplace/images/:token_id — returns PNG for comics (token ≤ 100)', async () => {
      const response = await request(app).get(`/imx/marketplace/images/${comicId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/image\/png/)
    })

    it('GET /imx/marketplace/images/:token_id — returns GIF for items (token > 100)', async () => {
      const response = await request(app).get(`/imx/marketplace/images/${itemId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/image\/gif/)
    })
  })
})

// ---------------------------------------------------------------------------
// Webhooks (Degen factory is mocked to avoid contract/IPFS access)
// ---------------------------------------------------------------------------

describe('API Webhooks', () => {
  describe('DEGENS', () => {
    const network = 'sepolia'
    const tokenId = 1

    const metadata = {
      id: tokenId,
      token_id: tokenId.toString(),
      name: 'Old Name',
      image: `ipfs://bafybeih75ntopwuggljajz3p2y2mh2ylxfv6joqlbvo2wxtabxkxm6igaa/degens/${tokenId}.png`,
      description: 'Original collection of your favorite 10k DEGENs 🎮',
      external_url: `https://staging.app.niftyleague.com/degens/${tokenId}`,
      attributes: [],
    }
    const newMetadata = { ...metadata }
    newMetadata.name = 'New Name'

    beforeEach(() => {
      spyOn(console, 'log').mockImplementation(() => undefined)
    })

    it('should update the metadata on name change', async () => {
      mockCheckTokenMetadataExists.mockResolvedValueOnce({
        exists: true,
        metadata,
        metadataURI: null,
      })
      mockUpdateDegenName.mockResolvedValueOnce({ newMetadata })

      const result = await handleNameChangeById(network, tokenId)

      expect(mockMakeDegen).toHaveBeenCalledWith(network)
      expect(mockCheckTokenMetadataExists).toHaveBeenCalledWith(tokenId)
      expect(mockUpdateDegenName).toHaveBeenCalledWith(tokenId, metadata)
      expect(result).toEqual({ metadata: newMetadata })
    })
  })
})
