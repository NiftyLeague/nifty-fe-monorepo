'use client'

import Link from 'next/link'

import { AppNavIcon } from '@/components/AppNavIcon'
import type { AppNavIconName } from '@/components/AppNavIcon'
import { Separator } from '@nl/ui/base/separator'
import { cn } from '@nl/ui/utils'

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

const Breadcrumbs = ({
  card,
  divider,
  icon,
  icons,
  navigation,
  pathname = '',
  rightAlign,
  separator,
  title,
  titleBottom,
  ...others
}: BreadCrumbsProps) => {
  const iconStyle = {
    marginRight: '6px',
    marginTop: '-2px',
    width: '16px',
    height: '16px',
  }

  const { main, item } = findBreadcrumb(navigation, pathname)

  // item separator
  const separatorIcon = <AppNavIcon name={separator || 'tally-1'} size="sm" />

  let mainContent
  let itemContent
  let breadcrumbContent: React.ReactElement = <span />

  // collapse item
  if (main && main.type === 'collapse') {
    mainContent = (
      <Link
        key="main"
        href="#"
        className="flex items-center text-sm font-medium text-foreground no-underline"
      >
        {icons && <AppNavIcon name={main.icon ?? 'list-tree'} style={iconStyle} />}
        {main.title}
      </Link>
    )
  }

  // items
  if (item && item.type === 'item') {
    itemContent = (
      <span
        key="item"
        className="flex items-center text-sm font-medium text-muted-foreground"
        style={{ textDecoration: 'none' }}
      >
        {icons && <AppNavIcon name={item.icon ?? 'list-tree'} style={iconStyle} />}
        {item.title}
      </span>
    )

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div
          className={cn(
            'mb-6',
            card === false ? 'border-none bg-transparent' : 'border bg-background'
          )}
          style={{ marginBottom: card === false ? 0 : gridSpacing * 8 }}
          {...others}
        >
          <div className={cn('p-2', card === false ? 'pl-0' : 'pl-2')}>
            <div
              className={cn(
                rightAlign
                  ? 'flex flex-row items-center justify-between'
                  : 'flex flex-col items-start justify-start'
              )}
            >
              {title && !titleBottom && (
                <h3 className="font-medium text-foreground" style={{ fontWeight: 500 }}>
                  {item.title}
                </h3>
              )}
              <nav aria-label="breadcrumb" className="flex items-center">
                {[
                  <Link
                    key="home"
                    href="/"
                    className="flex items-center text-sm font-medium no-underline"
                    style={{ color: 'inherit' }}
                  >
                    {icons && <AppNavIcon name="house" color="blue" fill="dim" style={iconStyle} />}
                    {icon && (
                      <AppNavIcon
                        name="house"
                        color="blue"
                        style={{ ...iconStyle, marginRight: 0 }}
                      />
                    )}
                    {!icon && 'Dashboard'}
                  </Link>,
                  mainContent,
                  itemContent,
                ]
                  .filter(Boolean)
                  .flatMap((crumb, index, all) =>
                    index === all.length - 1
                      ? [crumb]
                      : [
                          crumb,
                          <span key={`sep-${index}`} className="mx-1.25 flex w-4 items-center">
                            {separatorIcon}
                          </span>,
                        ]
                  )}
              </nav>
              {title && titleBottom && (
                <h3 className="font-medium text-foreground" style={{ fontWeight: 500 }}>
                  {item.title}
                </h3>
              )}
            </div>
          </div>
          {card === false && divider !== false && (
            <Separator
              className="mb-6 bg-[var(--color-purple)] opacity-60"
              style={{ marginBottom: gridSpacing * 8 }}
            />
          )}
        </div>
      )
    }
  }

  return breadcrumbContent
}

export default Breadcrumbs
