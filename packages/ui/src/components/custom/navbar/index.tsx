import { For, Show } from 'solid-js'

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

function DesktopNavLink(props: NavPage & { className?: string; descriptionClassName?: string }) {
  return (
    <NavigationLink
      class={cx(NAV_LINK_CONTENT_CLASS, props.className)}
      description={props.description}
      descriptionClassName={props.descriptionClassName}
      external={props.external}
      href={props.href}
      title={props.title}
    />
  )
}

function ListItem(props: { page: NavPage }) {
  return (
    <li>
      <DesktopNavLink
        className="text-base font-medium"
        description={props.page.description}
        descriptionClassName="whitespace-nowrap"
        external={props.page.external}
        href={props.page.href}
        title={props.page.title}
      />
    </li>
  )
}

function DropdownMenuItem(props: GroupedMenuItemData) {
  return (
    <li>
      <details class="group relative">
        <summary
          class={cx(
            DESKTOP_LINK_CLASS,
            'cursor-pointer list-none [&::-webkit-details-marker]:hidden'
          )}
        >
          {props.group}
          <span
            aria-hidden="true"
            class="ml-1 inline-block text-sm transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div class="absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow">
          <ul class="flex w-max min-w-75 flex-col p-2">
            <For each={props.pages}>{(page) => <ListItem page={page} />}</For>
          </ul>
        </div>
      </details>
    </li>
  )
}

function SingleMenuItem(props: SingleMenuItemData) {
  return (
    <li>
      <DesktopNavLink
        className={DESKTOP_LINK_CLASS}
        title={props.title}
        href={props.href}
        description={props.description}
        external={props.external}
      />
    </li>
  )
}

function DesktopNavMenu(props: NavbarProps) {
  return (
    <nav aria-label="Primary navigation" class="hidden md:block">
      <ul class="flex list-none items-center justify-center gap-1">
        <For each={props.navItems}>
          {(item) =>
            item.type === 'single' ? <SingleMenuItem {...item} /> : <DropdownMenuItem {...item} />
          }
        </For>
        <Show when={props.actionButton}>
          {(button) => (
            <li>
              <a
                href={button().href}
                target={button().external ? '_blank' : undefined}
                rel={button().external ? 'noreferrer' : undefined}
                class="theme-btn-primary theme-btn-rounded ml-3 max-w-fit"
              >
                {button().title}
              </a>
            </li>
          )}
        </Show>
      </ul>
    </nav>
  )
}

export function Navbar(props: NavbarProps) {
  const desktopNavItems = props.navItems.filter(
    (item) => item.type === 'group' || (item.type === 'single' && item.title !== 'Home')
  )
  return (
    <NavbarScrollFrame className={props.className}>
      <div class="flex h-full w-screen items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" class="flex-shrink-0">
          <OptimizedImage
            src="/img/logos/NL/white.webp"
            height={50}
            width={52}
            alt="Home"
            loading="eager"
            fetchpriority="low"
            class="h-12 w-auto transition-transform hover:scale-105"
          />
        </a>

        <DesktopNavMenu actionButton={props.actionButton} navItems={desktopNavItems} />
        <MobileNavMenu actionButton={props.actionButton} navItems={props.navItems} />
      </div>
    </NavbarScrollFrame>
  )
}

export default Navbar
