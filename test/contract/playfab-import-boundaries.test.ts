import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(path, 'utf8')

// smashers ships as Astro SSR: the same narrow entry points are enforced on the
// src/pages/api endpoints that replaced the Next route handlers.
const clientRoutes = [
  'apps/smashers/src/pages/api/playfab/forgot-password.ts',
  'apps/smashers/src/pages/api/playfab/login.ts',
  'apps/smashers/src/pages/api/playfab/signup.ts',
  'apps/smashers/src/pages/api/playfab/user/info.ts',
  'apps/smashers/src/pages/api/playfab/user/link-provider.ts',
  'apps/smashers/src/pages/api/playfab/user/unlink-provider.ts',
]

const cloudScriptRoutes = [
  'apps/smashers/src/pages/api/playfab/user/link-wallet.ts',
  'apps/smashers/src/pages/api/playfab/user/unlink-wallet.ts',
]

describe('PlayFab import boundaries', () => {
  it('keeps client-only routes on the narrow client entry point', () => {
    for (const route of clientRoutes) {
      const source = read(route)
      expect(source).toContain("from '@nl/playfab/api/client'")
      expect(source).not.toContain("from '@nl/playfab/api'")
    }
  })

  it('keeps admin and CloudScript routes on their narrow entry points', () => {
    expect(read('apps/smashers/src/pages/api/playfab/user/delete-account.ts')).toContain(
      "from '@nl/playfab/api/admin'"
    )

    for (const route of cloudScriptRoutes) {
      expect(read(route)).toContain("from '@nl/playfab/api/cloudscript'")
    }

    expect(read('apps/smashers/src/pages/api/playfab/user/update.ts')).toMatch(
      /@nl\/playfab\/api\/(client|cloudscript)/
    )
  })

  it('keeps session checks on the client SDK entry point', () => {
    const source = read('apps/smashers/src/pages/api/playfab/user/playfab-session.ts')
    expect(source).toContain("from '@nl/playfab/sdk/client'")
    expect(source).not.toContain("from '@nl/playfab/sdk'")
  })

  it('retains compatibility exports for existing package consumers', () => {
    const api = read('packages/playfab/src/api.ts')
    const manifest = JSON.parse(read('packages/playfab/package.json')) as {
      exports: Record<string, string>
    }

    expect(api).toContain("export * from './api/client'")
    expect(api).toContain("export * from './api/admin'")
    expect(api).toContain("export * from './api/cloudscript'")
    expect(manifest.exports['./api']).toBe('./src/api.ts')
    expect(manifest.exports['./api/*']).toBe('./src/api/*.ts')
    expect(manifest.exports['./sdk/client']).toBe('./src/sdk/client.ts')
  })
})
