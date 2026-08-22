import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(path, 'utf8')

const clientRoutes = [
  'apps/smashers/src/app/(auth_routes)/api/playfab/forgot-password/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/login/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/signup/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/user/info/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/user/link-provider/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/user/unlink-provider/route.ts',
]

const cloudScriptRoutes = [
  'apps/smashers/src/app/(auth_routes)/api/playfab/user/link-wallet/route.ts',
  'apps/smashers/src/app/(auth_routes)/api/playfab/user/unlink-wallet/route.ts',
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
    expect(
      read('apps/smashers/src/app/(auth_routes)/api/playfab/user/delete-account/route.ts')
    ).toContain("from '@nl/playfab/api/admin'")

    for (const route of cloudScriptRoutes) {
      expect(read(route)).toContain("from '@nl/playfab/api/cloudscript'")
    }

    expect(read('apps/smashers/src/app/(auth_routes)/api/playfab/user/update/route.ts')).toMatch(
      /@nl\/playfab\/api\/(client|cloudscript)/
    )
  })

  it('keeps session checks on the client SDK entry point', () => {
    const source = read(
      'apps/smashers/src/app/(auth_routes)/api/playfab/user/playfab-session/route.ts'
    )
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
