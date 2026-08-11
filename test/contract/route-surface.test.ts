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
    'src/app/robots.ts',
    'src/app/sitemap.ts',
    'src/app/(public-routes)/degens/page.tsx',
    'src/app/(public-routes)/degens/[id]/page.tsx',
    'src/app/(public-routes)/games/page.tsx',
    'src/app/(public-routes)/leaderboards/page.tsx',
    'src/app/(public-routes)/mint-o-matic/page.tsx',
    'src/app/(private-routes)/dashboard/page.tsx',
    'src/app/(private-routes)/dashboard/rentals/page.tsx',
    'src/app/(private-routes)/dashboard/degens/page.tsx',
    'src/app/(private-routes)/dashboard/overview/page.tsx',
  ],
}

const deferredDashboardDialogConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/degens/page.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
  'apps/app/src/app/(private-routes)/dashboard/rentals/MyRentalsDataGrid.tsx',
]
const deferredRenameDegenConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/degens/page.tsx',
  'apps/app/src/app/(private-routes)/dashboard/overview/MyDegens.tsx',
]
const deferredProfileDialogConsumers = [
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_Stats/TopInfo.tsx',
  'apps/app/src/app/(private-routes)/dashboard/gamer-profile/_ImageProfile/index.tsx',
]
const deferredNicknameDialogConsumer =
  'apps/app/src/app/(private-routes)/dashboard/rentals/MyRentalsDataGrid.tsx'

const authOnlyRouteLayouts = ['apps/app/src/app/(public-routes)/verification/layout.tsx']
const nftOnlyRouteLayouts = ['apps/app/src/app/(public-routes)/mint-o-matic/layout.tsx']
const publicProviderBoundary = 'apps/app/src/contexts/PublicAppContextWrapper.tsx'
const walletStorageBoundaries = [
  'apps/app/src/contexts/WalletAuthContextWrapper.tsx',
  'apps/app/src/contexts/WalletFeatureProviders.tsx',
  'apps/app/src/components/providers/MintProviders.tsx',
]
const dashboardOverview = 'apps/app/src/app/(private-routes)/dashboard/overview/page.tsx'
const privateShellBoundary = 'apps/app/src/components/providers/PrivateRoutesBoundary.tsx'
const privateShell = 'apps/app/src/components/providers/PrivateRoutesShell.tsx'
const dashboardDataProviderBoundary = 'apps/app/src/contexts/DashboardDataProviders.tsx'
const dashboardDataBoundary = 'apps/app/src/components/providers/DashboardDataBoundary.tsx'
const deferredRenameDegenDialog = 'apps/app/src/components/providers/DeferredRenameDegenDialog.tsx'
const deferredDialogLoading = 'apps/app/src/components/providers/DeferredDialogLoading.tsx'
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
const networkContext = 'apps/app/src/contexts/NetworkContext.tsx'
const networkProvider = 'apps/app/src/contexts/NetworkProvider.tsx'
const graphQL = 'apps/app/src/hooks/useGraphQL.ts'
const publicCarousel = 'apps/web/src/components/Carousel/index.tsx'
const interactivePublicCarousel = 'apps/web/src/components/Carousel/InteractiveCarousel.tsx'
const smashersLoginClient = 'apps/smashers/src/app/(auth_routes)/login/LoginClient.tsx'
const privateShellLayout = 'apps/app/src/app/(private-routes)/layout.tsx'
const sidebarProfile = 'apps/app/src/app/_layout/_MainLayout/_Sidebar/_UserProfile/index.tsx'
const staleWalletContextWrapper = 'apps/app/src/contexts/WalletContextWrapper.tsx'
const deferredAnalyticsSource = 'packages/ui/src/lib/gtm/DeferredAnalytics.tsx'
const analyticsLayouts = [
  'apps/web/src/app/(main)/layout.tsx',
  'apps/web/src/app/(special-routes)/invite/[game]/[refcode]/layout.tsx',
  'apps/web/src/app/(special-routes)/party/[game]/[refcode]/[partyID]/layout.tsx',
  'apps/smashers/src/app/layout.tsx',
  'apps/app/src/app/layout.tsx',
]
const deferredConsoleGameRoutes = [
  'apps/web/src/app/(main)/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/app/(main)/niftyworld/page.tsx',
  'apps/smashers/src/app/page.tsx',
]
const appShell = 'apps/app/src/app/_layout/AppShell.tsx'
const deferredNotifications = 'apps/app/src/components/providers/DeferredNotifications.tsx'
const leaderboardsPage = 'apps/app/src/app/(public-routes)/leaderboards/page.tsx'
const deferredLeaderboards = 'apps/app/src/components/providers/DeferredLeaderboards.tsx'

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

