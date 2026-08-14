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
  'apps/app/src/contexts/WalletAuthProviders.tsx',
  'apps/app/src/contexts/WalletFeatureProviders.tsx',
  'apps/app/src/components/providers/MintProviders.tsx',
]
const dashboardOverview = 'apps/app/src/app/(private-routes)/dashboard/overview/page.tsx'
const dashboardOverviewBoundary =
  'apps/app/src/app/(private-routes)/dashboard/overview/DashboardOverviewRouteBoundary.tsx'
const dashboardOverviewClient =
  'apps/app/src/app/(private-routes)/dashboard/overview/DashboardOverviewClient.tsx'
const dashboardDegens = 'apps/app/src/app/(private-routes)/dashboard/degens/page.tsx'
const dashboardDegensBoundary =
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensRouteBoundary.tsx'
const dashboardDegensClient =
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensClient.tsx'
const dashboardDegensContent =
  'apps/app/src/app/(private-routes)/dashboard/degens/DashboardDegensContent.tsx'
const dashboardItems = 'apps/app/src/app/(private-routes)/dashboard/items/page.tsx'
const dashboardItemsBoundary =
  'apps/app/src/app/(private-routes)/dashboard/items/DashboardItemsRouteBoundary.tsx'
const dashboardItemsClient =
  'apps/app/src/app/(private-routes)/dashboard/items/DashboardItemsClient.tsx'
const dashboardItemsContent =
  'apps/app/src/app/(private-routes)/dashboard/items/DashboardItemsContent.tsx'
const dashboardBurner = 'apps/app/src/app/(private-routes)/dashboard/items/burner/page.tsx'
const dashboardBurnerBoundary =
  'apps/app/src/app/(private-routes)/dashboard/items/burner/ComicsBurnerRouteBoundary.tsx'
const dashboardBurnerClient =
  'apps/app/src/app/(private-routes)/dashboard/items/burner/ComicsBurnerClient.tsx'
const dashboardBurnerContent =
  'apps/app/src/app/(private-routes)/dashboard/items/burner/ComicsBurnerContent.tsx'
const gamerProfile = 'apps/app/src/app/(private-routes)/dashboard/gamer-profile/page.tsx'
const gamerProfileBoundary =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileRouteBoundary.tsx'
const gamerProfileClient =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileClient.tsx'
const gamerProfileContent =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/GamerProfileContent.tsx'
const dashboardRentals = 'apps/app/src/app/(private-routes)/dashboard/rentals/page.tsx'
const dashboardRentalsBoundary =
  'apps/app/src/app/(private-routes)/dashboard/rentals/DashboardRentalsRouteBoundary.tsx'
const dashboardRentalsClient =
  'apps/app/src/app/(private-routes)/dashboard/rentals/DashboardRentalsClient.tsx'
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
const viewportVideo = 'packages/ui/src/components/custom/viewport-video/index.tsx'
const viewportVideoBoundary =
  'packages/ui/src/components/custom/viewport-video/ViewportVideoBoundary.tsx'
const viewportVideoEnhancer =
  'packages/ui/src/components/custom/viewport-video/ViewportVideoEnhancer.tsx'
const web3GameList = 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'
const publicGamesGridStyles = 'apps/app/src/app/(public-routes)/games/grid-item.module.css'
const staleDownloadGameDialog = 'apps/app/src/components/dialog/DownloadGameDialog.tsx'
const gameCard = 'apps/app/src/components/cards/GameCard.tsx'
const smashersLoginClient = 'apps/smashers/src/app/(auth_routes)/login/LoginClient.tsx'
const smashersLoginPage = 'apps/smashers/src/app/(auth_routes)/login/page.tsx'
const smashersLoginRoute = 'apps/smashers/src/app/(auth_routes)/login/LoginRoute.tsx'
const sharedAuthIconSources = [
  'packages/ui/src/components/custom/input/index.tsx',
  'packages/ui/src/components/custom/auth-form/forms/login.tsx',
  'packages/ui/src/components/custom/auth-form/forms/forgot-password.tsx',
  'packages/ui/src/components/custom/auth-form/forms/update-password.tsx',
  'packages/ui/src/components/custom/social-icon-button/index.tsx',
  'packages/ui/src/components/custom/theme/index.tsx',
]
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
const webOverviewPage = 'apps/web/src/app/(main)/overview/page.tsx'
const gltfPage = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/page.tsx'
const gltfClient = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViews.tsx'
const gltfRouteBoundary =
  'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViewsRouteBoundary.tsx'
const webViemClient = 'apps/web/src/lib/viemClient.ts'
const webClaimableNFTL = 'apps/web/src/hooks/useClaimableNFTL.ts'
const webDegenAssets = 'apps/web/src/constants/degen-assets.ts'
const webDegenCatalog = 'apps/web/src/constants/degens.ts'
const webNavbar = 'apps/web/src/components/Navbar/index.tsx'
const sharedWebNavbar = 'packages/ui/src/components/custom/navbar/index.tsx'
const sharedWebNavbarScrollFrame = 'packages/ui/src/components/custom/navbar/NavbarScrollFrame.tsx'
const sharedWebMobileNavbar = 'packages/ui/src/components/custom/navbar/MobileNavMenu.tsx'
const sharedWebNavLinkContent = 'packages/ui/src/components/custom/navbar/NavLinkContent.tsx'
const sharedWebMobileTrigger = 'packages/ui/src/components/custom/navbar/MobileNavTrigger.tsx'
const sharedConsoleGame = 'packages/ui/src/components/custom/console-game/index.tsx'
const sharedDeferredConsoleGame =
  'packages/ui/src/components/custom/deferred-console-game/index.tsx'
const webCommunityPage = 'apps/web/src/app/(main)/community/page.tsx'
const webTeamPage = 'apps/web/src/app/(main)/team/page.tsx'
const webCarousel = 'apps/web/src/components/Carousel/index.tsx'
const sharedThemeButton = 'packages/ui/src/components/custom/theme-button-group/index.tsx'
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
  'packages/ui/src/components/custom/theme-button-group/index.tsx',
  'apps/web/src/components/LearnCards/index.tsx',
  'apps/web/src/components/Careers/JobCard.tsx',
  'apps/web/src/components/Sponsors.tsx',
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
const webCommunityDegenCarousel = 'apps/web/src/components/CommunityDegenCarousel.tsx'
const webDeferredTeamSections = 'apps/web/src/components/DeferredTeamSections.tsx'
const webTeamCarousel = 'apps/web/src/components/TeamCarousel.tsx'
const webDeferredOverviewSections = 'apps/web/src/components/DeferredOverviewSections.tsx'
const webOverviewFAQ = 'apps/web/src/components/OverviewFAQ.tsx'
const webCareersPage = 'apps/web/src/app/(main)/careers/page.tsx'
const webDeferredCareersSections = 'apps/web/src/components/DeferredCareersSections.tsx'
const webCareersJobs = 'apps/web/src/components/CareersJobs.tsx'
const smashersDeferredHomeSections = 'apps/smashers/src/components/DeferredHomeSections.tsx'
const appShell = 'apps/app/src/app/_layout/AppShell.tsx'
const privateRoutesShell = 'apps/app/src/components/providers/PrivateRoutesShell.tsx'
const deferredNotifications = 'apps/app/src/components/providers/DeferredNotifications.tsx'
const deferredDegenCard = 'apps/app/src/components/providers/DeferredDegenCard.tsx'
const deferredCharacterCreator = 'apps/app/src/components/providers/DeferredCharacterCreator.tsx'
const leaderboardsPage = 'apps/app/src/app/(public-routes)/leaderboards/page.tsx'
const deferredLeaderboards = 'apps/app/src/components/providers/DeferredLeaderboards.tsx'
const deferredComponent = 'packages/ui/src/components/custom/deferred-component/index.tsx'
const degensPage = 'apps/app/src/app/(public-routes)/degens/page.tsx'
const degensRouteBoundary = 'apps/app/src/app/(public-routes)/degens/DegenRoute.tsx'
const degensClientPage = 'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx'
const degensSearchParamsBoundary =
  'apps/app/src/app/(public-routes)/degens/DegenSearchParamsBoundary.tsx'
