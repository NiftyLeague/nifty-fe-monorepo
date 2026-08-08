import { describe, expect, it } from 'bun:test'

// Auth routes import next-auth's session helper at module scope, which validates
// NEXTAUTH_SECRET on import. Provide a valid test secret so the imports succeed.
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? 'contract-test-secret-0123456789abcdef'

/**
 * Route module import guard.
 *
 * File-existence (route-surface.test.ts) proves a route file exists; this proves
 * every externally-consumed route module actually imports and still exports its
 * handler(s). A route that exists but was refactored into a broken state (renamed
 * export, removed default, dangling import) fails here — and the runtime would
 * have 500'd the endpoint.
 *
 * Mirrors the route list in route-surface.test.ts (import path vs. file path).
 */
const routeImports: Record<string, string[]> = {
  smashers: [
    '(auth_routes)/api/auth/[...nextauth]/route',
    '(auth_routes)/api/edge-geo/route',
    '(auth_routes)/api/playfab/forgot-password/route',
    '(auth_routes)/api/playfab/login/route',
    '(auth_routes)/api/playfab/logout/route',
    '(auth_routes)/api/playfab/signup/route',
    '(auth_routes)/api/playfab/user/delete-account/route',
    '(auth_routes)/api/playfab/user/info/route',
    '(auth_routes)/api/playfab/user/link-provider/route',
    '(auth_routes)/api/playfab/user/link-wallet/route',
    '(auth_routes)/api/playfab/user/playfab-session/route',
    '(auth_routes)/api/playfab/user/unlink-provider/route',
    '(auth_routes)/api/playfab/user/unlink-wallet/route',
    '(auth_routes)/api/playfab/user/update/route',
  ],
}

describe('externally-consumed route modules import cleanly', () => {
  for (const [app, routes] of Object.entries(routeImports)) {
    describe(app, () => {
      for (const route of routes) {
        it(`imports ${route}`, async () => {
          const mod = await import(`../../apps/${app}/src/app/${route}`)
          // Every Next.js route module must export at least one HTTP method.
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
