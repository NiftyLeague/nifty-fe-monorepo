import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
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
    // The public route group preserves the external `/` URL while keeping its
    // wallet-free layout boundary explicit in the source tree.
    'src/app/(public-routes)/page.tsx',
    'src/app/verification/page.tsx',
    'src/app/robots.ts',
    'src/app/sitemap.ts',
    'src/app/(public-routes)/degens/page.tsx',
    'src/app/(public-routes)/degens/[id]/page.tsx',
    'src/app/(public-routes)/games/page.tsx',
    'src/app/(public-routes)/leaderboards/page.tsx',
    'src/app/(public-routes)/mint-o-matic/page.tsx',
    'src/app/(private-routes)/dashboard/page.tsx',
    'src/app/(private-routes)/dashboard/items/page.tsx',
    'src/app/(private-routes)/dashboard/items/burner/page.tsx',
    'src/app/(private-routes)/dashboard/gamer-profile/page.tsx',
    'src/app/(private-routes)/dashboard/rentals/page.tsx',
    'src/app/(private-routes)/dashboard/degens/page.tsx',
    'src/app/(private-routes)/dashboard/overview/page.tsx',
  ],
}

const deferredDashboardDialogConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
  'apps/app/src/app/(private-routes)/dashboard/rentals/MyRentalsDataGrid.tsx',
]
const deferredRenameDegenConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
]
const deferredProfileDialogConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_Stats/TopInfo.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/index.tsx',
]
const deferredNicknameDialogConsumer =
  'apps/app/src/app/(private-routes)/dashboard/rentals/MyRentalsDataGrid.tsx'

const authOnlyRouteLayouts = ['apps/app/src/app/verification/layout.tsx']
const nftOnlyRouteLayouts = ['apps/app/src/app/(public-routes)/mint-o-matic/layout.tsx']
const publicRoutesLayout = 'apps/app/src/app/(public-routes)/layout.tsx'
const stalePublicProviderBoundary = 'apps/app/src/contexts/PublicAppContextWrapper.tsx'
const walletStorageBoundaries = [
  'apps/app/src/contexts/WalletAuthContextWrapper.tsx',
  'apps/app/src/contexts/WalletFeatureProviders.tsx',
  'apps/app/src/components/providers/MintProviders.tsx',
]
const dashboardOverview = 'apps/app/src/app/(private-routes)/dashboard/overview/page.tsx'
const dashboardDegens = 'apps/app/src/app/(private-routes)/dashboard/degens/page.tsx'
const dashboardDegensContent =
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx'
const dashboardItems = 'apps/app/src/app/(private-routes)/dashboard/items/page.tsx'
const dashboardItemsContent =
  'apps/app/src/app/(private-routes)/dashboard/items/DashboardItemsContent.tsx'
const dashboardBurner = 'apps/app/src/app/(private-routes)/dashboard/items/burner/page.tsx'
const dashboardBurnerContent =
  'apps/app/src/app/(private-routes)/dashboard/items/burner/ComicsBurnerContent.tsx'
const gamerProfile = 'apps/app/src/app/(private-routes)/dashboard/gamer-profile/page.tsx'
const gamerProfileContent =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileContent.tsx'
const dashboardRentals = 'apps/app/src/app/(private-routes)/dashboard/rentals/page.tsx'
const dashboardRentalsContent =
  'apps/app/src/app/(private-routes)/dashboard/rentals/DashboardRentalsContent.tsx'
const privateShellBoundary = 'apps/app/src/components/providers/PrivateRoutesBoundary.tsx'
const privateShell = 'apps/app/src/components/providers/PrivateRoutesShell.tsx'
const dashboardDataProviderBoundary = 'apps/app/src/contexts/DashboardDataProviders.tsx'
const dashboardDataBoundary = 'apps/app/src/components/providers/DashboardDataBoundary.tsx'
const deferredRenameDegenDialog = 'apps/app/src/components/providers/DeferredRenameDegenDialog.tsx'
const deferredDialogLoading = 'apps/app/src/components/providers/DeferredDialogLoading.tsx'
const degenDialog = 'apps/app/src/components/dialog/DegenDialog/index.tsx'
const deferredProfileNameDialog = 'apps/app/src/components/providers/DeferredProfileNameDialog.tsx'
const deferredProfileImageDialog =
  'apps/app/src/components/providers/DeferredProfileImageDialog.tsx'
