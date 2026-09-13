import { describe, expect, it } from 'bun:test'

import { findUnusedExports } from '../../scripts/find-unused-exports.mjs'

/**
 * The `export` keyword on these is redundant: every name is reached only from inside
 * its own file. They are live code, not dead code, so the M4.4 export pass deliberately
 * left the keyword in place rather than churning 90 declarations across 44 files —
 * unused exports are tree-shaken out of every build, so nothing ships because of them.
 *
 * Pinned so the set cannot grow unnoticed: a new entry here means an export was added
 * that nothing imports yet. Either un-export it or review it into this list.
 */
const REDUNDANT_EXPORTS = {
  'apps/api/src/classes/marketplaceCollection.ts': ['MarketplaceCollectionConfig'],
  'apps/api/src/imx/client.ts': ['ImxMintResult', 'ImxMintV2Params', 'ImxUser', 'MetadataProperty'],
  'apps/api/src/utils/request-json.ts': ['JsonRequestError', 'JsonRequestOptions'],
  'apps/app/src/constants/niftyworld-games.ts': ['NIFTY_WORLD_ORIGIN'],
  'apps/app/src/constants/unity-builds.ts': ['UnityConfigWithMeta'],
  'apps/app/src/contexts/NavigationContext.tsx': ['useNavigation'],
  'apps/app/src/contexts/NotificationContext.tsx': ['useNotification'],
  'apps/app/src/hooks/merkleDistributor/useUserUnclaimedAmount.ts': ['ClaimResult'],
  'apps/app/src/runtime/env.ts': ['DEPLOY_ENV'],
  'apps/app/src/runtime/metadata.ts': [
    'LinkTag',
    'MetaTag',
    'RouteHeadContent',
    'RouteMetadata',
    'buildMeta',
    'formatTitle',
  ],
  'apps/app/src/url/search-schema.ts': ['RawSearch'],
  'apps/app/src/url/search-state.ts': ['LeaderboardGameKey'],
  'apps/app/src/utils/degen-traits.ts': ['DegenTraitEntry'],
  'apps/app/src/utils/pagination.ts': ['PageItem'],
  'apps/app/src/utils/public-degens.ts': ['PublicDegenWire'],
  'apps/docs/src/lib/links.ts': ['FeatureItem', 'LinkItem', 'SocialItem'],
  'apps/docs/src/lib/navigation.ts': [
    'SECTIONS',
    'Section',
    'SidebarLink',
    'StarlightRouteData',
    'isInSection',
  ],
  'apps/smashers/src/runtime/Image.tsx': ['OptimizedImage', 'OptimizedImageProps'],
  'apps/smashers/src/runtime/metadata.ts': ['MetadataValues', 'SITE_URL'],
  'apps/smashers/src/runtime/redirects.mjs': ['STORE_PATHS'],
  'apps/smashers/src/runtime/store-links.ts': ['StoreLinks'],
  'apps/smashers/src/utils/oauth.ts': ['OAUTH_SECRET_ENV', 'StartedFlow'],
  'apps/smashers/src/utils/session.ts': ['Session', 'SessionData'],
  'apps/web/src/app/(special-routes)/gltf/[tokenId]/components/DegenViews.tsx': ['DegenViewsProps'],
  'apps/web/src/components/Carousel/DegenCardItem.tsx': ['Degen'],
  'apps/web/src/runtime/Image.tsx': [
    'OptimizedImage',
    'OptimizedImageProps',
    'getOptimizedImageProps',
  ],
  'apps/web/src/runtime/image-props.mjs': [
    'DEVICE_WIDTHS',
    'IMAGE_QUALITIES',
    'SMALL_WIDTHS',
    'candidateWidths',
    'selectWidths',
  ],
  'apps/web/worker/routes.mjs': ['withQuery'],
  'packages/playfab/src/auth/oauth.ts': [
    'AuthorizeUrlInput',
    'ExchangeCodeInput',
    'OAuthCredentials',
    'PkcePair',
    'TokenSet',
  ],
  'packages/playfab/src/components/AccountDetails/LinkedProviders.tsx': ['Props'],
  'packages/playfab/src/components/AccountDetails/index.tsx': ['AccountDetailsProps'],
  'packages/playfab/src/components/PlayFabAuthForm/index.tsx': ['PlayFabAuthFormProps'],
  'packages/playfab/src/constants.ts': ['ProfileConstraints'],
  'packages/playfab/src/sdk/index.ts': ['default', 'playfab'],
  'packages/playfab/src/types.ts': [
    'CharacterInventory',
    'Currencies',
    'EntityTokenResponse',
    'LinkAppleResult',
    'LinkFacebookResult',
    'LinkGoogleResult',
    'LinkTwitchResult',
    'Stats',
    'TitleData',
    'UnlinkAppleResult',
    'UnlinkFacebookResult',
    'UnlinkGoogleResult',
    'UnlinkTwitchResult',
    'UserAccountInfo',
    'UserDataRecord',
  ],
  'packages/ui/src/components/custom/app-bar/index.tsx': ['AppBarProps'],
  'packages/ui/src/components/custom/global-error/index.tsx': ['GlobalErrorPageProps'],
  'packages/ui/src/components/custom/native-image/index.tsx': ['NativeImageProps'],
  'packages/ui/src/components/custom/optimized-image/index.tsx': ['OptimizedImageProps'],
  'packages/ui/src/components/custom/responsive-carousel/index.tsx': ['ResponsiveCarouselProps'],
  'packages/ui/src/components/custom/theme-button-group/index.tsx': [
    'ThemeButton',
    'ThemeButtonProps',
  ],
  'packages/ui/src/hooks/useDeferredComponent.ts': [
    'DeferredComponentLoader',
    'DeferredComponentState',
  ],
  'packages/ui/src/lib/degen-tribes.ts': ['DegenTribe'],
  'packages/ui/src/lib/gtm/dataLayer.ts': ['GoogleTagManagerEvent'],
  'packages/ui/src/lib/image-attributes.ts': ['ImageAttributeInput'],
}

describe('type-aware export audit', () => {
  const { unused } = findUnusedExports()
  const unreachable = unused.filter((entry) => entry.scope === 'unreachable')
  const redundant = unused.filter((entry) => entry.scope === 'export-only')

  it('finds no export that nothing reaches, in any workspace', () => {
    // The detector resolves imports through the type checker, stitches in Astro
    // frontmatter imports, namespace and dynamic imports, and skips what loads by
    // convention (Astro endpoints, generated route trees, tool configs). An entry
    // here is code with no consumer anywhere — delete it or review it.
    expect(unreachable).toEqual([])
  })

  it('keeps the reviewed file-internal exports pinned', () => {
    const actual: Record<string, string[]> = {}
    for (const entry of redundant) (actual[entry.path] ??= []).push(entry.name)
    for (const names of Object.values(actual)) names.sort()
    expect(actual).toEqual(REDUNDANT_EXPORTS)
  })
}, 120000)
