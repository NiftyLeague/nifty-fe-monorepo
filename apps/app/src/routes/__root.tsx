/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/solid-router'
import type { JSX } from 'solid-js'
import { HydrationScript } from 'solid-js/web'

import DeferredExternalScript from '@nl/ui/custom/deferred-external-script'
import { cx } from '@nl/ui/class-names'
// Resolved asset URLs for the fonts painted above the fold. Preloading
// them from the document head beats waiting for the CSS font-matching pass.
import nexaRustBlackWoff2 from '@nl/ui/lib/fonts/NexaRustSans_Black/NexaRustSans-Black.woff2?url'
import ibmPlexSansWoff2 from '@nl/ui/lib/fonts/assets/ibm-plex-sans-400.woff2?url'
import lilitaOneWoff2 from '@nl/ui/lib/fonts/assets/lilita-one-400.woff2?url'

import DeferredAnalytics from '@/components/runtime/DeferredAnalytics'
import DeferredSentry from '@/components/runtime/DeferredSentry'
import { RootErrorBoundary, RootNotFound } from '@/components/runtime/RouteFallbacks'
import { sentryOptions } from '@/constants/sentry'
import { buildRootMeta } from '@/runtime/metadata'
import type { RouterContext } from '@/router'
import appCss from '@/styles/app.css?url'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: buildRootMeta(),
    links: [
      { rel: 'stylesheet', href: appCss },
      // Fonts are fetched anonymously by the CSS font matcher; the preload
      // must declare crossorigin or the browser refetches them.
      {
        rel: 'preload',
        href: ibmPlexSansWoff2,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: nexaRustBlackWoff2,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: lilitaOneWoff2,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
      { rel: 'icon', href: '/favicon/nl_purple/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon/nl_purple/apple-touch-icon.png' },
      { rel: 'shortcut icon', href: '/favicon/nl_purple/android-chrome-192x192.png' },
    ],
  }),
  errorComponent: RootErrorBoundary,
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

function RootDocument(props: { children: JSX.Element }) {
  return (
    <html lang="en" class={cx('dark', 'h-full')}>
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body class="h-full">
        <DeferredSentry enabled={import.meta.env.PROD} options={sentryOptions} />
        <DeferredAnalytics />
        {props.children}
        <Scripts />
        <DeferredExternalScript id="device-stats" src="/scripts/stats.js" />
      </body>
    </html>
  )
}