const deferredNicknameDialog = 'apps/app/src/components/providers/DeferredChangeNicknameDialog.tsx'
const authUrls = 'apps/app/src/constants/auth-urls.ts'
const walletModal = 'apps/app/src/contexts/WalletModal.ts'
const web3ModalContext = 'apps/app/src/contexts/Web3ModalContext.tsx'
const authTokenContext = 'apps/app/src/contexts/AuthTokenContext.tsx'
const mintNetworkBoundary = 'apps/app/src/components/providers/MintNetworkBoundary.tsx'
const mintPage = 'apps/app/src/app/(public-routes)/mint-o-matic/page.tsx'
const mintPageContent = 'apps/app/src/components/providers/MintPageContent.tsx'
const deferredMintPage = 'apps/app/src/components/providers/DeferredMintPage.tsx'
const mintWalletBoundary = 'apps/app/src/components/providers/MintProviders.tsx'
const deferredMintWalletBoundary = 'apps/app/src/components/providers/DeferredMintProviders.tsx'
const walletProviderFallbacks = 'apps/app/src/components/providers/WalletProviderFallbacks.tsx'
const gameRoute = 'apps/app/src/components/wrapper/GameRoute.tsx'
const unityGamePages = [
  'apps/app/src/app/(public-routes)/games/crypto-winter/page.tsx',
  'apps/app/src/app/(public-routes)/games/mt-gawx/page.tsx',
  'apps/app/src/app/(public-routes)/games/smashers/page.tsx',
  'apps/app/src/app/(public-routes)/games/wen-game/page.tsx',
]
const networkContext = 'apps/app/src/contexts/NetworkContext.tsx'
const networkProvider = 'apps/app/src/contexts/NetworkProvider.tsx'
const graphQL = 'apps/app/src/hooks/useGraphQL.ts'
const publicCarousel = 'apps/web/src/components/Carousel/index.tsx'
const interactivePublicCarousel = 'apps/web/src/components/Carousel/InteractiveCarousel.tsx'
const deferredWeb3GameList = 'apps/app/src/app/(public-routes)/games/DeferredWeb3GameList.tsx'
const staleDownloadGameDialog = 'apps/app/src/components/dialog/DownloadGameDialog.tsx'
const smashersLoginClient = 'apps/smashers/src/app/(auth_routes)/login/LoginClient.tsx'
const smashersLoginPage = 'apps/smashers/src/app/(auth_routes)/login/page.tsx'
const smashersLoginRoute = 'apps/smashers/src/app/(auth_routes)/login/LoginRoute.tsx'
const smashersProfilePage = 'apps/smashers/src/app/(auth_routes)/profile/page.tsx'
const smashersProfileRoute = 'apps/smashers/src/app/(auth_routes)/profile/ProfileRoute.tsx'
const smashersActionButtons = 'apps/smashers/src/components/Header/ActionButtonsGroup/index.tsx'
const smashersRootLayout = 'apps/smashers/src/app/layout.tsx'
const smashersAuthLayout = 'apps/smashers/src/app/(auth_routes)/layout.tsx'
const staleSmashersUnityDialog = 'apps/smashers/src/components/UnityDialog/index.tsx'
const privateShellLayout = 'apps/app/src/app/(private-routes)/layout.tsx'
const sidebarProfile = 'apps/app/src/app/_layout/_MainLayout/_Sidebar/_UserProfile/index.tsx'
const localStorageHook = 'apps/app/src/hooks/useLocalStorage.ts'
const contractReaderHook = 'apps/app/src/hooks/useContractReader.ts'
const valueEqualityUtility = 'apps/app/src/utils/value-equality.ts'
const mainLayout = 'apps/app/src/app/_layout/_MainLayout/index.tsx'
const networkWarning = 'apps/app/src/app/_layout/_MainLayout/_Header/NetworkWarning.tsx'
const staleWalletContextWrapper = 'apps/app/src/contexts/WalletContextWrapper.tsx'
const deferredAnalyticsSource = 'packages/ui/src/lib/gtm/DeferredAnalytics.tsx'
const analyticsLayouts = [
  'apps/app/src/app/layout.tsx',
  'apps/web/src/app/(main)/layout.tsx',
  'apps/web/src/app/(special-routes)/invite/[game]/[refcode]/layout.tsx',
  'apps/web/src/app/(special-routes)/party/[game]/[refcode]/[partyID]/layout.tsx',
  'apps/smashers/src/app/layout.tsx',
]
const deferredConsoleGameRoutes = [
  'apps/web/src/app/(main)/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/app/(main)/niftyworld/page.tsx',
  'apps/smashers/src/app/page.tsx',
]
const sharedDeferredSection = 'packages/ui/src/components/custom/deferred-section/index.tsx'
const sharedRouteLoading = 'packages/ui/src/components/custom/route-loading/index.tsx'
const routeLoadingFiles = [
  'apps/app/src/app/loading.tsx',
  'apps/web/src/app/(main)/loading.tsx',
  'apps/smashers/src/app/loading.tsx',
]
const webHomePage = 'apps/web/src/app/(main)/page.tsx'
const gltfPage = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/page.tsx'
const gltfClient = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViews.tsx'
const webNavbar = 'apps/web/src/components/Navbar/index.tsx'
const sharedWebNavbar = 'packages/ui/src/components/custom/navbar/index.tsx'
const sharedWebMobileNavbar = 'packages/ui/src/components/custom/navbar/MobileNavMenu.tsx'
const sharedWebMobileTrigger = 'packages/ui/src/components/custom/navbar/MobileNavTrigger.tsx'
const webCommunityPage = 'apps/web/src/app/(main)/community/page.tsx'
const webTeamPage = 'apps/web/src/app/(main)/team/page.tsx'
const webCarousel = 'apps/web/src/components/Carousel/index.tsx'
const animationFreeMarketingPages = [
  'apps/web/src/app/(main)/page.tsx',
  'apps/web/src/app/(main)/games/page.tsx',
  'apps/web/src/app/(main)/niftyworld/page.tsx',
  'apps/web/src/app/(main)/overview/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/app/(main)/compete-and-earn/page.tsx',
  'apps/web/src/app/(main)/careers/page.tsx',
  'apps/web/src/app/(main)/team/page.tsx',
  'apps/web/src/app/(main)/community/page.tsx',
  'apps/web/src/app/(main)/lore/page.tsx',
]
const animationFreeMarketingComponents = [
  'apps/smashers/src/components/GameSection/index.tsx',
  'apps/smashers/src/components/DegensSection/index.tsx',
  'apps/web/src/components/ThemeBtnGroup/index.tsx',
  'apps/web/src/components/LearnCards/index.tsx',
  'apps/web/src/components/Careers/JobCard.tsx',
  'apps/web/src/components/Sponsors.tsx',
  'packages/ui/src/components/custom/accordion/index.tsx',
  'packages/ui/src/components/custom/degen-specials-table/index.tsx',
]
const staticLegalPages = [
  'apps/web/src/app/(main)/terms-of-service/page.tsx',
  'apps/web/src/app/(main)/privacy-policy/page.tsx',
  'apps/web/src/app/(main)/disclaimer/page.tsx',
]
const webDefinitions = 'apps/web/src/components/Definitions.tsx'
const smashersHomePage = 'apps/smashers/src/app/page.tsx'
const webDeferredHomeSections = 'apps/web/src/components/DeferredHomeSections.tsx'
const smashersDeferredHomeSections = 'apps/smashers/src/components/DeferredHomeSections.tsx'
const appShell = 'apps/app/src/app/_layout/AppShell.tsx'
const privateRoutesShell = 'apps/app/src/components/providers/PrivateRoutesShell.tsx'
const deferredNotifications = 'apps/app/src/components/providers/DeferredNotifications.tsx'
const leaderboardsPage = 'apps/app/src/app/(public-routes)/leaderboards/page.tsx'
const deferredLeaderboards = 'apps/app/src/components/providers/DeferredLeaderboards.tsx'
const degensPage = 'apps/app/src/app/(public-routes)/degens/page.tsx'
const degensRouteBoundary = 'apps/app/src/app/(public-routes)/degens/DegenRoute.tsx'
const degensClientPage = 'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx'
const publicMainLayout = 'apps/app/src/app/_layout/_PublicMainLayout/index.tsx'
const publicNavigation = 'apps/app/src/components/providers/PublicNavigation.tsx'
const publicMobileNavigation = 'apps/app/src/components/providers/PublicMobileNavigation.tsx'
const publicDesktopSidebarToggle =
  'apps/app/src/components/providers/PublicDesktopSidebarToggle.tsx'
const publicMobileNavigationTrigger =
  'apps/app/src/components/providers/PublicMobileNavigationTrigger.tsx'
const publicMainContent = 'apps/app/src/components/providers/PublicMainContent.tsx'
const publicNavLinks = 'apps/app/src/components/providers/PublicNavLinks.tsx'
const verificationPage = 'apps/app/src/app/verification/page.tsx'
const verificationLayout = 'apps/app/src/app/verification/layout.tsx'

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

describe('public leaderboard loading contract', () => {
  it('keeps the archived leaderboard client graph out of the initial route entry', () => {
    const pageSource = readFileSync(join(process.cwd(), leaderboardsPage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), deferredLeaderboards), 'utf8')

    expect(pageSource).toContain('DeferredLeaderboards')
    expect(pageSource).not.toContain("from '@/components/leaderboards'")
    expect(deferredSource).toContain("import('@/components/leaderboards')")
    expect(deferredSource).toContain('LeaderboardsLoading')
    expect(deferredSource).toContain('role="status"')
    expect(deferredSource).toContain('role="alert"')
    expect(deferredSource).toContain('aria-busy="true"')
    expect(deferredSource).toContain('Retry')
    expect(deferredSource).toContain("from '@nl/ui/base/skeleton'")
  })
})

