'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon } from '@nl/ui/base/icon'
import { cn } from '@nl/ui/utils'

import { PublicItems } from '@/constants/menu-items'

interface PublicNavLinksProps {
  onNavigate?: () => void
}

const publicLinks = PublicItems.items.flatMap((item) =>
  item.type === 'group' ? (item.children ?? []) : []
)

export default function PublicNavLinks({ onNavigate }: PublicNavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      <ul className="m-0 list-none p-0">
        {publicLinks.map((item) => {
          if (item.type !== 'item' || !item.url) return null

          const isSelected = pathname === item.url
          const linkClass = cn(
            'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left text-sidebar-foreground transition-colors hover:border-purple hover:bg-muted',
            isSelected && 'border-purple bg-muted'
          )

          return (
            <li key={item.id || item.url}>
              <Link
                href={item.url}
                className={linkClass}
                aria-current={isSelected ? 'page' : undefined}
                onClick={onNavigate}
              >
                <span className="my-auto min-w-9">
                  <Icon name={item.icon ?? 'dot'} size="lg" />
                </span>
                <span className={cn('flex-1 text-base', isSelected ? 'font-bold' : 'font-normal')}>
                  {item.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <hr className="mt-1 mb-5 opacity-60" />
    </>
  )
}
