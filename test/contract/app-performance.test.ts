import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const responsiveTableList = 'apps/app/src/components/ResponsiveTable/DataList.tsx'
const rootManifest = 'package.json'
const turboConfig = 'turbo.json'
const apiManifest = 'apps/api/package.json'
const imxClient = 'apps/api/src/imx/client.ts'
const imxCollectionOnboarding = 'apps/api/src/imx/onboarding/3-create-collection.ts'
const sharedJsonRequest = 'apps/api/src/utils/request-json.ts'
const apiNativeFetchSources = [
  'apps/api/src/classes/minty.ts',
  'apps/api/src/utils/api.ts',
  'apps/api/src/utils/imageGenerator.ts',
  'apps/api/src/utils/nftl.ts',
  'apps/api/src/utils/refreshMetadata.ts',
]
const appManifest = 'apps/app/package.json'
const appGasUtility = 'apps/app/src/utils/gas.ts'
const retiredAxiosUtility = 'apps/app/src/utils/axios.ts'
const appGraphQLUtility = 'apps/app/src/utils/graphql.ts'
const appTsConfig = 'apps/app/tsconfig.json'
const appWeb3Types = 'apps/app/src/types/web3.ts'
const appInterchainService = 'apps/app/src/utils/interchainTokenService.ts'
const deferredNicknameForm = 'apps/app/src/pages/dashboard/rentals/ChangeNicknameDialog.tsx'
const deferredProfileNameForm =
  'apps/app/src/pages/dashboard/gamer-profile/_Stats/ChangeProfileNameForm.tsx'
const appBaseInputConsumers = [
  'apps/app/src/pages/dashboard/degens/_dialogs/RenameDegenDialogContent.tsx',
  deferredProfileNameForm,
  'apps/app/src/pages/dashboard/items/burner/_components/comics-grid.tsx',
  deferredNicknameForm,
  'apps/app/src/pages/dashboard/rentals/SearchRental.tsx',
  'apps/app/src/components/dialog/BuyArcadeTokensDialog.tsx',
  'apps/app/src/components/dialog/DegenDialog/RentDegenContentDialog.tsx',
]
const sharedInputGroupConsumers = [
  'packages/ui/src/components/custom/auth-form/forms/login.tsx',
  'packages/ui/src/components/custom/auth-form/forms/forgot-password.tsx',
  'packages/ui/src/components/custom/auth-form/forms/update-password.tsx',
  'packages/playfab/src/components/DisplayField.tsx',
  'packages/playfab/src/components/Stats/index.tsx',
  'packages/playfab/src/components/Inventory/index.tsx',
  'packages/playfab/src/components/AccountDetails/index.tsx',
  'packages/playfab/src/components/AccountDetails/LinkWalletInput.tsx',
]
const sharedInputGroup = 'packages/ui/src/components/base/input-group.tsx'
const retiredCustomInput = 'packages/ui/src/components/custom/input/index.tsx'
// Neither web, smashers, nor docs has a next.config anymore (Astro static /
// Astro SSR), and the template app was removed.
const webManifest = 'apps/web/package.json'
const webHome = 'apps/web/src/app/(main)/page.tsx'
const incrementalTypecheckConfigs = [
  'apps/api/tsconfig.json',
  // apps/web/tsconfig.json and apps/docs/tsconfig.json are excluded: both extend
  // Astro's strict preset, which drives astro check without Next-style
  // incremental build info.
  'apps/app/tsconfig.json',
  'apps/smashers/tsconfig.json',
  'packages/contracts/tsconfig.json',
  'packages/playfab/tsconfig.json',
  'packages/ui/tsconfig.json',
]
const webTsConfig = 'apps/web/tsconfig.json'
const smashersTsConfig = 'apps/smashers/tsconfig.json'
const smashersRootLayout = 'apps/smashers/src/layouts/Base.astro'
const deferredExternalScript =
  'packages/ui/src/components/custom/deferred-external-script/index.tsx'