const degensTopNav = 'apps/app/src/components/extended/DegensTopNav/index.tsx'
const publicMainLayout = 'apps/app/src/app/_layout/_PublicMainLayout/index.tsx'
const publicNavigation = 'apps/app/src/components/providers/PublicNavigation.tsx'
const sharedAppBar = 'packages/ui/src/components/custom/app-bar/index.tsx'
const publicContentContainer = 'apps/app/src/components/wrapper/PublicContentContainer.tsx'
const publicNavLinks = 'apps/app/src/components/providers/PublicNavLinks.tsx'
const sharedMobileNavigation = 'packages/ui/src/components/custom/mobile-navigation/index.tsx'
const collapsibleSidebarLayout = 'apps/app/src/app/_layout/_CollapsibleSidebarLayout/index.tsx'
const smashersBackButton = 'apps/smashers/src/components/Header/BackButton/index.tsx'
const verificationPage = 'apps/app/src/app/verification/page.tsx'
const verificationLayout = 'apps/app/src/app/verification/layout.tsx'
const verificationClient = 'apps/app/src/app/verification/VerificationClient.tsx'
const verificationRouteBoundary = 'apps/app/src/app/verification/VerificationRouteBoundary.tsx'
const walletAuthContextWrapper = 'apps/app/src/contexts/WalletAuthContextWrapper.tsx'
const walletAuthProviders = 'apps/app/src/contexts/WalletAuthProviders.tsx'
const walletAuthProvidersBoundary = 'apps/app/src/contexts/WalletAuthProvidersBoundary.tsx'

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
    const sharedSource = readFileSync(join(process.cwd(), deferredComponent), 'utf8')

    expect(pageSource).toContain('DeferredLeaderboards')
    expect(pageSource).not.toContain("from '@/components/leaderboards'")
    expect(deferredSource).toContain("import('@/components/leaderboards')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-component'")
    expect(deferredSource).toContain('LeaderboardsLoading')
    expect(deferredSource).toContain('role="status"')
    expect(deferredSource).toContain('aria-busy="true"')
    expect(deferredSource).toContain("from '@nl/ui/base/skeleton'")
    expect(sharedSource).toContain('role="alert"')
    expect(sharedSource).toContain('Retry')
  })
})

describe('public degen loading contract', () => {
  it('keeps the interactive degen browser split while server-rendering its shell', () => {
    const pageSource = readFileSync(join(process.cwd(), degensPage), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), degensRouteBoundary), 'utf8')
    const clientPageSource = readFileSync(join(process.cwd(), degensClientPage), 'utf8')
    const topNavSource = readFileSync(join(process.cwd(), degensTopNav), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DegenRoute'")
    expect(routeBoundarySource).toContain("dynamic(() => import('./AllDegensPage')")
    expect(routeBoundarySource).not.toContain('ssr: false')
    expect(routeBoundarySource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientPageSource).toContain("'use client'")
    expect(clientPageSource).toContain("from 'lucide-react'")
    expect(clientPageSource).toContain('<Suspense fallback={null}>')
    expect(clientPageSource).not.toContain('ssr: false')
    expect(routeBoundarySource).toContain('role="status"')
    expect(routeBoundarySource).toContain('aria-live="polite"')
    expect(routeBoundarySource).toContain('aria-busy="true"')
    const searchParamsBoundarySource = readFileSync(
      join(process.cwd(), degensSearchParamsBoundary),
      'utf8'
    )
    expect(searchParamsBoundarySource).toContain('useSearchParams')
    expect(searchParamsBoundarySource).toContain('Object.fromEntries')
    expect(clientPageSource).not.toContain("from '@nl/ui/base/icon'")
    expect(topNavSource).toContain("from 'lucide-react'")
    expect(topNavSource).not.toContain("from '@nl/ui/base/icon'")
  })
})

