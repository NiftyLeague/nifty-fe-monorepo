'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@nl/ui/utils'

import { NAV_LINK_CONTENT_CLASS, NavLinkContent } from './NavLinkContent'

export interface ActiveNavLinkProps extends Omit<
  React.ComponentProps<typeof Link>,
  'children' | 'href'
> {
  description?: string
  external?: boolean
  href: string
  title: string
}

export default function ActiveNavLink({
  className,
  description,
  external,
  href,
  title,
  ...props
}: ActiveNavLinkProps) {
  const pathname = usePathname()
  const isActive = href === pathname

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        NAV_LINK_CONTENT_CLASS,
        isActive && 'bg-primary/40 text-primary-foreground',
        className
      )}
      {...props}
    >
      <NavLinkContent description={description} external={external} title={title} />
    </Link>
  )
}