describe('public degen loading contract', () => {
  it('keeps the interactive degen browser out of the route entry chunk', () => {
    const pageSource = readFileSync(join(process.cwd(), degensPage), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), degensRouteBoundary), 'utf8')
    const clientPageSource = readFileSync(join(process.cwd(), degensClientPage), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DegenRoute'")
    expect(routeBoundarySource).toContain("dynamic(() => import('./AllDegensPage')")
    expect(routeBoundarySource).toContain('ssr: false')
    expect(routeBoundarySource).toContain('role="status"')
    expect(routeBoundarySource).toContain('aria-live="polite"')
    expect(routeBoundarySource).toContain('aria-busy="true"')
    expect(routeBoundarySource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientPageSource).toContain("'use client'")
  })
})

describe('GLTF viewer loading contract', () => {
  it('keeps the initial NFT shell server-rendered and browser controls isolated', () => {
    const pageSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), gltfClient), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain('await params')
    expect(pageSource).toContain("from 'next/image'")
    expect(pageSource).toContain("from './components/DegenViews'")
    expect(clientSource).toContain("'use client'")
    expect(clientSource).not.toContain("from 'next/image'")
    expect(clientSource).toContain("dynamic(() => import('./ModelView')")
    expect(clientSource).toContain('ssr: false')
  })
})

describe('shared notification loading contract', () => {
  it('keeps toast implementations out of the eager app shell graph', () => {
    const appShellSource = readFileSync(join(process.cwd(), appShell), 'utf8')
    const privateShellSource = readFileSync(join(process.cwd(), privateRoutesShell), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), deferredNotifications), 'utf8')

    expect(appShellSource).not.toContain('DeferredNotifications')
    expect(appShellSource).not.toContain("from '@nl/ui/base/sonner'")
    expect(appShellSource).not.toContain("from '@/components/extended/Snackbar'")
    expect(privateShellSource).toContain('DeferredNotifications')
    expect(deferredSource).toContain("import('@/components/extended/Snackbar')")
    expect(deferredSource).toContain("import('@nl/ui/base/sonner')")
    expect(deferredSource).toContain('Promise.all')
  })
})

describe('shared route loading contract', () => {
  it('uses the themed shadcn skeleton boundary for every Next app', () => {
    const sharedSource = readFileSync(join(process.cwd(), sharedRouteLoading), 'utf8')

    expect(sharedSource).toContain("from '@nl/ui/base/skeleton'")
    expect(sharedSource).toContain('role="status"')
    expect(sharedSource).toContain('aria-live="polite"')
    expect(sharedSource).toContain('aria-busy="true"')
    expect(sharedSource).toContain('bg-background')

    for (const file of routeLoadingFiles) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).toContain("from '@nl/ui/custom/route-loading'")
      expect(source).not.toContain("from '@nl/ui/custom/loading'")
    }

    expect(
      existsSync(join(process.cwd(), 'packages/ui/src/components/custom/loading/index.tsx'))
    ).toBe(false)
  })
})

describe('Smashers public shell contract', () => {
  it('keeps the homepage server-rendered except for the modal island', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersHomePage), 'utf8')
    const actionButtonsSource = readFileSync(join(process.cwd(), smashersActionButtons), 'utf8')

    expect(pageSource).not.toContain('HomeInteractive')
    expect(pageSource).toContain("import Header, { type ActiveModal } from '@/components/Header'")
    expect(pageSource).toContain('<main>')
    expect(actionButtonsSource).toContain("'use client'")
    expect(actionButtonsSource).not.toContain("from 'next/dynamic'")
    expect(actionButtonsSource).toContain("import('@/components/PlayDialog')")
    expect(actionButtonsSource).toContain("import('@/components/TrailerDialog')")
    expect(actionButtonsSource).toContain("import('@/components/CreditsDialog')")
    expect(actionButtonsSource).toContain('aria-busy={isLoading}')
  })

  it('keeps feature flags scoped to authenticated routes', () => {
    const rootLayoutSource = readFileSync(join(process.cwd(), smashersRootLayout), 'utf8')
    const authLayoutSource = readFileSync(join(process.cwd(), smashersAuthLayout), 'utf8')

    expect(rootLayoutSource).not.toContain('FeatureFlagProvider')
    expect(authLayoutSource).toContain('FeatureFlagProvider')
    expect(existsSync(join(process.cwd(), staleSmashersUnityDialog))).toBe(false)
  })
})

describe('Smashers profile loading contract', () => {
  it('keeps the interactive profile graph behind an accessible route boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersProfilePage), 'utf8')
    const routeSource = readFileSync(join(process.cwd(), smashersProfileRoute), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './ProfileRoute'")
    expect(pageSource).toContain('getSession')
    expect(pageSource).toContain("redirect('/login')")
    expect(routeSource).toContain("dynamic(() => import('./ProfileClient')")
    expect(routeSource).toContain('ssr: false')
    expect(routeSource).toContain("from '@nl/ui/base/skeleton'")
    expect(routeSource).toContain('role="status"')
    expect(routeSource).toContain('aria-live="polite"')
    expect(routeSource).toContain('aria-busy="true"')
  })
})

describe('Smashers login loading contract', () => {
  it('keeps the interactive login graph behind an accessible route boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersLoginPage), 'utf8')
    const routeSource = readFileSync(join(process.cwd(), smashersLoginRoute), 'utf8')

    expect(pageSource).not.toContain("from '@nl/ui/custom/loading'")
    expect(pageSource).not.toContain("from './LoginClient'")
    expect(pageSource).toContain("from './LoginRoute'")
    expect(pageSource).toContain('getSession')
    expect(pageSource).toContain("redirect('/profile')")
    expect(routeSource).toContain("dynamic(() => import('./LoginClient')")
    expect(routeSource).toContain('ssr: false')
    expect(routeSource).toContain("from '@nl/ui/base/skeleton'")
    expect(routeSource).toContain('role="status"')
    expect(routeSource).toContain('aria-live="polite"')
    expect(routeSource).toContain('aria-busy="true"')
  })
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

describe('dashboard dialog loading contract', () => {
  it('keeps the small trait index map out of the cosmetics registry graph', () => {
    const source = readFileSync(join(process.cwd(), degenDialog), 'utf8')

    expect(source).toContain("from '@/constants/traitIndexes'")
    expect(source).not.toContain("from '@/constants/cosmeticsFilters'")
  })

  for (const file of deferredDashboardDialogConsumers) {
    it(`defers the Degen dialog in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredDegenDialog')
      expect(source).not.toContain("from '@/components/dialog/DegenDialog'")
    })
  }

  it('defers the dashboard rename form until the dialog opens', () => {
    const source = readFileSync(join(process.cwd(), deferredRenameDegenDialog), 'utf8')

    expect(source).toContain(
      "import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent')"
    )
    expect(source).toContain('DeferredDialogLoading')
  })

  for (const file of deferredRenameDegenConsumers) {
    it(`keeps the rename form deferred in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredRenameDegenDialog')
      expect(source).not.toContain(
        "from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'"
      )
    })
  }

  it('shares an accessible loading boundary across deferred dialog wrappers', () => {
    const source = readFileSync(join(process.cwd(), deferredDialogLoading), 'utf8')

    expect(source).toContain("from '@nl/ui/base/skeleton'")
    expect(source).toContain('role="status"')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('aria-busy="true"')
  })

  const deferredDialogWrappers = [
    [deferredProfileNameDialog, 'ChangeProfileNameDialog', 'dashboard/gamer-profile/'],
    [deferredProfileImageDialog, 'ProfileImageDialog', 'dashboard/gamer-profile/'],
    [deferredNicknameDialog, 'ChangeNicknameDialog', 'dashboard/rentals/'],
  ] as const

  for (const [file, component, route] of deferredDialogWrappers) {
    it(`defers ${component} behind a shared loading boundary`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain(`import('@/app/(private-routes)/${route}`)
      expect(source).toContain(`DeferredDialogLoading`)
      expect(source).toContain('ssr: false')
    })
  }

  it('keeps the rental nickname form deferred until its dialog opens', () => {
    const source = readFileSync(join(process.cwd(), deferredNicknameDialogConsumer), 'utf8')

    expect(source).toContain('DeferredChangeNicknameDialog')
    expect(source).not.toContain("from './ChangeNicknameDialog'")
  })

  for (const file of deferredProfileDialogConsumers) {
    it(`keeps profile dialogs deferred in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredProfile')
      expect(source).not.toContain("from './ChangeProfileNameDialog'")
      expect(source).not.toContain("from './ProfileImageDialog'")
    })
  }
})

describe('auth-only route provider contract', () => {
  for (const file of authOnlyRouteLayouts) {
    it(`keeps heavy wallet features out of ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('WalletAuthContextWrapper')
      expect(source).not.toContain("from '@/contexts/WalletContextWrapper'")
    })
  }
})