describe('GLTF viewer loading contract', () => {
  it('keeps the initial NFT shell server-rendered and browser controls isolated', () => {
    const pageSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), gltfClient), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), gltfRouteBoundary), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain('await params')
    expect(pageSource).toContain("from 'next/image'")
    expect(pageSource).toContain("from './components/DegenViewsRouteBoundary'")
    expect(routeBoundarySource).toContain("dynamic(() => import('./DegenViews')")
    expect(routeBoundarySource).not.toContain('ssr: false')
    expect(routeBoundarySource).toContain('<RouteLoading label="Loading DEGEN viewer" />')
    expect(clientSource).toContain("'use client'")
    expect(clientSource).not.toContain("from 'next/image'")
    expect(clientSource).toContain("dynamic(() => import('./ModelView')")
    expect(clientSource).toContain('ssr: false')
  })

  it('preloads only the visible NFT artwork', () => {
    const source = readFileSync(join(process.cwd(), gltfPage), 'utf8')

    expect(source).toContain('priority\n          src={imageSrc}')
    expect(source).not.toContain('className={styles.sprite}\n          fill\n          priority')
    expect(source).not.toContain('quality={100}')
  })

  it('keeps accumulated NFTL reads available when the optional Infura variable is unavailable', () => {
    const clientSource = readFileSync(join(process.cwd(), webViemClient), 'utf8')
    const hookSource = readFileSync(join(process.cwd(), webClaimableNFTL), 'utf8')

    expect(clientSource).toContain('NEXT_PUBLIC_INFURA_ID')
    expect(clientSource).toContain('NEXT_PUBLIC_INFURA_PROJECT_ID')
    expect(clientSource).toContain('ethereum-rpc.publicnode.com')
    expect(clientSource).toContain('fallback(rpcTransports)')
    expect(hookSource).toContain('args: [BigInt(tokenNumber)]')
    expect(hookSource).toContain('if (!cancelled)')
  })

  it('keeps route-only DEGEN constants out of the full catalog module', () => {
    const pageSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')
    const modelSource = readFileSync(
      join(
        process.cwd(),
        'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/ModelView.tsx'
      ),
      'utf8'
    )
    const assetSource = readFileSync(join(process.cwd(), webDegenAssets), 'utf8')
    const catalogSource = readFileSync(join(process.cwd(), webDegenCatalog), 'utf8')

    expect(pageSource).toContain("from '@/constants/degen-assets'")
    expect(modelSource).toContain("from '@/constants/degen-assets'")
    expect(assetSource).toContain('export const LEGGIES')
    expect(catalogSource).not.toContain("from './degen-assets'")
    expect(catalogSource).not.toContain('export const METAS')
    expect(catalogSource).not.toContain('export const RARES')
    expect(pageSource).not.toContain("from '@/constants/degens'")
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

describe('shared deferred loader contract', () => {
  it('uses the shared cancellable loader for app-only boundaries', () => {
    for (const file of [
      deferredDegenCard,
      deferredCharacterCreator,
      deferredMintWalletBoundary,
      mintNetworkBoundary,
      deferredNotifications,
    ]) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain("from '@nl/ui/hooks/useDeferredComponent'")
      expect(source).toContain('useDeferredComponent')
    }
  })

  it('shares viewport visibility state with the interactive web carousel', () => {
    const source = readFileSync(join(process.cwd(), publicCarousel), 'utf8')

    expect(source).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(source).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(source).toContain("import('./InteractiveCarousel')")
    expect(source).toContain("'300px 0px'")
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
    const headerSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/components/Header/index.tsx'),
      'utf8'
    )
    const actionButtonsSource = readFileSync(join(process.cwd(), smashersActionButtons), 'utf8')

    expect(pageSource).not.toContain('HomeInteractive')
    expect(pageSource).toContain("import Header, { type ActiveModal } from '@/components/Header'")
    expect(pageSource).toContain('<main>')
    expect(headerSource).not.toContain("'use client'")
    expect(headerSource).toContain("import ActionButtonsGroup from './ActionButtonsGroup'")
    expect(actionButtonsSource).toContain("'use client'")
    expect(actionButtonsSource).not.toContain("from 'next/dynamic'")
    expect(actionButtonsSource).toContain("from '@nl/ui/base/button'")
    expect(actionButtonsSource).toContain('<Button')
    expect(actionButtonsSource).not.toContain('<button')
    expect(actionButtonsSource).toContain("import('@/components/PlayDialog')")
    expect(actionButtonsSource).toContain("import('@/components/TrailerDialog')")
    expect(actionButtonsSource).toContain("import('@/components/CreditsDialog')")
    expect(actionButtonsSource).toContain('aria-busy={isLoading}')
  })

  it('defers Smashers auth providers behind the auth loading boundary', () => {
    const layoutSource = readFileSync(join(process.cwd(), smashersAuthLayout), 'utf8')
    const boundarySource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProvidersBoundary.tsx'),
      'utf8'
    )
    const providersSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProviders.tsx'),
      'utf8'
    )

    expect(layoutSource).toContain("from '@/contexts/AuthProvidersBoundary'")
    expect(layoutSource).not.toContain("from '@/contexts/AuthProvider'")
    expect(layoutSource).not.toContain("from '@/contexts/FeatureFlagsProvider'")
    expect(boundarySource).toContain("dynamic(() => import('./AuthProviders')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain("from '@nl/ui/base/skeleton'")
    expect(boundarySource).toContain('role="status"')
    expect(boundarySource).toContain('aria-live="polite"')
    expect(boundarySource).toContain('aria-busy="true"')
    expect(providersSource).toContain("from './AuthProvider'")
    expect(providersSource).toContain("from './FeatureFlagsProvider'")
  })

  it('keeps feature flags scoped to authenticated routes', () => {
    const rootLayoutSource = readFileSync(join(process.cwd(), smashersRootLayout), 'utf8')
    const authProvidersSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProviders.tsx'),
      'utf8'
    )

    expect(rootLayoutSource).not.toContain('FeatureFlagProvider')
    expect(authProvidersSource).toContain('FeatureFlagProvider')
    expect(existsSync(join(process.cwd(), staleSmashersUnityDialog))).toBe(false)
  })

  it('keeps the shared back control out of the full icon registry graph', () => {
    const source = readFileSync(join(process.cwd(), smashersBackButton), 'utf8')

    expect(source).toContain("from 'lucide-react'")
    expect(source).not.toContain("from '@nl/ui/base/icon'")
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

describe('shared auth icon loading contract', () => {
  it('keeps small auth controls out of the full icon registry graph', () => {
    for (const file of sharedAuthIconSources) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain("from 'lucide-react'")
      expect(source).not.toContain("from '@nl/ui/base/icon'")
    }
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

  it('keeps the public app bar padded and vertically centered', () => {
    const navigationSource = readFileSync(join(process.cwd(), publicNavigation), 'utf8')
    const appBarSource = readFileSync(join(process.cwd(), sharedAppBar), 'utf8')

    expect(navigationSource).toContain("from '@nl/ui/custom/app-bar'")
    expect(navigationSource).toContain('<AppBar>')
    expect(appBarSource).toContain('min-h-14')
    expect(appBarSource).toContain('px-4 py-2')
    expect(appBarSource).toContain('lg:h-[60px]')
    expect(appBarSource).toContain('lg:px-6 lg:py-0')
  })

  it('keeps mobile navigation server-rendered and avoids heavy shell primitives', () => {
    const navigationSource = readFileSync(join(process.cwd(), publicNavigation), 'utf8')
    const navigationStyles = readFileSync(
      join(process.cwd(), 'apps/app/src/app/_layout/_MainLayout/MainLayout.module.css'),
      'utf8'
    )
    const contentContainerSource = readFileSync(join(process.cwd(), publicContentContainer), 'utf8')
    const linksSource = readFileSync(join(process.cwd(), publicNavLinks), 'utf8')
    const sharedMobileSource = readFileSync(join(process.cwd(), sharedMobileNavigation), 'utf8')
    expect(navigationSource).not.toContain("'use client'")
    expect(navigationSource).toContain("from '@nl/ui/custom/mobile-navigation'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/scroll-area'")
    expect(navigationSource).not.toContain("from '@nl/ui/base/icon'")
    expect(navigationSource).not.toContain("from '@/components/extended/Breadcrumbs'")
    expect(navigationSource).toContain('<details id="public-desktop-navigation-toggle"')
    expect(navigationSource).toContain('aria-controls="public-desktop-navigation"')
    expect(navigationSource).not.toContain('PublicDesktopNavigationToggle')
    expect(navigationSource).toContain('{children}')
    expect(navigationSource).not.toContain('PublicMainContent')
    expect(
      existsSync(join(process.cwd(), 'apps/app/src/components/providers/PublicMainContent.tsx'))
    ).toBe(false)
    expect(navigationStyles).toContain(':has(:global(#public-desktop-navigation-toggle[open]))')
    expect(navigationStyles).toContain(
      ':not(:has(:global(#public-desktop-navigation-toggle[open])))'
    )
    expect(navigationStyles).not.toContain('data-sidebar-open')
    expect(contentContainerSource).not.toContain("'use client'")
    expect(contentContainerSource).toContain('container py-5 md:py-10')
    expect(linksSource).not.toContain("'use client'")
    expect(linksSource).not.toContain("from '@nl/ui/base/icon'")
    expect(linksSource).toContain("from '@nl/ui/custom/nav-icon'")
    expect(linksSource).not.toContain("from 'lucide-react'")
    expect(linksSource).toContain("from 'next/link'")
    expect(linksSource).not.toContain("from './PublicActiveNavLink'")
    expect(
      existsSync(join(process.cwd(), 'apps/app/src/components/providers/PublicActiveNavLink.tsx'))
    ).toBe(false)
    expect(
      existsSync(
        join(process.cwd(), 'apps/app/src/components/providers/PublicMobileNavigation.tsx')
      )
    ).toBe(false)
    expect(
      existsSync(
        join(process.cwd(), 'apps/app/src/components/providers/PublicMobileNavigationTrigger.tsx')
      )
    ).toBe(false)
    expect(sharedMobileSource).not.toContain("'use client'")
    expect(sharedMobileSource).toContain('<details')
    expect(sharedMobileSource).toContain('<summary')
    expect(sharedMobileSource).toContain('aria-controls={id}')
    expect(sharedMobileSource).toContain('group-open:rotate-45')
  })
})

describe('deferred sidebar content contract', () => {
  it('does not mount hidden drawer content before the drawer opens', () => {
    const source = readFileSync(join(process.cwd(), collapsibleSidebarLayout), 'utf8')

    expect(source).toContain('{isDrawerOpen ? renderDrawer() : null}')
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

  it('defers wallet providers and verification interactions until after the initial shell', () => {
    const pageSource = readFileSync(join(process.cwd(), verificationPage), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), verificationRouteBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), verificationClient), 'utf8')
    const wrapperSource = readFileSync(join(process.cwd(), walletAuthContextWrapper), 'utf8')
    const providersSource = readFileSync(join(process.cwd(), walletAuthProviders), 'utf8')
    const providersBoundarySource = readFileSync(
      join(process.cwd(), walletAuthProvidersBoundary),
      'utf8'
    )

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './VerificationRouteBoundary'")
    expect(routeBoundarySource).toContain("import('./VerificationClient')")
    expect(routeBoundarySource).toContain('ssr: false')
    expect(routeBoundarySource).toContain("from '@nl/ui/custom/route-loading'")
    expect(clientSource).toContain('useSearchParams')
    expect(clientSource).toContain('useSignAuthMsg')
    expect(wrapperSource).toContain("from '@/contexts/WalletAuthProvidersBoundary'")
    expect(wrapperSource).not.toContain("from '@/contexts/Web3ModalContext'")
    expect(providersBoundarySource).toContain("import('./WalletAuthProviders')")
    expect(providersBoundarySource).toContain('ssr: false')
    expect(providersBoundarySource).toContain("from '@nl/ui/custom/route-loading'")
    expect(providersSource).toContain("from '@/contexts/Web3ModalContext'")
    expect(providersSource).toContain("from '@/contexts/AuthTokenContext'")
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
      gamerProfileClient,
      dashboardItemsClient,
      dashboardBurnerClient,
      dashboardRentalsClient,
    ]) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).toContain('DashboardDataBoundary')
    }
    expect(readFileSync(join(process.cwd(), dashboardOverviewClient), 'utf8')).toContain(
      'DashboardDataBoundary'
    )
    expect(readFileSync(join(process.cwd(), dashboardDegensClient), 'utf8')).toContain(
      'DashboardDataBoundary'
    )

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
    const runtimeSource = readFileSync(
      join(process.cwd(), 'apps/app/src/contexts/Web3ModalRuntime.tsx'),
      'utf8'
    )
    const fallbackSource = readFileSync(join(process.cwd(), walletProviderFallbacks), 'utf8')
    const authSource = readFileSync(join(process.cwd(), authTokenContext), 'utf8')
    const authRuntimeSource = readFileSync(
      join(process.cwd(), 'apps/app/src/contexts/AuthTokenProviderRuntime.tsx'),
      'utf8'
    )
    const modalSource = readFileSync(join(process.cwd(), walletModal), 'utf8')

    expect(providerSource).toContain("import('./Web3ModalRuntime')")
    expect(providerSource).not.toContain("from 'wagmi'")
    expect(providerSource).not.toContain("from '@tanstack/react-query'")
    expect(runtimeSource).toContain("import('./Web3ModalConfig')")
    expect(runtimeSource).toContain('WagmiProvider')
    expect(providerSource).not.toContain('createAppKit')
    expect(providerSource).not.toContain('@reown/appkit/react')
    expect(providerSource).not.toContain('@/constants/contracts')
    expect(fallbackSource).toContain('<Skeleton')
    expect(fallbackSource).toContain('role="status"')
    expect(fallbackSource).toContain('role="alert"')
    expect(providerSource).toContain('Retry')
    expect(authSource).not.toContain('useAppKit')
    expect(authSource).not.toContain('useAppKitEvents')
    expect(authSource).not.toContain("from 'wagmi'")
    expect(authSource).toContain("import('./AuthTokenProviderRuntime')")
    expect(authRuntimeSource).toContain("from 'wagmi'")
    expect(authRuntimeSource).toContain('openWalletModal')
    expect(modalSource).toContain("import('@reown/appkit/react')")
    expect(modalSource).toContain("import('@/constants/contracts')")
  })

  it('loads dashboard data after the shell has painted with accessible recovery states', () => {
    const source = readFileSync(join(process.cwd(), dashboardDataBoundary), 'utf8')
    const sharedSource = readFileSync(join(process.cwd(), deferredComponent), 'utf8')

    expect(source).toContain("import('@/contexts/DashboardDataProviders')")
    expect(source).toContain("from '@nl/ui/custom/deferred-component'")
    expect(sharedSource).toContain('role="status"')
    expect(sharedSource).toContain('role="alert"')
    expect(sharedSource).toContain('Retry')
  })

  it('preserves the private shell layout while keeping the sidebar lightweight', () => {
    const layoutSource = readFileSync(join(process.cwd(), privateShellLayout), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), privateShellBoundary), 'utf8')
    const shellSource = readFileSync(join(process.cwd(), privateShell), 'utf8')
    const sidebarSource = readFileSync(
      join(process.cwd(), 'apps/app/src/app/_layout/_MainLayout/_Sidebar/index.tsx'),
      'utf8'
    )
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
    expect(sidebarSource).toContain("dynamic(() => import('./_UserProfile')")
    expect(sidebarSource).toContain("dynamic(() => import('./_LogoutButton')")
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
  it('defers the overview client graph behind the shared route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardOverview), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), dashboardOverviewBoundary), 'utf8')
    const source = readFileSync(join(process.cwd(), dashboardOverviewClient), 'utf8')
    const nftlSource = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(private-routes)/dashboard/overview/_MyNFTL/index.tsx'),
      'utf8'
    )

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DashboardOverviewRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./DashboardOverviewClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading dashboard overview" />')
    expect(source).toContain("from '@nl/ui/custom/deferred-section'")
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
    expect(source).toContain('<DeferredSection label="My Tokens" load={loadMyNFTL} />')
    expect(source).toContain('<DeferredSection label="My DEGENs" load={loadMyDegens} />')
    expect(source).toContain('<DeferredSection label="My Comics" load={loadMyComics} />')
    expect(source).toContain('<DeferredSection label="My Items" load={loadMyItems} />')
    expect(source).toContain('<DeferredSection label="My Stats" load={loadMyStats} />')
    expect(nftlSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(nftlSource).toContain("const loadArcadeBalance = () => import('./ArcadeBalance')")
    expect(nftlSource).toContain("import('./ArcadeBalance')")
    expect(nftlSource).toContain(
      '<DeferredSection label="Arcade balance" load={loadArcadeBalance} />'
    )
  })

  it('uses themed shadcn skeletons while dashboard sections load', () => {
    const sharedSource = readFileSync(
      join(process.cwd(), 'packages/ui/src/components/custom/deferred-section/index.tsx'),
      'utf8'
    )

    expect(sharedSource).toContain("from '@nl/ui/custom/deferred-skeleton'")
    expect(sharedSource).toContain('role="status"')
    expect(sharedSource).toContain('aria-live="polite"')
    expect(sharedSource).toContain('aria-busy="true"')
    expect(sharedSource).toContain('<DeferredSkeleton')
    expect(sharedSource).toContain('role="alert"')
    expect(sharedSource).toContain('Retry')
  })
})

