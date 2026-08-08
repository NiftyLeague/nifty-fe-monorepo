import { describe, expect, it } from 'bun:test'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Contract guard for externally-consumed routes.
 *
 * Some routes have NO in-repo callers — they are served to external clients
 * (e.g. Unity games, native apps, deep links, marketing campaigns). Source-grep
 * cannot catch accidental removal of these, so we pin the surface here. If a
 * route is genuinely removed, update this list deliberately (and note where the
 * external consumer was migrated).
 *
 * Keyed by app name; values are route file paths relative to `apps/<app>`.
 */
const appRouteContracts: Record<string, string[]> = {
  smashers: [
    // Externally consumed: niftysmasher.com Unity games + native app deep links.
    'src/app/(auth_routes)/api/auth/[...nextauth]/route.ts',
    'src/app/(auth_routes)/api/edge-geo/route.ts',
    'src/app/(auth_routes)/api/playfab/forgot-password/route.ts',
    'src/app/(auth_routes)/api/playfab/login/route.ts',
    'src/app/(auth_routes)/api/playfab/logout/route.ts',
    'src/app/(auth_routes)/api/playfab/signup/route.ts',
    'src/app/(auth_routes)/api/playfab/user/delete-account/route.ts',
    'src/app/(auth_routes)/api/playfab/user/info/route.ts',
    'src/app/(auth_routes)/api/playfab/user/link-provider/route.ts',
    'src/app/(auth_routes)/api/playfab/user/link-wallet/route.ts',
    'src/app/(auth_routes)/api/playfab/user/playfab-session/route.ts',
    'src/app/(auth_routes)/api/playfab/user/unlink-provider/route.ts',
    'src/app/(auth_routes)/api/playfab/user/unlink-wallet/route.ts',
    'src/app/(auth_routes)/api/playfab/user/update/route.ts',
    'src/app/(auth_routes)/login/page.tsx',
    'src/app/(auth_routes)/profile/page.tsx',
    'src/app/loot/page.tsx',
    'src/app/page.tsx',
  ],
  web: [
    // Marketing site: campaign and deep-link landing routes linked externally.
    'src/app/(main)/page.tsx',
    'src/app/(main)/roadmap/page.tsx',
    'src/app/(main)/team/page.tsx',
    'src/app/(main)/community/page.tsx',
    'src/app/(main)/lore/page.tsx',
    'src/app/(main)/niftyworld/page.tsx',
    'src/app/(main)/games/page.tsx',
    'src/app/(main)/degens/page.tsx',
    'src/app/(main)/careers/page.tsx',
    'src/app/(main)/terms-of-service/page.tsx',
    'src/app/(main)/privacy-policy/page.tsx',
    'src/app/(main)/disclaimer/page.tsx',
    'src/app/(main)/compete-and-earn/page.tsx',
    'src/app/(main)/overview/page.tsx',
    'src/app/(special-routes)/gltf/[tokenId]/page.tsx',
    'src/app/(special-routes)/invite/[game]/[refcode]/page.tsx',
    'src/app/(special-routes)/party/[game]/[refcode]/[partyID]/page.tsx',
  ],
  app: [
    // dApp: auth-critical, SEO, and externally deep-linked routes.
    'src/app/page.tsx',
    'src/app/robots.ts',
    'src/app/sitemap.ts',
    'src/app/(public-routes)/degens/page.tsx',
    'src/app/(public-routes)/degens/[id]/page.tsx',
    'src/app/(public-routes)/games/page.tsx',
    'src/app/(public-routes)/leaderboards/page.tsx',
    'src/app/(public-routes)/mint-o-matic/page.tsx',
    'src/app/(private-routes)/dashboard/page.tsx',
    'src/app/(private-routes)/dashboard/rentals/page.tsx',
    'src/app/(private-routes)/dashboard/degens/page.tsx',
    'src/app/(private-routes)/dashboard/overview/page.tsx',
  ],
}

describe('external route surface contract', () => {
  for (const [app, files] of Object.entries(appRouteContracts)) {
    describe(app, () => {
      for (const file of files) {
        it(`keeps ${file}`, () => {
          const path = join(process.cwd(), 'apps', app, file)
          expect(existsSync(path), `Missing externally-consumed route: apps/${app}/${file}`).toBe(
            true
          )
        })
      }
    })
  }
})

/**
 * Safety net: assert the app route trees actually exist and are non-empty,
 * so an entire route directory cannot silently disappear.
 */
describe('app route trees exist', () => {
  for (const app of Object.keys(appRouteContracts)) {
    it(`apps/${app}/src/app is a populated route tree`, () => {
      const root = join(process.cwd(), 'apps', app, 'src', 'app')
      expect(existsSync(root), `Missing route tree root: apps/${app}/src/app`).toBe(true)
      const count = countRouteFiles(root)
      expect(count, `No route files found under apps/${app}/src/app`).toBeGreaterThan(0)
    })
  }
})

function countRouteFiles(dir: string): number {
  let count = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      count += countRouteFiles(full)
    } else if (entry === 'page.tsx' || entry === 'route.ts' || entry === 'layout.tsx') {
      count += 1
    }
  }
  return count
}