const appRootLayout = 'apps/app/src/routes/__root.tsx'
const appUserProfile = 'apps/app/src/components/UserProfile/index.tsx'
const publicUserProfile = 'apps/app/src/components/providers/PublicUserProfile.tsx'
const appProfileVerification = 'apps/app/src/components/wrapper/Authentication.tsx'
const appShell = 'apps/app/src/layouts/_layout/AppShell.tsx'
const privateRoutesBoundary = 'apps/app/src/components/providers/PrivateRoutesBoundary.tsx'
const sharedAppBar = 'packages/ui/src/components/custom/app-bar/index.tsx'
const sharedAppBarStyles = 'packages/ui/src/components/custom/app-bar/app-bar.module.css'
const lightweightClassNames = 'packages/ui/src/lib/class-names.ts'
const deferredConsoleGame = 'packages/ui/src/components/custom/deferred-console-game/index.tsx'
const consoleGameBackdrop = 'packages/ui/src/components/custom/console-game/backdrop.tsx'
const gltfViews = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViews.tsx'
// web ships as Astro static: the gltf logo now renders inside the runtime
// client island (src/runtime/GltfClient.tsx) instead of a Next page.
const gltfClientRuntime = 'apps/web/src/runtime/GltfClient.tsx'
const marketingShellClassNameSources = [
  'apps/web/src/components/Footer/index.tsx',
  'packages/ui/src/components/custom/external-icon/index.tsx',
  'packages/ui/src/components/custom/mobile-navigation/index.tsx',
  'packages/ui/src/components/custom/navbar/index.tsx',
  'packages/ui/src/components/custom/navbar/NavbarScrollFrame.tsx',
  'packages/ui/src/components/custom/socials-footer/index.tsx',
  'packages/ui/src/components/custom/theme-button-group/index.tsx',
]
// web ships as Astro static: the shell root class comes from
// src/layouts/Marketing.astro's rootClass prop instead of a Next layout.
const webMarketingShellLayout = 'apps/web/src/layouts/Marketing.astro'
const marketingStaticNavigationSources = [
  'apps/web/src/components/Footer/index.tsx',
  'packages/ui/src/components/custom/navbar/index.tsx',
  'packages/ui/src/components/custom/navbar/MobileNavMenu.tsx',
  'packages/ui/src/components/custom/navbar/NavigationLink.tsx',
  'packages/ui/src/components/custom/theme-button-group/index.tsx',
]
const appStaticNavigationSources = [
  'apps/app/src/components/PublicLogo.tsx',
  'apps/app/src/components/providers/PublicNavigation.tsx',
  'apps/app/src/components/providers/PublicNavLinks.tsx',
]
const smashersStaticNavigationSources = [
  'apps/smashers/src/components/Header/Navbar/index.tsx',
  'apps/smashers/src/components/Header/BackButton/index.tsx',
]
const nonConflictingClassNameSources = [
  'apps/app/src/routes/__root.tsx',
  'apps/app/src/components/providers/PublicNavigation.tsx',
  'apps/smashers/src/components/Header/Navbar/index.tsx',
  'apps/web/src/app/(main)/compete-and-earn/page.tsx',
  'apps/web/src/app/(main)/lore/page.tsx',
  'apps/web/src/components/DegenGallery.tsx',
  'apps/web/src/components/GameCard.tsx',
  'apps/web/src/components/RoadmapTimeline/roadmapCard.tsx',
  'packages/ui/src/components/custom/app-bar/index.tsx',
]
const appBreadcrumbs = 'apps/app/src/components/extended/Breadcrumbs.tsx'
const appHeader = 'apps/app/src/layouts/_layout/_MainLayout/_Header/index.tsx'
const appNetworkWarning = 'apps/app/src/layouts/_layout/_MainLayout/_Header/NetworkWarning.tsx'
const appSidebarFrame = 'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/SidebarFrame.tsx'
const mobileSidebarSheet =
  'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/MobileSidebarSheet.tsx'
const appNavigationContext = 'apps/app/src/contexts/NavigationContext.tsx'
const appNavigationBreakpoints = 'apps/app/src/layouts/_layout/navigation-breakpoints.ts'
const appCollapsibleSidebarLayout =
  'apps/app/src/layouts/_layout/_CollapsibleSidebarLayout/index.tsx'
