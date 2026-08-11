'use client'

import Link from 'next/link'
import { Fragment } from 'react'

import { Button } from '@nl/ui/base/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@nl/ui/base/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@nl/ui/base/sheet'
import { Separator } from '@nl/ui/base/separator'

import ActiveNavLink from './ActiveNavLink'
import type { NavItemData, NavbarActionButton } from './index'

interface MobileNavMenuProps {
  actionButton?: NavbarActionButton
  navItems: NavItemData[]
  onOpenChange: (open: boolean) => void
  open: boolean
}

function MobileMenuGroup({ group, pages }: Extract<NavItemData, { type: 'group' }>) {
  return (
    <NavigationMenuItem value={group.toLowerCase()} className="w-full">
      <h3 className="text-base tracking-wider text-muted-foreground uppercase">{group}</h3>
      <ul className="flex w-full flex-col">
        {pages.map((page) => (
          <li key={page.title}>
            <SheetClose asChild>
              <ActiveNavLink className="text-base font-medium" {...page} />
            </SheetClose>
          </li>
        ))}
      </ul>
    </NavigationMenuItem>
  )
}

function MobileMenuItem({ type: _type, ...page }: Extract<NavItemData, { type: 'single' }>) {
  return (
    <NavigationMenuItem value={page.title.toLowerCase()} className="w-full">
      <SheetClose asChild>
        <ActiveNavLink className="text-base font-medium" {...page} />
      </SheetClose>
    </NavigationMenuItem>
  )
}

export default function MobileNavMenu({
  actionButton,
  navItems,
  onOpenChange,
  open,
}: MobileNavMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent id="nifty-mobile-navigation" className="bg-popover">
        <SheetHeader>
          <SheetTitle className="sr-only">Primary navigation</SheetTitle>
          <SheetDescription className="sr-only">Mobile website navigation menu</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-8 pb-4">
          <NavigationMenu
            viewport={false}
            aria-label="Primary navigation"
            className="max-w-none flex-col items-stretch"
          >
            <NavigationMenuList className="flex flex-col gap-4" data-orientation="vertical">
              {navItems.map((item) => (
                <Fragment key={item.type === 'single' ? item.title : item.group}>
                  {item.type === 'single' ? (
                    <MobileMenuItem {...item} />
                  ) : (
                    <MobileMenuGroup {...item} />
                  )}
                </Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {actionButton && (
            <>
              <Separator orientation="horizontal" className="my-6" />
              <Link
                href={actionButton.href}
                target={actionButton.external ? '_blank' : undefined}
                rel={actionButton.external ? 'noreferrer' : undefined}
              >
                <Button variant="outline" className="w-full cursor-pointer text-foreground">
                  Launch {actionButton.title}
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
