import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const responsiveTableList = 'apps/app/src/components/ResponsiveTable/DataList.tsx'
const appManifest = 'apps/app/package.json'
const privateShellIconSources = [
  'apps/app/src/app/_layout/_CollapsibleSidebarLayout/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Header/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Header/NetworkWarning.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavCollapse/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavGroup/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavItem/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_OnboardingCard/index.tsx',
  'apps/app/src/components/extended/Breadcrumbs.tsx',
]

describe('app performance contracts', () => {
  it('uses native shallow copies for primitive responsive-table selection state', () => {
    const source = readFileSync(responsiveTableList, 'utf8')

    expect(source).not.toContain("from 'lodash'")
    expect(source.match(/\.\.\.selection/g)).toHaveLength(2)
  })

  it('keeps the app free of lodash route imports', () => {
    const sources = [
      'apps/app/src/components/dialog/DegenDialog/TokenInfoBox.tsx',
      'apps/app/src/components/dialog/DegenDialog/EquipDegenContentDialog/index.tsx',
      'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileContent.tsx',
    ]

    for (const file of sources) {
      expect(readFileSync(file, 'utf8')).not.toMatch(/from ['\"]lodash(?:\/|['\"])/)
    }

    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))
    expect(manifest.dependencies?.lodash).toBeUndefined()
    expect(manifest.devDependencies?.['@types/lodash']).toBeUndefined()
  })

  it('keeps the private shell off the shared icon registry', () => {
    for (const file of privateShellIconSources) {
      expect(readFileSync(file, 'utf8')).not.toContain("from '@nl/ui/base/icon'")
    }

    const appNavIconSource = readFileSync('apps/app/src/components/AppNavIcon.tsx', 'utf8')
    expect(appNavIconSource).toContain("from 'lucide-react'")
    expect(appNavIconSource).toContain("'layout-grid': LayoutGrid")
    expect(appNavIconSource).toContain("'list-ordered': ListOrdered")
  })
})
