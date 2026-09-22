/**
 * Serves the Unity game build from R2 with the response headers the Unity
 * WebGL loader requires.
 *
 * The build is stored pre-compressed (Brotli). R2's custom-domain serving
 * drops the Content-Encoding header, and the Unity loader refuses to parse
 * .br payloads unless the response carries `Content-Encoding: br` — its own
 * error text says to check exactly that header. A Worker route on
 * cdn.niftyleague.com/unity/* therefore fronts the bucket and re-attaches the
 * headers stored with each object. Everything else on the host keeps hitting
 * the bucket's custom-domain origin directly.
 *
 * Objects are uploaded immutable (see the media publishing flow), so responses
 * are edge-cached for a year.
 */

interface R2Object {
  size: number
  body: ReadableStream
  httpEtag: string
  writeHttpMetadata(headers: Headers): void
}

interface R2Bucket {
  get(key: string): Promise<(R2Object & { bodyUsed: boolean }) | null>
}

interface Env {
  BUCKET: R2Bucket
}

const IMMUTABLE = 'public, max-age=31536000, immutable'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 })
    }

    const url = new URL(request.url)
    const key = url.pathname.slice(1) // strip the leading '/' → the object key
    const object = await env.BUCKET.get(key)

    if (!object) {
      return new Response('Not found', {
        status: 404,
        headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' },
      })
    }

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', IMMUTABLE)
    headers.set('access-control-allow-origin', '*')
    // The runtime strips Content-Encoding from responses with an unknown body
    // length; these bodies are pre-compressed, so pin the exact length.
    headers.set('content-length', String(object.size))

    if (request.method === 'HEAD') return new Response(null, { status: 200, headers })
    return new Response(object.body, { status: 200, headers })
  },
}
