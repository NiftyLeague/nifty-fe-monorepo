'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@nl/ui/utils'

interface PublicActiveNavLinkProps extends Omit<LinkProps, 'href'> {
  children: ReactNode
  href: string
  className?: string
}

export default function PublicActiveNavLink({
  children,
  className,
  href,
  ...props
}: PublicActiveNavLinkProps) {
  const pathname = usePathname()
  const isSelected = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left text-sidebar-foreground transition-colors hover:border-purple hover:bg-muted',
        isSelected && 'border-purple bg-muted font-bold',
        className
      )}
      aria-current={isSelected ? 'page' : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}
