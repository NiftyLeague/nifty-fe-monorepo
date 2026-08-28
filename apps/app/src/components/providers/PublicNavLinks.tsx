import { NavIcon } from '@nl/ui/custom/nav-icon'
import { Separator } from '@nl/ui/base/separator'

import { PublicItems } from '@/constants/menu-items'

const publicLinks = PublicItems.items.flatMap((item) =>
  item.type === 'group' ? (item.children ?? []) : []
)

function PublicNavIcon({ name }: { name?: string }) {
  const iconName =
    name === 'cat' || name === 'gamepad' || name === 'list-ordered' || name === 'sparkles'
      ? name
      : 'dot'

  return <NavIcon name={iconName} />
}

export default function PublicNavLinks() {
  return (
    <>
      <ul className="m-0 list-none p-0">
        {publicLinks.map((item) => {
          if (item.type !== 'item' || !item.url) return null

          return (
            <li key={item.id || item.url}>
              <a
                href={item.url}
                className="mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left text-sidebar-foreground transition-colors hover:border-purple hover:bg-muted"
              >
                <span className="my-auto min-w-9">
                  <PublicNavIcon name={item.icon} />
                </span>
                <span className="flex-1 text-base">{item.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
      <Separator className="mt-1 mb-5 opacity-60" />
    </>
  )
}
