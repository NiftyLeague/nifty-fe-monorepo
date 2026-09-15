import { For, Show } from 'solid-js'
import Link from '@/runtime/Link'
import { usePathname } from '@/runtime/navigation'

import { NavIcon } from '@nl/ui/custom/nav-icon'
import { Separator } from '@nl/ui/base/separator'
import { cx } from '@nl/ui/class-names'

import { PublicItems } from '@/constants/menu-items'

const publicLinks = PublicItems.items.flatMap((item) =>
  item.type === 'group' ? (item.children ?? []) : []
)

function PublicNavIcon(props: { name?: string }) {
  const iconName = () =>
    props.name === 'cat' ||
    props.name === 'earth' ||
    props.name === 'gamepad' ||
    props.name === 'list-ordered' ||
    props.name === 'sparkles'
      ? props.name
      : 'dot'

  return <NavIcon name={iconName()} />
}

export default function PublicNavLinks() {
  const pathname = usePathname()

  return (
    <>
      <ul class="m-0 list-none p-0">
        <For each={publicLinks}>
          {(item) => (
            <Show when={item.type === 'item' && item.url}>
              {(url) => {
                const isSelected = () => pathname() === url()
                return (
                  <li>
                    <Link
                      href={url()}
                      prefetch={false}
                      aria-current={isSelected() ? 'page' : undefined}
                      class={cx(
                        'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left text-sidebar-foreground transition-colors hover:border-purple hover:bg-muted',
                        isSelected() && 'border-purple bg-muted'
                      )}
                    >
                      <span class="my-auto min-w-9">
                        <PublicNavIcon name={item.icon} />
                      </span>
                      <span class={cx('flex-1 text-base', isSelected() && 'font-bold')}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                )
              }}
            </Show>
          )}
        </For>
      </ul>
      <Separator class="mt-1 mb-5 opacity-60" />
    </>
  )
}
