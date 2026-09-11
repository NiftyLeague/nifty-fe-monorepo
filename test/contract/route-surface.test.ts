import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseReferral, referralTargets, routeRequest } from '../../apps/web/worker/routes.mjs'

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
 * web ships as Astro static: marketing routes are compiled from src/pages/*.astro
 * and deep links are served by the Cloudflare Worker (apps/web/worker/routes.mjs).
 */
const appRouteContracts: Record<string, string[]> = {
  smashers: [
    // Externally consumed: niftysmasher.com Unity games + native app deep links.
    // smashers ships as Astro SSR: API routes are src/pages/api/*.ts endpoints
    // and pages are src/pages/*.astro.
    'src/pages/api/edge-geo.ts',
    'src/pages/api/playfab/forgot-password.ts',
    'src/pages/api/playfab/login.ts',
    'src/pages/api/playfab/logout.ts',
    'src/pages/api/playfab/signup.ts',
    'src/pages/api/playfab/user/delete-account.ts',
    'src/pages/api/playfab/user/info.ts',
    'src/pages/api/playfab/user/link-provider.ts',
    'src/pages/api/playfab/user/link-wallet.ts',
    'src/pages/api/playfab/user/playfab-session.ts',
    'src/pages/api/playfab/user/unlink-provider.ts',
    'src/pages/api/playfab/user/unlink-wallet.ts',
    'src/pages/api/playfab/user/update.ts',
    // OAuth: replaces the next-auth catch-all with signin + callback endpoints.
    'src/pages/api/auth/signin/[provider].ts',
    'src/pages/api/auth/callback/[provider].ts',
    // Store and referral deep links. These are real route files rather than
    // middleware because Astro resolves routing before middleware runs, so an
    // unmatched path 404s before any middleware redirect could fire.
    'src/pages/ios/[...path].ts',
    'src/pages/android/[...path].ts',
    'src/pages/steam/[...path].ts',
    'src/pages/epic/[...path].ts',
    'src/pages/invite/[refcode].ts',
    'src/pages/robots.txt.ts',
    'src/pages/sitemap.xml.ts',
    'src/pages/login.astro',
    'src/pages/profile.astro',
    'src/pages/loot.astro',
    'src/pages/index.astro',
  ],
  web: [
    // Marketing site: campaign landing routes compiled from Astro pages that
    // wrap the retained React slot composers (LegacyPage).
    'src/pages/index.astro',
    'src/pages/roadmap.astro',
    'src/pages/team.astro',
    'src/pages/community.astro',
    'src/pages/lore.astro',
    'src/pages/niftyworld.astro',
    'src/pages/games.astro',
    'src/pages/degens.astro',
    'src/pages/careers.astro',
    'src/pages/terms-of-service.astro',
    'src/pages/privacy-policy.astro',
    'src/pages/disclaimer.astro',
    'src/pages/compete-and-earn.astro',
    'src/pages/overview.astro',
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
  'apps/app/src/contexts/WalletStorageProviders.tsx',
  'apps/app/src/components/providers/MintProviders.tsx',
]

const usesSharedLoadingSkeleton = (source: string) =>
  source.includes("from '@nl/ui/base/skeleton'") ||
  source.includes("from '@nl/ui/custom/deferred-skeleton'")

const rendersSharedLoadingSkeleton = (source: string) =>
  source.includes('<Skeleton') || source.includes('<DeferredSkeleton')

const leaderboardProviders = 'apps/app/src/contexts/LeaderboardProviders.tsx'
const leaderboardWalletBoundary = 'apps/app/src/components/leaderboards/LeaderboardRankBoundary.tsx'
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
const nftDataProviders = 'apps/app/src/contexts/NFTDataProviders.tsx'
const walletFeatureProviders = 'apps/app/src/contexts/WalletFeatureProviders.tsx'
const dashboardDataBoundary = 'apps/app/src/components/providers/DashboardDataBoundary.tsx'
const deferredDegenDialog = 'apps/app/src/components/providers/DeferredDegenDialog.tsx'
const deferredRenameDegenDialog = 'apps/app/src/components/providers/DeferredRenameDegenDialog.tsx'
const deferredDialogLoading = 'apps/app/src/components/providers/DeferredDialogLoading.tsx'
const degenDialog = 'apps/app/src/components/dialog/DegenDialog/index.tsx'
const deferredProfileNameDialog = 'apps/app/src/components/providers/DeferredProfileNameDialog.tsx'
const deferredProfileImageDialog =
  'apps/app/src/components/providers/DeferredProfileImageDialog.tsx'
const deferredNicknameDialog = 'apps/app/src/components/providers/DeferredChangeNicknameDialog.tsx'
const profileNameDialog =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_Stats/ChangeProfileNameDialog.tsx'
const profileImageDialog =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog.tsx'
const profileImageContent =
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/ProfileImageContent.tsx'
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
const smashersLoginClient = 'apps/smashers/src/components/login/LoginClient.tsx'
const smashersLoginPage = 'apps/smashers/src/pages/login.astro'
const smashersLootPage = 'apps/smashers/src/pages/loot.astro'
const smashersLootTables = 'apps/smashers/src/components/Loot/LootTables.tsx'
const staleSmashersLootBoundary = 'apps/smashers/src/components/Loot/LootTablesBoundary.tsx'
const sharedAuthIconSources = [
  'packages/ui/src/components/custom/auth-form/forms/login.tsx',
  'packages/ui/src/components/custom/auth-form/forms/forgot-password.tsx',
  'packages/ui/src/components/custom/auth-form/forms/update-password.tsx',
  'packages/ui/src/components/custom/social-icon-button/index.tsx',
  'packages/ui/src/components/custom/theme/index.tsx',
]
const smashersProfilePage = 'apps/smashers/src/pages/profile.astro'
const smashersProfileClient = 'apps/smashers/src/components/profile/ProfileClient.tsx'
const smashersActionButtons = 'apps/smashers/src/components/Header/ActionButtonsGroup/index.tsx'
const smashersRootLayout = 'apps/smashers/src/layouts/Base.astro'
const smashersAuthLayout = 'apps/smashers/src/layouts/Auth.astro'
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
const analyticsLayouts = ['apps/app/src/app/layout.tsx']
// web ships as Astro static and smashers as Astro SSR: analytics mount through
// each base layout's telemetry runtime instead of Next.js layout components.
const webAnalyticsBaseLayout = 'apps/web/src/layouts/Base.astro'
const webTelemetryRuntime = 'apps/web/src/runtime/telemetry.ts'
const smashersTelemetryRuntime = 'apps/smashers/src/runtime/telemetry.ts'
const smashersServerSentryRuntime = 'apps/smashers/src/runtime/sentry-server.ts'
const smashersMiddleware = 'apps/smashers/src/middleware.ts'
const deferredConsoleGameRoutes = [
  'apps/web/src/app/(main)/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/app/(main)/niftyworld/page.tsx',
  'apps/smashers/src/pages/index.astro',
]
const sharedDeferredSection = 'packages/ui/src/components/custom/deferred-section/index.tsx'
const sharedRouteLoading = 'packages/ui/src/components/custom/route-loading/index.tsx'
// smashers is excluded: Astro has no app-router `loading.tsx`; its route-level
// loading state is the `slot="fallback"` on each client-only island, asserted by
// the Smashers island fallback contract below.
const routeLoadingFiles = ['apps/app/src/app/loading.tsx', 'apps/web/src/app/(main)/loading.tsx']
const webHomePage = 'apps/web/src/app/(main)/page.tsx'
const webOverviewPage = 'apps/web/src/app/(main)/overview/page.tsx'
const gltfPage = 'apps/web/src/pages/shells/gltf.astro'
const gltfClientRuntime = 'apps/web/src/runtime/GltfClient.tsx'
const gltfClient = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViews.tsx'
const gltfRouteBoundary =
  'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViewsRouteBoundary.tsx'
const gltfModelView = 'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/ModelView.tsx'
const webClaimableNFTL = 'apps/web/src/hooks/useClaimableNFTL.ts'
const webDegenAssets = 'apps/web/src/constants/degen-assets.ts'
const webDegenCatalog = 'apps/web/src/constants/degens.ts'
const webNavbar = 'apps/web/src/components/Navbar/index.tsx'
const sharedWebNavbar = 'packages/ui/src/components/custom/navbar/index.tsx'
const sharedWebNavbarScrollFrame = 'packages/ui/src/components/custom/navbar/NavbarScrollFrame.tsx'
const sharedWebNavbarScrollState = 'packages/ui/src/components/custom/navbar/NavbarScrollState.tsx'
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
const smashersHomePage = 'apps/smashers/src/pages/index.astro'
const webDeferredHomeMedia = 'apps/web/src/components/DeferredHomeMedia.tsx'
const webDeferredHomeSections = 'apps/web/src/components/DeferredHomeSections.tsx'
const webDeferredHomeSectionsBoundary = 'apps/web/src/components/DeferredHomeSectionsBoundary.tsx'
const webHomeSectionConfig = 'apps/web/src/components/home-section-config.ts'
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
const degensTopNav = 'apps/app/src/components/extended/DegensTopNav/index.tsx'
const degensTopNavControls =
  'apps/app/src/components/extended/DegensTopNav/DegensTopNavControls.tsx'
const publicMainLayout = 'apps/app/src/app/_layout/_PublicMainLayout/index.tsx'
const publicNavigation = 'apps/app/src/components/providers/PublicNavigation.tsx'
const deferredPublicUserProfile = 'apps/app/src/components/providers/DeferredPublicUserProfile.tsx'
const publicUserProfile = 'apps/app/src/components/providers/PublicUserProfile.tsx'
const sharedAppBar = 'packages/ui/src/components/custom/app-bar/index.tsx'
const sharedAppBarStyles = 'packages/ui/src/components/custom/app-bar/app-bar.module.css'
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
const walletStorageProviders = 'apps/app/src/contexts/WalletStorageProviders.tsx'
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
          if (app === 'web') {
            // Each Astro marketing page must wrap the retained React slot
            // composer so the migrated page keeps rendering its islands.
            expect(readFileSync(path, 'utf8')).toContain('LegacyPage')
          }
        })
      }
    })
  }
})

