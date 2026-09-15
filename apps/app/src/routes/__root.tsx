/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRouteWithContext, type JSX } from '@tanstack/solid-router'

import DeferredExternalScript from '@nl/ui/custom/deferred-external-script'
import { cx } from '@nl/ui/class-names'

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