describe('dashboard DEGEN loading contract', () => {
  it('keeps the card and filter graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardDegens), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), dashboardDegensBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), dashboardDegensClient), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardDegensContent), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DashboardDegensRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./DashboardDegensClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading dashboard DEGENs" />')
    expect(clientSource).toContain("dynamic(() => import('./DashboardDegensContent')")
    expect(clientSource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from '@/components/cards/DegenCard/DashboardDegenCard'")
    expect(clientSource).not.toContain("from '@/components/extended/DegensFilter'")
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
    const boundarySource = readFileSync(join(process.cwd(), dashboardItemsBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), dashboardItemsClient), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardItemsContent), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DashboardItemsRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./DashboardItemsClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading dashboard comics and items" />')
    expect(clientSource).toContain("dynamic(() => import('./DashboardItemsContent')")
    expect(clientSource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-live="polite"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from '@/components/cards/ComicCard'")
    expect(clientSource).not.toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain("from '@/components/cards/ComicCard'")
    expect(contentSource).toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain('DashboardComicsPageContent')
  })
})

describe('dashboard burner loading contract', () => {
  it('keeps the burner machine and wallet graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardBurner), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), dashboardBurnerBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), dashboardBurnerClient), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardBurnerContent), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './ComicsBurnerRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./ComicsBurnerClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading comics burner" />')
    expect(clientSource).toContain("dynamic(() => import('./ComicsBurnerContent')")
    expect(clientSource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-live="polite"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from 'ethers'")
    expect(clientSource).not.toContain("from './_components/machine'")
    expect(clientSource).not.toContain("from '@/hooks/useNetworkContext'")
    expect(contentSource).toContain("from 'ethers'")
    expect(contentSource).toContain("from './_components/machine'")
    expect(contentSource).toContain("from '@/hooks/useNetworkContext'")
    expect(contentSource).toContain('setRefreshKey((key) => key + 1)')
  })
})