describe('web deep-link shell contract', () => {
  // web ships as Astro static + Cloudflare Worker; the invite/party/gltf deep
  // links resolve through routeRequest to static shell pages instead of
  // (special-routes) page.tsx files. See apps/web/checks/routes.node.mjs.
  it('serves the gltf deep link from the static shell', () => {
    expect(routeRequest('https://niftyleague.com/gltf/123')).toEqual({
      kind: 'gltf',
      tokenId: '123',
      asset: '/shells/gltf.html',
    })
    expect(existsSync(join(process.cwd(), 'apps/web/src/pages/shells/gltf.astro'))).toBe(true)
  })

  it('serves invite and party deep links from the referral shell', () => {
    expect(routeRequest('https://niftyleague.com/invite/smashers/CODE')).toEqual({
      kind: 'referral',
      asset: '/shells/referral.html',
    })
    expect(routeRequest('https://niftyleague.com/party/smashers/CODE/PARTY')).toEqual({
      kind: 'referral',
      asset: '/shells/referral.html',
    })
    expect(existsSync(join(process.cwd(), 'apps/web/src/pages/shells/referral.astro'))).toBe(true)
  })
})

describe('web invite redirect contract', () => {
  it('keeps navigation and deep-link side effects out of render', () => {
    // The deleted client-side InviteRedirect component is replaced by pure
    // worker helpers, so the static referral shell stays free of routing logic.
    expect(parseReferral('/invite/smashers/CODE')).toEqual({
      game: 'smashers',
      refcode: 'CODE',
    })
    expect(parseReferral('/party/smashers/CODE/PARTY')).toEqual({
      game: 'smashers',
      refcode: 'CODE',
      partyID: 'PARTY',
    })
    expect(parseReferral('/invite/smashers')).toBeNull()

    const targets = referralTargets(
      { game: 'smashers', refcode: 'REFCODE12', partyID: 'P1' },
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    )
    expect(targets.native).toContain('niftysmashers://smashers/party')
    expect(targets.store).toContain('/ios/?referral=REFCODE12')
    expect(targets.launchNative).toBe(true)
  })
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
    expect(usesSharedLoadingSkeleton(deferredSource)).toBe(true)
    expect(sharedSource).toContain('role="alert"')
    expect(sharedSource).toContain('Retry')
  })

  it('keeps archived leaderboards on the auth-only wallet boundary', () => {
    const providers = readFileSync(join(process.cwd(), leaderboardProviders), 'utf8')
    const boundary = readFileSync(join(process.cwd(), leaderboardWalletBoundary), 'utf8')

    expect(boundary).toContain("from '@/contexts/AuthStatusContext'")
    expect(boundary).toContain("dynamic(() => import('./LeaderboardRankAction')")
    expect(boundary).not.toContain('WalletFeatureProviders')
    expect(providers).toContain("from '@/contexts/WalletAuthProviders'")
    expect(providers).toContain("from '@/contexts/WalletStorageProviders'")
    expect(providers).toContain("import('@/contexts/AuditFixtureContextWrapper')")
    expect(providers).not.toContain("from '@/contexts/AuditFixtureContextWrapper'")

    for (const provider of [
      'IMXProvider',
      'NetworkProvider',
      'NFTsBalanceProvider',
      'TokensBalanceProvider',
    ]) {
      expect(providers).not.toContain(`import { ${provider} }`)
    }
  })
})

describe('public degen loading contract', () => {
  it('keeps the interactive degen browser split while server-rendering its shell', () => {
    const pageSource = readFileSync(join(process.cwd(), degensPage), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), degensRouteBoundary), 'utf8')
    const clientPageSource = readFileSync(join(process.cwd(), degensClientPage), 'utf8')
    const topNavSource = readFileSync(join(process.cwd(), degensTopNav), 'utf8')
    const topNavControlsSource = readFileSync(join(process.cwd(), degensTopNavControls), 'utf8')
    expect(pageSource).not.toContain("'use client'")
    expect(pageSource).toContain("from './DegenRoute'")
    expect(pageSource).toContain('HydrationBoundary')
    expect(pageSource).toContain('prefetchQuery')
    expect(routeBoundarySource).toContain("'use client'")
    expect(routeBoundarySource).toContain("dynamic(() => import('./AllDegensPage')")
    expect(routeBoundarySource).toContain('ssr: false')
    expect(usesSharedLoadingSkeleton(routeBoundarySource)).toBe(true)
    expect(clientPageSource).toContain("'use client'")
    expect(clientPageSource).toContain("from 'lucide-react'")
    expect(clientPageSource).toContain('useQueryStates')
    expect(clientPageSource).not.toContain('useSearchParams')
    expect(clientPageSource).not.toContain('useRouter')
    expect(clientPageSource).not.toContain('ssr: false')
    expect(routeBoundarySource).toContain('role="status"')
    expect(routeBoundarySource).toContain('aria-live="polite"')
    expect(routeBoundarySource).toContain('aria-busy="true"')
    expect(clientPageSource).not.toContain("from '@nl/ui/base/icon'")
    expect(topNavSource).toContain("import('./DegensTopNavControls')")
    expect(topNavControlsSource).toContain("from 'lucide-react'")
    expect(topNavSource).not.toContain("from '@nl/ui/base/icon'")
  })

  it('keeps the interactive degen browser out of the route entry chunk', () => {
    const routeBoundarySource = readFileSync(join(process.cwd(), degensRouteBoundary), 'utf8')

    expect(routeBoundarySource).toContain("dynamic(() => import('./AllDegensPage')")
    expect(routeBoundarySource).toContain('ssr: false')
    expect(usesSharedLoadingSkeleton(routeBoundarySource)).toBe(true)
    expect(routeBoundarySource).toContain('role="status"')
    expect(routeBoundarySource).toContain('aria-live="polite"')
    expect(routeBoundarySource).toContain('aria-busy="true"')
  })
})

describe('GLTF viewer loading contract', () => {
  it('keeps the initial NFT shell server-rendered and browser controls isolated', () => {
    // web ships as Astro static: the deep-link shell is a prerendered Astro
    // page and the browser controls load through a client-only island.
    const shellSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')
    const runtimeSource = readFileSync(join(process.cwd(), gltfClientRuntime), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), gltfClient), 'utf8')
    const routeBoundarySource = readFileSync(join(process.cwd(), gltfRouteBoundary), 'utf8')
    const modelViewSource = readFileSync(join(process.cwd(), gltfModelView), 'utf8')

    expect(shellSource).not.toContain("'use client'")
    expect(shellSource).toContain('client:only="react"')
    expect(shellSource).toContain('styles.viewer__shell')
    expect(shellSource).toContain('styles.initial__image')
    expect(runtimeSource).toContain("from '@nl/ui/custom/optimized-image'")
    expect(runtimeSource).toContain('import DegenViews')
    expect(runtimeSource).toContain('initialImage={null}')
    expect(routeBoundarySource).toContain("'use client'")
    expect(routeBoundarySource).toContain("dynamic(() => import('./DegenViews')")
    expect(routeBoundarySource).toContain('ssr: false')
    expect(routeBoundarySource).toContain('className={styles.viewer__shell}')
    expect(routeBoundarySource).toContain('className={styles.initial__image}')
    expect(routeBoundarySource).toContain('initialImage={null}')
    expect(routeBoundarySource).toContain('role="status"')
    expect(routeBoundarySource).not.toContain('@nl/ui/custom/route-loading')
    expect(clientSource).toContain("'use client'")
    expect(clientSource).not.toContain("from 'next/image'")
    expect(clientSource).toContain('image__surface')
    expect(clientSource).toContain("const loadModelView = () => import('./ModelView')")
    expect(clientSource).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(clientSource).toContain('ssr: false')
    expect(modelViewSource).toContain(
      "import '@google/model-viewer/dist/model-viewer-module.min.js'"
    )
    expect(modelViewSource).not.toContain("import '@google/model-viewer'")
    expect(modelViewSource).toContain('modelViewerRef')
    expect(modelViewSource).toContain("model.setAttribute('src', MODEL_SRC)")
  })

  it('keeps embedded viewer controls loadable in sandboxed frames', () => {
    // The Next.js /_next/static CORS rewrite is replaced by the Cloudflare
    // _headers file emitted for the static asset bundle.
    const finalizeSource = readFileSync(
      join(process.cwd(), 'apps/web/scripts/finalize-static.mjs'),
      'utf8'
    )

    expect(finalizeSource).toContain('/_astro/*')
    expect(finalizeSource).toContain('Access-Control-Allow-Origin: *')
  })

  it('preloads only the visible NFT artwork', () => {
    const shellSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')
    const runtimeSource = readFileSync(join(process.cwd(), gltfClientRuntime), 'utf8')

    // The static shell eagerly fetches only the visible 2D poster.
    const posterStart = shellSource.indexOf('data-gltf-poster')
    const posterEnd = shellSource.indexOf('/>', posterStart)
    expect(posterStart).toBeGreaterThanOrEqual(0)
    expect(shellSource.slice(posterStart, posterEnd)).toContain('loading="eager"')
    expect(shellSource.slice(posterStart, posterEnd)).toContain('fetchpriority="high"')

    expect(runtimeSource).toContain('className={styles.sprite__wrapper}')
    expect(runtimeSource).toContain('fill\n            sizes="100vw"')
    const logoStart = runtimeSource.indexOf('alt="Nifty League Logo"')
    const logoEnd = runtimeSource.indexOf('src="/img/logos/NL/wordmark.webp"')

    expect(logoStart).toBeGreaterThanOrEqual(0)
    expect(logoEnd).toBeGreaterThan(logoStart)
    expect(runtimeSource.slice(logoStart, logoEnd)).not.toContain('priority')
    expect(runtimeSource).not.toContain('quality={100}')
  })

  it('keeps accumulated NFTL reads available when the optional Infura variable is unavailable', () => {
    const hookSource = readFileSync(join(process.cwd(), webClaimableNFTL), 'utf8')

    expect(hookSource).toContain('process.env.PUBLIC_INFURA_ID')
    expect(hookSource).toContain("'https://ethereum-rpc.publicnode.com'")
    expect(hookSource).toContain("method: 'POST'")
    expect(hookSource).toContain("params: [{ to: NFTL_CONTRACT_ADDRESS, data }, 'latest']")
    expect(hookSource).toContain('if (!cancelled)')
  })

  it('keeps route-only DEGEN constants out of the full catalog module', () => {
    const runtimeSource = readFileSync(join(process.cwd(), gltfClientRuntime), 'utf8')
    const modelSource = readFileSync(
      join(
        process.cwd(),
        'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/ModelView.tsx'
      ),
      'utf8'
    )
    const assetSource = readFileSync(join(process.cwd(), webDegenAssets), 'utf8')
    const catalogSource = readFileSync(join(process.cwd(), webDegenCatalog), 'utf8')

    expect(runtimeSource).toContain("from '@/constants/degen-assets'")
    expect(modelSource).toContain("from '@/constants/degen-assets'")
    expect(assetSource).toContain('export const LEGGIES')
    expect(catalogSource).not.toContain("from './degen-assets'")
    expect(catalogSource).not.toContain('export const METAS')
    expect(catalogSource).not.toContain('export const RARES')
    expect(runtimeSource).not.toContain("from '@/constants/degens'")
  })
})

