import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import type { QueryClient } from '@tanstack/react-query'

import { createAppQueryClient } from '@/query/app-query'

import { routeTree } from './routeTree.gen'

export interface RouterContext {
  queryClient: QueryClient
}

/**
 * TanStack Start calls this once per request, so the query client is created
 * per request too. That keeps server-rendered cache entries from leaking
 * between users while still letting route loaders prefetch and dehydrate.
 */
export function getRouter() {
  const queryClient = createAppQueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