describe('shared notification loading contract', () => {
  it('keeps toast implementations out of the eager app shell graph', () => {
    const appShellSource = readFileSync(join(process.cwd(), appShell), 'utf8')
    const deferredSource = readFileSync(join(process.cwd(), deferredNotifications), 'utf8')

    expect(appShellSource).toContain('DeferredNotifications')
    expect(appShellSource).not.toContain("from '@nl/ui/base/sonner'")
    expect(appShellSource).not.toContain("from '@/components/extended/Snackbar'")
    expect(deferredSource).toContain("import('@/components/extended/Snackbar')")
    expect(deferredSource).toContain("import('@nl/ui/base/sonner')")
    expect(deferredSource).toContain('Promise.all')
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

describe('public storage provider contract', () => {
  it('keeps wallet storage out of the shared public shell', () => {
    const source = readFileSync(join(process.cwd(), publicProviderBoundary), 'utf8')

    expect(source).not.toContain("from '@/contexts/LocalStorageContext'")
  })

  for (const file of walletStorageBoundaries) {
    it(`keeps wallet storage available in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain("from '@/contexts/LocalStorageContext'")
    })
  }
})

describe('private provider loading contract', () => {
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

describe('dashboard overview loading contract', () => {
  it('defers below-the-fold comic and item sections', () => {
    const source = readFileSync(join(process.cwd(), dashboardOverview), 'utf8')

    expect(source).toContain('import DeferredDashboardSection')
    expect(source).toContain("const loadMyComics = () => import('./MyComics')")
    expect(source).toContain("const loadMyItems = () => import('./MyItems')")
    expect(source).toContain("import('./MyComics')")
    expect(source).toContain("import('./MyItems')")
    expect(source).toContain('<DeferredDashboardSection label="My Comics" load={loadMyComics} />')
    expect(source).toContain('<DeferredDashboardSection label="My Items" load={loadMyItems} />')
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

describe('shared console game loading contract', () => {
  for (const file of deferredConsoleGameRoutes) {
    it(`defers the console game client boundary in ${file}`, () => {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).toContain('DeferredConsoleGame')
      expect(source).not.toContain("from '@nl/ui/custom/console-game'")
    })
  }
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
      expect(source).toContain('@nl/sentry-client/client')
    })
  }

  it('keeps the shared Sentry loader dynamic', () => {
    const source = readFileSync(join(process.cwd(), 'packages/sentry-client/src/client.ts'), 'utf8')

    expect(source).toContain("import('@sentry/nextjs')")
  })
})

describe('public route dependency contract', () => {
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
    const page = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/degens/page.tsx'),
      'utf8'
    )
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
    const page = readFileSync(
      join(process.cwd(), 'apps/app/src/app/(public-routes)/degens/page.tsx'),
      'utf8'
    )
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

    expect(loader).toContain('useOnScreen')
    expect(loader).toContain("import('./_Web3GameList/DeferredWeb3GameList')")
    expect(list).toContain('asChild')
    expect(list).not.toContain('WalletFeatureProviders')
    expect(list).not.toContain('ConnectWrapper')
    expect(list).not.toContain('useTokensBalances')
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