describe('website build performance contract', () => {
  it('inlines the atomic marketing CSS for first-load rendering', () => {
    // web ships as Astro static: the global stylesheet ships with the
    // prerendered shell instead of a Next.js inlineCss experiment.
    const baseSource = readFileSync(join(process.cwd(), 'apps/web/src/layouts/Base.astro'), 'utf8')
    const astroConfig = readFileSync(join(process.cwd(), 'apps/web/astro.config.mjs'), 'utf8')

    expect(baseSource).toContain("import '../styles/app.css'")
    expect(astroConfig).toContain("output: 'static'")
  })

  it('builds the marketing site through Astro instead of Next', () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'apps/web/package.json'), 'utf8')
    ) as {
      scripts?: Record<string, string>
    }

    expect(manifest.scripts?.build).toContain('astro build')
    expect(manifest.scripts?.build).not.toContain('next build')
    expect(existsSync(join(process.cwd(), 'apps/web/next.config.ts'))).toBe(false)
  })

  it('preloads only the visible NFT artwork', () => {
    const shellSource = readFileSync(join(process.cwd(), gltfPage), 'utf8')

    const posterStart = shellSource.indexOf('data-gltf-poster')
    const posterEnd = shellSource.indexOf('/>', posterStart)
    expect(posterStart).toBeGreaterThanOrEqual(0)
    expect(shellSource.slice(posterStart, posterEnd)).toContain('loading="eager"')
    expect(shellSource.slice(posterStart, posterEnd)).toContain('fetchpriority="high"')
    expect(shellSource).not.toContain('fetchpriority="high" loading="lazy"')
  })

  it('keeps accumulated NFTL reads available when the optional Infura variable is unavailable', () => {
    const hookSource = readFileSync(join(process.cwd(), webClaimableNFTL), 'utf8')
    const astroConfig = readFileSync(join(process.cwd(), 'apps/web/astro.config.mjs'), 'utf8')

    // The Infura id is inlined into the client bundle from the PUBLIC_ var.
    expect(astroConfig).toContain("'process.env.PUBLIC_INFURA_ID'")
    expect(hookSource).toContain('process.env.PUBLIC_INFURA_ID')
    expect(hookSource).toContain('ethereum-rpc.publicnode.com')
    expect(hookSource).toContain('encodeUint256(tokenIndex)')
    expect(hookSource).toContain('if (!cancelled)')
  })

  it('defers the below-fold NiftyWorld showcase video', () => {
    const source = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/niftyworld/page.tsx'),
      'utf8'
    )
    const videoStart = source.indexOf('src="/video/arcade-token.mp4"')
    const videoBlockStart = source.lastIndexOf('<ViewportVideo', videoStart)

    expect(videoStart).toBeGreaterThan(-1)
    expect(source.slice(videoBlockStart, videoStart)).toContain('deferLoad')
  })

  it('defers the large marketing hero videos while keeping their backdrops eager', () => {
    const heroVideoRoutes = [
      ['apps/web/src/app/(main)/degens/page.tsx', '/video/unboxing.mp4'],
      ['apps/web/src/app/(main)/niftyworld/page.tsx', '/video/mansion_showcase.mp4'],
    ] as const

    for (const [file, videoSource] of heroVideoRoutes) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      const videoStart = source.indexOf(`src="${videoSource}"`)
      const videoBlockStart = source.lastIndexOf('<DeferredConsoleGame', videoStart)
      const backdropStart = source.indexOf('<ConsoleGameBackdrop', videoBlockStart)
      const backdropEnd = source.indexOf('/>', backdropStart)
      const videoBlock = source.slice(videoBlockStart, backdropEnd)

      expect(videoStart).toBeGreaterThan(-1)
      expect(backdropStart).toBeGreaterThan(videoBlockStart)
      expect(backdropEnd).toBeGreaterThan(backdropStart)
      expect(videoBlock).toContain('deferVideo')
      expect(videoBlock).toContain('<DeferredConsoleGame')
      expect(videoBlock).toContain('loading="eager"')
    }
  })

  it('eagerly loads the mobile games hero artwork without elevating secondary media', () => {
    const source = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/games/page.tsx'),
      'utf8'
    )
    const mobileImageStart = source.indexOf('<MobileOnlyImage')
    const mobileImageEnd = source.indexOf('/>', mobileImageStart)

    expect(mobileImageStart).toBeGreaterThan(-1)
    expect(source.slice(mobileImageStart, mobileImageEnd)).toContain('loading="eager"')
    expect(source.slice(mobileImageStart, mobileImageEnd)).not.toContain('priority')
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
      deferredCharacterCreator,
      deferredMintWalletBoundary,
      mintNetworkBoundary,
      deferredNotifications,
    ]) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      if (file === deferredNotifications) {
        expect(source).toContain("from '@nl/ui/lib/deferred-activation'")
        expect(source).toContain('scheduleDeferredActivation')
      } else {
        expect(source).toContain("from '@nl/ui/custom/deferred-component'")
        expect(source).toContain('<DeferredComponent')
      }
    }

    const degenSource = readFileSync(join(process.cwd(), deferredDegenCard), 'utf8')
    expect(degenSource).toContain("from '@nl/ui/custom/deferred-component'")
    expect(degenSource).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(degenSource).toContain('disabledFallback')
    expect(degenSource).toContain('loadingFallback')
  })

  it('shares viewport visibility state with the interactive web carousel', () => {
    const source = readFileSync(join(process.cwd(), publicCarousel), 'utf8')

    expect(source).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(source).toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(source).toContain("import('./InteractiveCarousel')")
    expect(source).toContain("const CAROUSEL_ROOT_MARGIN = '160px 0px'")
  })
})

