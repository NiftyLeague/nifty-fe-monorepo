interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

// Retired Starlight-migration slugs, with and without the /docs base prefix.
// External redirects land on the canonical niftyleague.com/docs URLs.
const PERMANENT = new Map([
  ['/docs/archive/rentals/rentals', 'https://niftyleague.com/docs/archive/rentals'],
  ['/archive/rentals/rentals', 'https://niftyleague.com/docs/archive/rentals'],
  [
    '/docs/overview/games/niftyworld/niftyworld',
    'https://niftyleague.com/docs/overview/games/niftyworld',
  ],
  [
    '/overview/games/niftyworld/niftyworld',
    'https://niftyleague.com/docs/overview/games/niftyworld',
  ],
  ['/docs/greetings', 'https://niftyleague.com/docs'],
  ['/greetings', 'https://niftyleague.com/docs'],
  ['/docs/tutorial', 'https://niftyleague.com/docs'],
  ['/docs/tutorial/:path*', 'https://niftyleague.com/docs'],
  ['/tutorial/:path*', 'https://niftyleague.com/docs'],
])

const isTutorialPrefix = (path: string) =>
  path === '/docs/tutorial' ||
  path.startsWith('/docs/tutorial/') ||
  path === '/tutorial' ||
  path.startsWith('/tutorial/')

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (!path.startsWith('/docs')) return env.ASSETS.fetch(request)

    const destination =
      PERMANENT.get(path) ?? (isTutorialPrefix(path) ? PERMANENT.get('/docs/tutorial') : undefined)
    if (destination) return Response.redirect(destination, 301)

    // The build emits dist root files behind /docs URLs (base /docs, one build
    // serves both hosts), so strip the prefix before the asset lookup.
    const asset = new URL(`${url.pathname.slice('/docs'.length) || '/'}${url.search}`, url.origin)
    return env.ASSETS.fetch(new Request(asset, request))
  },
}
