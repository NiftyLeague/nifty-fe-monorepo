import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'

import ActiveNavLink from './ActiveNavLink'
import MobileNavTrigger from './MobileNavTrigger'

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

function ListItem({ page }: { page: NavPage }) {
  return (
    <li>
      <ActiveNavLink
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
          className={cn(
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
      <ActiveNavLink className={DESKTOP_LINK_CLASS} {...page} />
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
            <Link
              href={actionButton.href}
              target={actionButton.external ? '_blank' : undefined}
              rel={actionButton.external ? 'noreferrer' : undefined}
              className="theme-btn-primary theme-btn-rounded ml-3 max-w-fit"
            >
              {actionButton.title}
            </Link>
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
    <header
      className={cn(
        'navbar-scroll-frame fixed inset-x-0 top-0 z-50 h-20 bg-background/90 backdrop-blur-sm motion-safe:transition-all motion-safe:duration-500',
        className
      )}
    >
      <div className="flex h-full w-screen items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/img/logos/NL/white.webp"
            height={50}
            width={52}
            alt="Home"
            className="h-12 w-auto transition-transform hover:scale-105"
            loading="lazy"
          />
        </Link>

        <DesktopNavMenu actionButton={actionButton} navItems={desktopNavItems} />
        <MobileNavTrigger actionButton={actionButton} navItems={navItems} />
      </div>
    </header>
  )
}

export default Navbar
