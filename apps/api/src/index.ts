import './runtimeConfig.js'
import { config } from 'node-config-ts'
import './config.js' // side-effect: make the runtime config visible to the bundler
import { timingSafeEqual } from 'node:crypto'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { NextFunction, type Express, type Request, type Response } from 'express'

import { getBurnedDegens } from './utils/degensBurned'
import { resolveDegenMetadata, pipeRequest } from './utils/api'
import { handleNameChangeByInput } from './utils/handleNameChange'
import {
  resolveCirculatingSupply,
  resolveMaxSupply,
  resolveTotalSupply,
  resolveUnclaimedSupply,
} from './utils/nftl'

import { DEFAULTS, getEndpoints } from './constants/api'
import { CONTRACT_METHODS } from './constants/contracts'
import { CDN_BASE_URL, DEGENS_ASSET_PREFIX, MARKETPLACE_ASSET_PREFIX } from './constants/aws'
import { MARKETPLACE_COLLECTION_METADATA } from './constants/metadata/marketplace'
import type { Attribute, TargetNetwork } from './types'

const app: Express = express().set('port', config.port || 5005)
app.disable('x-powered-by')

const TARGET_NETWORKS: readonly TargetNetwork[] = ['mainnet', 'sepolia']
const MAX_DEGEN_TOKEN_ID = 10_000
const MAX_MARKETPLACE_TOKEN_ID = 107
const PUBLIC_CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=300'

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

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

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

const asyncRequestHandler =
  (handler: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next)
  }

// The Express app only serves local/bare-node deploys these days (production
// runs src/worker.ts). Trust proxy keeps req.protocol correct behind any
// proxy that terminates TLS, and buildBaseUrl below is defensive too.
app.set('trust proxy', true)

const buildBaseUrl = (req: Request): string => {
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const proto = forwardedProto === 'http' ? 'http' : 'https'
  const host =
    req.get('host') ||
    (config.host ? config.host[config.eth.network as TargetNetwork] : undefined) ||
    'api.niftyleague.com'
  return `${proto}://${host}`
}

app.get('/', function (req: Request, res: Response) {
  const baseUrl = buildBaseUrl(req)
  res.json({
    ...DEFAULTS,
    endpoints: getEndpoints(baseUrl),
  })
})

app.use(bodyParser.json({ limit: '1mb' }))

app.use(cors())

//////////////////////////////////////////////
// ------ NFTL
//////////////////////////////////////////////

const handleCirculatingSupply = async (res: Response, next: NextFunction) => {
  const supply = await resolveCirculatingSupply()
  if (supply) res.setHeader('cache-control', PUBLIC_CACHE_CONTROL).send(supply)
  else next(new Error('Unable to resolve supply.'))
}

app.get(
  '/NFTL/supply',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    await handleCirculatingSupply(res, next)
  })
)

app.get(
  '/NFTL/supply/circulating',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    await handleCirculatingSupply(res, next)
  })
)

app.get(
  '/NFTL/supply/unclaimed',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    const supply = await resolveUnclaimedSupply()
    if (supply) res.setHeader('cache-control', PUBLIC_CACHE_CONTROL).send(supply)
    else next(new Error('Unable to resolve supply.'))
  })
)

app.get(
  '/NFTL/supply/total',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    const supply = await resolveTotalSupply()
    if (supply) res.setHeader('cache-control', PUBLIC_CACHE_CONTROL).send(supply)
    else next(new Error('Unable to resolve supply.'))
  })
)

app.get(
  '/NFTL/supply/max',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    const supply = await resolveMaxSupply()
    if (supply) res.setHeader('cache-control', PUBLIC_CACHE_CONTROL).send(supply)
    else next(new Error('Unable to resolve supply.'))
  })
)

//////////////////////////////////////////////
// ------ DEGENs
//////////////////////////////////////////////

app.get(
  '/degens/burn-list',
  asyncRequestHandler(async function (req: Request, res: Response, next: NextFunction) {
    const burnList = await getBurnedDegens()
    if (burnList) res.send(burnList)
    else next(new Error('Unable to resolve burn list.'))
  })
)

