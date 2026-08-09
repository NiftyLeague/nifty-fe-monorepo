import fetch from 'node-fetch'
import https from 'https'
import type { Request, Response } from 'express'
import type { Metadata } from '@/types'

const REQUEST_TIMEOUT_MS = 10000

// node-fetch v3 accepts an AbortSignal timeout option. Keeps slow/dead
// upstreams from hanging the function up to maxDuration, matching the
// timeout behaviour used in pipeRequest and degensBurned.
export const fetchWithTimeout = (url: string, options: any = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })

export async function fetchMetadata(URI: string): Promise<Metadata | null> {
  try {
    const response = await fetchWithTimeout(URI)
    if (response.status < 400) return response.json() as unknown as Metadata
    return null
  } catch {
    return null
  }
}

export async function resolveDegenMetadata(req: Request): Promise<Metadata | null> {
  const network = Array.isArray(req.params.network) ? req.params.network[0] : req.params.network
  const token_id = Array.isArray(req.params.token_id) ? req.params.token_id[0] : req.params.token_id
  if (!['mainnet', 'sepolia'].includes(network) || !/^\d+$/.test(token_id)) return null
  const URI = `https://nifty-league.s3.amazonaws.com/degens/${encodeURIComponent(network)}/metadata/${encodeURIComponent(token_id)}.json`
  return fetchMetadata(URI)
}

// Proxies an upstream URL's body to the client response. Hardened against the
// failure modes that previously let a slow/dead upstream stall the function for
// the full maxDuration (30s) and leak sockets: adds a timeout, explicit error
// handling that returns the app's standard { errors: [...] } 502 shape, and
// guaranteed response termination on both success and failure.
export const pipeRequest = (url: string, res: Response) => {
  const req = https.get(url, (getRes: any) => {
    if (getRes.statusCode && getRes.statusCode >= 400) {
      getRes.resume()
      res
        .status(getRes.statusCode)
        .json({ errors: [{ message: `Upstream error: ${getRes.statusCode}` }] })
      return
    }
    const contentType = getRes.headers['content-type']
    if (contentType) res.setHeader('content-type', contentType)
    // S3 metadata / images are immutable — let the edge cache them.
    res.setHeader('cache-control', 'public, max-age=86400, immutable')
    getRes.pipe(res)
  })

  req.setTimeout(REQUEST_TIMEOUT_MS, () => {
    req.destroy(new Error('Upstream request timed out'))
  })

  req.on('error', (err: Error) => {
    if (res.headersSent) {
      res.end()
      return
    }
    res.status(502).json({ errors: [{ message: err.message || 'Failed to reach upstream' }] })
  })
}

// await sleep trick
// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Tiny TTL memoizer. Prevents routine traffic from hammering Etherscan/Alchemy
// on every request (rate-limit prone and 30s-ceiling risky). On upstream
// failure within the TTL window we return the last-good value when available,
// so transient provider errors don't take the endpoint down.
export function withCache<T>(ttlMs: number, fn: () => Promise<T | null>) {
  let cached: { value: T; expires: number } | null = null
  let inflight: Promise<T | null> | null = null
  return async (): Promise<T | null> => {
    const now = Date.now()
    if (cached && cached.expires > now) return cached.value
    if (!inflight) {
      inflight = fn()
        .then((value) => {
          inflight = null
          if (value !== null) cached = { value, expires: Date.now() + ttlMs }
          return value
        })
        .catch((err) => {
          inflight = null
          if (cached) return cached.value
          throw err
        })
    }
    return inflight
  }
}
