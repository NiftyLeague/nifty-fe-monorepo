'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'

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
        'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 flex flex-col gap-1 rounded-sm px-3 py-2 outline-none transition-colors',
        isActive && 'bg-primary/40 text-primary-foreground',
        className
      )}
      {...props}
    >
      <span className="w-full leading-none">
        {title}
        {external && <ExternalIcon />}
      </span>
      {description && (
        <span className="w-full text-xs leading-snug text-muted-foreground line-clamp-2">
          {description}
        </span>
      )}
    </Link>
  )
}
