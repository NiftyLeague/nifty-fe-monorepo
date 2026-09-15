import { Show } from 'solid-js'
import Link from '@/runtime/Link'
import { usePathname } from '@/runtime/navigation'
import { AppNavIcon } from '@/components/AppNavIcon'

import { cx } from '@nl/ui/class-names'
import { useIsDesktopNavigation, useSetDrawerOpen } from '@/contexts/NavigationContext'

// types
import type { LinkTarget, NavItemType } from '@/types'

interface NavItemProps {
  item: NavItemType
  level: number
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = (props: NavItemProps) => {
  const pathname = usePathname()
  const isDesktopNavigation = useIsDesktopNavigation()
  const setDrawerOpen = useSetDrawerOpen()
  const isSelected = () => pathname() === props.item.url

  const itemTarget = (): LinkTarget => (props.item.target ? '_blank' : '_self')

  const itemHandler = () => {
    if (!isDesktopNavigation()) setDrawerOpen(false)
  }

  const inner = (
    <>
      <span class="my-auto" style={{ 'min-width': `${!props.item?.icon ? 18 : 36}px` }}>
        <AppNavIcon name={props.item?.icon ?? 'dot'} size="lg" />
      </span>
      <span class="flex-1">
        <span
          class={cx(
            'text-base text-sidebar-foreground',
            isSelected() ? 'font-bold' : 'font-normal'
          )}
        >
          {props.item.title}
        </span>
        <Show when={props.item.caption}>
          <span class="block text-xs font-medium uppercase text-muted-foreground">
            {props.item.caption}
          </span>
        </Show>
      </span>
    </>
  )

  const linkClass = () =>
    cx(
      'mb-0.5 flex items-start gap-2 rounded-md border border-transparent bg-transparent px-2 py-2 text-left transition-colors hover:border-purple hover:bg-muted',
      isSelected() && 'border-purple bg-muted'
    )
  const style = {
    'padding-left': `${props.level * 24}px`,
    'padding-top': `${props.level > 1 ? 8 : 10}px`,
    'padding-bottom': `${props.level > 1 ? 8 : 10}px`,
  }

  if (props.item?.external) {
    return (
      <a
        href={props.item.url}
        target={itemTarget()}
        rel="noopener noreferrer"
        class={linkClass()}
        style={style}
        onClick={itemHandler}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      href={props.item.url!}
      prefetch={false}
      target={itemTarget()}
      class={linkClass()}
      style={style}
      onClick={itemHandler}
    >
      {inner}
    </Link>
  )
}

export default NavItem
