/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'

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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cx('dark', 'h-full')}>
      <head>
        <HeadContent />
      </head>
      <body className="h-full" suppressHydrationWarning>
        <DeferredSentry enabled={import.meta.env.PROD} options={sentryOptions} />
        <DeferredAnalytics />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Scripts />
        <DeferredExternalScript
          id="device-stats"
          src="https://d7ct17ettlkln.cloudfront.net/public/stats.js"
        />
      </body>
    </html>
  )
}
