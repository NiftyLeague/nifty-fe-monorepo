'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollDetection } from '@nl/ui/hooks/useScrollDetection';
import { cn } from '@nl/ui/utils';

import { Button } from '@nl/ui/base/button';
import { ExternalIcon } from '@nl/ui/custom/external-icon';
import { Icon } from '@nl/ui/base/icon';
import { Separator } from '@nl/ui/base/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@nl/ui/base/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@nl/ui/base/navigation-menu';

interface Page {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

interface SingleMenuItemData extends Page {
  type: 'single';
}

interface GroupedMenuItemData {
  type: 'group';
  group: string; // The main title for the group (e.g., "Products")
  pages: Page[]; // The sub-pages within this group
}

export type NavItemData = SingleMenuItemData | GroupedMenuItemData;

interface NavbarProps {
  actionButton?: Omit<Page, 'description'>;
  navItems: NavItemData[];
}

function NavLink({
  description,
  external,
  href,
  title,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & Page) {
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <NavigationMenuLink asChild data-active={isActive} {...props}>
      <Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
        <div className="w-full leading-none">
          {title}
          {external && <ExternalIcon />}
        </div>
        {description && <p className="w-full text-xs text-muted-foreground line-clamp-2 leading-snug">{description}</p>}
      </Link>
    </NavigationMenuLink>
  );
}

/* ==============================|| DESKTOP NAV ||============================== */

function ListItem({ description, external, href, title, ...props }: React.ComponentPropsWithoutRef<'li'> & Page) {
  return (
    <li {...props}>
      <NavLink
        className="text-base font-medium"
        description={description}
        external={external}
        href={href}
        title={title}
      />
    </li>
  );
}

function DropdownMenuItem({ group, pages }: GroupedMenuItemData) {
  return (
    <NavigationMenuItem value={group.toLowerCase()}>
      <NavigationMenuTrigger>{group}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="flex flex-col w-[300px] max-w-max">
          {pages.map(page => (
            <ListItem key={page.title} {...page} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function SingleMenuItem({ type, ...page }: SingleMenuItemData) {
  return (
    <NavigationMenuItem value={page.title.toLowerCase()}>
      <NavLink className={navigationMenuTriggerStyle()} {...page} />
    </NavigationMenuItem>
  );
}

function DesktopNavMenu({
  actionButton,
  navItems,
  ...props
}: React.ComponentProps<typeof NavigationMenuList> & NavbarProps) {
  return (
    <NavigationMenuList className="hidden md:flex" {...props}>
      {navItems.map(item => (
        <Fragment key={item.type === 'single' ? item.title : item.group}>
          {item.type === 'single' && <SingleMenuItem {...item} />}
          {item.type === 'group' && <DropdownMenuItem {...item} />}
        </Fragment>
      ))}
      {actionButton && (
        <a
          href={actionButton.href}
          target={actionButton.external ? '_blank' : undefined}
          rel={actionButton.external ? 'noreferrer' : undefined}
          className="theme-btn-primary theme-btn-rounded max-w-fit ml-3"
        >
          {actionButton.title}
        </a>
      )}
    </NavigationMenuList>
  );
}

/* ==============================|| MOBILE NAV ||=============================== */

function MobileMenuGroup({ group, pages }: GroupedMenuItemData) {
  return (
    <NavigationMenuItem value={group.toLowerCase()} className="w-full">
      <h3 className="text-base text-muted-foreground uppercase tracking-wider">{group}</h3>
      <ul className="flex flex-col w-full">
        {pages.map(page => (
          <ListItem key={page.title} {...page} />
        ))}
      </ul>
    </NavigationMenuItem>
  );
}

function MobileMenuItem({ type, ...page }: SingleMenuItemData) {
  return (
    <NavigationMenuItem value={page.title.toLowerCase()} className="w-full">
      <NavLink className="text-base font-medium" {...page} />
    </NavigationMenuItem>
  );
}

function MobileNavMenu({ actionButton, navItems, ...props }: React.ComponentProps<typeof Sheet> & NavbarProps) {
  return (
    <div className="flex md:hidden">
      <Sheet {...props}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="size-10 cursor-pointer">
            <span className="sr-only">Open Nav Menu</span>
            <Icon name="menu" aria-hidden="true" className="text-foreground size-7" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-popover">
          <SheetHeader>
            <SheetTitle className="hidden">Navigation</SheetTitle>
            <SheetDescription className="hidden">Mobile Website Navigation Menu</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-8 pb-4 overflow-y-auto">
            <NavigationMenuList className="flex flex-col gap-4" data-orientation="vertical">
              {navItems.map(item => (
                <Fragment key={item.type === 'single' ? item.title : item.group}>
                  {item.type === 'single' && <MobileMenuItem {...item} />}
                  {item.type === 'group' && <MobileMenuGroup {...item} />}
                </Fragment>
              ))}
            </NavigationMenuList>
            {actionButton && (
              <>
                <Separator orientation="horizontal" className="px-8" />
                <Link
                  href={actionButton.href}
                  target={actionButton.external ? '_blank' : undefined}
                  rel={actionButton.external ? 'noreferrer' : undefined}
                >
                  <Button variant="outline" className="w-full text-foreground cursor-pointer">
                    Launch {actionButton.title}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ================================|| NAVBAR ||================================= */

export function Navbar({
  actionButton,
  navItems,
  ...props
}: React.ComponentProps<typeof NavigationMenu> & NavbarProps) {
  const { ref: scrollSentinelRef, isIntersecting } = useScrollDetection();
  return (
    <>
      {/*
        This sentinel element is what the IntersectionObserver watches.
        It sits at the very top of the page, so when it scrolls out of view,
        we know the user has scrolled down.
      */}
      <div ref={scrollSentinelRef} className="absolute top-0 inset-x-0 h-px" />

      <NavigationMenu
        viewport={false}
        // value="products"
        className={cn(
          'fixed top-0 inset-x-0 h-20 z-50 transition-all duration-500',
          isIntersecting ? 'bg-transparent backdrop-blur-xs' : 'bg-background/90 backdrop-blur-sm',
        )}
        {...props}
      >
        <div className="w-screen h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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

          <DesktopNavMenu
            actionButton={actionButton}
            navItems={navItems.filter(
              item => item.type === 'group' || (item.type === 'single' && item?.title !== 'Home'),
            )}
          />

          <MobileNavMenu actionButton={actionButton} navItems={navItems} />
        </div>
      </NavigationMenu>
    </>
  );
}

export default Navbar;
