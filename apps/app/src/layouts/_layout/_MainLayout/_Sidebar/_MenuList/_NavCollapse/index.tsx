import { createEffect, createSignal, For, Show } from 'solid-js'
import { usePathname } from '@/runtime/navigation'
import { AppNavIcon } from '@/components/AppNavIcon'

// project imports
import { cx } from '@nl/ui/class-names'
import { NavGroupProps } from '../_NavGroup'
import NavItem from '../_NavItem'

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

interface NavCollapseProps {
  menu: NavGroupProps['item']
  level: number
}

const NavCollapse = (props: NavCollapseProps) => {
  const [open, setOpen] = createSignal(false)
  const [selected, setSelected] = createSignal<string | null | undefined>(null)

  const handleClick = () => {
    setOpen(!open())
    setSelected(!selected() ? props.menu.id : null)
  }

  const pathname = usePathname()

  createEffect(() => {
    const children = props.menu?.children || []
    const currentPath = pathname()
    children.forEach((item: NavGroupProps['item']) => {
      if (currentPath && currentPath.includes('product-details')) {
        if (item.url && item.url.includes('product-details')) {
          setOpen(true)
        }
      }
      if (item.url === currentPath) {
        setOpen(true)
      }
    })
  })

  return (
    <>
      <button
        type="button"
        class={cx(
          'mb-0.5 flex w-full items-center rounded-md px-2 text-left',
          props.level > 1 ? 'py-2' : 'py-2.5',
          selected() === props.menu.id ? 'bg-muted font-bold' : 'font-normal',
          props.level > 1 ? 'bg-transparent' : 'bg-inherit',
          'pl-(--level-pad)'
        )}
        style={{ '--level-pad': `${props.level * 24}px` }}
        onClick={handleClick}
      >
        <span
          class="my-auto min-w-(--nav-icon-w)"
          style={{ '--nav-icon-w': `${!props.menu.icon ? 18 : 36}px` }}
        >
          <AppNavIcon name={props.menu?.icon ?? 'dot'} size="lg" class="ml-1" />
        </span>
        <span class="flex flex-1 flex-col">
          <span class="text-inherit">{props.menu.title}</span>
          <Show when={props.menu.caption}>
            <span class="block text-xs font-medium uppercase text-muted-foreground">
              {props.menu.caption}
            </span>
          </Show>
        </span>
        <AppNavIcon
          name="chevron-down"
          size="md"
          class={cx('transition-transform', open() && 'rotate-180 transform')}
        />
      </button>
      <Show when={open()}>
        <div class="relative">
          <span aria-hidden class="absolute top-0 left-6.75 h-full w-px bg-separator opacity-100" />
          <div>
            <For each={props.menu?.children || []}>
              {(item) => {
                switch (item.type) {
                  case 'collapse':
                    return <NavCollapse menu={item} level={props.level + 1} />
                  case 'item':
                    return <NavItem item={item} level={props.level + 1} />
                  default:
                    return <h6 class="text-center text-error">Menu Items Error</h6>
                }
              }}
            </For>
          </div>
        </div>
      </Show>
    </>
  )
}

export default NavCollapse
