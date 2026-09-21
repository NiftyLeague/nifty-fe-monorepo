/**
 * Cloudflare Workers entrypoint.
 *
 * Routes and behaviour mirror the Express app in `src/index.ts` (which keeps
 * serving local `bun start`), with Express (req, res) idioms replaced by the
 * Workers fetch/response model:
 * - `pipeRequest` becomes a proxied `fetch` returning the upstream body stream.
 * - CORS and the security headers the platform applied from config are set
 *   on every response here.
 * - The one JSON POST body (webhook) is parsed with `request.json()`.
 *
 * Config resolves through the `node-config-ts` shim (see wrangler.jsonc
 * `alias`), which substitutes the config's `@@ENV` placeholders from Worker
 * bindings — deployed secrets and vars land on process.env before module eval.
 */
import { timingSafeEqual } from 'node:crypto'

import { config } from 'node-config-ts'

import { DEFAULTS, getEndpoints } from './constants/api'
import { CONTRACT_METHODS } from './constants/contracts'
import { CDN_BASE_URL, DEGENS_ASSET_PREFIX, MARKETPLACE_ASSET_PREFIX } from './constants/aws'
import { MARKETPLACE_COLLECTION_METADATA } from './constants/metadata/marketplace'
import { getBurnedDegens } from './utils/degensBurned'
import { fetchMetadata } from './utils/api'
import { handleNameChangeByInput } from './utils/handleNameChange'
import {
  resolveCirculatingSupply,
  resolveMaxSupply,
  resolveTotalSupply,
  resolveUnclaimedSupply,
} from './utils/nftl'
import type { Attribute, TargetNetwork } from './types'

const TARGET_NETWORKS: readonly TargetNetwork[] = ['mainnet', 'sepolia']
const MAX_DEGEN_TOKEN_ID = 10_000
const MAX_MARKETPLACE_TOKEN_ID = 107
const PUBLIC_CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=300'
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=86400, immutable'

const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'access-control-allow-origin': '*',
}

const isTargetNetwork = (value: string | undefined): value is TargetNetwork =>
  value !== undefined && TARGET_NETWORKS.includes(value as TargetNetwork)

const isTokenId = (value: string | undefined, max: number) => {
  if (!value || !/^\d+$/.test(value)) return false
  const tokenId = Number(value)
  return Number.isSafeInteger(tokenId) && tokenId >= 1 && tokenId <= max
}

const hasSecret = (supplied: string | undefined, expected: string | undefined) => {
  if (!supplied || !expected) return false
  const suppliedBytes = Buffer.from(supplied)
  const expectedBytes = Buffer.from(expected)
  return (
    suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes)
  )
}

const jsonResponse = (body: unknown, status = 200, cacheControl?: string): Response => {
  const headers = new Headers({ 'content-type': 'application/json; charset=utf-8' })
  if (cacheControl) headers.set('cache-control', cacheControl)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)
  return new Response(JSON.stringify(body), { status, headers })
}

