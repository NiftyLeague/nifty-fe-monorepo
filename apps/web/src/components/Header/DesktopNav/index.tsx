'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu as MenuIcon, Close as CloseIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { ABOUT_LINKS, DAO_LINKS, PRODUCT_LINKS } from '../constants';

// Define ExternalIcon at the top level
const ExternalIcon = (props: { className?: string }) => (
  <OpenInNewIcon className={`h-4 w-4 mb-1 ${props.className || ''}`} sx={{ fontSize: '0.875rem' }} />
);

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
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
      {external && <ExternalIcon className="ml-1" />}
    </Link>
  );
};

interface MobileMenuButtonProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const MobileMenuButton = ({ toggleMobileMenu, isMobileMenuOpen }: MobileMenuButtonProps) => (
  <div className="flex md:hidden">
    <button
      onClick={toggleMobileMenu}
      className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-foreground-2 hover:bg-background-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-foreground"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      {isMobileMenuOpen ? (
        <CloseIcon className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
      )}
    </button>
  </div>
);

interface DesktopNavProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const DesktopNav = ({ toggleMobileMenu, isMobileMenuOpen }: DesktopNavProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <MobileMenuButton toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      </div>
    </div>
  );
};

export default DesktopNav;
