import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const appCollectionConsumers = [
  'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx',
  'apps/app/src/components/extended/DegensFilter/index.tsx',
  'apps/app/src/components/dialog/DegenDialog/ViewTraitsContentDialog.tsx',
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
  'apps/app/src/app/(private-routes)/dashboard/items/burner/_components/comics-grid.tsx',
]

describe('native collection contracts', () => {
  it('keeps trivial collection operations out of app route consumers', () => {
    for (const file of appCollectionConsumers) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toMatch(/from ['\"]lodash\/(isEmpty|sum|xor)['\"]/)
    }
  })

  it('keeps PlayFab free of a dependency used only by removed helpers', () => {
    const manifest = JSON.parse(readFileSync('packages/playfab/package.json', 'utf8'))

    expect(manifest.dependencies?.lodash).toBeUndefined()
    expect(manifest.devDependencies?.['@types/lodash']).toBeUndefined()
  })
})
