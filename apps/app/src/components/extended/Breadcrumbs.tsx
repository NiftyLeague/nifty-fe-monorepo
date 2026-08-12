'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

import { AppNavIcon } from '@/components/AppNavIcon'
import type { AppNavIconName } from '@/components/AppNavIcon'
import { cn } from '@nl/ui/utils'

// project imports
import { BASE_PATH } from '@/config'
import type { NavItemType, NavItemTypeObject } from '@/types'

const gridSpacing = 3 // 24px

const linkSX = {
  display: 'flex',
  color: 'var(--color-background)',
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center',
}

interface BreadCrumbSxProps extends React.CSSProperties {
  mb?: string
  bgcolor?: string
}

interface BreadCrumbsProps {
  card?: boolean
  divider?: boolean
  icon?: boolean
  icons?: boolean
  maxItems?: number
  navigation?: NavItemTypeObject
  rightAlign?: boolean
  separator?: AppNavIconName
  title?: boolean
  titleBottom?: boolean
  sx?: BreadCrumbSxProps
}

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
  card,
  divider,
  icon,
  icons,
  maxItems,
  navigation,
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

  const [main, setMain] = useState<NavItemType | undefined>()
  const [item, setItem] = useState<NavItemType>()

  const getCollapse = useCallback(
    (menu: NavItemType) => {
      const recurse = (m: NavItemType, parentMenu: NavItemType) => {
        if (m.children) {
          m.children.forEach((collapse) => {
            if (collapse.type === 'collapse') {
              recurse(collapse, collapse)
            } else if (collapse.type === 'item') {
              if (document.location.pathname === BASE_PATH + collapse.url) {
                setMain(parentMenu)
                setItem(collapse)
              }
            }
          })
        }
      }
      recurse(menu, menu)
    },
    [setMain, setItem]
  )

  useEffect(() => {
    navigation?.items?.forEach((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu as { children: NavItemType[]; type?: string })
      }
    })
  }, [navigation, getCollapse])

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
            <hr
              className="mb-6 opacity-60"
              style={{ borderColor: 'var(--color-purple)', marginBottom: gridSpacing * 8 }}
            />
          )}
        </div>
      )
    }
  }

  return breadcrumbContent
}

export default Breadcrumbs
