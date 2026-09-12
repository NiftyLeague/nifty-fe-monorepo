import { Link as RouterLink } from '@tanstack/react-router'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>

interface LinkProps extends Omit<AnchorProps, 'href'> {
  children?: ReactNode
  href: string
  /** Kept for existing call sites; `false` disables route preloading. */
  prefetch?: boolean
}

const EXTERNAL_HREF = /^[a-z][a-z0-9+.-]*:|^\/\//

const splitHref = (href: string) => {
  const [pathPart, hashPart] = href.split('#', 2)
  const [pathname, query] = (pathPart ?? '').split('?', 2)
  const search = Object.fromEntries(new URLSearchParams(query ?? ''))
  return { hash: hashPart, pathname: pathname || '/', search }
}

/**
 * Anchor that keeps the `href`-based API while delegating internal
 * navigation to the TanStack Router. In-page anchors, external URLs, and
 * `mailto:`/`tel:` style links stay plain anchors.
 */
export default function Link({ children, href, prefetch, ...props }: LinkProps) {
  if (!href || href.startsWith('#') || EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  const { hash, pathname, search } = splitHref(href)

  return (
    <RouterLink
      // `to` is generated per-route and cannot be narrowed here, so the parsed
      // pathname is asserted once at this boundary instead of at every caller.
      to={pathname as never}
      search={search as never}
      hash={hash || undefined}
      preload={prefetch === false ? false : undefined}
      {...props}
    >
      {children}
    </RouterLink>
  )
}