describe('NFT-only route provider contract', () => {
  for (const file of nftOnlyRouteLayouts) {
    it(`keeps dashboard token balances out of ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredMintProviders')
      expect(source).not.toContain("from '@/contexts/WalletContextWrapper'")
      expect(source).not.toContain("from '@/contexts/AuditFixtureContextWrapper'")
    })
  }
})

describe('mint route provider loading contract', () => {
  it('keeps the heavy network provider out of the mint eligibility boundary', () => {
    const source = readFileSync(join(process.cwd(), mintWalletBoundary), 'utf8')

    expect(source).not.toContain('NetworkProvider')
    expect(source).toContain('DegenOwnershipProvider')
  })

  it('loads the network provider only for the mint canvas with an accessible state', () => {
    const pageSource = readFileSync(join(process.cwd(), mintPageContent), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), mintNetworkBoundary), 'utf8')

    expect(pageSource).toContain('DeferredCharacterCreator')
    expect(boundarySource).toContain("import('@/contexts/NetworkProvider')")
    expect(boundarySource).toContain('NEXT_PUBLIC_AUDIT_FIXTURE')
    expect(boundarySource).toContain('role="status"')
    expect(boundarySource).toContain('<Skeleton')
  })

  it('keeps wallet and mint content out of the initial route client segment', () => {
    const pageSource = readFileSync(join(process.cwd(), mintPage), 'utf8')
    const deferredPageSource = readFileSync(join(process.cwd(), deferredMintPage), 'utf8')
    const deferredProvidersSource = readFileSync(
      join(process.cwd(), deferredMintWalletBoundary),
      'utf8'
    )

    expect(pageSource).toContain('DeferredMintPage')
    expect(pageSource).not.toContain("from '@/contexts/")
    expect(deferredPageSource).toContain("import('./MintPageContent')")
    expect(deferredProvidersSource).toContain("import('./MintProviders')")
  })

  it('keeps the network context definition lightweight', () => {
    const contextSource = readFileSync(join(process.cwd(), networkContext), 'utf8')
    const providerSource = readFileSync(join(process.cwd(), networkProvider), 'utf8')
    const graphQLSource = readFileSync(join(process.cwd(), graphQL), 'utf8')

    for (const heavyImport of ["from '@/hooks/useContractLoader'", "from '@/hooks/useNotify'"]) {
      expect(contextSource).not.toContain(heavyImport)
      expect(providerSource).toContain(heavyImport)
    }
    expect(graphQLSource).toContain('useAccount')
    expect(graphQLSource).not.toContain("from '@/hooks/useNetworkContext'")
  })
})

describe('public Unity game loading contract', () => {
  it('shares one deferred, accessible game boundary', () => {
    const source = readFileSync(join(process.cwd(), gameRoute), 'utf8')

    expect(source).toContain("dynamic(() => import('./GameWithAuth')")
    expect(source).toContain('ssr: false')
    expect(source).toContain("from '@nl/ui/custom/route-loading'")
    expect(source).toContain('Loading game')
    expect(source).toContain('WalletRouteProvider')
  })

  for (const file of unityGamePages) {
    it(`keeps ${file} server-rendered and configuration-only`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain("'use client'")
      expect(source).not.toContain("from 'next/dynamic'")
      expect(source).not.toContain('GameWithAuth')
      expect(source).toContain("from '@/components/wrapper/GameRoute'")
    })
  }
})

describe('public storage provider contract', () => {
  it('keeps wallet storage out of the shared public shell', () => {
    const source = readFileSync(join(process.cwd(), publicRoutesLayout), 'utf8')

    expect(source).not.toContain("from '@/contexts/LocalStorageContext'")
    expect(source).not.toContain("from '@/contexts/FeatureFlagsContext'")
    expect(source).not.toContain('PublicAppContextWrapper')
    expect(existsSync(join(process.cwd(), stalePublicProviderBoundary))).toBe(false)
  })

  for (const file of walletStorageBoundaries) {
    it(`keeps wallet storage available in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain("from '@/contexts/LocalStorageContext'")
    })
  }
})

