import { Link as RouterLink } from '@tanstack/solid-router'
import { splitProps, type JSX } from 'solid-js'

type AnchorProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement>

interface LinkProps extends Omit<AnchorProps, 'href'> {
  children?: JSX.Element
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
export default function Link(props: LinkProps) {
  const [local, rest] = splitProps(props, ['children', 'href', 'prefetch'])
  const href = () => local.href ?? ''

  const isPlainAnchor = () => !local.href || href().startsWith('#') || EXTERNAL_HREF.test(href())

  const parts = () => splitHref(href())

  return (
    <>
      {isPlainAnchor() ? (
        <a href={local.href} {...rest}>
          {local.children}
        </a>
      ) : (
        <RouterLink
          // `to` is generated per-route and cannot be narrowed here, so the
          // parsed pathname is asserted once at this boundary instead of at
          // every caller.
          to={parts().pathname as never}
          search={parts().search as never}
          hash={parts().hash || undefined}
          preload={local.prefetch === false ? false : undefined}
          {...rest}
        >
          {local.children}
        </RouterLink>
      )}
    </>
  )
}