describe('private app bar contract', () => {
  it('keeps the shared app bar padded and vertically centered', () => {
    const source = readFileSync(join(process.cwd(), appShell), 'utf8')
    const appBarSource = readFileSync(join(process.cwd(), sharedAppBar), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/app-bar'")
    expect(source).toContain('<AppBar>{header}</AppBar>')
    expect(appBarSource).toContain('min-h-14')
    expect(appBarSource).toContain('px-4 py-2')
    expect(appBarSource).toContain('lg:h-[60px]')
    expect(appBarSource).toContain('lg:px-6 lg:py-0')
  })
})

describe('gamer profile loading contract', () => {
  it('keeps profile, wallet, and inventory graphs behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), gamerProfile), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), gamerProfileBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), gamerProfileClient), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), gamerProfileContent), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './GamerProfileRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./GamerProfileClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading gamer profile" />')
    expect(clientSource).toContain("dynamic(() => import('./GamerProfileContent')")
    expect(clientSource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-live="polite"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from 'wagmi'")
    expect(clientSource).not.toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).toContain("from 'wagmi'")
    expect(contentSource).toContain("from '@/hooks/balances/useNFTsBalances'")
    expect(contentSource).not.toContain('defaultValue')
    expect(contentSource).toContain('GamerProfileProvider')
  })
})

describe('dashboard rentals loading contract', () => {
  it('keeps the rental grid and auth query graph behind the route loading boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), dashboardRentals), 'utf8')
    const boundarySource = readFileSync(join(process.cwd(), dashboardRentalsBoundary), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), dashboardRentalsClient), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), dashboardRentalsContent), 'utf8')

    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DashboardRentalsRouteBoundary'")
    expect(boundarySource).toContain("dynamic(() => import('./DashboardRentalsClient')")
    expect(boundarySource).toContain('ssr: false')
    expect(boundarySource).toContain('<RouteLoading label="Loading rentals" />')
    expect(clientSource).toContain("dynamic(() => import('./DashboardRentalsContent')")
    expect(clientSource).toContain("from '@nl/ui/base/skeleton'")
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-live="polite"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from './MyRentalsDataGrid'")
    expect(clientSource).not.toContain("from '@tanstack/react-query'")
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
      expect(source).toContain("from '@nl/ui/gtm/deferred'")
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

  it('shares the Smashers video asset across marketing apps', () => {
    const smashersSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/app/page.tsx'),
      'utf8'
    )
    const webSource = readFileSync(join(process.cwd(), 'apps/web/src/app/(main)/page.tsx'), 'utf8')

    expect(smashersSource).toContain('src="/video/smashers.mp4"')
    expect(webSource).toContain('src="/video/smashers.mp4"')
    expect(smashersSource).not.toContain('smashers-960p.mp4')
  })

  it('shares one viewport observer between the deferred wrapper and loaded player', () => {
    const consoleGameSource = readFileSync(join(process.cwd(), sharedConsoleGame), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), sharedDeferredConsoleGame), 'utf8')

    expect(consoleGameSource).not.toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(consoleGameSource).toContain('isNearViewport?: boolean')
    expect(deferredSource).toContain('isNearViewport={isNearViewport}')
  })
})