describe('public app shell contract', () => {
  it('keeps the public route layout server-rendered', () => {
    const layoutSource = readFileSync(join(process.cwd(), publicMainLayout), 'utf8')
    const routeSource = readFileSync(join(process.cwd(), publicRoutesLayout), 'utf8')

    expect(layoutSource).not.toContain("'use client'")
    expect(layoutSource).toContain("from '@/components/providers/PublicNavigation'")
    expect(routeSource).toContain("from '@/app/_layout/_PublicMainLayout'")
  })

  it('defers the mobile drawer and avoids heavy shell primitives in the eager graph', () => {
    const navigationSource = readFileSync(join(process.cwd(), publicNavigation), 'utf8')
    const mobileSource = readFileSync(join(process.cwd(), publicMobileNavigation), 'utf8')
    const desktopToggleSource = readFileSync(
      join(process.cwd(), publicDesktopSidebarToggle),
      'utf8'
    )
    const mobileTriggerSource = readFileSync(
      join(process.cwd(), publicMobileNavigationTrigger),
      'utf8'
    )
    const mainContentSource = readFileSync(join(process.cwd(), publicMainContent), 'utf8')
    const linksSource = readFileSync(join(process.cwd(), publicNavLinks), 'utf8')

    expect(navigationSource).not.toContain("'use client'")
    expect(navigationSource).toContain("from './PublicDesktopSidebarToggle'")
    expect(navigationSource).toContain("from './PublicMobileNavigationTrigger'")
    expect(navigationSource).toContain("from './PublicMainContent'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/scroll-area'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/icon'")
    expect(navigationSource).not.toContain("from '@/components/extended/Breadcrumbs'")
    expect(desktopToggleSource).toContain("from '@nl/ui/base/button'")
    expect(desktopToggleSource).toContain('data-sidebar-open')
    expect(desktopToggleSource).toContain('aria-controls="public-desktop-navigation"')
    expect(mobileTriggerSource).toContain("import('./PublicMobileNavigation')")
    expect(mobileTriggerSource).toContain("from '@nl/ui/base/button'")
    expect(mainContentSource).toContain('usePathname')
    expect(mobileSource).toContain("from '@nl/ui/base/sheet'")
    expect(mobileSource).toContain('<SheetTitle')
    expect(mobileSource).toContain('<SheetDescription')
    expect(mobileSource).toContain('id="public-mobile-navigation"')
    expect(linksSource).not.toContain("from '@nl/ui/base/icon'")
    expect(linksSource).toContain("from 'lucide-react'")
    expect(linksSource).toContain("aria-current={isSelected ? 'page' : undefined}")
  })
})

describe('verification route shell contract', () => {
  it('keeps wallet verification outside the public navigation shell', () => {
    const pageSource = readFileSync(join(process.cwd(), verificationPage), 'utf8')
    const layoutSource = readFileSync(join(process.cwd(), verificationLayout), 'utf8')

    expect(pageSource).not.toContain('PublicNavigation')
    expect(pageSource).not.toContain('_PublicMainLayout')
    expect(layoutSource).toContain('WalletAuthContextWrapper')
    expect(
      existsSync(join(process.cwd(), 'apps/app/src/app/(public-routes)/verification/page.tsx'))
    ).toBe(false)
  })
})

describe('private provider loading contract', () => {
  it('defers chain-specific warning UI out of the private shell', () => {
    const layoutSource = readFileSync(join(process.cwd(), mainLayout), 'utf8')
    const warningSource = readFileSync(join(process.cwd(), networkWarning), 'utf8')

    expect(layoutSource).toContain("dynamic(() => import('./_Header/NetworkWarning')")
    expect(layoutSource).toContain('ssr: false')
    expect(layoutSource).not.toContain("from 'viem/chains'")
    expect(layoutSource).not.toContain('useSwitchChain')
    expect(warningSource).toContain('useSwitchChain')
    expect(warningSource).toContain('TARGET_NETWORK')
    expect(warningSource).toContain('aria-live="polite"')
    expect(warningSource).toContain('<Button')
  })

  it('replaces the tiny Redux store with scoped shared contexts', () => {
    const source = readFileSync(join(process.cwd(), privateShell), 'utf8')

    expect(source).toContain('AuthStatusProvider')
    expect(source).toContain('NotificationProvider')
    expect(source).not.toContain('ReduxProvider')
    expect(existsSync(join(process.cwd(), 'apps/app/src/store/ReduxProvider.tsx'))).toBe(false)
    expect(existsSync(join(process.cwd(), 'apps/app/src/store/store.ts'))).toBe(false)
  })

  it('keeps the superseded all-in-one wallet provider removed', () => {
    expect(existsSync(join(process.cwd(), staleWalletContextWrapper))).toBe(false)
  })

  it('keeps dashboard data providers out of the shared private shell', () => {
    const source = readFileSync(join(process.cwd(), privateShell), 'utf8')

    expect(source).not.toContain("from '@/contexts/WalletContextWrapper'")
    expect(source).not.toContain("from '@/contexts/NetworkContext'")
    expect(source).not.toContain("from '@/contexts/IMXContext'")
    expect(source).not.toContain("from '@/contexts/NFTsBalanceContext'")
    expect(source).not.toContain("from '@/contexts/TokensBalanceContext'")
  })

  it('keeps the data provider boundary explicit and dashboard-scoped', () => {
    const source = readFileSync(join(process.cwd(), dashboardDataProviderBoundary), 'utf8')

    expect(source).toContain("from '@/contexts/NetworkProvider'")
    expect(source).toContain("from '@/contexts/IMXContext'")
    expect(source).toContain("from '@/contexts/NFTsBalanceContext'")
    expect(source).toContain("from '@/contexts/TokensBalanceContext'")

    for (const file of [
      'apps/app/src/app/(private-routes)/dashboard/overview/page.tsx',
      'apps/app/src/app/(private-routes)/dashboard/degens/page.tsx',
      'apps/app/src/app/(private-routes)/dashboard/gamer-profile/page.tsx',
      'apps/app/src/app/(private-routes)/dashboard/items/page.tsx',
      'apps/app/src/app/(private-routes)/dashboard/items/burner/page.tsx',
    ]) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).toContain('DashboardDataBoundary')
    }

    expect(
      readFileSync(
        join(process.cwd(), 'apps/app/src/app/(private-routes)/dashboard/rentals/page.tsx'),
        'utf8'
      )
    ).not.toContain('DashboardDataProviders')
  })

  it('keeps auth and profile URLs independent from the contract registry', () => {
    const source = readFileSync(join(process.cwd(), authUrls), 'utf8')

    expect(source).toContain("from './api'")
    expect(source).not.toContain("from './contracts'")
    for (const file of [
      'apps/app/src/hooks/useCheckAuth.ts',
      'apps/app/src/hooks/useSignAuthMsg.ts',
      'apps/app/src/hooks/useGamerProfile/useGamerProfile.ts',
      'apps/app/src/hooks/useGamerProfile/useProfileAvatarFee.ts',
      'apps/app/src/hooks/useGamerProfile/useProfileFavDegens.ts',
    ]) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).not.toContain(
        "from '@/constants/url'"
      )
    }
  })

  it('keeps AppKit UI initialization out of the eager auth shell', () => {
    const providerSource = readFileSync(join(process.cwd(), web3ModalContext), 'utf8')
    const fallbackSource = readFileSync(join(process.cwd(), walletProviderFallbacks), 'utf8')
    const authSource = readFileSync(join(process.cwd(), authTokenContext), 'utf8')
    const modalSource = readFileSync(join(process.cwd(), walletModal), 'utf8')

    expect(providerSource).toContain("import('./Web3ModalConfig')")
    expect(providerSource).not.toContain("from './Web3ModalConfig'")
    expect(providerSource).not.toContain('createAppKit')
    expect(providerSource).not.toContain('@reown/appkit/react')
    expect(providerSource).not.toContain('@/constants/contracts')
    expect(fallbackSource).toContain('<Skeleton')
    expect(fallbackSource).toContain('role="status"')
    expect(fallbackSource).toContain('role="alert"')
    expect(providerSource).toContain('Retry')
    expect(authSource).not.toContain('useAppKit')
    expect(authSource).not.toContain('useAppKitEvents')
    expect(authSource).toContain('openWalletModal')
    expect(modalSource).toContain("import('@reown/appkit/react')")
    expect(modalSource).toContain("import('@/constants/contracts')")
  })

  it('loads dashboard data after the shell has painted with accessible recovery states', () => {
    const source = readFileSync(join(process.cwd(), dashboardDataBoundary), 'utf8')

    expect(source).toContain("import('@/contexts/DashboardDataProviders')")
    expect(source).toContain('role="status"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('Retry')
  })

  it('preserves the private shell layout while keeping the sidebar lightweight', () => {
    const layoutSource = readFileSync(join(process.cwd(), privateShellLayout), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), privateShellBoundary), 'utf8')
    const shellSource = readFileSync(join(process.cwd(), privateShell), 'utf8')
    const profileSource = readFileSync(join(process.cwd(), sidebarProfile), 'utf8')

    expect(layoutSource).toContain('PrivateRoutesBoundary')
    expect(layoutSource).toContain('headers()')
    expect(boundarySource).toContain("import('./PrivateRoutesShell')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<Skeleton')
    expect(boundarySource).toContain('role="status"')
    expect(shellSource).toContain('MainLayout')
    expect(shellSource).toContain('Web3ModalProvider')
    expect(shellSource).toContain('AuthTokenProvider')
    expect(profileSource).toContain('Open dashboard')
    expect(profileSource).toContain('<Button asChild className="w-full">')
    expect(profileSource).not.toContain('SidebarWalletActions')
    expect(profileSource).not.toContain("from '@/hooks/useNetworkContext'")
    expect(profileSource).not.toContain("from '@/hooks/writeContracts/useClaimNFTL'")
  })
})

