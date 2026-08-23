import Link from 'next/link'
import { Fragment } from 'react'

import { buttonVariants } from '@nl/ui/base/button-variants'
import MobileNavigationDisclosure from '@nl/ui/custom/mobile-navigation'

import { NavLinkContent, NAV_LINK_CONTENT_CLASS } from './NavLinkContent'
import type { NavItemData, NavbarActionButton } from './index'

interface MobileNavMenuProps {
  actionButton?: NavbarActionButton
  navItems: NavItemData[]
}

function MobileMenuGroup({ group, pages }: Extract<NavItemData, { type: 'group' }>) {
  return (
    <li className="w-full">
      <h3 className="text-base tracking-wider text-muted-foreground uppercase">{group}</h3>
      <ul className="flex w-full flex-col">
        {pages.map((page) => (
          <li key={page.title}>
            <Link
              className={`${NAV_LINK_CONTENT_CLASS} text-base font-medium`}
              href={page.href}
              prefetch={false}
              target={page.external ? '_blank' : undefined}
              rel={page.external ? 'noreferrer' : undefined}
            >
              <NavLinkContent
                description={page.description}
                external={page.external}
                title={page.title}
              />
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

function MobileMenuItem({ type: _type, ...page }: Extract<NavItemData, { type: 'single' }>) {
  return (
    <li className="w-full">
      <Link
        className={`${NAV_LINK_CONTENT_CLASS} text-base font-medium`}
        href={page.href}
        prefetch={false}
        target={page.external ? '_blank' : undefined}
        rel={page.external ? 'noreferrer' : undefined}
      >
        <NavLinkContent
          description={page.description}
          external={page.external}
          title={page.title}
        />
      </Link>
    </li>
  )
}

export default function MobileNavMenu({ actionButton, navItems }: MobileNavMenuProps) {
  return (
    <MobileNavigationDisclosure
      id="nifty-mobile-navigation"
      label="Toggle navigation"
      className="md:hidden"
      panelClassName="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-popover px-8 pb-4 text-popover-foreground shadow-lg"
    >
      <>
        <nav aria-label="Primary navigation">
          <ul className="flex w-full flex-col gap-4 py-4">
            {navItems.map((item) => (
              <Fragment key={item.type === 'single' ? item.title : item.group}>
                {item.type === 'single' ? (
                  <MobileMenuItem {...item} />
                ) : (
                  <MobileMenuGroup {...item} />
                )}
              </Fragment>
            ))}
          </ul>
        </nav>
        {actionButton && (
          <>
            <div
              aria-hidden="true"
              className="my-6 h-px w-full shrink-0 bg-separator"
              data-slot="mobile-nav-divider"
            />
            <Link
              href={actionButton.href}
              prefetch={false}
              target={actionButton.external ? '_blank' : undefined}
              rel={actionButton.external ? 'noreferrer' : undefined}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full cursor-pointer text-foreground',
              })}
            >
              Launch {actionButton.title}
            </Link>
          </>
        )}
      </>
    </MobileNavigationDisclosure>
  )
}
