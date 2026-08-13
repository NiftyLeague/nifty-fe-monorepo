import Link from 'next/link'
import { Fragment } from 'react'

import { Button } from '@nl/ui/base/button'
import { Separator } from '@nl/ui/base/separator'

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
    <details className="group relative md:hidden">
      <summary
        aria-controls="nifty-mobile-navigation"
        aria-label="Toggle navigation"
        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" className="flex size-6 flex-col justify-center gap-1.5">
          <span className="h-0.5 w-full rounded-full bg-current transition-transform group-open:translate-y-2 group-open:rotate-45" />
          <span className="h-0.5 w-full rounded-full bg-current transition-opacity group-open:opacity-0" />
          <span className="h-0.5 w-full rounded-full bg-current transition-transform group-open:-translate-y-2 group-open:-rotate-45" />
        </span>
        <span className="sr-only">Toggle navigation</span>
      </summary>
      <div
        id="nifty-mobile-navigation"
        className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-popover px-8 pb-4 text-popover-foreground shadow-lg"
      >
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
            <Separator orientation="horizontal" className="my-6" />
            <Button asChild variant="outline" className="w-full cursor-pointer text-foreground">
              <Link
                href={actionButton.href}
                target={actionButton.external ? '_blank' : undefined}
                rel={actionButton.external ? 'noreferrer' : undefined}
              >
                Launch {actionButton.title}
              </Link>
            </Button>
          </>
        )}
      </div>
    </details>
  )
}
