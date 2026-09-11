import { describe, expect, it } from 'bun:test'

// The smashers session helper reads SESSION_SECRET lazily, but the OAuth flow
// helpers still need a valid-length secret available during import.
process.env.SESSION_SECRET = process.env.SESSION_SECRET ?? 'contract-test-secret-0123456789abcdef'
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? process.env.SESSION_SECRET

/**
 * Route module import guard.
 *
 * File-existence (route-surface.test.ts) proves a route file exists; this proves
 * every externally-consumed route module actually imports and still exports its
 * handler(s). A route that exists but was refactored into a broken state (renamed
 * export, removed default, dangling import) fails here — and the runtime would
 * have 500'd the endpoint. Astro endpoints live in src/pages/api and export
 * GET/POST/etc. exactly like the Next route handlers they replaced.
 *
 * Mirrors the route list in route-surface.test.ts (import path vs. file path).
 */
const routeImports: Record<string, string[]> = {
  smashers: [
    'api/auth/callback/[provider]',
    'api/auth/signin/[provider]',
    'api/edge-geo',
    'api/playfab/forgot-password',
    'api/playfab/login',
    'api/playfab/logout',
    'api/playfab/signup',
    'api/playfab/user/delete-account',
    'api/playfab/user/info',
    'api/playfab/user/link-provider',
    'api/playfab/user/link-wallet',
    'api/playfab/user/playfab-session',
    'api/playfab/user/unlink-provider',
    'api/playfab/user/unlink-wallet',
    'api/playfab/user/update',
  ],
}

describe('externally-consumed route modules import cleanly', () => {
  for (const [app, routes] of Object.entries(routeImports)) {
    describe(app, () => {
      for (const route of routes) {
        it(`imports ${route}`, async () => {
          const mod = await import(`../../apps/${app}/src/pages/${route}`)
          // Every API route module must export at least one HTTP method.
          const handlers = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].filter(
            (m) => typeof mod[m] === 'function'
          )
          expect(
            handlers.length,
            `Route ${route} imports but exports no HTTP handler (expected GET/POST/etc.)`
          ).toBeGreaterThan(0)
        })
      }
    })
  }
})
