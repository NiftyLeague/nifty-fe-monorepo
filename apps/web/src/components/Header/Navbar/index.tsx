'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@nl/ui/base/Icon';
import ExternalIcon from '@nl/ui/custom/ExternalIcon';
import { ABOUT_LINKS, DAO_LINKS, PRODUCT_LINKS } from '../constants';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

const NavLink = (props: NavLinkProps) => {
  const { href, children, className = '', external = false } = props;
  return (
    <Link
      href={href}
      className={`text-foreground hover:text-foreground-2 px-1 py-2 text-lg font-bold uppercase ${className}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
    </Link>
  );
};

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

const Dropdown = (props: DropdownProps) => {
  const { title, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-foreground hover:text-foreground-2 px-1 py-2 text-lg font-bold uppercase flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <Icon
          name="chevron-down"
          size="xl"
          strokeWidth={2.5}
          className={`ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-background-2 ring-1 ring-background-2 ring-opacity-5 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all duration-200 z-10`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div className="py-1" role="none">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

const DropdownLink = ({ href, children, external = false }: DropdownLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');

  return (
    <Link
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      className={`block px-4 py-2 rounded-md text-base ${
        isActive
          ? 'bg-background-3 text-foreground-2'
          : 'bg-background-2 hover:bg-background-4 !text-foreground-2 hover:!text-foreground'
      }`}
    >
      {children}
      {external && <ExternalIcon />}
    </Link>
  );
};

const DesktopNavLinks = () => (
  <div className="hidden md:flex items-center space-x-4">
    <Dropdown title="Products">
      {PRODUCT_LINKS.map(link => (
        <DropdownLink key={link.href} href={link.href} external={link.external}>
          {link.name}
        </DropdownLink>
      ))}
    </Dropdown>

    {/* <NavLink href="/roadmap">Roadmap</NavLink> */}

    <Dropdown title="About">
      {ABOUT_LINKS.map(link => (
        <DropdownLink key={link.href} href={link.href} external={link.external}>
          {link.name}
        </DropdownLink>
      ))}
    </Dropdown>

    <Dropdown title="DAO">
      {DAO_LINKS.map(link => (
        <DropdownLink key={link.href} href={link.href} external={link.external}>
          {link.name}
        </DropdownLink>
      ))}
    </Dropdown>

    {/* Launch App Button */}
    <a
      href="https://app.niftyleague.com"
      target="_blank"
      rel="noreferrer"
      className="theme-btn-primary theme-btn-rounded max-w-fit"
    >
      Web3 App
    </a>
  </div>
);

interface NavMenuButtonProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const NavMenuButton = ({ toggleMobileMenu, isMobileMenuOpen }: NavMenuButtonProps) => (
  <div className="flex md:hidden z-100">
    <button
      onClick={toggleMobileMenu}
      className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-foreground-2 hover:bg-background-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-foreground cursor-pointer"
      aria-expanded="false"
    >
      <span className="sr-only">Open Nav Menu</span>
      <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size="xl" aria-hidden="true" />
    </button>
  </div>
);

interface NavbarProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const Navbar = ({ toggleMobileMenu, isMobileMenuOpen }: NavbarProps) => {
  return (
    <div className="w-screen max-w-screen 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/img/logos/NL/white.webp"
            height={50}
            width={52}
            alt="Nifty League Logo"
            className="h-12 w-auto transition-transform hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavLinks />

        {/* Mobile Menu Button */}
        <NavMenuButton toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      </div>
    </div>
  );
};

export default Navbar;
