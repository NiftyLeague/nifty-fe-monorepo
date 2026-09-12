import {
  useLocation,
  useNavigate,
  useRouter as useTanStackRouter,
  useSearch,
} from '@tanstack/react-router'
import { useMemo } from 'react'

/**
 * The navigation hooks this app uses, backed by the TanStack Router. Keeping
 * hooks in one place lets the migrated components read the way they did before
 * without a framework-specific router.
 */

const EXTERNAL_HREF = /^[a-z][a-z0-9+.-]*:|^\/\//i

const isInternalHref = (href: string) => !EXTERNAL_HREF.test(href)

export function usePathname(): string {
  return useLocation({ select: (location) => location.pathname })
}

export function useSearchParams(): URLSearchParams {
  const search = useSearch({ strict: false }) as Record<string, unknown>

  return useMemo(() => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(search)) {
      if (value === undefined || value === null) continue
      if (Array.isArray(value)) {
        for (const entry of value) params.append(key, String(entry))
        continue
      }
      params.set(key, String(value))
    }
    return params
  }, [search])
}

interface Router {
  back: () => void
  forward: () => void
  prefetch: (href: string) => Promise<void>
  push: (href: string) => void
  refresh: () => Promise<void>
  replace: (href: string) => void
}

/**
 * Imperative navigation matching the router surface this app was written
 * this app: `push`, `replace`, `back`, `forward`, `refresh`, and `prefetch`.
 */
export function useRouter(): Router {
  const navigate = useNavigate()
  const router = useTanStackRouter()

  return useMemo(() => {
    const navigateTo = (href: string, replace: boolean) => {
      if (!isInternalHref(href)) {
        if (typeof window !== 'undefined') {
          if (replace) window.location.replace(href)
          else window.location.assign(href)
        }
        return
      }

      void navigate({ to: href as never, replace })
    }

    return {
      back: () => router.history.back(),
      forward: () => router.history.forward(),
      prefetch: async (href: string) => {
        if (!isInternalHref(href)) return
        await router.preloadRoute({ to: href as never })
      },
      push: (href: string) => navigateTo(href, false),
      refresh: async () => {
        await router.invalidate()
      },
      replace: (href: string) => navigateTo(href, true),
    }
  }, [navigate, router])
}
