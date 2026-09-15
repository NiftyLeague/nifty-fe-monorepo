'use client'

import { Show } from 'solid-js'
import Link from '@/runtime/Link'

import { AppNavIcon } from '@/components/AppNavIcon'
import type { AppNavIconName } from '@/components/AppNavIcon'
import { Separator } from '@nl/ui/base/separator'
import { cx } from '@nl/ui/class-names'

// project imports
import { BASE_PATH } from '@/config'
import type { NavItemType, NavItemTypeObject } from '@/types'

const gridSpacing = 3 // 24px

interface BreadCrumbsProps {
  card?: boolean
  divider?: boolean
  icon?: boolean
  icons?: boolean
  navigation?: NavItemTypeObject
  pathname?: string
  rightAlign?: boolean
  separator?: AppNavIconName
  title?: boolean
  titleBottom?: boolean
}

const findBreadcrumb = (navigation: NavItemTypeObject | undefined, pathname: string) => {
  let main: NavItemType | undefined
  let item: NavItemType | undefined

  const visit = (menu: NavItemType, parentMenu: NavItemType): boolean => {
    for (const child of menu.children ?? []) {
      if (child.type === 'collapse' && visit(child, child)) return true

      if (child.type === 'item' && pathname === BASE_PATH + child.url) {
        main = parentMenu
        item = child
        return true
      }
    }

    return false
  }

  for (const menu of navigation?.items ?? []) {
    if (menu.type === 'group' && visit(menu, menu)) break
  }

  return { main, item }
}

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = (props: BreadCrumbsProps) => {
  const pathname = () => props.pathname ?? ''
  const iconStyle = {
    'margin-right': '6px',
    'margin-top': '-2px',
    width: '16px',
    height: '16px',
  }

  const crumbs = () => findBreadcrumb(props.navigation, pathname())

  // item separator
  const separatorIcon = () => <AppNavIcon name={props.separator || 'tally-1'} size="sm" />

  return (
    <Show
      when={(() => {
        const { item } = crumbs()
        return item && item.type === 'item' && item.breadcrumbs !== false ? item : null
      })()}
      keyed
    >
      {(item) => {
        const main = crumbs().main
        return (
          <div
            class={cx(
              'mb-6',
              props.card === false ? 'border-none bg-transparent' : 'border bg-background'
            )}
            style={{ 'margin-bottom': props.card === false ? '0' : `${gridSpacing * 8}px` }}
          >
            <div class={cx(props.card === false ? 'py-2 pr-2 pl-0' : 'p-2')}>
              <div
                class={cx(
                  props.rightAlign
                    ? 'flex flex-row items-center justify-between'
                    : 'flex flex-col items-start justify-start'
                )}
              >
                <Show when={props.title && !props.titleBottom}>
                  <h3 class="font-medium text-foreground" style={{ 'font-weight': '500' }}>
                    {item.title}
                  </h3>
                </Show>
                <nav aria-label="breadcrumb" class="flex items-center">
                  <Link
                    href="/"
                    class="flex items-center text-sm font-medium no-underline"
                    style={{ color: 'inherit' }}
                  >
                    <Show when={props.icons}>
                      <AppNavIcon name="house" color="blue" fill="dim" style={iconStyle} />
                    </Show>
                    <Show when={props.icon}>
                      <AppNavIcon
                        name="house"
                        color="blue"
                        style={{ ...iconStyle, 'margin-right': '0' }}
                      />
                    </Show>
                    <Show when={!props.icon}>Dashboard</Show>
                  </Link>
                  <Show when={main && main.type === 'collapse' ? main : null} keyed>
                    {(mainItem) => (
                      <>
                        <span class="mx-1.25 flex w-4 items-center">{separatorIcon()}</span>
                        <Link
                          href="#"
                          class="flex items-center text-sm font-medium text-foreground no-underline"
                        >
                          <Show when={props.icons}>
                            <AppNavIcon name={mainItem.icon ?? 'list-tree'} style={iconStyle} />
                          </Show>
                          {mainItem.title}
                        </Link>
                      </>
                    )}
                  </Show>
                  <span class="mx-1.25 flex w-4 items-center">{separatorIcon()}</span>
                  <span
                    class="flex items-center text-sm font-medium text-muted-foreground"
                    style={{ 'text-decoration': 'none' }}
                  >
                    <Show when={props.icons}>
                      <AppNavIcon name={item.icon ?? 'list-tree'} style={iconStyle} />
                    </Show>
                    {item.title}
                  </span>
                </nav>
                <Show when={props.title && props.titleBottom}>
                  <h3 class="font-medium text-foreground" style={{ 'font-weight': '500' }}>
                    {item.title}
                  </h3>
                </Show>
              </div>
            </div>
            <Show when={props.card === false && props.divider !== false}>
              <Separator
                class="mb-6 bg-[var(--color-purple)] opacity-60"
                style={{ 'margin-bottom': `${gridSpacing * 8}px` }}
              />
            </Show>
          </div>
        )
      }}
    </Show>
  )
}

export default Breadcrumbs
