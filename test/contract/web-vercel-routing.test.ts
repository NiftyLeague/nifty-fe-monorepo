import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type VercelRedirect = { source: string; destination: string; permanent?: boolean }
type VercelRewrite = { source: string; destination: string }
type VercelHeaderSet = { source: string; headers: { key: string; value: string }[] }

const webRoot = join(process.cwd(), 'apps/web')
const config = JSON.parse(readFileSync(join(webRoot, 'vercel.json'), 'utf8')) as {
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  trailingSlash?: boolean
  cleanUrls?: boolean
  redirects?: VercelRedirect[]
  rewrites?: VercelRewrite[]
  headers?: VercelHeaderSet[]
}

// The Cloudflare Worker keeps the full-fidelity routing (poster rewriting,
// shell 404s). The Vercel build must cover the same public route surface via
// redirects and rewrites so either deployment path serves identically.
describe('web Vercel routing contract', () => {
  it('exists and builds the Astro static output', () => {
    expect(existsSync(join(webRoot, 'vercel.json'))).toBe(true)
    expect(config.framework).toBe('astro')
    expect(config.buildCommand).toBe('bun run build')
    expect(config.outputDirectory).toBe('dist')
    expect(config.trailingSlash).toBe(false)
    expect(config.cleanUrls).toBe(true)
  })

  it('keeps permanent short links on 308 redirects', () => {
    const permanent = new Map(config.redirects?.filter((r) => r.permanent).map((r) => [r.source, r.destination]))
    expect(permanent.get('/blog')).toBe('https://niftyleague.medium.com')
    expect(permanent.get('/feedback')).toBe('https://feedback.niftyleague.com')
    expect(permanent.get('/snapshot')).toBe('https://snapshot.niftyleague.com')
    expect(permanent.get('/tally')).toBe('https://www.tally.xyz/gov/niftyleague')
    expect(permanent.get('/NFTL/supply')).toBe('https://api.niftyleague.com/NFTL/supply')
    expect(permanent.get('/app')).toContain('app.niftyleague.com')
  })

  it('keeps temporary short links and DEGEN deep links on 307 redirects', () => {
    const temporary = new Map(config.redirects?.filter((r) => !r.permanent).map((r) => [r.source, r.destination]))
    expect(temporary.get('/HUB')).toBe('https://hub.xyz/niftyleague')
    expect(temporary.get('/OS')).toBe('https://opensea.io/collection/niftydegen')
    expect(temporary.get('/ME')).toBe('https://magiceden.io/collections/ethereum/niftydegen')
    expect(temporary.get('/BLUR')).toBe('https://blur.io/collection/niftydegen')
    expect(temporary.get('/d/:token_id(\\d{1,})')).toContain(
      'https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/:token_id'
    )
  })

  it('serves the deep-link shells for gltf, invite and party routes', () => {
    const bySource = new Map(config.rewrites?.map((r) => [r.source, r.destination]))
    expect(bySource.get('/gltf/:tokenId')).toBe('/shells/gltf.html')
    expect(bySource.get('/invite/:game/:refcode')).toBe('/shells/referral.html')
    expect(bySource.get('/party/:game/:refcode/:partyID')).toBe('/shells/referral.html')
  })

  it('proxies the shop, contact and docs upstreams', () => {
    const bySource = new Map(config.rewrites?.map((r) => [r.source, r.destination]))
    expect(bySource.get('/contact')).toContain('forms.gle')
    expect(bySource.get('/shop')).toBe('https://shop.niftyleague.com')
    expect(bySource.get('/collections/:path*')).toContain('shop.niftyleague.com')
    expect(bySource.get('/pages/:path*')).toContain('shop.niftyleague.com')
    expect(bySource.get('/products/:path*')).toContain('shop.niftyleague.com')
    expect(bySource.get('/cart/:path*')).toContain('shop.niftyleague.com')
    expect(bySource.get('/account/login')).toContain('shop.niftyleague.com')
    expect(bySource.get('/docs/:path*')).toContain('docs.niftyleague.com')
  })

  it('allows opaque-origin module loading for embedded GLTF viewers', () => {
    const sources = new Map(config.headers?.map((h) => [h.source, h.headers]))
    const astro = new Map(sources.get('/_astro/(.*)')?.map((h) => [h.key, h.value]) ?? [])
    const images = new Map(sources.get('/__images/(.*)')?.map((h) => [h.key, h.value]) ?? [])
    expect(astro.get('Access-Control-Allow-Origin')).toBe('*')
    expect(astro.get('Cache-Control')).toContain('immutable')
    expect(images.get('Access-Control-Allow-Origin')).toBe('*')
    expect(images.get('Cache-Control')).toContain('immutable')
  })

  it('keeps the Cloudflare Worker variant aligned with the same route surface', () => {
    const worker = readFileSync(join(webRoot, 'worker/routes.mjs'), 'utf8')
    expect(worker).toContain('/shells/gltf.html')
    expect(worker).toContain('/shells/referral.html')
    expect(worker).toContain('shop.niftyleague.com')
    expect(existsSync(join(webRoot, 'wrangler.jsonc'))).toBe(true)
  })
})