describe('shared value equality contract', () => {
  it('keeps lodash equality out of eager app utilities', () => {
    const utilitySource = readFileSync(join(process.cwd(), valueEqualityUtility), 'utf8')

    expect(utilitySource).not.toContain('lodash')
    for (const file of [localStorageHook, contractReaderHook]) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).toContain("from '@/utils/value-equality'")
      expect(source).not.toContain("from 'lodash/isEqual'")
    }
  })
})

describe('dashboard overview loading contract', () => {
  it('defers dashboard sections behind the shared loading boundary', () => {
    const source = readFileSync(join(process.cwd(), dashboardOverview), 'utf8')
    const nftlSource = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(private-routes)/dashboard/overview/_MyNFTL/index.tsx'),
      'utf8'
    )

    expect(source).toContain('import DeferredDashboardSection')
    expect(source).toContain("const loadMyComics = () => import('./MyComics')")
    expect(source).toContain("const loadMyItems = () => import('./MyItems')")
    expect(source).toContain("const loadMyDegens = () => import('./MyDegens')")
    expect(source).toContain("const loadMyNFTL = () => import('./_MyNFTL')")
    expect(source).toContain("const loadMyStats = () => import('./MyStats')")
    expect(source).toContain("import('./MyComics')")
    expect(source).toContain("import('./MyItems')")
    expect(source).toContain("import('./MyDegens')")
    expect(source).toContain("import('./_MyNFTL')")
    expect(source).toContain("import('./MyStats')")
    expect(source).toContain('<DeferredDashboardSection label="My Tokens" load={loadMyNFTL} />')
    expect(source).toContain('<DeferredDashboardSection label="My DEGENs" load={loadMyDegens} />')
    expect(source).toContain('<DeferredDashboardSection label="My Comics" load={loadMyComics} />')
    expect(source).toContain('<DeferredDashboardSection label="My Items" load={loadMyItems} />')
    expect(source).toContain('<DeferredDashboardSection label="My Stats" load={loadMyStats} />')
    expect(nftlSource).toContain('DeferredDashboardSection')
    expect(nftlSource).toContain("const loadArcadeBalance = () => import('./ArcadeBalance')")
    expect(nftlSource).toContain("import('./ArcadeBalance')")
    expect(nftlSource).toContain(
      '<DeferredDashboardSection label="Arcade balance" load={loadArcadeBalance} />'
    )
  })

  it('uses themed shadcn skeletons while dashboard sections load', () => {
    const adapterSource = readFileSync(
      join(process.cwd(), 'apps/app/src/components/providers/DeferredDashboardSection.tsx'),
      'utf8'
    )
    const sharedSource = readFileSync(
      join(process.cwd(), 'packages/ui/src/components/custom/deferred-section/index.tsx'),
      'utf8'
    )

    expect(adapterSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(adapterSource).toContain('export const DashboardSectionLoading = DeferredSectionLoading')
    expect(adapterSource).toContain('export default DeferredSection')
    expect(sharedSource).toContain("from '@nl/ui/base/skeleton'")
    expect(sharedSource).toContain('role="status"')
    expect(sharedSource).toContain('aria-live="polite"')
    expect(sharedSource).toContain('aria-busy="true"')
    expect(sharedSource).toContain('<Skeleton')
    expect(sharedSource).toContain('role="alert"')
    expect(sharedSource).toContain('Retry')
  })
})

describe('dashboard DEGEN loading contract', () => {
  it('keeps the card and filter graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardDegens), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardDegensContent), 'utf8')

    expect(pageSource).toContain("dynamic(() => import('./DashboardDegensContent')")
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-busy="true"')
    expect(pageSource).not.toContain("from '@/components/cards/DegenCard/DashboardDegenCard'")
    expect(pageSource).not.toContain("from '@/components/extended/DegensFilter'")
    expect(contentSource).toContain("import('@/components/cards/DegenCard/DashboardDegenCard')")
    expect(contentSource).toContain(
      "import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'"
    )
    expect(contentSource).not.toContain(
      "import DegensFilter from '@/components/extended/DegensFilter'"
    )
    expect(contentSource).toContain('DashboardDegensPageContent')
  })
})

describe('dashboard items loading contract', () => {
  it('keeps the comic and item graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardItems), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardItemsContent), 'utf8')

    expect(pageSource).toContain("dynamic(() => import('./DashboardItemsContent')")
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
    expect(pageSource).not.toContain("from '@/components/cards/ComicCard'")
    expect(pageSource).not.toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain("from '@/components/cards/ComicCard'")
    expect(contentSource).toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain('DashboardComicsPageContent')
  })
})

describe('dashboard burner loading contract', () => {
  it('keeps the burner machine and wallet graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardBurner), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardBurnerContent), 'utf8')

    expect(pageSource).toContain("dynamic(() => import('./ComicsBurnerContent')")
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
    expect(pageSource).not.toContain("from 'ethers'")
    expect(pageSource).not.toContain("from './_components/machine'")
    expect(pageSource).not.toContain("from '@/hooks/useNetworkContext'")
    expect(contentSource).toContain("from 'ethers'")
    expect(contentSource).toContain("from './_components/machine'")
    expect(contentSource).toContain("from '@/hooks/useNetworkContext'")
    expect(contentSource).toContain('setRefreshKey((key) => key + 1)')
  })
})

