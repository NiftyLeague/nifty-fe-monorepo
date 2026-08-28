import Link from 'next/link'

import { NavLinkContent, NAV_LINK_CONTENT_CLASS } from './NavLinkContent'

interface NavigationLinkProps {
  className?: string
  description?: string
  external?: boolean
  href: string
  title: string
}

/** Uses client-side navigation only for routes owned by the current app. */
function NavigationLink({ className, description, external, href, title }: NavigationLinkProps) {
  const content = <NavLinkContent description={description} external={external} title={title} />
  const resolvedClassName = className ?? NAV_LINK_CONTENT_CLASS

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={resolvedClassName}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} prefetch={false} className={resolvedClassName}>
      {content}
    </Link>
  )
}

export default NavigationLink
