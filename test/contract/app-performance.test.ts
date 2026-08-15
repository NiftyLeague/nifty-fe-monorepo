import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

const responsiveTableList = 'apps/app/src/components/ResponsiveTable/DataList.tsx'
const appManifest = 'apps/app/package.json'
const appGasUtility = 'apps/app/src/utils/gas.ts'
const retiredAxiosUtility = 'apps/app/src/utils/axios.ts'
const appGraphQLUtility = 'apps/app/src/utils/graphql.ts'
const appNextConfig = 'apps/app/next.config.ts'
const smashersNextConfig = 'apps/smashers/next.config.ts'
const webManifest = 'apps/web/package.json'
const webNextConfig = 'apps/web/next.config.ts'
const deferredSentryClient = 'packages/sentry-client/src/client.ts'
const deferredSentryModule = 'packages/sentry-client/src/nextjs-client.ts'
const appRootLayout = 'apps/app/src/app/layout.tsx'
const appShell = 'apps/app/src/app/_layout/AppShell.tsx'
const sharedAppBar = 'packages/ui/src/components/custom/app-bar/index.tsx'
const sharedAppBarStyles = 'packages/ui/src/components/custom/app-bar/app-bar.module.css'
const lightweightClassNames = 'packages/ui/src/lib/class-names.ts'
const appBreadcrumbs = 'apps/app/src/components/extended/Breadcrumbs.tsx'
const appSidebarFrame = 'apps/app/src/app/_layout/_MainLayout/_Sidebar/SidebarFrame.tsx'
const mobileSidebarSheet = 'apps/app/src/app/_layout/_MainLayout/_Sidebar/MobileSidebarSheet.tsx'
const appNavigationContext = 'apps/app/src/contexts/NavigationContext.tsx'
const appNavigationBreakpoints = 'apps/app/src/app/_layout/navigation-breakpoints.ts'
const bridgeDialog = 'apps/app/src/components/dialog/BridgeButtonDialog/index.tsx'
const appSectionSlider = 'apps/app/src/components/sections/SectionSlider.tsx'
const allDegensPage = 'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx'
const gamesPage = 'apps/app/src/app/(public-routes)/games/page.tsx'
const deferredInstallerAction = 'apps/app/src/app/(public-routes)/games/DeferredInstallerAction.tsx'
const leaderboards = 'apps/app/src/components/leaderboards/index.tsx'
const leaderboardsStyles = 'apps/app/src/components/leaderboards/index.module.css'
const collapsibleSidebarLayout = 'apps/app/src/app/_layout/_CollapsibleSidebarLayout/index.tsx'
const appCarouselSettingsSources = [
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyComics.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyItems.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog.tsx',
]
const sharedResponsiveCarousel = 'packages/ui/src/components/custom/responsive-carousel/index.tsx'
const sharedResponsiveCarouselStyles =
  'packages/ui/src/components/custom/responsive-carousel/responsive-carousel.module.css'
const degenFilterUtils = 'apps/app/src/components/extended/DegensFilter/utils.ts'
const useFetch = 'apps/app/src/hooks/useFetch.ts'
const sharedCatalogConsumers = [
  'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx',
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
]
const privateShellIconSources = [
  'apps/app/src/app/_layout/_CollapsibleSidebarLayout/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Header/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Header/NetworkWarning.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavCollapse/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavGroup/index.tsx',
  'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavItem/index.tsx',
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
  'apps/app/src/components/dialog/DegenDialog/EquipDegenContentDialog/index.tsx',
  'apps/app/src/components/dialog/DegenDialog/RentDegenContentDialog.tsx',
  'apps/app/src/components/dialog/DialogActions.tsx',
  'apps/app/src/components/dialog/WithdrawButtonDialog/WithdrawSuccess.tsx',
  'apps/smashers/src/app/(auth_routes)/profile/ProfileClient.tsx',
]