const bridgeDialog = 'apps/app/src/components/dialog/BridgeButtonDialog/index.tsx'
const appSectionSlider = 'apps/app/src/components/sections/SectionSlider.tsx'
const allDegensPage = 'apps/app/src/pages/degens/AllDegensPage.tsx'
const gamesPage = 'apps/app/src/routes/_public/games.index.tsx'
const leaderboards = 'apps/app/src/components/leaderboards/index.tsx'
const leaderboardsStyles = 'apps/app/src/components/leaderboards/index.module.css'
const collapsibleSidebarLayout = 'apps/app/src/layouts/_layout/_CollapsibleSidebarLayout/index.tsx'
const appCarouselSettingsSources = [
  'apps/app/src/pages/dashboard/overview/MyDegens.tsx',
  'apps/app/src/pages/dashboard/overview/MyComics.tsx',
  'apps/app/src/pages/dashboard/overview/MyItems.tsx',
  'apps/app/src/pages/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog.tsx',
]
const sharedResponsiveCarousel = 'packages/ui/src/components/custom/responsive-carousel/index.tsx'
const sharedResponsiveCarouselStyles =
  'packages/ui/src/components/custom/responsive-carousel/responsive-carousel.module.css'
const degenFilterUtils = 'apps/app/src/components/extended/DegensFilter/utils.ts'
const degenFilterStyles = 'apps/app/src/components/extended/DegensFilter/index.module.css'
const publicDegenQueries = 'apps/app/src/hooks/queries/usePublicDegens.ts'
const sharedCatalogConsumers = [
  'apps/app/src/pages/degens/AllDegensPage.tsx',
  'apps/app/src/pages/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/pages/dashboard/gamer-profile/GamerProfileContent.tsx',
  'apps/app/src/pages/dashboard/overview/MyDegens.tsx',
]
const privateShellIconSources = [
  'apps/app/src/layouts/_layout/_CollapsibleSidebarLayout/index.tsx',
  'apps/app/src/layouts/_layout/_MainLayout/_Header/index.tsx',
  'apps/app/src/layouts/_layout/_MainLayout/_Header/NetworkWarning.tsx',
  'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/_MenuList/_NavCollapse/index.tsx',
  'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/_MenuList/_NavGroup/index.tsx',
  'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/_MenuList/_NavItem/index.tsx',
  'apps/app/src/components/extended/Breadcrumbs.tsx',
]
const appIconRegistrySources = [
  'apps/app/src/pages/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/pages/dashboard/degens/_dialogs/RenameStepper.tsx',
  'apps/app/src/pages/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog.tsx',
  'apps/app/src/pages/dashboard/gamer-profile/_Stats/ChangeProfileNameDialog.tsx',
  'apps/app/src/pages/dashboard/gamer-profile/_Stats/TopInfo.tsx',
  'apps/app/src/pages/dashboard/items/burner/_components/comics-grid.tsx',
  'apps/app/src/pages/dashboard/rentals/MyRentalsDataGrid.tsx',
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
  'apps/smashers/src/components/profile/ProfileClient.tsx',
]
const sharedOxfmtConfig = '.oxfmtrc.json'
const sharedOxlintConfig = '.oxlintrc.json'
const testHarnessPreload = 'test/preload.ts'
const appStylesheets = [
  'apps/app/src/styles/app.css',
  'apps/smashers/src/styles/app.css',
  'apps/web/src/styles/app.css',
]