describe('gamer profile loading contract', () => {
  it('keeps profile, wallet, and inventory graphs behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), gamerProfile), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), gamerProfileContent), 'utf8')

    expect(pageSource).toContain("dynamic(() => import('./GamerProfileContent')")
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
    expect(pageSource).not.toContain("from 'wagmi'")
    expect(pageSource).not.toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain("from 'wagmi'")
    expect(contentSource).toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).not.toContain('defaultValue')
    expect(contentSource).toContain('GamerProfileProvider')
  })
})

describe('dashboard rentals loading contract', () => {
  it('keeps the rental grid and auth query graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardRentals), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardRentalsContent), 'utf8')

    expect(pageSource).toContain("dynamic(() => import('./DashboardRentalsContent')")
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
    expect(pageSource).not.toContain("from './MyRentalsDataGrid'")
    expect(pageSource).not.toContain("from '@tanstack/react-query'")
    expect(contentSource).toContain("from './MyRentalsDataGrid'")
    expect(contentSource).toContain("from '@tanstack/react-query'")
    expect(contentSource).toContain('My Rentals')
  })
})

describe('shared analytics loading contract', () => {
  it('defers GTM and Web Vitals until the browser is idle', () => {
    const source = readFileSync(join(process.cwd(), deferredAnalyticsSource), 'utf8')

    expect(source).toContain("import('./GoogleTagManager')")
    expect(source).toContain("import('./WebVitals')")
    expect(source).toContain('requestIdleCallback')
    expect(source).toContain('setTimeout')
    expect(source).not.toContain("from 'next/dynamic'")
  })

  for (const file of analyticsLayouts) {
    it(`uses deferred analytics in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredAnalytics')
      expect(source).not.toContain('import { GoogleTagManager')
      expect(source).not.toContain('import { WebVitals')
    })
  }
})

describe('app-router metadata contract', () => {
  for (const file of [
    'apps/app/src/app/layout.tsx',
    'apps/web/src/app/layout.tsx',
    'apps/smashers/src/app/layout.tsx',
  ]) {
    it(`keeps ${file} on the Metadata API`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain("from 'next/head'")
      expect(source).not.toContain('<Head>')
    })
  }
})

describe('shared console game loading contract', () => {
  for (const file of deferredConsoleGameRoutes) {
    it(`defers the console game client boundary in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredConsoleGame')
      expect(source).not.toContain("from '@nl/ui/custom/console-game'")
    })
  }
})

describe('shared below-fold loading contract', () => {
  it('provides an accessible themed loading state with retry behavior', () => {
    const source = readFileSync(join(process.cwd(), sharedDeferredSection), 'utf8')

    expect(source).toContain("from '@nl/ui/base/skeleton'")
    expect(source).toContain("from '@nl/ui/base/button'")
    expect(source).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(source).toContain('role="status"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('Retry')
  })

  it('defers below-fold marketing sections in web', () => {
    const pageSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), webDeferredHomeSections), 'utf8')

    expect(pageSource).toContain('DeferredMintOMatic')
    expect(pageSource).toContain('DeferredSponsors')
    expect(pageSource).not.toContain("import('@/components/MintOMatic')")
    expect(pageSource).not.toContain("import('@/components/Sponsors')")
    expect(deferredSource).toContain("import('@/components/MintOMatic')")
    expect(deferredSource).toContain("import('@/components/Sponsors')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-section'")
  })

  it('defers below-fold marketing sections in Smashers', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersHomePage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), smashersDeferredHomeSections), 'utf8')

    expect(pageSource).toContain('DeferredGameSection')
    expect(pageSource).toContain('DeferredDegensSection')
    expect(pageSource).not.toContain("import('@/components/GameSection')")
    expect(pageSource).not.toContain("import('@/components/DegensSection')")
    expect(deferredSource).toContain("import('@/components/GameSection')")
    expect(deferredSource).toContain("import('@/components/DegensSection')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-section'")
  })
})

describe('web public navigation contract', () => {
  it('keeps static navigation configuration out of the client graph', () => {
    const navbarSource = readFileSync(join(process.cwd(), webNavbar), 'utf8')
    const sharedNavbarSource = readFileSync(join(process.cwd(), sharedWebNavbar), 'utf8')
    const mobileTriggerSource = readFileSync(join(process.cwd(), sharedWebMobileTrigger), 'utf8')
    const mobileNavbarSource = readFileSync(join(process.cwd(), sharedWebMobileNavbar), 'utf8')

    expect(navbarSource).not.toContain("'use client'")
    expect(navbarSource).toContain("from '@nl/ui/custom/navbar'")
    expect(sharedNavbarSource).toContain("import NavbarScrollFrame from './NavbarScrollFrame'")
    expect(sharedNavbarSource).toContain("import ActiveNavLink from './ActiveNavLink'")
    expect(sharedNavbarSource).toContain('<details')
    expect(sharedNavbarSource).not.toContain("from '@nl/ui/base/navigation-menu'")
    expect(sharedNavbarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(mobileTriggerSource).toContain("import('./MobileNavMenu')")
    expect(mobileTriggerSource).toContain('ssr: false')
    expect(mobileTriggerSource).toContain('aria-controls="nifty-mobile-navigation"')
    expect(mobileNavbarSource).toContain("from '@nl/ui/base/sheet'")
    expect(mobileNavbarSource).toContain('<SheetTitle')
    expect(mobileNavbarSource).toContain('<SheetDescription')
    expect(mobileNavbarSource).toContain('id="nifty-mobile-navigation"')
  })
})

describe('web marketing page boundary contract', () => {
  it('keeps static marketing pages server-rendered while deferring interaction', () => {
    const communitySource = readFileSync(join(process.cwd(), webCommunityPage), 'utf8')
    const teamSource = readFileSync(join(process.cwd(), webTeamPage), 'utf8')
    const carouselSource = readFileSync(join(process.cwd(), webCarousel), 'utf8')

    expect(communitySource).not.toContain("'use client'")
    expect(communitySource).not.toContain('useMediaQuery')
    expect(communitySource).toContain('sliding-background-wrapper')
    expect(teamSource).not.toContain("'use client'")
    expect(teamSource).toContain("import Carousel from '@/components/Carousel'")
    expect(carouselSource).toContain("'use client'")
  })
})

describe('web marketing animation boundary contract', () => {
  for (const file of [...animationFreeMarketingPages, ...animationFreeMarketingComponents]) {
    it(`keeps default marketing content out of the animated client boundary in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain('AnimatedWrapper')
      expect(source).not.toContain('@nl/ui/custom/animated-wrapper')
      expect(source).not.toContain('transition-fade-start')
      expect(source).not.toContain('transition-vertical-fade-start')
      expect(source).not.toContain('transition-quick-pop-start')
      expect(source).not.toContain('transition-quick-pop-left-start')
      expect(source).not.toContain('delay-lite')
      expect(source).not.toContain('delay-normal')
      expect(source).not.toContain('delay-long')
    })
  }
})

describe('static legal route performance contract', () => {
  for (const file of staticLegalPages) {
    it(`keeps ${file} server-only and immediately visible`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain("'use client'")
      expect(source).not.toContain('AnimatedWrapper')
      expect(source).not.toContain('@nl/ui/custom/animated-wrapper')
      expect(source).not.toContain('transition-fade-start')
    })
  }

  it('keeps the shared legal definitions fragment free of client-only animation code', () => {
    const source = readFileSync(join(process.cwd(), webDefinitions), 'utf8')

    expect(source).not.toContain("from 'react'")
    expect(source).not.toContain('AnimatedWrapper')
    expect(source).not.toContain('transition-fade-start')
  })
})

const sentryClientBoundaries = [
  'apps/app/src/instrumentation-client.ts',
  'apps/app/src/app/global-error.tsx',
  'apps/web/src/instrumentation-client.ts',
  'apps/web/src/app/global-error.tsx',
  'apps/smashers/src/instrumentation-client.ts',
  'apps/smashers/src/app/global-error.tsx',
]

describe('deferred Sentry client contract', () => {
  for (const file of sentryClientBoundaries) {
    it(`keeps the Sentry SDK out of the static client boundary in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain("from '@sentry/nextjs'")
      if (file.endsWith('instrumentation-client.ts')) {
        expect(source).toContain('@nl/sentry-client/router-bridge')
        expect(source).not.toContain('@nl/sentry-client/bootstrap')
      } else {
        expect(source).toContain("import('@nl/sentry-client/bootstrap')")
      }
    })
  }

  it('keeps the shared Sentry loader dynamic', () => {
    const source = readFileSync(join(process.cwd(), 'packages/sentry-client/src/client.ts'), 'utf8')
    const bootstrap = readFileSync(
      join(process.cwd(), 'packages/sentry-client/src/bootstrap.ts'),
      'utf8'
    )
    const routerBridge = readFileSync(
      join(process.cwd(), 'packages/sentry-client/src/router-bridge.ts'),
      'utf8'
    )

    expect(source).toContain("import('@sentry/nextjs')")
    expect(bootstrap).toContain("import('./client')")
    expect(bootstrap).not.toContain("from '@sentry/nextjs'")
    expect(routerBridge).not.toContain("from '@sentry/nextjs'")
  })
})