describe('shared route loading contract', () => {
  it('uses the themed shadcn skeleton boundary for every Next app', () => {
    const sharedSource = readFileSync(join(process.cwd(), sharedRouteLoading), 'utf8')

    expect(usesSharedLoadingSkeleton(sharedSource)).toBe(true)
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
    expect(pageSource).toContain("from '@/components/Header'")
    expect(pageSource).toContain('type ActiveModal')
    expect(pageSource).toContain('<Header>')
    expect(pageSource).toContain('<main>')
    // The shell stays static HTML; the interactive header subtrees are islands
    // injected through Header's slots (asserted by smashers-runtime.test.ts).
    expect(pageSource).toContain('client:visible')
    expect(pageSource).toContain('client:load')
    expect(headerSource).not.toContain("'use client'")
    // Header must not import the interactive children itself: that ships them
    // without a client directive and they render inert.
    expect(headerSource).not.toContain("from './ActionButtonsGroup'")
    expect(headerSource).not.toContain("from './DeferredHeroBackground'")
    expect(actionButtonsSource).toContain("'use client'")
    expect(actionButtonsSource).not.toContain("from 'next/dynamic'")
    expect(actionButtonsSource).toContain("from '@nl/ui/base/button-variants'")
    expect(actionButtonsSource).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(actionButtonsSource).toContain('className={buttonVariants()}')
    expect(actionButtonsSource).toContain('<button')
    expect(actionButtonsSource).not.toContain("from '@nl/ui/base/button'")
    expect(actionButtonsSource).toContain("import('@/components/PlayDialog')")
    expect(actionButtonsSource).toContain("import('@/components/TrailerDialog')")
    expect(actionButtonsSource).toContain("import('@/components/CreditsDialog')")
    expect(actionButtonsSource).toContain('useDeferredComponent(action.load, open)')
    expect(actionButtonsSource).not.toContain('loadedModals')
    expect(actionButtonsSource).toContain('aria-busy={isLoading}')
  })

  it('mounts the PlayFab auth providers only on authenticated routes', () => {
    // smashers is Astro: the Next `dynamic(ssr:false)` boundary is replaced by
    // the auth layout's client-only island, and the accessible loading state now
    // lives on each page's island fallback (asserted below).
    const layoutSource = readFileSync(join(process.cwd(), smashersAuthLayout), 'utf8')
    const providersSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProviders.tsx'),
      'utf8'
    )
    const providerSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProvider.tsx'),
      'utf8'
    )

    // Providers live inside each page's island, not in the layout: Astro gives
    // every client directive its own React root, so an island in the layout
    // could not supply context to an island in the page.
    expect(layoutSource).not.toContain("from '@/contexts/AuthProviders'")
    expect(layoutSource).not.toContain("from '@/contexts/FeatureFlagsProvider'")
    expect(layoutSource).toContain('<slot />')
    for (const page of [smashersLoginPage, smashersProfilePage]) {
      expect(readFileSync(join(process.cwd(), page), 'utf8')).toContain('client:only')
    }
    expect(providersSource).toContain("from './AuthProvider'")
    expect(providersSource).toContain("from './FeatureFlagsProvider'")
    expect(providerSource).toContain("from '@nl/playfab/components/UserContextProvider'")
    // The next-auth SessionProvider is gone; identity is the PlayFab session.
    expect(providerSource).not.toContain('next-auth')
    expect(
      existsSync(join(process.cwd(), 'apps/smashers/src/contexts/AuthProvidersBoundary.tsx'))
    ).toBe(false)
  })

  it('keeps the public routes free of the feature-flag provider', () => {
    const publicLayoutSource = readFileSync(join(process.cwd(), smashersRootLayout), 'utf8')
    const authProvidersSource = readFileSync(
      join(process.cwd(), 'apps/smashers/src/contexts/AuthProviders.tsx'),
      'utf8'
    )

    expect(publicLayoutSource).not.toContain('FeatureFlagProvider')
    expect(authProvidersSource).toContain('FeatureFlagProvider')
    expect(existsSync(join(process.cwd(), staleSmashersUnityDialog))).toBe(false)
  })

  it('keeps an accessible loading fallback on every auth island', () => {
    for (const [file, label] of [
      [smashersLoginPage, 'sign-in form'],
      [smashersProfilePage, 'profile'],
    ] as const) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).toContain('slot="fallback"')
      expect(source).toContain("from '@nl/ui/base/skeleton'")
      expect(source).toContain('<Skeleton')
      expect(source).toContain('role="status"')
      expect(source).toContain('aria-live="polite"')
      expect(source).toContain('aria-busy="true"')
      expect(source).toContain(label)
    }
  })

  it('keeps the shared back control out of the full icon registry graph', () => {
    const source = readFileSync(join(process.cwd(), smashersBackButton), 'utf8')

    expect(source).toContain("from 'lucide-react'")
    expect(source).not.toContain("from '@nl/ui/base/icon'")
  })
})
describe('Smashers login loading contract', () => {
  it('keeps the interactive login graph behind an accessible island boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersLoginPage), 'utf8')

    expect(pageSource).not.toContain("from '@nl/ui/custom/loading'")
    expect(pageSource).toContain("from '@/components/login/LoginClient'")
    expect(pageSource).toContain('client:only="react"')
    expect(pageSource).toContain('getSession')
    expect(pageSource).toContain("Astro.redirect('/profile'")
    // The island fallback carries the accessible loading state.
    expect(pageSource).toContain('slot="fallback"')
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
  })

  it('defers the Smashers PlayFab auth form behind the client-only island', () => {
    const source = readFileSync(join(process.cwd(), smashersLoginClient), 'utf8')

    // The form still loads lazily, but through the island rather than
    // next/dynamic; the page-level fallback provides the loading UI.
    expect(source).toContain("import PlayFabAuthForm from '@nl/playfab/components/PlayFabAuthForm'")
    expect(source).not.toContain("from 'next/dynamic'")
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
describe('Smashers profile loading contract', () => {
  it('keeps the interactive profile graph behind an accessible island boundary', () => {
    const pageSource = readFileSync(join(process.cwd(), smashersProfilePage), 'utf8')
    const clientSource = readFileSync(join(process.cwd(), smashersProfileClient), 'utf8')

    expect(pageSource).toContain("from '@/components/profile/ProfileClient'")
    expect(pageSource).toContain('client:only="react"')
    expect(pageSource).toContain('getSession')
    expect(pageSource).toContain("Astro.redirect('/login'")
    expect(pageSource).toContain('slot="fallback"')
    expect(pageSource).toContain("from '@nl/ui/base/skeleton'")
    expect(pageSource).toContain('role="status"')
    expect(pageSource).toContain('aria-live="polite"')
    expect(pageSource).toContain('aria-busy="true"')
    // The tab panels stay interactive islands with no Next dynamic boundary.
    expect(clientSource).toContain("from '@nl/playfab/components/AccountDetails'")
    expect(clientSource).not.toContain("from 'next/dynamic'")
  })
})

/**
 * Safety net: assert the app route trees actually exist and are non-empty,
 * so an entire route directory cannot silently disappear.
 *
 * smashers ships as Astro SSR and keeps its routes in src/pages instead.
 */
describe('app route trees exist', () => {
  for (const app of Object.keys(appRouteContracts)) {
    const routeDir = app === 'smashers' ? 'pages' : 'app'
    it(`apps/${app}/src/${routeDir} is a populated route tree`, () => {
      const root = join(process.cwd(), 'apps', app, 'src', routeDir)
      expect(existsSync(root), `Missing route tree root: apps/${app}/src/${routeDir}`).toBe(true)
      const count = countRouteFiles(root)
      expect(count, `No route files found under apps/${app}/src/${routeDir}`).toBeGreaterThan(0)
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

  it('loads the Degen dialog only while it is open', () => {
    const source = readFileSync(join(process.cwd(), deferredDegenDialog), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-component'")
    expect(source).toContain('enabled={open}')
    expect(source).toContain("import('@/components/dialog/DegenDialog')")
    expect(source).not.toContain("from 'next/dynamic'")
  })

  it('defers the dashboard rename form until the dialog opens', () => {
    const source = readFileSync(join(process.cwd(), deferredRenameDegenDialog), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-component'")
    expect(source).toContain('enabled={open}')
    expect(source).toContain(
      "import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent')"
    )
    expect(source).toContain('DeferredDialogLoading')
    expect(source).not.toContain("from 'next/dynamic'")
  })

  for (const file of deferredRenameDegenConsumers) {
    it(`keeps the rename form deferred in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredRenameDegenDialog')
      expect(source).toContain('open={isRenameDegenModalOpen}')
      expect(source).not.toContain(
        "from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'"
      )
    })
  }

  it('shares an accessible loading boundary across deferred dialog wrappers', () => {
    const source = readFileSync(join(process.cwd(), deferredDialogLoading), 'utf8')

    expect(usesSharedLoadingSkeleton(source)).toBe(true)
    expect(source).toContain('role="status"')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('aria-busy="true"')
  })

  const deferredDialogWrappers = [
    [deferredProfileNameDialog, 'ChangeProfileNameDialog', 'dashboard/gamer-profile/'],
    [deferredProfileImageDialog, 'ProfileImageDialog', 'dashboard/gamer-profile/'],
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
    const wrapper = readFileSync(join(process.cwd(), deferredNicknameDialog), 'utf8')
    const source = readFileSync(join(process.cwd(), deferredNicknameDialogConsumer), 'utf8')

    expect(wrapper).toContain("from '@nl/ui/custom/deferred-component'")
    expect(wrapper).toContain('enabled={open}')
    expect(wrapper).toContain(
      "import('@/app/(private-routes)/dashboard/rentals/ChangeNicknameDialog')"
    )
    expect(wrapper).not.toContain("from 'next/dynamic'")
    expect(source).toContain('DeferredChangeNicknameDialog')
    expect(source).toContain('open={isNicknameModalOpen}')
    expect(source).not.toContain("from './ChangeNicknameDialog'")
  })

  it('keeps the profile name form out of the trigger module until the dialog opens', () => {
    const source = readFileSync(join(process.cwd(), profileNameDialog), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-component'")
    expect(source).toContain('enabled={open}')
    expect(source).toContain("import('./ChangeProfileNameForm')")
    expect(source).toContain('DeferredDialogLoading')
    expect(source).not.toContain("from './ChangeProfileNameForm'")
  })

  it('keeps the profile image picker graph out of the trigger module until the dialog opens', () => {
    const dialogSource = readFileSync(join(process.cwd(), profileImageDialog), 'utf8')
    const contentSource = readFileSync(join(process.cwd(), profileImageContent), 'utf8')

    expect(dialogSource).toContain("from '@nl/ui/custom/deferred-component'")
    expect(dialogSource).toContain('enabled={open}')
    expect(dialogSource).toContain("import('./ProfileImageContent')")
    expect(dialogSource).toContain('DeferredDialogLoading')
    expect(dialogSource).not.toContain("from '@/components/sections/SectionSlider'")
    expect(dialogSource).not.toContain(
      "from '@/app/(private-routes)/dashboard/rentals/SearchRental'"
    )
    expect(contentSource).toContain("from '@/components/sections/SectionSlider'")
    expect(contentSource).toContain("from '@/app/(private-routes)/dashboard/rentals/SearchRental'")
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
    expect(rendersSharedLoadingSkeleton(boundarySource)).toBe(true)
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

      if (file === walletStorageProviders) {
        expect(source).toContain("from '@/contexts/LocalStorageContext'")
      } else {
        expect(source).toContain("from '@/contexts/WalletStorageProviders'")
      }
    })
  }

  it('reuses the shared wallet auth provider composition for game routes', () => {
    const source = readFileSync(
      join(process.cwd(), 'apps/app/src/contexts/GameWalletProviders.tsx'),
      'utf8'
    )

    expect(source).toContain("from '@/contexts/WalletAuthProviders'")
    expect(source).not.toContain("from '@/contexts/LocalStorageContext'")
    expect(source).not.toContain("from '@/contexts/Web3ModalContext'")
    expect(source).not.toContain("from '@/contexts/AuthStatusContext'")
    expect(source).not.toContain("from '@/contexts/AuthTokenContext'")
  })
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
    const appBarStyles = readFileSync(join(process.cwd(), sharedAppBarStyles), 'utf8')

    expect(navigationSource).toContain("from '@nl/ui/custom/app-bar'")
    expect(navigationSource).toContain('<AppBar>')
    expect(appBarSource).toContain("import styles from './app-bar.module.css'")
    expect(appBarStyles).toContain('min-height: 56px')
    expect(appBarStyles).toContain('padding: 8px 16px')
    expect(appBarStyles).toContain('height: 60px')
    expect(appBarStyles).toContain('padding: 0 24px')
  })

  it('keeps mobile navigation server-rendered and avoids heavy shell primitives', () => {
    const navigationSource = readFileSync(join(process.cwd(), publicNavigation), 'utf8')
    const toggleSource = readFileSync(
      join(process.cwd(), 'apps/app/src/components/providers/PublicDesktopNavigationToggle.tsx'),
      'utf8'
    )
    const deferredProfileSource = readFileSync(
      join(process.cwd(), deferredPublicUserProfile),
      'utf8'
    )
    const profileSource = readFileSync(join(process.cwd(), publicUserProfile), 'utf8')
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
    expect(toggleSource).toContain("'use client'")
    expect(toggleSource).toContain('<details')
    expect(toggleSource).toContain('id="public-desktop-navigation-toggle"')
    expect(toggleSource).toContain('aria-controls="public-desktop-navigation"')
    expect(toggleSource).toContain('dataset.publicSidebarState')
    expect(profileSource).toContain('loadingFallback={<ProfileProviderLoading />}')
    expect(profileSource).toContain(
      'errorFallback={(retry) => <ProfileProviderError retry={retry} />}'
    )
    expect(profileSource).not.toContain("from '@nl/ui/hooks/useDeferredActivation'")
    expect(profileSource).toContain("from '@nl/ui/hooks/useMediaQuery'")
    expect(profileSource).toContain("from '@/app/_layout/navigation-breakpoints'")
    expect(profileSource).toContain("placement: 'desktop' | 'mobile'")
    expect(profileSource).toContain('enabled\n')
    expect(profileSource).toContain('walletRequested')
    expect(profileSource).toContain('data-public-signed-out-profile')
    expect(profileSource).toContain('isVisiblePlacement')
    expect(profileSource).toContain('Sign-in is temporarily unavailable.')
    expect(navigationSource).not.toContain("from '@/components/extended/Breadcrumbs'")
    expect(deferredProfileSource).toContain("'use client'")
    expect(deferredProfileSource).toContain("import('./PublicUserProfile')")
    expect(deferredProfileSource).toContain('useDeferredComponent')
    expect(deferredProfileSource).toContain('isVisiblePlacement')
    expect(navigationSource).toContain('<DeferredPublicUserProfile placement="mobile" />')
    expect(navigationSource).toContain('<DeferredPublicUserProfile placement="desktop" />')
    expect(navigationSource).toContain('{children}')
    expect(navigationSource).not.toContain('PublicMainContent')
    expect(
      existsSync(join(process.cwd(), 'apps/app/src/components/providers/PublicMainContent.tsx'))
    ).toBe(false)
    expect(navigationStyles).toContain("data-public-sidebar-state='open'")
    expect(navigationStyles).toContain("data-public-sidebar-state='closed'")
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
    expect(linksSource).not.toContain("from 'next/link'")
    expect(linksSource).toContain('<a')
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
    expect(providersBoundarySource).toContain(
      "const loadWalletAuthProviders = () => import('./WalletAuthProviders')"
    )
    expect(providersBoundarySource).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(providersBoundarySource).toContain('errorFallback')
    expect(providersBoundarySource).toContain('loadingFallback')
    expect(providersBoundarySource).toContain("from '@nl/ui/custom/route-loading'")
    expect(providersSource).toContain("from '@/contexts/WalletStorageProviders'")
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
    expect(warningSource).toContain("from '@nl/ui/base/button-variants'")
    expect(warningSource).toContain('<button')
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
    const dataSource = readFileSync(join(process.cwd(), nftDataProviders), 'utf8')
    const featureSource = readFileSync(join(process.cwd(), walletFeatureProviders), 'utf8')

    expect(dataSource).toContain("from '@/contexts/NetworkProvider'")
    expect(dataSource).toContain("from '@/contexts/IMXContext'")
    expect(dataSource).toContain("from '@/contexts/NFTsBalanceContext'")
    expect(dataSource).not.toContain("from '@/contexts/TokensBalanceContext'")
    expect(featureSource).toContain("from '@/contexts/NFTDataProviders'")
    expect(featureSource).toContain("from '@/contexts/TokensBalanceContext'")

    for (const file of [gamerProfileClient, dashboardItemsClient, dashboardBurnerClient]) {
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
    const configSource = readFileSync(
      join(process.cwd(), 'apps/app/src/contexts/Web3ModalConfig.tsx'),
      'utf8'
    )
    const modalSource = readFileSync(join(process.cwd(), walletModal), 'utf8')

    expect(providerSource).toContain("import('./Web3ModalRuntime')")
    expect(providerSource).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(providerSource).not.toContain('useEffect')
    expect(providerSource).not.toContain('useState')
    expect(providerSource).not.toContain("from 'wagmi'")
    expect(providerSource).not.toContain("from '@tanstack/react-query'")
    expect(providerSource).toContain("import('./Web3ModalConfig')")
    expect(providerSource).toContain('Promise.all')
    expect(runtimeSource).not.toContain("import('./Web3ModalConfig')")
    expect(runtimeSource).toContain('WagmiProvider')
    expect(providerSource).not.toContain('createAppKit')
    expect(providerSource).not.toContain('@reown/appkit/react')
    expect(providerSource).not.toContain('@/constants/contracts')
    expect(rendersSharedLoadingSkeleton(fallbackSource)).toBe(true)
    expect(fallbackSource).toContain('role="status"')
    expect(fallbackSource).toContain('role="alert"')
    expect(providerSource).toContain('Retry')
    expect(providerSource).toContain('onRetry={retry}')
    expect(authSource).not.toContain('useAppKit')
    expect(authSource).not.toContain('useAppKitEvents')
    expect(authSource).not.toContain("from 'wagmi'")
    expect(authSource).toContain("from '@nl/ui/hooks/useDeferredComponent'")
    expect(authSource).not.toContain('useEffect')
    expect(authSource).not.toContain('useState')
    expect(authSource).toContain("import('./AuthTokenProviderRuntime')")
    expect(authRuntimeSource).toContain("from 'wagmi'")
    expect(authRuntimeSource).toContain('openWalletModal')
    expect(modalSource).toContain("import('@reown/appkit/react')")
    expect(modalSource).toContain("import('@/constants/contracts')")
    expect(modalSource).not.toContain("import('viem/chains')")
    expect(modalSource).toContain("import('./Web3ModalConfig')")
    expect(modalSource).toContain('immutableZkEvm')
    expect(modalSource).toContain('immutableZkEvmTestnet')
    expect(modalSource).not.toContain('@reown/appkit/networks')
    expect(configSource).toContain("from 'viem/chains'")
    expect(configSource).toContain(
      'export { immutableZkEvm, immutableZkEvmTestnet, mainnet, sepolia }'
    )
    expect(configSource).not.toContain('@reown/appkit/networks')
  })

  it('loads dashboard data after the shell has painted with accessible recovery states', () => {
    const source = readFileSync(join(process.cwd(), dashboardDataBoundary), 'utf8')
    const sharedSource = readFileSync(join(process.cwd(), deferredComponent), 'utf8')

    expect(source).toContain(
      "const loadWalletFeatureProviders = () => import('@/contexts/WalletFeatureProviders')"
    )
    expect(source).toContain(
      "const loadNFTDataProviders = () => import('@/contexts/NFTDataProviders')"
    )
    expect(source).toContain('includeTokens ? loadWalletFeatureProviders : loadNFTDataProviders')
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
    const sharedProfileSource = readFileSync(
      join(process.cwd(), 'apps/app/src/components/UserProfile/index.tsx'),
      'utf8'
    )
    const profileImplementationSource = `${profileSource}\n${sharedProfileSource}`

    expect(layoutSource).toContain('PrivateRoutesBoundary')
    expect(layoutSource).toContain('headers()')
    expect(boundarySource).not.toContain("'use client'")
    expect(boundarySource).toContain("dynamic(() => import('./PrivateRoutesShell')")
    expect(boundarySource).not.toContain('ssr: false')
    expect(rendersSharedLoadingSkeleton(boundarySource)).toBe(true)
    expect(boundarySource).toContain('role="status"')
    expect(shellSource).toContain('MainLayout')
    expect(shellSource).toContain('WalletStorageProviders')
    expect(shellSource).toContain('loadingFallback')
    expect(shellSource).toContain('walletReady={false}')
    expect(shellSource).toContain('AuthTokenProvider')
    expect(sidebarSource).toContain("dynamic(() => import('./_UserProfile')")
    expect(sidebarSource).toContain("dynamic(() => import('./_LogoutButton')")
    expect(profileSource).toContain("export { default } from '@/components/UserProfile'")
    expect(profileImplementationSource).toContain('Open dashboard')
    expect(profileImplementationSource).toContain("from '@nl/ui/base/button-variants'")
    expect(profileImplementationSource).toContain('data-slot="button"')
    expect(profileImplementationSource).not.toContain('SidebarWalletActions')
    expect(profileImplementationSource).not.toContain("from '@/hooks/useNetworkContext'")
    expect(profileImplementationSource).not.toContain("from '@/hooks/writeContracts/useClaimNFTL'")
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
    expect(usesSharedLoadingSkeleton(clientSource)).toBe(true)
    expect(clientSource).toContain('role="status"')
    expect(clientSource).toContain('aria-busy="true"')
    expect(clientSource).not.toContain("from '@/components/cards/DegenCard/DashboardDegenCard'")
    expect(clientSource).not.toContain("from '@/components/extended/DegensFilter'")
    expect(contentSource).toContain("import('@/components/cards/DegenCard/DashboardDegenCard')")
    expect(contentSource).toContain('(module) => module.DashboardDegenCardInView')
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
    expect(usesSharedLoadingSkeleton(clientSource)).toBe(true)
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
    expect(usesSharedLoadingSkeleton(clientSource)).toBe(true)
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
    const appBarStyles = readFileSync(join(process.cwd(), sharedAppBarStyles), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/app-bar'")
    expect(source).toContain('<AppBar>{header}</AppBar>')
    expect(appBarSource).toContain("import styles from './app-bar.module.css'")
    expect(appBarStyles).toContain('min-height: 56px')
    expect(appBarStyles).toContain('padding: 8px 16px')
    expect(appBarStyles).toContain('height: 60px')
    expect(appBarStyles).toContain('padding: 0 24px')
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
    expect(usesSharedLoadingSkeleton(clientSource)).toBe(true)
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
    expect(usesSharedLoadingSkeleton(clientSource)).toBe(true)
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
    const schedulerSource = readFileSync(
      join(process.cwd(), 'packages/ui/src/lib/deferred-activation.ts'),
      'utf8'
    )

    expect(source).toContain("import('./GoogleTagManager')")
    expect(source).toContain("import('./WebVitals')")
    expect(source).toContain("from '@nl/ui/lib/deferred-activation'")
    expect(source).toContain('scheduleDeferredActivation')
    expect(schedulerSource).toContain('requestIdleCallback')
    expect(schedulerSource).toContain('setTimeout')
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

  it('uses deferred analytics in apps/web/src/layouts/Base.astro', () => {
    const source = readFileSync(join(process.cwd(), webAnalyticsBaseLayout), 'utf8')

    // The base layout only mounts the telemetry island; GTM, Web Vitals and
    // Sentry load later from the runtime module.
    expect(source).toContain("import '../runtime/telemetry'")
    expect(source).not.toContain('googletagmanager')
  })

  it('uses deferred analytics in apps/smashers/src/layouts/Base.astro', () => {
    const source = readFileSync(join(process.cwd(), smashersRootLayout), 'utf8')

    // The base layout only mounts the telemetry runtime; GTM, Web Vitals and
    // Sentry load later from that module.
    expect(source).toContain("import '../runtime/telemetry'")
    expect(source).not.toContain('googletagmanager')
  })

  for (const file of [webTelemetryRuntime, smashersTelemetryRuntime]) {
    it(`defers GTM, Web Vitals and Sentry until activation in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain("'gtm.start'")
      expect(source).toContain("import('web-vitals')")
      expect(source).toContain("import('@sentry/browser')")
      expect(source).toContain('requestIdleCallback')
    })
  }
})

describe('app-router metadata contract', () => {
  it('keeps apps/app/src/app/layout.tsx on the Metadata API', () => {
    const source = readFileSync(join(process.cwd(), 'apps/app/src/app/layout.tsx'), 'utf8')

    expect(source).not.toContain("from 'next/head'")
    expect(source).not.toContain('<Head>')
  })

  it('keeps apps/smashers/src/layouts/Base.astro emitting canonical and social meta', () => {
    // smashers ships as Astro SSR: the base layout hand-emits the same metadata
    // the Next Metadata API produced.
    const source = readFileSync(join(process.cwd(), smashersRootLayout), 'utf8')

    expect(source).not.toContain("from 'next/head'")
    expect(source).not.toContain('<Head>')
    expect(source).toContain('rel="canonical"')
    expect(source).toContain('og:title')
    expect(source).toContain('twitter:card')
    expect(source).toContain('name="description"')
  })

  it('keeps apps/web/src/layouts/Base.astro emitting canonical and social meta', () => {
    // web ships as Astro static: the base layout hand-emits the same metadata
    // the Next Metadata API produced.
    const source = readFileSync(join(process.cwd(), 'apps/web/src/layouts/Base.astro'), 'utf8')

    expect(source).not.toContain("from 'next/head'")
    expect(source).not.toContain('<Head>')
    expect(source).toContain('rel="canonical"')
    expect(source).toContain('og:title')
    expect(source).toContain('twitter:card')
    expect(source).toContain('name="description"')
  })
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
    const smashersSource = readFileSync(join(process.cwd(), smashersHomePage), 'utf8')
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
    expect(consoleGameSource).toContain(
      '{isNearViewport ? <source src={src} type="video/mp4" /> : null}'
    )
    expect(consoleGameSource).toContain('children: ReactNode')
    expect(deferredSource).toContain('isNearViewport={isNearViewport && videoActivated}')
    expect(deferredSource).toContain('scheduleDeferredActivation')
    expect(deferredSource).toContain('children: ReactNode')
    expect(deferredSource).toContain('<div className="dark-gradient-overlay" />')
    expect(deferredSource).toContain('renderGradientOverlay={false}')
    expect(deferredSource).not.toContain("from '../console-game/backdrop'")
    expect(deferredSource).not.toContain("from '@nl/ui/custom/optimized-image'")
  })
})

describe('shared below-fold loading contract', () => {
  it('provides an accessible themed loading state with retry behavior', () => {
    const source = readFileSync(join(process.cwd(), sharedDeferredSection), 'utf8')

    expect(source).toContain("from '@nl/ui/custom/deferred-skeleton'")
    expect(source).toContain('DEFERRED_RETRY_BUTTON_CLASS')
    expect(source).toContain("from '@nl/ui/lib/deferred-boundary'")
    expect(source).toContain("from '@nl/ui/base/button'")
    expect(source).toContain('<Button')
    expect(source).not.toContain('<button')
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
    const deferredSource = readFileSync(join(process.cwd(), webDeferredHomeMedia), 'utf8')
    const deferredHomeSectionsSource = readFileSync(
      join(process.cwd(), webDeferredHomeSections),
      'utf8'
    )
    const deferredHomeSectionsBoundarySource = readFileSync(
      join(process.cwd(), webDeferredHomeSectionsBoundary),
      'utf8'
    )
    const homeSectionConfigSource = readFileSync(join(process.cwd(), webHomeSectionConfig), 'utf8')
    const sharedDeferredSource = readFileSync(join(process.cwd(), sharedDeferredSection), 'utf8')
    const homeSectionNames = [
      'HomeDegensSection',
      'HomeCompeteSection',
      'HomeTokenSection',
      'HomeNiftyWorldSection',
      'HomeDashboardSection',
      'HomeCommunitySection',
      'HomeSponsorsSection',
    ]
    const homeSectionSources = homeSectionNames
      .map((section) =>
        readFileSync(
          join(process.cwd(), `apps/web/src/components/HomeSections/${section}.tsx`),
          'utf8'
        )
      )
      .join('\n')
    const homeStyles = readFileSync(join(process.cwd(), 'apps/web/src/styles/home.css'), 'utf8')

    expect(pageSource).toContain("from '@/components/DeferredHomeSectionsBoundary'")
    expect(pageSource).toContain('DeferredHomeSectionsBoundary')
    expect(pageSource).not.toContain('DeferredHomeDegens')
    expect(pageSource).not.toContain('DeferredHomeCompete')
    expect(pageSource).not.toContain('DeferredHomeDashboard')
    expect(pageSource).not.toContain('DeferredHomeSponsors')
    expect(pageSource).not.toContain("from '@/components/HomeSections/HomeDegensSection'")
    expect(pageSource).not.toContain("from '@/components/HomeSections/HomeCompeteSection'")
    expect(pageSource).not.toContain("from '@/components/HomeSections/HomeTokenSection'")
    expect(pageSource).not.toContain("import('@/components/MintOMatic')")
    expect(pageSource).not.toContain("import('@/components/Sponsors')")
    expect(pageSource).not.toContain("from '@/components/Carousel'")
    expect(pageSource).not.toContain("from '@/components/Carousel/DegenCardItem'")
    expect(deferredSource).not.toContain("import('@/components/HomeBelowFold')")
    expect(existsSync(join(process.cwd(), 'apps/web/src/components/HomeBelowFold.tsx'))).toBe(false)
    expect(deferredHomeSectionsSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(deferredHomeSectionsSource).toContain("from './home-section-config'")
    expect(deferredHomeSectionsBoundarySource).toContain("from './home-section-config'")
    expect(deferredHomeSectionsBoundarySource).toContain('useOnScreen')
    expect(deferredHomeSectionsBoundarySource).toContain('useDeferredComponent')
    expect(homeSectionConfigSource).toContain("export const HOME_SECTION_ROOT_MARGIN = '240px 0px'")
    expect(deferredHomeSectionsSource).toContain('loadingMode="minimal"')
    for (const section of [
      'HomeDegensSection',
      'HomeCompeteSection',
      'HomeNiftyWorldSection',
      'HomeDashboardSection',
      'HomeTokenSection',
      'HomeCommunitySection',
      'HomeSponsorsSection',
    ]) {
      expect(deferredHomeSectionsSource).toContain(`import('@/components/HomeSections/${section}')`)
    }
    expect(sharedDeferredSource).toContain('className="deferred-section"')
    expect(sharedDeferredSource).toContain("loadingMode?: 'skeleton' | 'minimal'")
    expect(deferredSource).toContain("import('@/components/CommunityDegenCarousel')")
    expect(deferredSource).toContain("import('@/components/MintOMatic')")
    for (const section of homeSectionNames) {
      expect(
        readFileSync(
          join(process.cwd(), `apps/web/src/components/HomeSections/${section}.tsx`),
          'utf8'
        )
      ).not.toContain("'use client'")
    }
    expect(homeSectionSources).toContain("from '@/components/DeferredHomeMedia'")
    expect(homeSectionSources).toContain("from '@/components/CompeteArtwork'")
    expect(homeSectionSources).toContain("from '@/components/Sponsors'")
    expect(homeSectionSources).not.toContain("from '@/constants/sponsors'")
    expect(pageSource).not.toContain('home-below-fold')
    expect(homeStyles).not.toContain('.home-below-fold')
    expect(homeStyles).toContain('.home-pg .deferred-section')
    expect(homeStyles).toContain('.home-pg .home-static-section')
    expect(homeStyles).toContain('content-visibility: auto')
    expect(homeStyles).toContain('contain-intrinsic-size: auto 800px')
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
    const sharedNavbarScrollStateSource = readFileSync(
      join(process.cwd(), sharedWebNavbarScrollState),
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
    expect(sharedNavbarScrollFrameSource).not.toContain("'use client'")
    expect(sharedNavbarScrollFrameSource).toContain('NavbarScrollState')
    expect(sharedNavbarScrollStateSource).not.toContain("'use client'")
    expect(sharedNavbarScrollStateSource).toContain('requestAnimationFrame')
    expect(sharedNavbarScrollStateSource).toContain('window.scrollY > 80')
    expect(sharedNavbarScrollStateSource).toContain('nextIsScrolled === isScrolled')
    expect(sharedNavbarScrollStateSource).toContain('data-target')
    expect(sharedNavbarScrollStateSource).toContain('dangerouslySetInnerHTML')
    expect(sharedNavbarSource).not.toContain("import ActiveNavLink from './ActiveNavLink'")
    expect(sharedNavbarSource).toContain('function DesktopNavLink')
    expect(sharedNavbarScrollFrameSource).toContain('navbar-scroll-frame')
    expect(sharedNavbarScrollFrameSource).toContain('bg-transparent')
    expect(sharedNavbarScrollFrameSource).toContain('backdrop-blur-xs')
    expect(sharedNavbarSource).not.toContain('transition-all')
    expect(sharedNavbarSource).not.toContain('useScrollDetection')
    expect(sharedNavbarSource).toContain('<details')
    expect(sharedNavbarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(sharedNavbarSource).not.toContain("from './ActiveNavLink'")
    expect(sharedNavbarSource).toContain("from './NavLinkContent'")
    expect(sharedNavLinkContentSource).toContain('export function NavLinkContent')
    expect(sharedNavLinkContentSource).toContain('NAV_LINK_CONTENT_CLASS')
    expect(existsSync(join(process.cwd(), sharedWebMobileTrigger))).toBe(false)
    expect(mobileNavbarSource).not.toContain("'use client'")
    expect(mobileNavbarSource).not.toContain("from '@nl/ui/base/sheet'")
    expect(mobileNavbarSource).not.toContain("from './ActiveNavLink'")
    expect(mobileNavbarSource).toContain("from '@nl/ui/custom/mobile-navigation'")
    expect(mobileNavbarSource).toContain('<nav aria-label="Primary navigation">')
    expect(mobileNavbarSource).toContain("from '@nl/ui/base/button-variants'")
    // The mobile divider is a lightweight div carrying the separator token
    // (no Separator component import; oxlint flags unused imports).
    expect(mobileNavbarSource).not.toContain("from '@nl/ui/base/separator'")
    expect(mobileNavbarSource).toContain('data-slot="mobile-nav-divider"')
    expect(mobileNavbarSource).toContain('aria-hidden="true"')
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
    const communityConversationSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/CommunityConversation.tsx'),
      'utf8'
    )
    const teamDesktopSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/TeamDesktop/index.tsx'),
      'utf8'
    )

    expect(communitySource).not.toContain("'use client'")
    expect(communitySource).not.toContain('useMediaQuery')
    expect(communitySource).toContain('sliding-background-wrapper')
    expect(communitySource).toContain("from '@/components/CommunityConversation'")
    expect(communitySource).not.toContain('DeferredCommunityConversation')
    expect(communityConversationSource).not.toContain("'use client'")
    expect(teamSource).not.toContain("'use client'")
    expect(teamSource).toContain('DeferredTeamCarousel')
    expect(teamSource).toContain("from '@/components/TeamDesktop'")
    expect(teamSource).not.toContain('DeferredTeamDesktop')
    expect(teamSource).not.toContain("from '@/components/Carousel'")
    expect(carouselSource).toContain("'use client'")
    expect(deferredTeamSource).toContain("import('@/components/TeamCarousel')")
    expect(deferredTeamSource).toContain("from '@nl/ui/custom/deferred-section'")
    expect(teamCarouselSource).toContain("from '@/components/Carousel'")
    expect(teamCarouselSource).toContain("from '@/constants/team'")
    expect(teamDesktopSource).not.toContain("'use client'")
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
    const homeSectionsSource =
      readFileSync(
        join(process.cwd(), 'apps/web/src/components/HomeSections/HomeCompeteSection.tsx'),
        'utf8'
      ) +
      readFileSync(
        join(process.cwd(), 'apps/web/src/components/HomeSections/HomeTokenSection.tsx'),
        'utf8'
      )
    const bouncingNftlSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/BouncingNFTL/index.tsx'),
      'utf8'
    )

    expect(homeSource).not.toContain("from '@nl/ui/custom/parallax-wrapper'")
    expect(bouncingNftlSource).not.toContain("from '@nl/ui/custom/parallax-wrapper'")
    expect(homeSectionsSource).toContain("visibleTokens={['token1', 'token2']}")
    expect(homeSectionsSource).toContain("visibleTokens={['token1', 'token3']}")
    expect(bouncingNftlSource).not.toContain('classes?.')
    expect(bouncingNftlSource).toContain('animate-bounce-coin1')
    expect(bouncingNftlSource).toContain('animate-bounce-coin2')
    expect(bouncingNftlSource).toContain('animate-bounce-coin3')
  })

  it('uses rendered-width image hints for the home page artwork', () => {
    const homeSource = readFileSync(join(process.cwd(), webHomePage), 'utf8')
    const homeSectionsSource = [
      'HomeCompeteSection',
      'HomeCommunitySection',
      'HomeNiftyWorldSection',
    ]
      .map((section) =>
        readFileSync(
          join(process.cwd(), `apps/web/src/components/HomeSections/${section}.tsx`),
          'utf8'
        )
      )
      .join('\n')
    const bouncingNftlSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/BouncingNFTL/index.tsx'),
      'utf8'
    )

    expect(homeSource).toContain('src="/img/hero/companion-base.webp"')
    expect(homeSource).toContain('sizes="12vw"')
    expect(homeSource).toContain('src="/img/hero/halo.webp"')
    expect(homeSource).toContain('sizes="9vw"')
    expect(homeSectionsSource).toContain('sizes="(min-width: 768px) 50vw, 100vw"')
    expect(homeSectionsSource).toContain('sizes="246px"')
    expect(bouncingNftlSource).toContain("sizes: '226px'")
    expect(bouncingNftlSource).toContain("sizes: '246px'")
  })

  it('uses rendered-width hints for secondary marketing artwork', () => {
    const expectedHints: Array<[string, string]> = [
      [
        'apps/web/src/components/TeamDesktop/index.tsx',
        'sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"',
      ],
      ['apps/web/src/components/Sponsors.tsx', 'sizes="80px"'],
      ['apps/web/src/components/LearnCards/index.tsx', 'sizes="(min-width: 640px) 50vw, 100vw"'],
      [
        'apps/web/src/app/(main)/compete-and-earn/page.tsx',
        'sizes="(min-width: 768px) 50vw, 100vw"',
      ],
      ['apps/web/src/app/(main)/careers/page.tsx', 'sizes="(min-width: 768px) 50vw, 100vw"'],
      ['apps/web/src/app/(main)/games/page.tsx', 'sizes="33vw"'],
      ['apps/web/src/components/DegenGallery.tsx', 'sizes="(max-width: 768px) 33vw, 205px"'],
      [
        'apps/web/src/components/NiftyWorldProperties.tsx',
        'sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"',
      ],
      ['apps/web/src/app/(main)/roadmap/page.tsx', 'sizes="(min-width: 920px) 800px, 600px"'],
      ['apps/web/src/components/RoadmapTimeline/roadmapCard.tsx', 'sizes="200px"'],
    ]

    for (const [file, hint] of expectedHints) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).toContain(hint)
    }
  })

  it('server-renders static marketing artwork without client deferred wrappers', () => {
    const staticSectionRoutes: Array<[string, string, string]> = [
      [
        'apps/web/src/app/(main)/degens/page.tsx',
        "from '@/components/DegenGallery'",
        'DeferredDegenGallery',
      ],
      [
        'apps/web/src/app/(main)/niftyworld/page.tsx',
        "from '@/components/NiftyWorldProperties'",
        'DeferredNiftyWorldProperties',
      ],
      [
        'apps/web/src/app/(main)/overview/page.tsx',
        "from '@/components/OverviewCommunity'",
        'DeferredOverviewCommunity',
      ],
    ]

    for (const [file, directImport, deferredExport] of staticSectionRoutes) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain(directImport)
      expect(source).not.toContain(deferredExport)
    }

    const staticSectionFiles = [
      'apps/web/src/components/DegenGallery.tsx',
      'apps/web/src/components/NiftyWorldProperties.tsx',
      'apps/web/src/components/OverviewCommunity.tsx',
    ]

    for (const file of staticSectionFiles) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toContain("'use client'")
      expect(source).toContain('@nl/ui/custom/optimized-image')
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

  it('keeps 404 artwork out of normal-route preload hints', () => {
    const error404Source = readFileSync(
      join(process.cwd(), 'packages/ui/src/components/custom/error-404/index.tsx'),
      'utf8'
    )

    expect(error404Source).not.toContain('priority')
    expect(error404Source).not.toContain('loading=')
  })

  it('does not eagerly preload below-fold decorative artwork', () => {
    const overviewSource = readFileSync(join(process.cwd(), webOverviewPage), 'utf8')
    const overviewCommunitySource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/OverviewCommunity.tsx'),
      'utf8'
    )
    const roadmapSource = readFileSync(
      join(process.cwd(), 'apps/web/src/app/(main)/roadmap/page.tsx'),
      'utf8'
    )

    expect(overviewSource).not.toContain('priority')
    expect(overviewCommunitySource).toContain(
      "import { getOptimizedImageProps } from '@nl/ui/custom/optimized-image'"
    )
    expect(overviewCommunitySource).toContain('<picture>')
    expect(overviewCommunitySource).toContain('media="(max-width: 767px)"')
    expect(roadmapSource).toContain('src="/img/space/satoshi_move.gif"')
    expect(roadmapSource).toContain('src="/img/space/moon.webp"')
    expect(roadmapSource).not.toContain(
      'src="/img/space/moon.webp"\n                alt="moon"\n                width={800}\n                height={800}\n                priority'
    )
  })

  it('keeps the first roadmap milestone separate from deferred catalog data', () => {
    const timelineSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/RoadmapTimeline/index.tsx'),
      'utf8'
    )
    const firstCardSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/RoadmapTimeline/first-card.tsx'),
      'utf8'
    )
    const deferredCardsSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/RoadmapTimeline/RoadmapTimelineCards.tsx'),
      'utf8'
    )
    const catalogSource = readFileSync(
      join(process.cwd(), 'apps/web/src/components/RoadmapTimeline/constants.tsx'),
      'utf8'
    )

    expect(timelineSource).toContain("from './first-card'")
    expect(timelineSource).not.toContain("from './constants'")
    expect(firstCardSource).toContain("title: 'DEGEN Minting'")
    expect(catalogSource).not.toContain("from './first-card'")
    expect(deferredCardsSource).toContain("from './constants'")
    expect(deferredCardsSource).toContain('ROADMAP_CARDS.map')
    expect(deferredCardsSource).not.toContain('DeferredComponent')
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
]

describe('deferred Sentry client contract', () => {
  it('keeps the Sentry SDK out of the web static shell', () => {
    // web ships as Astro static: the Next.js instrumentation-client/global-error
    // boundaries are gone and @sentry/browser loads lazily from the telemetry
    // runtime instead of @sentry/nextjs.
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'apps/web/package.json'), 'utf8')
    ) as { dependencies?: Record<string, string> }

    expect(existsSync(join(process.cwd(), 'apps/web/src/instrumentation-client.ts'))).toBe(false)
    expect(existsSync(join(process.cwd(), 'apps/web/src/app/global-error.tsx'))).toBe(false)
    expect(manifest.dependencies?.['@sentry/nextjs']).toBeUndefined()
    expect(manifest.dependencies?.['@sentry/browser']).toBeDefined()
    expect(readFileSync(join(process.cwd(), webTelemetryRuntime), 'utf8')).toContain(
      "import('@sentry/browser')"
    )
  })

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

  it('keeps the Sentry SDK out of the smashers Astro shell', () => {
    // smashers ships as Astro SSR: the Next instrumentation-client/global-error
    // boundaries are gone and @sentry/browser loads lazily from the telemetry
    // runtime, mirroring web.
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'apps/smashers/package.json'), 'utf8')
    ) as { dependencies?: Record<string, string> }

    expect(existsSync(join(process.cwd(), 'apps/smashers/src/instrumentation-client.ts'))).toBe(
      false
    )
    expect(existsSync(join(process.cwd(), 'apps/smashers/src/app/global-error.tsx'))).toBe(false)
    expect(manifest.dependencies?.['@sentry/nextjs']).toBeUndefined()
    expect(manifest.dependencies?.['@sentry/browser']).toBeDefined()
    expect(readFileSync(join(process.cwd(), smashersTelemetryRuntime), 'utf8')).toContain(
      "import('@sentry/browser')"
    )
  })

  it('keeps the smashers server SDK lazy, production-gated and off the client', () => {
    // Server-side capture survived the migration: the Next instrumentation
    // onRequestError hook is replaced by middleware reporting through this
    // module, with the same production gate and the same lazy import.
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), 'apps/smashers/package.json'), 'utf8')
    ) as { dependencies?: Record<string, string> }
    const source = readFileSync(join(process.cwd(), smashersServerSentryRuntime), 'utf8')
    const middleware = readFileSync(join(process.cwd(), smashersMiddleware), 'utf8')

    expect(manifest.dependencies?.['@sentry/node']).toBeDefined()
    expect(manifest.dependencies?.['@sentry/nextjs']).toBeUndefined()
    expect(source).not.toContain("from '@sentry/node'")
    expect(source).toContain("import('@sentry/node')")
    expect(source).toContain("process.env.VERCEL_ENV === 'production'")
    expect(middleware).toContain('captureServerError')
    expect(middleware).toContain('defineMiddleware')
  })

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
  // smashers is excluded: it ships as Astro SSR with no Next build wrapper or
  // instrumentation hook; its @sentry/browser integration is asserted in the
  // deferred client contract through the telemetry runtime.
  for (const app of ['app']) {
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

  it('keeps static Smashers loot tables server-rendered', () => {
    const page = readFileSync(join(process.cwd(), smashersLootPage), 'utf8')
    const tables = readFileSync(join(process.cwd(), smashersLootTables), 'utf8')

    expect(page).toContain("import LootTables from '@/components/Loot/LootTables'")
    expect(page).not.toContain('LootTablesBoundary')
    // Prerendered so the crate tables ship as static HTML, matching the old
    // server-rendered Next page.
    expect(page).toContain('export const prerender = true')
    expect(tables).not.toContain("'use client'")
    expect(tables).toContain('<table>')
    expect(existsSync(join(process.cwd(), staleSmashersLootBoundary))).toBe(false)
  })

  it('keeps the shared auth form on the shared skeleton primitive', () => {
    const page = readFileSync(join(process.cwd(), smashersLoginPage), 'utf8')

    expect(page).toContain("from '@nl/ui/base/skeleton'")
    expect(page).not.toContain("from '@nl/ui/custom/loading'")
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
    const constants = readFileSync(
      join(process.cwd(), 'packages/ui/src/components/custom/viewport-video/constants.ts'),
      'utf8'
    )

    expect(shell).not.toContain("'use client'")
    expect(shell).toContain("from './ViewportVideoBoundary'")
    expect(shell).toContain("from './constants'")
    expect(constants).toContain("DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN = '0px 0px -25% 0px'")
    expect(boundary).toContain('lazy<ComponentType<ViewportVideoEnhancerProps>>(')
    expect(boundary).toContain('rootMargin = DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN')
    expect(boundary).toContain(
      "preload={shouldRenderMedia && isNearViewport ? 'metadata' : 'none'}"
    )
    expect(boundary).toContain(
      'const shouldRenderMedia = hasEnteredViewport || (isNearViewport && !deferLoad)'
    )
    expect(enhancer).not.toContain("from '@nl/ui/hooks/useOnScreen'")
    expect(enhancer).toContain('isNearViewport: boolean')
    expect(enhancer).toContain("from '@nl/ui/hooks/useMediaQuery'")
    expect(enhancer).toContain("video.preload = shouldLoad ? 'metadata' : 'none'")
  })

  it('keeps marketing game video identifiers unique', () => {
    const source = readFileSync(join(process.cwd(), 'apps/web/src/components/GameCard.tsx'), 'utf8')

    expect(source).toContain('id={`game-video-${index}`}')
    expect(source).toMatch(/<ViewportVideo[\s\S]*deferLoad[\s\S]*src={video}/)
    expect(source).not.toContain('id="console-video"')
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
    const list = readFileSync(join(process.cwd(), web3GameList), 'utf8')
    const gamesPage = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/games/page.tsx'),
      'utf8'
    )
    const homePage = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/page.tsx'),
      'utf8'
    )

    expect(existsSync(join(process.cwd(), web3GameList))).toBe(true)
    expect(gamesPage).toContain("import DeferredWeb3GameList from './DeferredWeb3GameList'")
    expect(gamesPage).toContain('<DeferredWeb3GameList />')
    expect(homePage).toContain("import DeferredWeb3GameList from './games/DeferredWeb3GameList'")
    expect(homePage).toContain('<DeferredWeb3GameList />')
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
    expect(source).toContain("buttonVariants({ className: cx(buttonClassName, 'disabled') })")
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
    expect(sharedAnimations).toContain('prefers-reduced-motion: reduce')
    expect(sharedAnimations).toContain('.animate-zoom-out')
    expect(webStyles).toContain('.animate-propeller')
    expect(webStyles).toContain('.animate-bounce-coin1')
    expect(webStyles).toContain('.animate-bounce-coin2')
    expect(webStyles).toContain('.animate-bounce-coin3')
    expect(webStyles).toContain('prefers-reduced-motion: reduce')
    expect(webMarketingStyles).toContain('prefers-reduced-motion: reduce')
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
  // Next names routes page.tsx/route.ts/layout.tsx; Astro names them
  // <route>.astro for pages and <route>.ts for endpoints.
  const routeFileNames = new Set(['page.tsx', 'route.ts', 'layout.tsx'])
  const isAstroRoute = (entry: string) =>
    (entry.endsWith('.astro') || entry.endsWith('.ts')) && !entry.endsWith('.test.ts')

  let count = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      count += countRouteFiles(full)
    } else if (routeFileNames.has(entry) || isAstroRoute(entry)) {
      count += 1
    }
  }
  return count
}