app.get('/:network/degen/metadata/:token_id', function (req: Request, res: Response) {
  const network = getParam(req.params.network)
  const token_id = getParam(req.params.token_id)
  if (!isTargetNetwork(network) || !isTokenId(token_id, MAX_DEGEN_TOKEN_ID)) {
    res.sendStatus(404)
    return
  }
  // Both networks serve the flat mainnet asset layout on R2 (sepolia mirrors
  // mainnet and is no longer written separately).
  pipeRequest(`${CDN_BASE_URL}/${DEGENS_ASSET_PREFIX}/metadata/${token_id}.json`, res)
})

app.get('/:network/degen/image/:token_id', function (req: Request, res: Response) {
  const network = getParam(req.params.network)
  const token_id = getParam(req.params.token_id)
  if (!isTargetNetwork(network) || !isTokenId(token_id, MAX_DEGEN_TOKEN_ID)) {
    res.sendStatus(404)
    return
  }
  // All degen imagery is WebP on the CDN (animated webp for legendaries/Hydras).
  pipeRequest(`${CDN_BASE_URL}/${DEGENS_ASSET_PREFIX}/images/bg/md/${token_id}.webp`, res)
})

app.get(
  '/:network/degen/:token_id/background',
  asyncRequestHandler(async function (req: Request, res: Response) {
    const network = getParam(req.params.network)
    const token_id = getParam(req.params.token_id)
    if (!isTargetNetwork(network) || !isTokenId(token_id, MAX_DEGEN_TOKEN_ID)) {
      res.sendStatus(404)
      return
    }
    const metadata = await resolveDegenMetadata(req)
    const background = metadata?.attributes?.find((a: Attribute) => a.trait_type === 'Background')
    if (background) res.send(background.value)
    else res.status(404).send({ errors: [{ message: 'Background not found' }] })
  })
)

//////////////////////////////////////////////
// ------ MARKETPLACE
//////////////////////////////////////////////

app.get('/imx/marketplace/collection.json', function (req: Request, res: Response) {
  res
    .setHeader('cache-control', 'public, max-age=3600, immutable')
    .send(MARKETPLACE_COLLECTION_METADATA)
})

app.get('/imx/marketplace/metadata/:token_id', function (req: Request, res: Response) {
  let tokenId = getParam(req.params.token_id)
  if (!tokenId) {
    res.sendStatus(404)
    return
  }
  if (tokenId.endsWith('.json')) tokenId = tokenId.slice(0, -5)
  if (!isTokenId(tokenId, MAX_MARKETPLACE_TOKEN_ID)) {
    res.sendStatus(404)
    return
  }
  pipeRequest(`${CDN_BASE_URL}/${MARKETPLACE_ASSET_PREFIX}/metadata/${tokenId}.json`, res)
})

app.get('/imx/marketplace/images/:token_id', function (req: Request, res: Response) {
  const tokenId = getParam(req.params.token_id)
  if (!isTokenId(tokenId, MAX_MARKETPLACE_TOKEN_ID)) {
    res.sendStatus(404)
    return
  }
  // COMICS 1-100 are PNG, Items 101+ are GIF
  const fileType = Number(tokenId) <= 100 ? 'png' : 'gif'
  pipeRequest(`${CDN_BASE_URL}/${MARKETPLACE_ASSET_PREFIX}/images/${tokenId}.${fileType}`, res)
})

//////////////////////////////////////////////
// ------ WEBHOOKS
//////////////////////////////////////////////

app.post('/:network/webhooks/degen/:secret', (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const targetNetwork = getParam(req.params.network)
    const secret = getParam(req.params.secret)
    if (!hasSecret(secret, config.blocknative.webhookSecret) || !isTargetNetwork(targetNetwork)) {
      res.sendStatus(404)
      return
    }

    const tx = (req.body ?? {}) as {
      status?: unknown
      direction?: unknown
      apiKey?: unknown
      input?: unknown
    }
    if (
      targetNetwork === 'mainnet' &&
      tx.status === 'confirmed' &&
      tx.direction === 'incoming' &&
      tx.apiKey === config.blocknative.apiKey.degens &&
      typeof tx.input === 'string'
    ) {
      if (tx.input.startsWith(CONTRACT_METHODS.RENAME)) {
        await handleNameChangeByInput(targetNetwork, tx.input)
      }
    }
    res.sendStatus(200)
  })().catch(next)
})

//////////////////////////////////////////////

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).send({ errors: [{ message: err.message ?? 'Something went wrong' }] })
}

app.use(errorHandler)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})

export default app
