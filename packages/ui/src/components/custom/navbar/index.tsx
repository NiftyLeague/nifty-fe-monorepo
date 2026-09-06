import { Fragment } from 'react'

import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'

import MobileNavMenu from './MobileNavMenu'
import NavigationLink from './NavigationLink'
import { NavbarScrollFrame } from './NavbarScrollFrame'
import { NAV_LINK_CONTENT_CLASS } from './NavLinkContent'

export interface NavPage {
  title: string
  href: string
  description?: string
  external?: boolean
}

interface SingleMenuItemData extends NavPage {
  type: 'single'
}

interface GroupedMenuItemData {
  type: 'group'
  group: string
  pages: NavPage[]
}

export type NavItemData = SingleMenuItemData | GroupedMenuItemData
export type NavbarActionButton = Omit<NavPage, 'description'>

export interface NavbarProps {
  actionButton?: NavbarActionButton
  navItems: NavItemData[]
  className?: string
}

const DESKTOP_LINK_CLASS =
  'inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-lg font-bold uppercase outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'

function DesktopNavLink({
  className,
  description,
  external,
  href,
  title,
}: NavPage & { className?: string }) {
  return (
    <NavigationLink
      className={cx(NAV_LINK_CONTENT_CLASS, className)}
      description={description}
      external={external}
      href={href}
      title={title}
    />
  )
}

function ListItem({ page }: { page: NavPage }) {
  return (
    <li>
      <DesktopNavLink
        className="text-base font-medium"
        description={page.description}
        external={page.external}
        href={page.href}
        title={page.title}
      />
    </li>
  )
}

function DropdownMenuItem({ group, pages }: GroupedMenuItemData) {
  return (
    <li>
      <details className="group relative">
        <summary
          className={cx(
            DESKTOP_LINK_CLASS,
            'cursor-pointer list-none [&::-webkit-details-marker]:hidden'
          )}
        >
          {group}
          <span
            aria-hidden="true"
            className="ml-1 inline-block text-sm transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow">
          <ul className="flex w-[300px] max-w-max flex-col p-2">
            {pages.map((page) => (
              <ListItem key={page.title} page={page} />
            ))}
          </ul>
        </div>
      </details>
    </li>
  )
}

function SingleMenuItem({ type: _type, ...page }: SingleMenuItemData) {
  return (
    <li>
      <DesktopNavLink className={DESKTOP_LINK_CLASS} {...page} />
    </li>
  )
}

function DesktopNavMenu({ actionButton, navItems }: NavbarProps) {
  return (
    <nav aria-label="Primary navigation" className="hidden md:block">
      <ul className="flex list-none items-center justify-center gap-1">
        {navItems.map((item) => (
          <Fragment key={item.type === 'single' ? item.title : item.group}>
            {item.type === 'single' ? <SingleMenuItem {...item} /> : <DropdownMenuItem {...item} />}
          </Fragment>
        ))}
        {actionButton && (
          <li>
            <a
              href={actionButton.href}
              target={actionButton.external ? '_blank' : undefined}
              rel={actionButton.external ? 'noreferrer' : undefined}
              className="theme-btn-primary theme-btn-rounded ml-3 max-w-fit"
            >
              {actionButton.title}
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

export function Navbar({ actionButton, navItems, className }: NavbarProps) {
  const desktopNavItems = navItems.filter(
    (item) => item.type === 'group' || (item.type === 'single' && item.title !== 'Home')
  )
  return (
    <NavbarScrollFrame className={className}>
      <div className="flex h-full w-screen items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex-shrink-0">
          <OptimizedImage
            src="/img/logos/NL/white.webp"
            height={50}
            width={52}
            alt="Home"
            loading="eager"
            fetchPriority="low"
            className="h-12 w-auto transition-transform hover:scale-105"
          />
        </a>

        <DesktopNavMenu actionButton={actionButton} navItems={desktopNavItems} />
        <MobileNavMenu actionButton={actionButton} navItems={navItems} />
      </div>
    </NavbarScrollFrame>
  )
}

export default Navbar
