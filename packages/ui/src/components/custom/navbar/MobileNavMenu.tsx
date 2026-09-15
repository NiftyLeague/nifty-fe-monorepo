import { For, Show } from 'solid-js'

import { buttonVariants } from '@nl/ui/base/button-variants'
import MobileNavigationDisclosure from '@nl/ui/custom/mobile-navigation'

import NavigationLink from './NavigationLink'
import { NAV_LINK_CONTENT_CLASS } from './NavLinkContent'
import type { NavItemData, NavbarActionButton } from './index'

interface MobileNavMenuProps {
  actionButton?: NavbarActionButton
  navItems: NavItemData[]
  // Reserved for controlled open state. The menu currently mounts
  // conditionally via MobileNavigationDisclosure and ignores these.
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function MobileMenuGroup(props: Extract<NavItemData, { type: 'group' }>) {
  return (
    <li class="w-full">
      <h3 class="text-base tracking-wider text-muted-foreground uppercase">{props.group}</h3>
      <ul class="flex w-full flex-col">
        <For each={props.pages}>
          {(page) => (
            <li>
              <NavigationLink
                class={`${NAV_LINK_CONTENT_CLASS} text-base font-medium`}
                description={page.description}
                external={page.external}
                href={page.href}
                title={page.title}
              />
            </li>
          )}
        </For>
      </ul>
    </li>
  )
}

function MobileMenuItem(props: Extract<NavItemData, { type: 'single' }>) {
  return (
    <li class="w-full">
      <NavigationLink
        class={`${NAV_LINK_CONTENT_CLASS} text-base font-medium`}
        description={props.description}
        external={props.external}
        href={props.href}
        title={props.title}
      />
    </li>
  )
}

export default function MobileNavMenu(props: MobileNavMenuProps) {
  return (
    <MobileNavigationDisclosure
      id="nifty-mobile-navigation"
      label="Toggle navigation"
      className="md:hidden"
      panelClassName="fixed inset-x-0 top-20 bottom-0 z-40 isolate overflow-y-auto overscroll-contain touch-pan-y bg-popover px-8 pb-4 text-popover-foreground shadow-lg"
    >
      <nav aria-label="Primary navigation">
        <ul class="flex w-full flex-col gap-4 py-4">
          <For each={props.navItems}>
            {(item) =>
              item.type === 'single' ? <MobileMenuItem {...item} /> : <MobileMenuGroup {...item} />
            }
          </For>
        </ul>
      </nav>
      <Show when={props.actionButton}>
        {(button) => (
          <>
            <div
              aria-hidden="true"
              class="my-6 h-px w-full shrink-0 bg-separator"
              data-slot="mobile-nav-divider"
            />
            <a
              href={button().href}
              target={button().external ? '_blank' : undefined}
              rel={button().external ? 'noreferrer' : undefined}
              class={buttonVariants({
                variant: 'outline',
                className: 'w-full cursor-pointer text-foreground',
              })}
            >
              Launch {button().title}
            </a>
          </>
        )}
      </Show>
    </MobileNavigationDisclosure>
  )
}
