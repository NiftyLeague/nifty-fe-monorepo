import type { ComponentProps } from 'react'

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string | { pathname?: string; query?: Record<string, string | number>; hash?: string }
  prefetch?: boolean | null
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  locale?: string | false
  legacyBehavior?: boolean
  passHref?: boolean
}

/** App-local native navigation; other workspaces continue to use Next's Link. */
export default function Link({
  href,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  locale: _locale,
  legacyBehavior: _legacy,
  passHref: _passHref,
  ...props
}: LinkProps) {
  let destination: string
  if (typeof href === 'string') destination = href
  else {
    const query = new URLSearchParams(
      Object.entries(href.query ?? {}).map(([key, value]) => [key, String(value)])
    ).toString()
    destination = `${href.pathname ?? '/'}${query ? `?${query}` : ''}${href.hash ? `#${href.hash.replace(/^#/, '')}` : ''}`
  }
  return <a {...props} href={destination} />
}
