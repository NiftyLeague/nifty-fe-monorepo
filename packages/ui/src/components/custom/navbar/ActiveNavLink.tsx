'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavigationMenuLink } from '@nl/ui/base/navigation-menu'
import { ExternalIcon } from '@nl/ui/custom/external-icon'

export interface ActiveNavLinkProps extends React.ComponentProps<typeof NavigationMenuLink> {
  description?: string
  external?: boolean
  href: string
  title: string
}

export function ActiveNavLink({
  description,
  external,
  href,
  title,
  ...props
}: ActiveNavLinkProps) {
  const pathname = usePathname()

  return (
    <NavigationMenuLink asChild data-active={href === pathname} {...props}>
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        <div className="w-full leading-none">
          {title}
          {external && <ExternalIcon />}
        </div>
        {description && (
          <p className="w-full text-xs leading-snug text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </Link>
    </NavigationMenuLink>
  )
}