describe('shared below-fold loading contract', () => {
  it('provides an accessible themed loading state with retry behavior', () => {
    const source = readFileSync(join(process.cwd(), sharedDeferredSection), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-skeleton'")
    expect(source).toContain("from '@nl/ui/base/button-variants'")
    expect(source).toContain("buttonVariants({ variant: 'outline' })")
    expect(source).toContain('<button')
    expect(source).not.toContain("from '@nl/ui/base/button'")
    expect(source).not.toContain('<Button')
    expect(source).toContain('type="button"')
    expect(source).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(source).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(source).toContain('role="status"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('Retry')
  })

  it('defers below-fold marketing interaction without clipping visual effects', () => {
    const pageSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), webDeferredHomeSections), 'utf8')
    const carouselSource = readFileSync(join(process.cwd(), webCommunityDegenCarousel), 'utf8')
    const homeStyles = readFileSync(join(process.cwd(), 'apps/web/src/styles/home.css'), 'utf8')

    expect(pageSource).toContain('DeferredMintOMatic')
    expect(pageSource).toContain('DeferredSponsors')
    expect(pageSource).toContain('DeferredCommunityDegenCarousel')
    expect(pageSource).not.toContain("import('@/components/MintOMatic')")
    expect(pageSource).not.toContain("import('@/components/Sponsors')")
    expect(pageSource).not.toContain("from '@/components/Carousel'")
    expect(pageSource).not.toContain("from '@/components/Carousel/DegenCardItem'")
    expect(deferredSource).toContain("import('@/components/MintOMatic')")
    expect(deferredSource).toContain("import('@/components/Sponsors')")
    expect(deferredSource).not.toContain("from '@/constants/sponsors'")
    expect(deferredSource).toContain("import('@/components/CommunityDegenCarousel')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(carouselSource).toContain("from '@/components/Carousel'")
    expect(carouselSource).toContain("from '@/constants/degens'")
    expect(pageSource).not.toContain('home-below-fold')
    expect(homeStyles).not.toContain('.home-below-fold')
    expect(homeStyles).not.toContain('content-visibility: auto')
  })

  it('defers the below-fold Overview FAQ interaction bundle', () => {
    const pageSource = readFileSync(join(process.cwd(), webOverviewPage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), webDeferredOverviewSections), 'utf8')
    const faqSource = readFileSync(join(process.cwd(), webOverviewFAQ), 'utf8')

    expect(pageSource).toContain('DeferredOverviewFAQ')
    expect(pageSource).not.toContain("from '@nl/ui/custom/accordion'")
    expect(deferredSource).toContain("import('@/components/OverviewFAQ')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(faqSource).toContain("from '@nl/ui/base/accordion'")
    expect(faqSource).not.toContain("from '@nl/ui/custom/accordion'")
    expect(faqSource).toContain('<AccordionItem')
    expect(faqSource).toContain('<AccordionTrigger')
    expect(faqSource).toContain('<AccordionContent')
    expect(faqSource).toContain('defaultValue="item-1"')
  })

  it('defers the below-fold Careers job accordion bundle', () => {
    const pageSource = readFileSync(join(process.cwd(), webCareersPage), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), webDeferredCareersSections), 'utf8')
    const jobsSource = readFileSync(join(process.cwd(), webCareersJobs), 'utf8')

    expect(pageSource).toContain('DeferredCareersJobs')
    expect(pageSource).not.toContain("from '@/components/Careers/JobCard'")
    expect(pageSource).not.toContain("from '@/constants/careers'")
    expect(deferredSource).toContain("import('@/components/CareersJobs')")
    expect(deferredSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(jobsSource).toContain("from '@/components/Careers/JobCard'")
    expect(jobsSource).toContain("from '@/constants/careers'")
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
    const sharedNavbarScrollFrameSource = readFileSync(
      join(process.cwd(), sharedWebNavbarScrollFrame),
      'utf8'
    )
    const mobileNavbarSource = readFileSync(join(process.cwd(), sharedWebMobileNavbar), 'utf8')
    const sharedNavLinkContentSource = readFileSync(
      join(process.cwd(), sharedWebNavLinkContent),
      'utf8'
    )

    expect(navbarSource).not.toContain("'use client'")
    expect(navbarSource).toContain("from '@nl/ui/custom/navbar'")
    expect(sharedNavbarSource).not.toContain("'use client'")
    expect(sharedNavbarScrollFrameSource).toContain("'use client'")
    expect(sharedNavbarScrollFrameSource).toContain('requestAnimationFrame')
    expect(sharedNavbarSource).not.toContain("import ActiveNavLink from './ActiveNavLink'")
    expect(sharedNavbarSource).toContain('function DesktopNavLink')
    expect(sharedNavbarScrollFrameSource).toContain('navbar-scroll-frame')
    expect(sharedNavbarScrollFrameSource).toContain('bg-transparent')
    expect(sharedNavbarScrollFrameSource).toContain('backdrop-blur-xs')
    expect(sharedNavbarSource).not.toContain('transition-all')
    expect(sharedNavbarSource).not.toContain('useScrollDetection')
    expect(sharedNavbarSource).toContain('<details')
    expect(sharedNavbarSource).not.toContain("from '@nl/ui/base/navigation-menu'")
    expect(sharedNavbarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(sharedNavbarSource).not.toContain("from './ActiveNavLink'")
    expect(sharedNavbarSource).toContain("from './NavLinkContent'")
    expect(sharedNavLinkContentSource).toContain('export function NavLinkContent')
    expect(sharedNavLinkContentSource).toContain('NAV_LINK_CONTENT_CLASS')
    expect(existsSync(join(process.cwd(), sharedWebMobileTrigger))).toBe(false)
    expect(mobileNavbarSource).not.toContain("'use client'")
    expect(mobileNavbarSource).not.toContain("from '@nl/ui/base/navigation-menu'")
    expect(mobileNavbarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(mobileNavbarSource).not.toContain("from './ActiveNavLink'")
    expect(mobileNavbarSource).toContain("from '@nl/ui/custom/mobile-navigation'")
    expect(mobileNavbarSource).toContain('<nav aria-label="Primary navigation">')
    expect(mobileNavbarSource).toContain("from '@nl/ui/base/button-variants'")
    expect(mobileNavbarSource).toContain('<hr aria-hidden="true"')
    expect(mobileNavbarSource).toContain('bg-separator')
    expect(mobileNavbarSource).toContain('id="nifty-mobile-navigation"')
    const sharedMobileSource = readFileSync(join(process.cwd(), sharedMobileNavigation), 'utf8')
    expect(sharedMobileSource).not.toContain("'use client'")
    expect(sharedMobileSource).toContain('<details')
    expect(sharedMobileSource).toContain('<summary')
    expect(sharedMobileSource).toContain('aria-label={label}')
    const sharedUtilityStyles = readFileSync(
      join(process.cwd(), 'packages/ui/src/styles/04_tailwind.utilities.css'),
      'utf8'
    )
    expect(sharedUtilityStyles).toContain('prefers-reduced-motion: no-preference')
    expect(sharedUtilityStyles).toContain('animation-timeline: scroll(root block)')
  })
})

describe('web marketing page boundary contract', () => {
  it('keeps static marketing pages server-rendered while deferring interaction', () => {
    const communitySource = readFileSync(join(process.cwd(), webCommunityPage), 'utf8')
    const teamSource = readFileSync(join(process.cwd(), webTeamPage), 'utf8')
    const carouselSource = readFileSync(join(process.cwd(), webCarousel), 'utf8')
    const deferredTeamSource = readFileSync(join(process.cwd(), webDeferredTeamSections), 'utf8')
    const teamCarouselSource = readFileSync(join(process.cwd(), webTeamCarousel), 'utf8')

    expect(communitySource).not.toContain("'use client'")
    expect(communitySource).not.toContain('useMediaQuery')
    expect(communitySource).toContain('sliding-background-wrapper')
    expect(teamSource).not.toContain("'use client'")
    expect(teamSource).toContain('DeferredTeamCarousel')
    expect(teamSource).not.toContain("from '@/components/Carousel'")
    expect(carouselSource).toContain("'use client'")
    expect(deferredTeamSource).toContain("import('@/components/TeamCarousel')")
    expect(deferredTeamSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(teamCarouselSource).toContain("from '@/components/Carousel'")
    expect(teamCarouselSource).toContain("from '@/constants/team'")
  })
})

describe('web marketing image sizing contract', () => {
  it('preloads only the responsive hero background on the homepage critical path', () => {
    const homeSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')

    expect(homeSource).toContain("import { preload } from 'react-dom'")
    expect(homeSource).toContain("media: '(min-width: 769px)'")
    expect(homeSource).toContain("media: '(max-width: 768px)'")
    expect(homeSource).toContain("fetchPriority: 'high'")
    expect(homeSource).not.toContain('speech-bubble.webp\n            alt="Learn More"')
    expect(homeSource).not.toContain('loading="eager"\n            fetchPriority="high"')
  })

  it('keeps decorative homepage coins out of the client scroll graph', () => {
    const homeSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')
    const bouncingNftlSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/BouncingNFTL/index.tsx'),
      'utf8'
    )

    expect(homeSource).not.toContain("from '@nl/ui/custom/parallax-wrapper'")
    expect(bouncingNftlSource).not.toContain("from '@nl/ui/custom/parallax-wrapper'")
    expect(homeSource).toContain("visibleTokens={['token1', 'token2']}")
    expect(homeSource).toContain("visibleTokens={['token1', 'token3']}")
    expect(bouncingNftlSource).not.toContain('classes?.')
    expect(bouncingNftlSource).toContain('animate-bounce-coin1')
    expect(bouncingNftlSource).toContain('animate-bounce-coin2')
    expect(bouncingNftlSource).toContain('animate-bounce-coin3')
  })

  it('uses rendered-width image hints for the home page artwork', () => {
    const homeSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')
    const bouncingNftlSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/BouncingNFTL/index.tsx'),
      'utf8'
    )

    expect(homeSource).toContain('src="/img/hero/companion-base.webp"')
    expect(homeSource).toContain('sizes="12vw"')
    expect(homeSource).toContain('src="/img/hero/halo.webp"')
    expect(homeSource).toContain('sizes="9vw"')
    expect(homeSource).toContain('sizes="(min-width: 768px) 50vw, 100vw"')
    expect(homeSource).toContain('sizes="246px"')
    expect(bouncingNftlSource).toContain("sizes: '226px'")
    expect(bouncingNftlSource).toContain("sizes: '246px'")
  })

  it('uses rendered-width hints for secondary marketing artwork', () => {
    const expectedHints: Array<[string, string]> = [
      [
        'apps/web/src/components/TeamDesktop/index.tsx',
        'sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"',
      ],
      ['apps/web/src/components/Sponsors.tsx', 'sizes="(min-width: 768px) 160px, 80px"'],
      ['apps/web/src/components/LearnCards/index.tsx', 'sizes="(min-width: 640px) 50vw, 100vw"'],
      [
        'apps/web/src/app/(main)/compete-and-earn/page.tsx',
        'sizes="(min-width: 768px) 50vw, 100vw"',
      ],
      ['apps/web/src/app/(main)/careers/page.tsx', 'sizes="(min-width: 768px) 50vw, 100vw"'],
      ['apps/web/src/app/(main)/games/page.tsx', 'sizes="33vw"'],
      [
        'apps/web/src/app/(main)/niftyworld/page.tsx',
        'sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"',
      ],
      ['apps/web/src/app/(main)/roadmap/page.tsx', 'sizes="(min-width: 920px) 800px, 600px"'],
      ['apps/web/src/components/RoadmapTimeline/roadmapCard.tsx', 'sizes="200px"'],
    ]

    for (const [file, hint] of expectedHints) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).toContain(hint)
    }
  })

  it('preloads only the first Overview learn card', () => {
    const learnCardsSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/LearnCards/index.tsx'),
      'utf8'
    )

    expect(learnCardsSource).toContain('priority={priority}')
    expect(learnCardsSource).toContain('priority={index === 0}')
    expect(learnCardsSource).not.toContain('            priority\n')
  })

  it('does not eagerly preload below-fold decorative artwork', () => {
    const overviewSource = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/overview/page.tsx'),
      'utf8'
    )
    const roadmapSource = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/roadmap/page.tsx'),
      'utf8'
    )

    expect(overviewSource).not.toContain('priority')
    expect(overviewSource).toContain("import Image, { getImageProps } from 'next/image'")
    expect(overviewSource).toContain('<picture>')
    expect(overviewSource).toContain('media="(max-width: 767px)"')
    expect(roadmapSource).toContain('src="/img/space/satoshi_move.gif"')
    expect(roadmapSource).toContain('src="/img/space/moon.webp"')
    expect(roadmapSource).not.toContain(
      'src="/img/space/moon.webp"\n                alt="moon"\n                width={800}\n                height={800}\n                priority'
    )
  })

  it('keeps the Community hero preload focused on its primary artwork', () => {
    const communitySource = readFileSync(join(process.cwd(), webCommunityPage), 'utf8')

    expect(communitySource).toContain('src="/img/space/moon-satoshi.webp"')
    expect(communitySource).toContain(
      'src="/img/space/moon-satoshi.webp"\n                alt="Satoshi moon"\n                width={445}\n                height={437}\n                priority'
    )
    expect(communitySource).not.toContain(
      'src="/img/space/earth-darkened.webp"\n              width={1684}\n              height={525}\n              alt="Earth"\n              priority'
    )
    expect(communitySource).not.toContain(
      'src="/img/gradient/purple-light-grad.svg"\n                priority'
    )
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
        expect(source).toContain('sentryOptions')
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

describe('production-only Sentry server contract', () => {
  const sentryApps = ['app', 'smashers', 'web']

  for (const app of sentryApps) {
    it(`keeps the ${app} build wrapper lazy outside production`, () => {
      const source = readFileSync(join(process.cwd(), `apps/${app}/next.config.ts`), 'utf8')

      expect(source).not.toContain("import { withSentryConfig } from '@sentry/nextjs'")
      expect(source).toContain("import('@sentry/nextjs')")
      expect(source).toContain("process.env.VERCEL_ENV === 'production'")
    })

    it(`keeps ${app} request-error capture lazy and production-gated`, () => {
      const source = readFileSync(join(process.cwd(), `apps/${app}/src/instrumentation.ts`), 'utf8')

      expect(source).not.toContain("import * as Sentry from '@sentry/nextjs'")
      expect(source).toContain("import('@sentry/nextjs')")
      expect(source).toContain("process.env.VERCEL_ENV !== 'production'")
      expect(source).toContain('captureRequestError(...args)')
    })
  }
})

describe('public route dependency contract', () => {
  it('keeps public purchase URLs independent from the contract registry', () => {
    const source = readFileSync(join(process.cwd(), 'apps/app/src/constants/url.ts'), 'utf8')
    const publicUrls = readFileSync(
      join(process.cwd(), 'apps/app/src/constants/public-urls.ts'),
      'utf8'
    )

    expect(source).not.toContain("from './contracts'")
    expect(source).toContain(
      "export { DEGEN_PURCHASE_URL, NFTL_PURCHASE_URL } from './public-urls'"
    )
    expect(publicUrls).toContain('0xB0d7e9Ff5fb8E739c4990f7920d8047AcfAe4884')
    expect(publicUrls).toContain('NFTL_PURCHASE_URL')
  })

  it('keeps game description disclosure server-rendered and keyboard accessible', () => {
    const source = readFileSync(join(process.cwd(), gameCard), 'utf8')

    expect(source).not.toContain("'use client'")
    expect(source).not.toContain('useState')
    expect(source).toContain('<details')
    expect(source).toContain('<summary')
    expect(source).toContain('group-open:max-h-none')
    expect(
      existsSync(join(process.cwd(), 'apps/app/src/components/cards/ExpandableGameDescription.tsx'))
    ).toBe(false)
  })

  it('keeps static Web3 game cards server-rendered and shadcn-styled', () => {
    const source = readFileSync(join(process.cwd(), web3GameList), 'utf8')

    expect(source).not.toContain("'use client'")
    expect(source).toContain("from '@nl/ui/base/button-variants'")
    expect(source).not.toContain("from '@nl/ui/base/button'")
    expect(source).not.toContain('asChild')
    expect(source).not.toContain('WalletFeatureProviders')
    expect(source).not.toContain('ConnectWrapper')
    expect(source).not.toContain('useTokensBalances')
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

  it('defers public carousel behavior without shipping a third-party slider runtime', () => {
    const shell = readFileSync(join(process.cwd(), publicCarousel), 'utf8')
    const interactive = readFileSync(join(process.cwd(), interactivePublicCarousel), 'utf8')
    const sharedCarousel = readFileSync(
      join(process.cwd(), 'packages/ui/src/components/custom/responsive-carousel/index.tsx'),
      'utf8'
    )
    const sharedCarouselStyles = readFileSync(
      join(
        process.cwd(),
        'packages/ui/src/components/custom/responsive-carousel/responsive-carousel.module.css'
      ),
      'utf8'
    )
    const manifest = JSON.parse(readFileSync(join(process.cwd(), 'apps/web/package.json'), 'utf8'))

    expect(shell).toContain("import('./InteractiveCarousel')")
    expect(shell).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(shell).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(shell).not.toContain("from 'react-multi-carousel'")
    expect(shell).not.toContain('react-multi-carousel/lib/styles.css')
    expect(interactive).toContain("from '@nl/ui/custom/responsive-carousel'")
    expect(sharedCarousel).toContain("from '@nl/ui/base/icon-button'")
    expect(sharedCarousel).toContain('aria-roledescription="carousel"')
    expect(sharedCarousel).toContain('prefers-reduced-motion')
    expect(sharedCarouselStyles).toContain('scroll-snap-type: x mandatory')
    expect(sharedCarouselStyles).toContain('touch-action: pan-x')
    expect(manifest.dependencies?.['react-multi-carousel']).toBeUndefined()
  })

  it('keeps public videos server-rendered while deferring playback observers', () => {
    const shell = readFileSync(join(process.cwd(), viewportVideo), 'utf8')
    const boundary = readFileSync(join(process.cwd(), viewportVideoBoundary), 'utf8')
    const enhancer = readFileSync(join(process.cwd(), viewportVideoEnhancer), 'utf8')

    expect(shell).not.toContain("'use client'")
    expect(shell).toContain("from './ViewportVideoBoundary'")
    expect(shell).toContain("rootMargin = '0px'")
    expect(boundary).toContain("dynamic(() => import('./ViewportVideoEnhancer')")
    expect(boundary).toContain("rootMargin = '0px'")
    expect(boundary).toContain('preload="none"')
    expect(enhancer).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(enhancer).toContain("from '@nl/ui/hooks/useMediaQuery'")
    expect(enhancer).toContain("video.preload = shouldPlay ? 'metadata' : 'none'")
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
    const list = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'),
      'utf8'
    )

    expect(existsSync(join(process.cwd(), web3GameList))).toBe(true)
    expect(
      existsSync(
        join(process.cwd(), 'apps/app/src/app/(public-routes)/games/DeferredWeb3GameList.tsx')
      )
    ).toBe(false)
    expect(list).toContain("from '@nl/ui/base/button-variants'")
    expect(list).not.toContain('WalletFeatureProviders')
    expect(list).not.toContain('ConnectWrapper')
    expect(list).not.toContain('useTokensBalances')
  })

  it('keeps the public launcher action independent from the network registry', () => {
    const source = readFileSync(join(process.cwd(), 'apps/app/src/hooks/useVersion.ts'), 'utf8')

    expect(source).toContain("process.env.NEXT_PUBLIC_NETWORK === 'mainnet'")
    expect(source).not.toContain("from '@/constants/networks'")
    expect(source).not.toContain('TARGET_NETWORK')
  })

  it('keeps the removed desktop download dialog from returning as dead UI', () => {
    const list = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'),
      'utf8'
    )

    expect(existsSync(join(process.cwd(), staleDownloadGameDialog))).toBe(false)
    expect(list).not.toContain('DownloadGameDialog')
  })

  it('preserves the responsive grid style for both public game lists', () => {
    const gridStyles = readFileSync(join(process.cwd(), publicGamesGridStyles), 'utf8')
    const freeToPlayList = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_GameList/index.tsx'),
      'utf8'
    )
    const web3List = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'),
      'utf8'
    )

    expect(freeToPlayList).toContain("from '../grid-item.module.css'")
    expect(web3List).toContain("from '../grid-item.module.css'")
    expect(gridStyles).toContain('@media (max-width: 639.95px)')
    expect(
      existsSync(
        join(process.cwd(), 'apps/app/src/app/(public-routes)/games/_GameList/grid-item.module.css')
      )
    ).toBe(false)
    expect(
      existsSync(
        join(
          process.cwd(),
          'apps/app/src/app/(public-routes)/games/_Web3GameList/grid-item.module.css'
        )
      )
    ).toBe(false)
  })

  it('uses the shared shadcn button recipe for themed marketing CTAs', () => {
    const source = readFileSync(join(process.cwd(), sharedThemeButton), 'utf8')

    expect(source).toContain("import { buttonVariants } from '@nl/ui/base/button-variants'")
    expect(source).toContain("buttonVariants({ variant: 'ghost'")
    expect(source).toContain("buttonVariants({ className: cn(buttonClassName, 'disabled') })")
    expect(source).toContain('<button')
    expect(source).not.toContain("from '@nl/ui/base/button'")
    expect(source).not.toContain('aria-disabled={disabled}')
    expect(source).not.toContain("href={href || ''}")
    expect(source).toContain('if (!href) return null')
    expect(source).not.toContain("href={href ?? '#'}")
  })

  it('keeps Web-only animation rules out of the shared UI stylesheet', () => {
    const sharedAnimations = readFileSync(
      join(process.cwd(), 'packages/ui/src/styles/05_tailwind.animate.css'),
      'utf8'
    )
    const webMarketingStyles = readFileSync(
      join(process.cwd(), 'apps/web/src/styles/marketing.css'),
      'utf8'
    )
    const homePage = readFileSync(join(process.cwd(), 'apps/web/src/app/(main)/page.tsx'), 'utf8')
    const communityPage = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/community/page.tsx'),
      'utf8'
    )
    const webStyles = readFileSync(join(process.cwd(), 'apps/web/src/styles/home.css'), 'utf8')

    expect(sharedAnimations).not.toContain('animate-propeller')
    expect(sharedAnimations).not.toContain('animate-bounce-coin')
    expect(sharedAnimations).not.toContain('.sliding-nfts')
    expect(sharedAnimations).not.toContain('slideBg')
    expect(webStyles).toContain('.animate-propeller')
    expect(webStyles).toContain('.animate-bounce-coin1')
    expect(webStyles).toContain('.animate-bounce-coin2')
    expect(webStyles).toContain('.animate-bounce-coin3')
    expect(homePage).toContain("import '@/styles/marketing.css'")
    expect(communityPage).toContain("import '@/styles/marketing.css'")
    expect(webMarketingStyles).toContain('.sliding-nfts')
    expect(webMarketingStyles).toContain('slideBg')
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
