'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ExternalIcon from '@nl/ui/custom/ExternalIcon';
import { ABOUT_LINKS, DAO_LINKS, MOBILE_GENERAL_LINKS, PRODUCT_LINKS } from '../constants';

interface NavMenuLinkProps {
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  href: string;
  toggleMobileMenu: () => void;
}

const NavMenuLink = ({ children, href, toggleMobileMenu, external = false }: NavMenuLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');
  return (
    <Link
      key={href}
      href={href}
      onClick={toggleMobileMenu}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-none hover:bg-accent text-foreground hover:text-accent-foreground'
      }`}
    >
      {children}
      {external && <ExternalIcon />}
    </Link>
  );
};

const NavMenuGroup = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="pt-3 pb-2">
      <h3 className="px-3 text-base text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  );
};

interface NavMenuProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const NavMenu = ({ toggleMobileMenu, isMobileMenuOpen }: NavMenuProps) => {
  return (
    <div
      className={`fixed inset-0 w-screen max-w-screen h-screen overflow-y-auto z-50 bg-background transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
      }`}
      onClick={toggleMobileMenu}
    >
      <div className="px-4 pt-5 pb-6 space-y-1 max-w-md mx-auto">
        {/* General Links */}
        {MOBILE_GENERAL_LINKS.map(link => (
          <NavMenuLink key={link.href} href={link.href} toggleMobileMenu={toggleMobileMenu} external={link.external}>
            {link.name}
          </NavMenuLink>
        ))}

        {/* Products Section */}
        <NavMenuGroup title="Products">
          {PRODUCT_LINKS.map(link => (
            <NavMenuLink key={link.href} href={link.href} toggleMobileMenu={toggleMobileMenu} external={link.external}>
              {link.name}
            </NavMenuLink>
          ))}
        </NavMenuGroup>

        {/* About Section */}
        <NavMenuGroup title="About">
          {ABOUT_LINKS.map(link => (
            <NavMenuLink key={link.href} href={link.href} toggleMobileMenu={toggleMobileMenu} external={link.external}>
              {link.name}
            </NavMenuLink>
          ))}
        </NavMenuGroup>

        {/* DAO Section */}
        <NavMenuGroup title="DAO">
          {DAO_LINKS.map(link => (
            <NavMenuLink key={link.href} href={link.href} toggleMobileMenu={toggleMobileMenu} external={link.external}>
              {link.name}
            </NavMenuLink>
          ))}
        </NavMenuGroup>

        {/* Launch App Button */}
        <div className="pt-4 pb-3 border-t border-divider">
          <a
            href="https://app.niftyleague.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center px-4 py-2 border border-foreground rounded-md shadow-sm text-base font-medium text-foreground bg-background hover:bg-accent"
            onClick={toggleMobileMenu}
          >
            Launch Web3 App
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