describe('app performance contracts', () => {
  it('keeps IMX REST calls on the native JSON fetch helper', () => {
    const manifest = JSON.parse(readFileSync(apiManifest, 'utf8'))

    expect(manifest.dependencies?.axios).toBeUndefined()
    for (const file of [imxClient, imxCollectionOnboarding]) {
      expect(readFileSync(file, 'utf8')).not.toContain("from 'axios'")
    }
    expect(readFileSync(sharedJsonRequest, 'utf8')).toContain('globalThis.fetch')
  })

  it('keeps API runtime requests on Node native fetch', () => {
    const manifest = JSON.parse(readFileSync(apiManifest, 'utf8'))

    expect(manifest.dependencies?.['node-fetch']).toBeUndefined()
    for (const file of apiNativeFetchSources) {
      expect(readFileSync(file, 'utf8')).not.toContain("from 'node-fetch'")
    }

    expect(readFileSync('apps/api/src/utils/imageGenerator.ts', 'utf8')).toContain(
      'Readable.fromWeb'
    )
  })

  it('keeps lint traversal off generated framework output', () => {
    const oxlint = JSON.parse(readFileSync(sharedOxlintConfig, 'utf8'))
    const ignores: string[] = oxlint.ignorePatterns ?? []

    for (const generatedPath of [
      '**/.turbo/**',
      '**/src/types/typechain/**',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
    ]) {
      expect(ignores).toContain(generatedPath)
    }
    expect(readFileSync(sharedOxfmtConfig, 'utf8')).toContain('.github/actions/')
  })

  it('keeps isolated React tests on one workspace runtime', () => {
    const source = readFileSync(testHarnessPreload, 'utf8')

    expect(source).toContain('async function importFirstAvailable')
    expect(source).toContain("'../node_modules/react/index.js'")
    expect(source).toContain("'../node_modules/.bun/node_modules/react/index.js'")
    expect(source).toContain("'../node_modules/react-dom/index.js'")
    expect(source).toContain("'../node_modules/.bun/node_modules/react-dom/index.js'")
    expect(source).toContain('mock.module(workspaceReact')

    for (const workspace of ['apps/app', 'apps/web', 'packages/ui']) {
      expect(source).toContain(`'${workspace}'`)
    }
  })

  it('keeps test-only sources out of runtime Tailwind scans', () => {
    for (const file of appStylesheets) {
      const source = readFileSync(file, 'utf8')

      for (const suffix of ['test', 'spec', 'stories', 'story']) {
        expect(source).toContain(`@source not "../**/*.${suffix}.{ts,tsx}";`)
      }
    }

    const smashersStyles = readFileSync('apps/smashers/src/styles/app.css', 'utf8')
    for (const suffix of ['test', 'spec', 'stories', 'story']) {
      expect(smashersStyles).toContain(
        `@source not "../../../../packages/playfab/src/**/*.${suffix}.{ts,tsx}";`
      )
    }
  })

  it('keeps the eager private shell on lightweight class joining', () => {
    const helperSource = readFileSync(lightweightClassNames, 'utf8')
    expect(helperSource).toContain("from 'clsx'")
    expect(helperSource).not.toContain('tailwind-merge')

    for (const file of [
      'apps/app/src/layouts/_layout/AppShell.tsx',
      'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/SidebarFrame.tsx',
      'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/_MenuList/_NavCollapse/index.tsx',
      'apps/app/src/layouts/_layout/_MainLayout/_Sidebar/_MenuList/_NavItem/index.tsx',
      appBreadcrumbs,
    ]) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/class-names'")
      expect(source).not.toContain("from '@nl/ui/utils'")
    }
  })

  it('keeps the public sidebar profile on the leaf auth hook', () => {
    const source = readFileSync(join(process.cwd(), appUserProfile), 'utf8')

    expect(source).toContain("from '@/hooks/useGamerProfile/useGamerProfile'")
    expect(source).not.toContain("from '@/hooks/useGamerProfile'")
    expect(source).not.toContain("from '@/contexts/GamerProfileContext'")
  })

  it('preserves a visible signed-out profile affordance', () => {
    const source = readFileSync(join(process.cwd(), appUserProfile), 'utf8')

    expect(source).toContain("from 'lucide-react'")
    expect(source).toContain('<UserRound')
    expect(source).toContain('Login to view dashboards')
  })

  it('defers the public wallet graph until the profile is activated', () => {
    const source = readFileSync(join(process.cwd(), publicUserProfile), 'utf8')

    expect(source).toContain('data-public-signed-out-profile')
    expect(source).toContain('walletRequested')
    expect(source).toContain("import('@/contexts/WalletModal')")
    expect(source).toContain('<WalletAuthProvidersBoundary')
  })

  it('keeps degen filter controls spaced outside the checkbox primitive', () => {
    const source = readFileSync(join(process.cwd(), degenFilterStyles), 'utf8')

    expect(source).toContain('margin-right: 8px')
    expect(source).not.toContain('padding-right: 8px')
  })

  it('centers the signed-out private route prompt in the app viewport', () => {
    const source = readFileSync(join(process.cwd(), appProfileVerification), 'utf8')

    expect(source).toContain('items-center justify-center')
    expect(source).toContain('min-h-[calc(100dvh-56px)]')
  })

  it('keeps the eager marketing shell off the conflict-merging utility', () => {
    for (const file of marketingShellClassNameSources) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/class-names'")
      expect(source).not.toContain("from '@nl/ui/utils'")
    }

    // The Astro marketing layout composes static class strings only, so it must
    // not pull in the conflict-merging utility at all.
    const marketingLayout = readFileSync(webMarketingShellLayout, 'utf8')
    expect(marketingLayout).not.toContain('tailwind-merge')
    expect(marketingLayout).not.toContain('@nl/ui/utils')
  })

  it('keeps static marketing navigation out of the Next Link client runtime', () => {
    for (const file of marketingStaticNavigationSources) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toContain("from 'next/link'")
      expect(source).not.toContain('from "next/link"')
    }
  })

  it('keeps the public app shell navigation out of the Next Link client runtime', () => {
    for (const file of appStaticNavigationSources) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toContain("from 'next/link'")
      expect(source).not.toContain('from "next/link"')
    }
  })

  it('keeps the Smashers public home navigation out of the Next Link client runtime', () => {
    for (const file of smashersStaticNavigationSources) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).not.toContain("from 'next/link'")
      expect(source).not.toContain('from "next/link"')
    }
  })

  it('keeps the marketing console preview deferred until it is close to view', () => {
    const source = readFileSync(deferredConsoleGame, 'utf8')
    const backdropSource = readFileSync(consoleGameBackdrop, 'utf8')
    expect(source).toContain("const CONSOLE_GAME_ROOT_MARGIN = '0px 0px -25% 0px'")
    expect(source).toContain('useOnScreen(rootRef, CONSOLE_GAME_ROOT_MARGIN)')
    // The interactive chunk waits for the viewport in every case, and the
    // video remains behind the activation window unless a consumer opts into
    // loading the chunk on viewport.
    expect(source).toContain('const shouldLoadInteractiveGame = loadInteractiveOnViewport')
    expect(source).toContain('? isNearViewport')
    expect(source).toContain(': isNearViewport && (!deferVideo || videoActivated)')
    expect(source).toContain('children: ReactNode')
    expect(source).not.toContain('ConsoleGameBackdrop')
    expect(source).not.toContain('<DeferredSkeleton')
    expect(source).not.toContain('<video')
    expect(source).toContain('<div className="dark-gradient-overlay" />')
    expect(source).toContain('renderGradientOverlay={false}')
    expect(backdropSource).toContain('alt="Game Console Backdrop"')
  })

  it('defers the decorative hero character layer behind the LCP background', () => {
    const source = readFileSync(webHome, 'utf8')
    const heroStart = source.indexOf('src="/img/hero/characters.webp"')
    const heroEnd = source.indexOf('/>', heroStart)

    expect(heroStart).toBeGreaterThanOrEqual(0)
    expect(heroEnd).toBeGreaterThan(heroStart)
    expect(source.slice(heroStart, heroEnd)).not.toContain('loading="eager"')
  })

  it('keeps the GLTF viewer off the conflict-merging utility', () => {
    const source = readFileSync(gltfViews, 'utf8')
    expect(source).toContain("from '@nl/ui/class-names'")
    expect(source).not.toContain("from '@nl/ui/utils'")
  })

  it('keeps non-conflicting public class composition off the conflict-merging utility', () => {
    for (const file of nonConflictingClassNameSources) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/class-names'")
      expect(source).not.toContain("from '@nl/ui/utils'")
    }
  })

  it('keeps the Smashers Astro shell off every class-merging utility', () => {
    // The Next layout joined font variables with cx(); the Astro base layout now
    // owns neither: the faces and the `--font-*` properties live in
    // @nl/ui/styles/fonts.css (pinned by font-loading.test.ts), so the shell
    // imports no font runtime and has no class composition left to merge.
    const source = readFileSync(smashersRootLayout, 'utf8')

    expect(source).not.toContain("from '@nl/ui/utils'")
    expect(source).not.toContain("from '@nl/ui/class-names'")
    expect(source).not.toContain('@font-face')
    expect(source).toContain('astro-island{display:contents}')
  })

  it('does not prioritize the GLTF logo that is hidden in the initial 2D view', () => {
    const source = readFileSync(gltfClientRuntime, 'utf8')
    const logoStart = source.indexOf('alt="Nifty League Logo"')
    const logoEnd = source.indexOf('src="/img/logos/NL/wordmark.webp"')

    expect(logoStart).toBeGreaterThanOrEqual(0)
    expect(logoEnd).toBeGreaterThan(logoStart)
    expect(source.slice(logoStart, logoEnd)).not.toContain('priority')
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

  it('keeps the private header toggle on the shared shadcn recipe', () => {
    const source = readFileSync(appHeader, 'utf8')
    const networkWarningSource = readFileSync(appNetworkWarning, 'utf8')

    expect(source).toContain("from '@nl/ui/base/button-variants'")
    expect(source).toContain("variant: 'ghost'")
    expect(source).toContain('aria-controls="app-primary-navigation"')
    expect(source).not.toContain("from '@nl/ui/base/button'")
    expect(networkWarningSource).toContain("from '@nl/ui/base/button-variants'")
    expect(networkWarningSource).toContain("variant: 'default'")
    expect(networkWarningSource).not.toContain("from '@nl/ui/base/button'")
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

  it('keeps the private provider shell out of the initial route bundle', () => {
    const source = readFileSync(privateRoutesBoundary, 'utf8')

    expect(source).not.toContain("'use client'")
    expect(source).toContain("dynamic(() => import('./PrivateRoutesShell')")
    expect(source).not.toContain('ssr: false')
    expect(source).toContain('loading: PrivateRoutesLoading')
  })

  it('keeps the DEGEN filter drawer on the shared desktop breakpoint', () => {
    const source = readFileSync(appCollapsibleSidebarLayout, 'utf8')
    const breakpointSource = readFileSync(appNavigationBreakpoints, 'utf8')

    expect(breakpointSource).toContain("desktopNavigationMediaQuery = '(min-width: 1024px)'")
    expect(source).toContain("from '@/layouts/_layout/navigation-breakpoints'")
    expect(source).toContain('useMediaQuery(desktopNavigationMediaQuery)')
    expect(source).not.toContain("useMediaQuery('(max-width:1024px)')")
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
    expect(sharedCarousel).toContain("from '@nl/ui/hooks/useMediaQuery'")
    expect(sharedCarousel).toContain("useMediaQuery('(prefers-reduced-motion: reduce)')")
    expect(sharedCarousel).toContain('const viewportWidthRef = useRef(0)')
    expect(sharedCarousel).toContain('if (nextWidth === viewportWidthRef.current) return')
    expect(sharedCarousel).toContain(
      'const getPageWidth = useCallback(() => viewportWidthRef.current, [])'
    )
    expect(sharedCarousel).not.toContain("window.matchMedia('(prefers-reduced-motion: reduce)')")
    expect(sharedCarouselStyles).toContain('scroll-snap-type: x mandatory')
    expect(manifest.dependencies?.['react-slick']).toBeUndefined()
    expect(manifest.dependencies?.['slick-carousel']).toBeUndefined()
    expect(manifest.devDependencies?.['@types/react-slick']).toBeUndefined()
  })

  it('defers third-party device telemetry until the page has loaded', () => {
    const source = readFileSync(appRootLayout, 'utf8')
    const deferredSource = readFileSync(deferredExternalScript, 'utf8')

    expect(source).toContain('id="device-stats"')
    expect(source).toContain("from '@nl/ui/custom/deferred-external-script'")
    expect(source).toContain('<DeferredExternalScript')
    expect(deferredSource).toContain('scheduleDeferredActivation')
    expect(deferredSource).toContain('document.createElement')
  })

  it('keeps the app Sentry runtime lazy and free of the Next SDK', () => {
    const runtime = readFileSync(join(process.cwd(), 'apps/app/src/runtime/sentry.ts'), 'utf8')

    expect(runtime).toContain("import('@sentry/browser')")
    expect(runtime).not.toContain('@sentry/nextjs')
    expect(runtime).toContain('??= import(')
  })

  it('runs local app development through Vite on port 3001', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    expect(manifest.scripts.dev).toBe('vite dev')
    expect(manifest.scripts.dev).not.toContain('next dev')
    expect(manifest.scripts.build).toBe('vite build')
  })

  it('leaves no Next.js build surface behind', () => {
    // web and smashers are Astro and docs is Astro/Starlight, so no app in the
    // repo has a Next config or instrumentation hook any more.
    for (const file of [
      'apps/app/next.config.ts',
      'apps/app/src/instrumentation.ts',
      'apps/app/sentry.server.config.ts',
      'apps/app/sentry.edge.config.ts',
      'apps/smashers/next.config.ts',
      'apps/web/next.config.ts',
    ]) {
      expect(existsSync(join(process.cwd(), file)), `${file} should be gone`).toBe(false)
    }
  })

  it('removes the unsupported optional Turbopack path from every app', () => {
    const manifests = [appManifest, webManifest, 'apps/smashers/package.json']

    for (const file of manifests) {
      const scripts = JSON.parse(readFileSync(file, 'utf8')).scripts
      expect(scripts['build:turbo']).toBeUndefined()
      expect(scripts['dev:turbo']).toBeUndefined()
    }
  })

  it('keeps every TypeScript project on incremental checking', () => {
    for (const file of incrementalTypecheckConfigs) {
      expect(readFileSync(file, 'utf8')).toContain('"incremental": true')
    }
  })

  it('scopes the app TypeScript program to source and build config inputs', () => {
    const tsConfig = JSON.parse(readFileSync(appTsConfig, 'utf8')) as { include?: string[] }

    expect(tsConfig.include).toEqual(['src', 'vite.config.ts'])
  })

  it('scopes the Astro web TypeScript program to Astro-generated and source inputs', () => {
    const tsConfig = JSON.parse(readFileSync(webTsConfig, 'utf8')) as {
      include?: string[]
      extends?: string[]
    }

    // The Astro preset plus the shared option base; see astro-config.test.ts.
    expect(tsConfig.extends).toEqual(['astro/tsconfigs/strict', '@nl/typescript-config/astro.json'])
    expect(tsConfig.include).toEqual([
      '.astro/types.d.ts',
      'src/**/*',
      'worker/**/*',
      'playwright.config.ts',
      'e2e/**/*',
    ])
  })

  it('scopes the Astro smashers TypeScript program to Astro-generated and source inputs', () => {
    const tsConfig = JSON.parse(readFileSync(smashersTsConfig, 'utf8')) as {
      include?: string[]
      extends?: string[]
    }

    // The Astro preset plus the shared option base; see astro-config.test.ts.
    expect(tsConfig.extends).toEqual(['astro/tsconfigs/strict', '@nl/typescript-config/astro.json'])
    expect(tsConfig.include).toEqual(['.astro/types.d.ts', 'src/**/*', 'astro.config.mjs'])
  })

  it('keeps generated contract types out of the default app program and avoids the barrel graph', () => {
    const tsConfig = readFileSync(appTsConfig, 'utf8')
    expect(tsConfig).toContain('src/types/typechain/**')

    for (const file of [appWeb3Types, appInterchainService]) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toContain("from '@/types/typechain'")
    }
    expect(readFileSync(appWeb3Types, 'utf8')).toContain('@/types/typechain/src/contracts/imx/NFTL')
    expect(readFileSync(appInterchainService, 'utf8')).toContain(
      '@/types/typechain/src/contracts/NFTLToken'
    )
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

  it('keeps deferred rename forms on native React Hook Form rules', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    for (const file of [deferredNicknameForm, deferredProfileNameForm]) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain('rules={{ required:')
      expect(source).not.toContain('yup')
      expect(source).not.toContain('@hookform/resolvers')
    }

    expect(manifest.dependencies?.['@hookform/resolvers']).toBeUndefined()
    expect(manifest.dependencies?.yup).toBeUndefined()
  })

  it('uses shared shadcn inputs across the app instead of the heavyweight custom wrapper', () => {
    for (const file of appBaseInputConsumers) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/base/input'")
      expect(source).not.toContain("from '@nl/ui/custom/input'")
    }
  })

  it('shares the accessible input group across auth and PlayFab surfaces', () => {
    const inputGroupSource = readFileSync(sharedInputGroup, 'utf8')

    expect(inputGroupSource).toContain('role="group"')
    expect(inputGroupSource).toContain("aria-label={visible ? 'Hide' : 'Reveal'}")
    expect(existsSync(retiredCustomInput)).toBe(false)

    for (const file of sharedInputGroupConsumers) {
      const source = readFileSync(file, 'utf8')
      expect(source).not.toContain('@nl/ui/custom/input')
      expect(
        source.includes('@nl/ui/base/input-group') || source.includes("from '../DisplayField'")
      ).toBe(true)
    }
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

  it('uses the deterministic Astro path for local marketing development', () => {
    // web ships as Astro static + Cloudflare Worker; dev serves the static
    // pipeline on port 3000 instead of a Next server.
    const manifest = JSON.parse(readFileSync(webManifest, 'utf8'))

    expect(manifest.scripts.dev).toContain('astro dev --port 3000')
    expect(manifest.scripts.dev).not.toContain('next dev')
    expect(manifest.scripts['dev:turbo']).toBeUndefined()
  })

  it('keeps every deployable app on the root build graph', () => {
    const root = JSON.parse(readFileSync(rootManifest, 'utf8'))
    const turbo = JSON.parse(readFileSync(turboConfig, 'utf8'))

    expect(root.scripts.build).toBe(
      'turbo run api#build app#build docs#build smashers#build web#build'
    )
    expect(turbo.tasks['template#build']).toBeUndefined()
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

  it('keeps deferred rename forms on native React Hook Form rules', () => {
    const manifest = JSON.parse(readFileSync(appManifest, 'utf8'))

    for (const file of [deferredNicknameForm, deferredProfileNameForm]) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain('rules={{ required:')
      expect(source).not.toContain('yup')
      expect(source).not.toContain('@hookform/resolvers')
    }

    expect(manifest.dependencies?.['@hookform/resolvers']).toBeUndefined()
    expect(manifest.dependencies?.yup).toBeUndefined()
  })

  it('uses shared shadcn inputs across the app instead of the heavyweight custom wrapper', () => {
    for (const file of appBaseInputConsumers) {
      const source = readFileSync(file, 'utf8')
      expect(source).toContain("from '@nl/ui/base/input'")
      expect(source).not.toContain("from '@nl/ui/custom/input'")
    }
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
      'apps/app/src/pages/dashboard/gamer-profile/GamerProfileContent.tsx',
    ]

    for (const file of sources) {
      expect(readFileSync(file, 'utf8')).not.toMatch(/from ['"]lodash(?:\/|['"])/)
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
    const querySource = readFileSync(publicDegenQueries, 'utf8')

    expect(querySource).toContain('queryKeys.publicDegens.list')
    expect(querySource).toContain('queryKeys.publicDegens.byIds')
    expect(querySource).toContain('signal')

    for (const file of sharedCatalogConsumers) {
      expect(readFileSync(file, 'utf8')).toMatch(/usePublicDegens(?:Page|ByIds)/)
    }
  })
})