/** Streams an allow-listed CDN URL straight through to the client. */
const pipeAsResponse = async (url: string): Promise<Response> => {
  let upstream: URL
  try {
    upstream = new URL(url)
  } catch {
    return jsonResponse({ errors: [{ message: 'Unsupported upstream URL' }] }, 400)
  }
  if (upstream.origin !== new URL(CDN_BASE_URL).origin) {
    return jsonResponse({ errors: [{ message: 'Unsupported upstream URL' }] }, 400)
  }
  let cdnResponse: Response
  try {
    cdnResponse = await fetch(upstream, {
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return jsonResponse({ errors: [{ message: 'Upstream request failed' }] }, 502)
  }
  if (cdnResponse.status >= 400) {
    return jsonResponse(
      { errors: [{ message: `Upstream error: ${cdnResponse.status}` }] },
      cdnResponse.status
    )
  }
  const headers = new Headers(cdnResponse.headers)
  const contentType = headers.get('content-type')
  headers.delete('content-encoding')
  headers.delete('transfer-encoding')
  if (contentType) headers.set('content-type', contentType)
  // S3 metadata / images are immutable — let the edge cache them.
  headers.set('cache-control', IMMUTABLE_CACHE_CONTROL)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)
  return new Response(cdnResponse.body, { status: 200, headers })
}

const buildBaseUrl = (request: Request): string => {
  const url = new URL(request.url)
  const host =
    url.host ||
    (config.host ? config.host[config.eth.network as TargetNetwork] : undefined) ||
    'api.niftyleague.com'
  return `https://${host}`
}

const handleSupply = (supply: string | null): Response =>
  supply
    ? jsonResponse(supply, 200, PUBLIC_CACHE_CONTROL)
    : jsonResponse({ errors: [{ message: 'Unable to resolve supply.' }] }, 500)

const resolveDegenBackground = async (
  network: TargetNetwork,
  tokenId: string
): Promise<Response> => {
  const metadata = await fetchMetadata(
    `${CDN_BASE_URL}/degens/metadata/${encodeURIComponent(tokenId)}.json`
  )
  const background = metadata?.attributes?.find((a: Attribute) => a.trait_type === 'Background')
  if (background) return jsonResponse(background.value)
  return jsonResponse({ errors: [{ message: 'Background not found' }] }, 404)
}

const handleWebhook = async (
  network: TargetNetwork,
  secret: string | undefined,
  request: Request
): Promise<Response> => {
  if (
    !hasSecret(secret, config.blocknative.webhookSecret) ||
    !isTargetNetwork(network) ||
    network !== 'mainnet'
  ) {
    return new Response(null, { status: 404 })
  }

  let body: {
    status?: unknown
    direction?: unknown
    apiKey?: unknown
    input?: unknown
  } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    body = {}
  }

  if (
    body.status === 'confirmed' &&
    body.direction === 'incoming' &&
    body.apiKey === config.blocknative.apiKey?.degens &&
    typeof body.input === 'string' &&
    body.input.startsWith(CONTRACT_METHODS.RENAME)
  ) {
    await handleNameChangeByInput(network, body.input)
  }
  return new Response(null, { status: 200 })
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'
    const segments = path.split('/').filter(Boolean)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, OPTIONS',
          'access-control-allow-headers': 'content-type',
        },
      })
    }

    if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { allow: 'GET, POST, HEAD' } })
    }
    if (request.method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: { ...SECURITY_HEADERS, allow: 'GET, POST, HEAD' },
      })
    }

    // NFTL supply
    if (
      request.method === 'GET' &&
      (path === '/NFTL/supply' || path === '/NFTL/supply/circulating')
    )
      return handleSupply(await resolveCirculatingSupply())
    if (request.method === 'GET' && path === '/NFTL/supply/unclaimed')
      return handleSupply(await resolveUnclaimedSupply())
    if (request.method === 'GET' && path === '/NFTL/supply/total')
      return handleSupply(await resolveTotalSupply())
    if (request.method === 'GET' && path === '/NFTL/supply/max')
      return handleSupply(await resolveMaxSupply())

    // Burn list
    if (request.method === 'GET' && path === '/degens/burn-list') {
      const burnList = await getBurnedDegens()
      if (burnList) return jsonResponse(burnList)
      return jsonResponse({ errors: [{ message: 'Unable to resolve burn list.' }] }, 500)
    }

    // DEGEN metadata / image / background: /:network/degen/...
    if (
      segments.length === 4 &&
      segments[1] === 'degen' &&
      (segments[2] === 'metadata' || segments[2] === 'image' || segments[3] !== undefined)
    ) {
      const [network, kind, tokenId] = [segments[0], segments[2], segments[3]]
      if (request.method === 'GET' && kind === 'metadata' && isTargetNetwork(network)) {
        if (!isTokenId(tokenId, MAX_DEGEN_TOKEN_ID)) return new Response(null, { status: 404 })
        return pipeAsResponse(`${CDN_BASE_URL}/${DEGENS_ASSET_PREFIX}/metadata/${tokenId}.json`)
      }
      if (request.method === 'GET' && kind === 'image' && isTargetNetwork(network)) {
        if (!isTokenId(tokenId, MAX_DEGEN_TOKEN_ID)) return new Response(null, { status: 404 })
        // All degen imagery is WebP on the CDN (animated webp for legendaries/Hydras).
        return pipeAsResponse(`${CDN_BASE_URL}/${DEGENS_ASSET_PREFIX}/images/bg/md/${tokenId}.webp`)
      }
      if (request.method === 'GET' && kind !== 'metadata' && kind !== 'image') {
        if (!isTargetNetwork(network) || !isTokenId(kind, MAX_DEGEN_TOKEN_ID)) {
          return new Response(null, { status: 404 })
        }
        return resolveDegenBackground(network, kind)
      }
    }

    // Marketplace: /imx/marketplace/...
    if (request.method === 'GET' && path === '/imx/marketplace/collection.json') {
      return jsonResponse(MARKETPLACE_COLLECTION_METADATA, 200, 'public, max-age=3600, immutable')
    }
    if (
      request.method === 'GET' &&
      segments[0] === 'imx' &&
      segments[1] === 'marketplace' &&
      (segments[2] === 'metadata' || segments[2] === 'images') &&
      segments.length === 4
    ) {
      let tokenId = segments[3]
      if (segments[2] === 'metadata' && tokenId.endsWith('.json')) tokenId = tokenId.slice(0, -5)
      if (!isTokenId(tokenId, MAX_MARKETPLACE_TOKEN_ID)) return new Response(null, { status: 404 })
      if (segments[2] === 'metadata')
        return pipeAsResponse(
          `${CDN_BASE_URL}/${MARKETPLACE_ASSET_PREFIX}/metadata/${tokenId}.json`
        )
      // COMICS 1-100 are PNG, Items 101+ are GIF
      const fileType = Number(tokenId) <= 100 ? 'png' : 'gif'
      return pipeAsResponse(
        `${CDN_BASE_URL}/${MARKETPLACE_ASSET_PREFIX}/images/${tokenId}.${fileType}`
      )
    }

    // Webhooks: POST /:network/webhooks/degen/:secret
    if (
      request.method === 'POST' &&
      segments.length === 4 &&
      segments[1] === 'webhooks' &&
      segments[2] === 'degen'
    ) {
      return handleWebhook(segments[0] as TargetNetwork, segments[3], request)
    }

    // Index: describe the API
    if (request.method === 'GET' && path === '/') {
      return jsonResponse({ ...DEFAULTS, endpoints: getEndpoints(buildBaseUrl(request)) })
    }

    return new Response(null, { status: 404 })
  },
}