describe('app performance contracts', () => {
  it('keeps the eager private shell on lightweight class joining', () => {
    const helperSource = readFileSync(lightweightClassNames, 'utf8')
    expect(helperSource).toContain("from 'clsx'")
    expect(helperSource).not.toContain('tailwind-merge')

    for (const file of [
      'apps/app/src/app/_layout/AppShell.tsx',
      'apps/app/src/app/_layout/_MainLayout/_Sidebar/SidebarFrame.tsx',
      'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavCollapse/index.tsx',
      'apps/app/src/app/_layout/_MainLayout/_Sidebar/_MenuList/_NavItem/index.tsx',
    ]) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/class-names'")
      expect(source).not.toContain("from '@nl/ui/utils'")
    }
  })

  it('loads the accessible mobile sidebar sheet only when opened', () => {
    const sidebarSource = readFileSync(appSidebarFrame, 'utf8')
    const mobileSheetSource = readFileSync(mobileSidebarSheet, 'utf8')

    expect(sidebarSource).toContain("lazy(() => import('./MobileSidebarSheet'))")
    expect(sidebarSource).toContain('isCompactScreen && drawerOpen')
    expect(sidebarSource).toContain('<Suspense fallback={null}>')
    expect(sidebarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(mobileSheetSource).toContain("from '@nl/ui/base/sheet'")
    expect(mobileSheetSource).toContain('SheetTitle')
    expect(mobileSheetSource).toContain('SheetDescription')
    expect(mobileSheetSource).toContain('closeLabel="Close sidebar"')
  })

  it('keeps the private shell and sidebar on the same desktop breakpoint', () => {
    const shellSource = readFileSync(appShell, 'utf8')
    const sidebarSource = readFileSync(appSidebarFrame, 'utf8')
    const contextSource = readFileSync(appNavigationContext, 'utf8')
    const breakpointSource = readFileSync(appNavigationBreakpoints, 'utf8')

    expect(breakpointSource).toContain("desktopNavigationMediaQuery = '(min-width: 1024px)'")
    expect(contextSource).toContain('useMediaQuery(desktopNavigationMediaQuery)')
    expect(shellSource).toContain('isDesktopNavigation')
    expect(sidebarSource).not.toContain('useMediaQuery')
    expect(sidebarSource).toContain('const isCompactScreen = !isDesktopNavigation')
  })

  it('keeps the private app bar padded and vertically centered', () => {
    const shellSource = readFileSync(appShell, 'utf8')
    const appBarSource = readFileSync(sharedAppBar, 'utf8')
    const appBarStyles = readFileSync(sharedAppBarStyles, 'utf8')

    expect(shellSource).toContain("from '@nl/ui/custom/app-bar'")
    expect(shellSource).toContain('<AppBar>{header}</AppBar>')
    expect(appBarSource).toContain("import styles from './app-bar.module.css'")
    expect(appBarStyles).toContain('min-height: 56px')
    expect(appBarStyles).toContain('padding: 8px 16px')
    expect(appBarStyles).toContain('height: 60px')
    expect(appBarStyles).toContain('padding: 0 24px')
  })

  it('resolves breadcrumbs from the current pathname without a post-mount scan', () => {
    const source = readFileSync(appBreadcrumbs, 'utf8')

    expect(source).toContain('pathname?: string')
    expect(source).toContain('findBreadcrumb')
    expect(source).not.toContain('useEffect')
    expect(source).not.toContain('document.location')
    expect(source).not.toContain('maxItems')
  })

  it('shares the accessible native carousel and keeps the app free of slider runtimes', () => {
    const sectionSlider = readFileSync(appSectionSlider, 'utf8')
    const sharedCarousel = readFileSync(sharedResponsiveCarousel, 'utf8')
    const sharedCarouselStyles = readFileSync(sharedResponsiveCarouselStyles, 'utf8')
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    expect(sectionSlider).toContain("from '@nl/ui/custom/responsive-carousel'")
    expect(sectionSlider).not.toContain('react-slick')
    expect(sectionSlider).not.toContain('slick-carousel')
    expect(sharedCarousel).toContain('aria-roledescription="carousel"')
    expect(sharedCarouselStyles).toContain('scroll-snap-type: x mandatory')
    expect(manifest.dependencies?.['react-slick']).toBeUndefined()
    expect(manifest.dependencies?.['slick-carousel']).toBeUndefined()
    expect(manifest.devDependencies?.['@types/react-slick']).toBeUndefined()
  })

  it('defers third-party device telemetry until the page has loaded', () => {
    const source = readFileSync(appRootLayout, 'utf8')

    expect(source).toContain('id="device-stats"')
    expect(source).toContain('strategy="lazyOnload"')
  })

  it('keeps deferred Sentry on a named async module graph', () => {
    const clientSource = readFileSync(deferredSentryClient, 'utf8')
    const moduleSource = readFileSync(deferredSentryModule, 'utf8')

    expect(clientSource).toContain("import('./nextjs-client')")
    expect(clientSource).not.toContain("sentryModulePromise ??= import('@sentry/nextjs')")
    expect(moduleSource).toContain("from '@sentry/nextjs'")
    expect(moduleSource).toContain('captureException')
    expect(moduleSource).toContain('captureRouterTransitionStart')
    expect(moduleSource).toContain('init')
  })

  it('uses Turbopack for local app development', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    expect(manifest.scripts.dev).toBe('next dev --turbopack --port 3001')
    expect(manifest.scripts.dev).not.toContain('--webpack')
  })

  it('uses the project TypeScript CLI for Next app builds', () => {
    for (const file of [appNextConfig, smashersNextConfig]) {
      expect(readFileSync(file, 'utf8')).toContain('useTypeScriptCli: true')
    }
  })

  it('keeps the app gas-price path on native fetch without a retired Axios wrapper', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))
    const gasSource = readFileSync(appGasUtility, 'utf8')

    expect(manifest.dependencies?.axios).toBeUndefined()
    expect(gasSource).toContain("fetch('https://ethgasstation.info/json/ethgasAPI.json')")
    expect(gasSource).not.toContain("from 'axios'")
    expect(existsSync(retiredAxiosUtility)).toBe(false)
  })

  it('keeps the app GraphQL path on native fetch without request-client dependencies', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))
    const graphqlSource = readFileSync(appGraphQLUtility, 'utf8')

    expect(manifest.dependencies?.graphql).toBeUndefined()
    expect(manifest.dependencies?.['graphql-request']).toBeUndefined()
    expect(graphqlSource).toContain("method: 'POST'")
    expect(graphqlSource).toContain("'Content-Type': 'application/json'")
  })

  it('removes the retired inline NFTL swap graph', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))
    const rentDialogSource = readFileSync(
      'apps/app/src/components/dialog/DegenDialog/RentDegenContentDialog.tsx',
      'utf8'
    )

    expect(manifest.dependencies?.['@cowprotocol/cow-sdk']).toBeUndefined()
    expect(rentDialogSource).toContain('href={COW_PROTOCOL_URL}')
    expect(rentDialogSource).not.toContain('purchasingNFTL')

    for (const file of [
      'apps/app/src/components/dialog/DegenDialog/CowSwapWidget.tsx',
      'apps/app/src/components/dialog/DegenDialog/TokenInfoBox.tsx',
      'apps/app/src/hooks/balances/useEtherBalance.ts',
      'apps/app/src/hooks/useRateEtherToNFTL.ts',
      'apps/app/src/hooks/useTokenUSDPrice.ts',
      'apps/app/src/utils/cowswap.ts',
    ]) {
      expect(existsSync(file)).toBe(false)
    }
  })

  it('uses Turbopack for local marketing development', () => {
    const manifest = JSON.parse(readFileSync(webManifest, 'utf8'))
    const nextConfig = readFileSync(webNextConfig, 'utf8')

    expect(manifest.scripts.dev).toBe('next dev --turbopack --port 3000')
    expect(manifest.scripts.dev).not.toContain('--webpack')
    expect(nextConfig).toContain('  turbopack: {},')
  })

  it('loads the bridge form only after its dialog opens', () => {
    const source = readFileSync(bridgeDialog, 'utf8')

    expect(source).not.toContain("import BridgeForm from './BridgeForm'")
    expect(source).toContain("dynamic(() => import('./BridgeForm')")
    expect(source).toContain('Loading bridge options')
  })

  it('shares accessible pagination controls and removes retired slider settings', () => {
    const pageSource = readFileSync(allDegensPage, 'utf8')

    expect(pageSource).toContain("from '@/components/pagination/PaginationControls'")
    expect(pageSource).toContain("from '@nl/ui/base/pagination'")
    expect(pageSource).toContain("aria-current={p === currentPage ? 'page' : undefined}")

    for (const file of appCarouselSettingsSources) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toContain('adaptiveHeight')
      expect(source).not.toContain('swipe: false')
    }
  })

  it('defers the public installer action out of the initial games route graph', () => {
    const pageSource = readFileSync(gamesPage, 'utf8')
    const deferredSource = readFileSync(deferredInstallerAction, 'utf8')

    expect(pageSource).toContain("import DeferredInstallerAction from './DeferredInstallerAction'")
    expect(pageSource).not.toContain("import InstallerAction from './InstallerAction'")
    expect(pageSource).toContain('actions={<DeferredInstallerAction />}')
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-component'")
    expect(deferredSource).toContain("from '@nl/ui/base/button-variants'")
    expect(deferredSource).not.toContain("from '@nl/ui/base/button'")
    expect(deferredSource).toContain("className={buttonVariants({ variant: 'outline' })}")
    expect(deferredSource).toContain('<button')
    expect(deferredSource).toContain("import('./InstallerAction')")
    expect(deferredSource).toContain('aria-label="Loading installer action"')
    expect(deferredSource).toContain('Retry installer')
  })

  it('uses the shared themed Button for leaderboard filters', () => {
    const source = readFileSync(leaderboards, 'utf8')

    expect(source).toContain("from '@nl/ui/base/button'")
    expect(source).toContain('<Button')
    expect(source).not.toContain('<button')
    expect(source).not.toContain("from './index.module.css'")
    expect(existsSync(leaderboardsStyles)).toBe(false)
  })

  it('uses the shared accessible IconButton for the mobile filter close control', () => {
    const source = readFileSync(collapsibleSidebarLayout, 'utf8')

    expect(source).toContain("from '@nl/ui/base/icon-button'")
    expect(source).toContain('<IconButton')
    expect(source).not.toContain('<button')
    expect(source).toContain('aria-label="Close filters"')
  })

  it('uses native shallow copies for primitive responsive-table selection state', () => {
    const source = readFileSync(responsiveTableList, 'utf8')

    expect(source).not.toContain("from 'lodash'")
    expect(source.match(/\.\.\.selection/g)).toHaveLength(2)
  })

  it('keeps the app free of lodash route imports', () => {
    const sources = [
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

  it('deduplicates the repeated degen catalog request across app surfaces', () => {
    const fetchSource = readFileSync(useFetch, 'utf8')

    expect(fetchSource).toContain('sharedCache?: boolean')
    expect(fetchSource).toContain('pendingRequests')
    expect(fetchSource).toContain('SHARED_CACHE_TTL_MS')

    for (const file of sharedCatalogConsumers) {
      expect(readFileSync(file, 'utf8')).toContain('sharedCache: true')
    }
  })
})
