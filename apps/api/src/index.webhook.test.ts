import request from 'supertest'
import type { Express } from 'express'
import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test'

import { CONTRACT_METHODS } from './constants/contracts'

// ---------------------------------------------------------------------------
// Mocks — provide a deterministic config so the webhook route is registered
// with a known secret/apiKey, and isolate the rename handler.
// ---------------------------------------------------------------------------

const WEBHOOK_SECRET = 'test-webhook-secret'
const DEGENS_API_KEY = 'test-degens-api-key'

const IMX_ENV = {
  apiKey: 'imx-api-key',
  client: {
    publicApiUrl: 'https://api.example.com/v1',
    starkContractAddress: '0x0',
    registrationContractAddress: '0x0',
    gasLimit: '7000000',
    gasPrice: '40000000000',
    enableDebug: false,
  },
  company: { name: 'Nifty League', contact: 'info@niftyleague.com', organizationId: 'org' },
  project: { name: 'Nifty League Marketplace', legacyId: 'legacy' },
  collection: {
    contractAddress: '0x0',
    name: 'Nifty Marketplace',
    description: 'desc',
    iconUrl: 'https://niftyleague.com/icon.png',
    imageUrl: 'https://niftyleague.com/image.png',
    metadataApiUrl: 'https://example.com/metadata',
  },
}

mock.module('node-config-ts', () => ({
  config: {
    host: {
      mainnet: 'https://api.niftyleague.com',
      sepolia: 'https://staging.api.niftyleague.com',
    },
    port: 5005,
    aws: {
      apiSecret: 'aws-secret',
      s3: {
        bucket: 'nifty-league',
        clientConfig: {
          region: 'us-east-1',
          credentials: { accessKeyId: 'id', secretAccessKey: 'key' },
        },
      },
    },
    blocknative: {
      webhookSecret: WEBHOOK_SECRET,
      apiKey: { degens: DEGENS_API_KEY, comics: 'comics', p2e: 'p2e' },
    },
    eth: {
      account: { pk: '0x0' },
      network: 'mainnet',
      infura: 'infura',
      etherscan: 'etherscan',
      alchemy: { mainnet: 'alchemy-main', sepolia: 'alchemy-sep' },
      opensea: 'opensea',
    },
    imageGenerator: { baseURL: 'https://image.example.com', secret: 'img-secret', version: 'v1' },
    ipfs: {
      authorization: 'ipfs-auth',
      protocol: 'https',
      host: 'api.ipfs.io',
      port: 5001,
      path: '',
      gatewayURL: 'https://ipfs.io/ipfs',
      pinata: { pinataApiKey: 'pinata-key', pinataSecretApiKey: 'pinata-secret' },
    },
    imx: { mainnet: IMX_ENV, sepolia: IMX_ENV },
  },
}))

const mockHandleNameChangeByInput = mock<(network: string, input: string) => Promise<any>>(() =>
  Promise.resolve({ metadata: {} })
)
mock.module('./utils/handleNameChange', () => ({
  handleNameChangeByInput: mockHandleNameChangeByInput,
  handleNameChangeById: mock(),
}))

// ---------------------------------------------------------------------------
// Dynamic import — the app must load *after* all mocks are registered.
// ---------------------------------------------------------------------------

let app: Express
beforeAll(async () => {
  app = (await import('./index')).default
})

const RENAME_INPUT = `${CONTRACT_METHODS.RENAME}00000000`
const renameTx = (overrides: Record<string, unknown> = {}) => ({
  status: 'confirmed',
  direction: 'incoming',
  apiKey: DEGENS_API_KEY,
  input: RENAME_INPUT,
  ...overrides,
})

const webhookUrl = (network: string, secret: string) => `/${network}/webhooks/degen/${secret}`

describe('Webhook routes (Degen rename)', () => {
  beforeEach(() => {
    mockHandleNameChangeByInput.mockClear()

    mockHandleNameChangeByInput.mockResolvedValue({ metadata: {} })
  })

  it('POST valid confirmed mainnet rename tx -> 200 and handler invoked', async () => {
    const response = await request(app).post(webhookUrl('mainnet', WEBHOOK_SECRET)).send(renameTx())
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).toHaveBeenCalledTimes(1)
    expect(mockHandleNameChangeByInput).toHaveBeenCalledWith('mainnet', RENAME_INPUT)
  })

  it('POST with non-rename input -> 200 but handler not invoked', async () => {
    const response = await request(app)
      .post(webhookUrl('mainnet', WEBHOOK_SECRET))
      .send(renameTx({ input: '0x1234' }))
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST with wrong apiKey -> 200 but handler not invoked', async () => {
    const response = await request(app)
      .post(webhookUrl('mainnet', WEBHOOK_SECRET))
      .send(renameTx({ apiKey: 'wrong-key' }))
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST with unconfirmed status -> 200 but handler not invoked', async () => {
    const response = await request(app)
      .post(webhookUrl('mainnet', WEBHOOK_SECRET))
      .send(renameTx({ status: 'pending' }))
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST with malformed input -> 200 but handler not invoked', async () => {
    const response = await request(app)
      .post(webhookUrl('mainnet', WEBHOOK_SECRET))
      .send(renameTx({ input: null }))
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST on non-mainnet network -> 200 but handler not invoked', async () => {
    const response = await request(app).post(webhookUrl('sepolia', WEBHOOK_SECRET)).send(renameTx())
    expect(response.status).toBe(200)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST with wrong secret -> 404 and handler not invoked', async () => {
    const response = await request(app).post(webhookUrl('mainnet', 'wrong-secret')).send(renameTx())
    expect(response.status).toBe(404)
    expect(mockHandleNameChangeByInput).not.toHaveBeenCalled()
  })

  it('POST when handler throws -> 500 with error payload', async () => {
    mockHandleNameChangeByInput.mockRejectedValueOnce(new Error('rename failed'))
    const response = await request(app).post(webhookUrl('mainnet', WEBHOOK_SECRET)).send(renameTx())
    expect(response.status).toBe(500)
    expect(response.body.errors[0].message).toBe('rename failed')
  })
})