describe('public route dependency contract', () => {
  it('uses the shared accessible deferred section for Web3 game cards', () => {
    const source = readFileSync(join(process.cwd(), deferredWeb3GameList), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-section'")
    expect(source).toContain("import('./_Web3GameList')")
    expect(source).toContain('rootMargin="200px"')
    expect(source).not.toContain('useOnScreen')
    expect(source).not.toContain('useState')
  })

  it('defers the Smashers PlayFab auth form behind an accessible loading boundary', () => {
    const source = readFileSync(join(process.cwd(), smashersLoginClient), 'utf8')

    expect(source).toContain("dynamic(() => import('@nl/playfab/components/PlayFabAuthForm')")
    expect(source).toContain('ssr: false')
    expect(source).toContain("from '@nl/ui/base/skeleton'")
    expect(source).toContain('role="status"')
    expect(source).toContain('aria-live="polite"')
    expect(source).not.toContain("from '@nl/playfab/components/PlayFabAuthForm'")
  })

  it('defers the public carousel library until its cards approach the viewport', () => {
    const shell = readFileSync(join(process.cwd(), publicCarousel), 'utf8')
    const interactive = readFileSync(join(process.cwd(), interactivePublicCarousel), 'utf8')

    expect(shell).toContain("import('./InteractiveCarousel')")
    expect(shell).toContain('IntersectionObserver')
    expect(shell).not.toContain("from 'react-multi-carousel'")
    expect(shell).not.toContain('react-multi-carousel/lib/styles.css')
    expect(interactive).toContain("from 'react-multi-carousel'")
    expect(interactive).toContain('react-multi-carousel/lib/styles.css')
    expect(interactive).toContain('ssr={true}')
    expect(interactive).toContain('autoPlay={true}')
  })

  it('keeps API-only constants separate from the contract registry', () => {
    const source = readFileSync(join(process.cwd(), 'apps/app/src/constants/api.ts'), 'utf8')

    expect(source).not.toContain('constants/contracts')
    expect(source).not.toContain('deployments')
  })

  it('keeps the public degen dialog wallet-free', () => {
    const page = readFileSync(join(process.cwd(), degensClientPage), 'utf8')
    const dialog = readFileSync(
      join(process.cwd(), 'apps/app/src/components/dialog/PublicDegenDialog.tsx'),
      'utf8'
    )

    const deferredDialog = readFileSync(
      join(process.cwd(), 'apps/app/src/components/providers/DeferredPublicDegenDialog.tsx'),
      'utf8'
    )

    expect(page).toContain('DeferredPublicDegenDialog')
    expect(page).not.toContain('WalletDegenDialog')
    expect(dialog).toContain("from '@nl/ui/base/dialog'")
    expect(dialog).not.toContain('WalletFeatureProviders')
    expect(dialog).not.toContain('useNetworkContext')
    expect(deferredDialog).toContain("import('@/components/dialog/PublicDegenDialog')")
    expect(deferredDialog).toContain('DeferredDialogLoading')
  })

  it('defers the public degen filter behind an accessible loading boundary', () => {
    const page = readFileSync(join(process.cwd(), degensClientPage), 'utf8')
    const deferredFilter = readFileSync(
      join(process.cwd(), 'apps/app/src/components/providers/DeferredDegensFilter.tsx'),
      'utf8'
    )

    expect(page).toContain('DeferredDegensFilter')
    expect(page).not.toContain("from '@/components/extended/DegensFilter'")
    expect(deferredFilter).toContain("import('@/components/extended/DegensFilter')")
    expect(deferredFilter).toContain('DeferredDialogLoading')
  })

  it('keeps wallet-backed game providers out of public game cards', () => {
    const loader = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/DeferredWeb3GameList.tsx'),
      'utf8'
    )
    const list = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'),
      'utf8'
    )

    expect(loader).toContain("from '@nl/ui/custom/deferred-section'")
    expect(loader).toContain("import('./_Web3GameList')")
    expect(list).toContain('asChild')
    expect(list).not.toContain('WalletFeatureProviders')
    expect(list).not.toContain('ConnectWrapper')
    expect(list).not.toContain('useTokensBalances')
  })

  it('keeps the removed desktop download dialog from returning as dead UI', () => {
    const list = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'),
      'utf8'
    )

    expect(existsSync(join(process.cwd(), staleDownloadGameDialog))).toBe(false)
    expect(list).not.toContain('DownloadGameDialog')
  })

  it('keeps dashboard-only card actions in a private wrapper', () => {
    const card = readFileSync(
      join(process.cwd(), 'apps/app/src/components/cards/DegenCard/index.tsx'),
      'utf8'
    )
    const dashboardCard = readFileSync(
      join(process.cwd(), 'apps/app/src/components/cards/DegenCard/DashboardDegenCard.tsx'),
      'utf8'
    )

    expect(card).not.toContain("from './DegenDashboardActions'")
    expect(card).toContain('dashboardActions?: React.ReactNode')
    expect(dashboardCard).toContain("import('./DegenDashboardActions')")
  })
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
