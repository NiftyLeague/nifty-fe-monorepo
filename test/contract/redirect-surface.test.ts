import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { routeRequest } from '../../apps/web/worker/routes.mjs'

/**
 * Deep-link and redirect surface contract.
 *
 * These paths are consumed by external campaigns, native app deep links, store
 * redirects, and share URLs — they have no in-repo click-through that proves they
 * still exist. If a redirect source or deep-link route is trimmed, this test fails.
 *
 * Sources are either:
 *  - route files under `apps/<app>/src/app` (pinned by path), or
 *  - redirect sources that must appear in `next.config.*` (pinned by substring), or
 *  - web worker routes asserted through `routeRequest` in apps/web/worker/routes.mjs
 *    (web ships as Astro static + Cloudflare Worker).
 */

interface WorkerRouteOutcome {
  kind: 'redirect' | 'proxy' | 'gltf' | 'referral'
  status?: 307 | 308
  url?: string
  asset?: string
}

interface SurfaceEntry {
  type: 'file' | 'redirect' | 'worker-route'
  path: string
  reason: string
  outcome?: WorkerRouteOutcome
}

const surfaces: Record<string, SurfaceEntry[]> = {
  smashers: [
    {
      type: 'redirect',
      path: "'/ios'",
      reason: 'App Store deep link consumed by Unity games and invite flow',
    },
    {
      type: 'redirect',
      path: "'/invite/",
      reason: 'Referral deep link (invite/<ref_code>)',
    },
    {
      type: 'redirect',
      path: "'GOOGLE_PLAY'",
      reason: 'Google Play store redirect mapping (generates /android)',
    },
    {
      type: 'redirect',
      path: "'STEAM'",
      reason: 'Steam store redirect mapping (generates /steam)',
    },
    {
      type: 'redirect',
      path: "'EPIC'",
      reason: 'Epic Games store redirect mapping (generates /epic)',
    },
    {
      type: 'file',
      path: 'src/app/(auth_routes)/api/auth/[...nextauth]/route.ts',
      reason: 'OAuth callback + session API',
    },
  ],
  web: [
    {
      type: 'worker-route',
      path: '/invite/smashers/CODE',
      reason: 'Invite referral landing (marketing deep link)',
      outcome: { kind: 'referral', asset: '/shells/referral.html' },
    },
    {
      type: 'worker-route',
      path: '/party/smashers/CODE/PARTY',
      reason: 'Party join deep link',
      outcome: { kind: 'referral', asset: '/shells/referral.html' },
    },
    {
      type: 'worker-route',
      path: '/gltf/123456',
      reason: 'DEGEN 3D viewer deep link',
      outcome: { kind: 'gltf', asset: '/shells/gltf.html' },
    },
    {
      type: 'worker-route',
      path: '/d/123',
      reason: 'Short DEGEN OpenSea share link',
      outcome: {
        kind: 'redirect',
        status: 307,
        url: 'https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/123',
      },
    },
    {
      type: 'worker-route',
      path: '/shop',
      reason: 'Shop proxy entry point',
      outcome: { kind: 'proxy', url: 'https://shop.niftyleague.com/' },
    },
  ],
  app: [
    {
      type: 'file',
      path: 'src/app/(public-routes)/degens/[id]/page.tsx',
      reason: 'DEGEN profile deep link',
    },
    {
      type: 'file',
      path: 'src/app/(public-routes)/games/smashers/page.tsx',
      reason: 'Game deep link',
    },
    {
      type: 'file',
      path: 'src/app/verification/page.tsx',
      reason: 'Auth verification route',
    },
  ],
}

function findNextConfig(app: string): string | null {
  for (const name of ['next.config.ts', 'next.config.mjs', 'next.config.js']) {
    const p = join(process.cwd(), 'apps', app, name)
    if (existsSync(p)) return p
  }
  return null
}

describe('deep-link and redirect surface contract', () => {
  for (const [app, entries] of Object.entries(surfaces)) {
    describe(app, () => {
      const configPath = findNextConfig(app)
      const configSource = configPath ? readFileSync(configPath, 'utf8') : ''

      for (const entry of entries) {
        it(`${entry.type === 'worker-route' ? 'worker route' : entry.type === 'redirect' ? 'redirect' : 'route'} ${entry.path} (${entry.reason})`, () => {
          if (entry.type === 'file') {
            const filePath = join(process.cwd(), 'apps', app, entry.path)
            expect(existsSync(filePath), `Missing deep-link route: apps/${app}/${entry.path}`).toBe(
              true
            )
          } else if (entry.type === 'worker-route') {
            const result = routeRequest(`https://niftyleague.com${entry.path}`)
            expect(result, `Unexpected worker route outcome for ${entry.path}`).toMatchObject(
              entry.outcome as object
            )
          } else {
            expect(configPath, `No next.config found for apps/${app}`).toBeTruthy()
            expect(
              configSource.includes(entry.path),
              `Missing redirect source ${entry.path} in apps/${app}/${configPath?.split('/').pop()} (${entry.reason})`
            ).toBe(true)
          }
        })
      }
    })
  }
})
