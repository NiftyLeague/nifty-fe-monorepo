import Link from '@/runtime/Link'
import { usePathname } from '@/runtime/navigation'

import { NavIcon } from '@nl/ui/custom/nav-icon'
import { Separator } from '@nl/ui/base/separator'
import { cx } from '@nl/ui/class-names'

import { PublicItems } from '@/constants/menu-items'

const publicLinks = PublicItems.items.flatMap((item) =>
  item.type === 'group' ? (item.children ?? []) : []
)

function PublicNavIcon({ name }: { name?: string }) {
  const iconName =
    name === 'cat' ||
    name === 'earth' ||
    name === 'gamepad' ||
    name === 'list-ordered' ||
    name === 'sparkles'
      ? name
      : 'dot'

  return <NavIcon name={iconName} />
}

export default function PublicNavLinks() {
  const pathname = usePathname()

  return (
    <>
      <ul className="m-0 list-none p-0">
        {publicLinks.map((item) => {
          if (item.type !== 'item' || !item.url) return null
          const isSelected = pathname === item.url

          return (
            <li key={item.id || item.url}>
              <Link
                href={item.url}
                prefetch={false}
                aria-current={isSelected ? 'page' : undefined}
                className={cx(
                  'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left text-sidebar-foreground transition-colors hover:border-purple hover:bg-muted',
                  isSelected && 'border-purple bg-muted'
                )}
              >
                <span className="my-auto min-w-9">
                  <PublicNavIcon name={item.icon} />
                </span>
                <span className={cx('flex-1 text-base', isSelected && 'font-bold')}>
                  {item.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Separator className="mt-1 mb-5 opacity-60" />
    </>
  )
}
