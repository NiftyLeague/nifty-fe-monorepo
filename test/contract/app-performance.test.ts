import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const responsiveTableList = 'apps/app/src/components/ResponsiveTable/DataList.tsx'
const appManifest = 'apps/app/package.json'
const appRootLayout = 'apps/app/src/app/layout.tsx'
const bridgeDialog = 'apps/app/src/components/dialog/BridgeButtonDialog/index.tsx'
const degenFilterUtils = 'apps/app/src/components/extended/DegensFilter/utils.ts'
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
const appIconRegistrySources = [
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/degens/_dialogs/RenameStepper.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_Stats/ChangeProfileNameDialog.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_Stats/TopInfo.tsx',
  'apps/app/src/app/(private-routes)/dashboard/items/burner/_components/comics-grid.tsx',
  'apps/app/src/app/(private-routes)/dashboard/rentals/MyRentalsDataGrid.tsx',
  'apps/app/src/components/ResponsiveTable/ExpandableListItem.tsx',
  'apps/app/src/components/ResponsiveTable/DataList.tsx',
  'apps/app/src/components/ResponsiveTable/Pagination.tsx',
  'apps/app/src/components/ResponsiveTable/ResponsiveTable.tsx',
  'apps/app/src/components/ResponsiveTable/types.ts',
  'apps/app/src/components/cards/BuyCard.tsx',
  'apps/app/src/components/cards/DegenCard/DegenDashboardActions.tsx',
  'apps/app/src/components/cards/DegenCard/index.tsx',
  'apps/app/src/components/dialog/BridgeButtonDialog/BridgeSuccess.tsx',
  'apps/app/src/components/dialog/BuyArcadeTokensDialog.tsx',
  'apps/app/src/components/dialog/DegenDialog/CowSwapWidget.tsx',
  'apps/app/src/components/dialog/DegenDialog/EquipDegenContentDialog/index.tsx',
  'apps/app/src/components/dialog/DegenDialog/RentDegenContentDialog.tsx',
  'apps/app/src/components/dialog/DialogActions.tsx',
  'apps/app/src/components/dialog/WithdrawButtonDialog/WithdrawSuccess.tsx',
  'apps/app/src/components/pagination/PaginationIconOnly.tsx',
  'apps/smashers/src/app/(auth_routes)/profile/ProfileClient.tsx',
]

describe('app performance contracts', () => {
  it('defers third-party device telemetry until the page has loaded', () => {
    const source = readFileSync(appRootLayout, 'utf8')

    expect(source).toContain('id="device-stats"')
    expect(source).toContain('strategy="lazyOnload"')
  })

  it('uses Turbopack for local app development', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    expect(manifest.scripts.dev).toBe('next dev --turbopack --port 3001')
    expect(manifest.scripts.dev).not.toContain('--webpack')
  })

  it('loads the bridge form only after its dialog opens', () => {
    const source = readFileSync(bridgeDialog, 'utf8')

    expect(source).not.toContain("import BridgeForm from './BridgeForm'")
    expect(source).toContain("dynamic(() => import('./BridgeForm')")
    expect(source).toContain('Loading bridge options')
  })

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

  it('keeps private application components on direct icon imports', () => {
    for (const file of appIconRegistrySources) {
      expect(readFileSync(file, 'utf8')).not.toMatch(
        /import \{[^}]*\bIcon\b[^}]*\} from ['"]@nl\/ui\/base\/icon/
      )
    }
  })

  it('keeps the seventh-tribe filter off the full Hydra metadata payload', () => {
    const source = readFileSync(degenFilterUtils, 'utf8')

    expect(source).toContain("from '@/constants/hydra-rarities'")
    expect(source).not.toContain("from '@/constants/hydras'")
  })
})
