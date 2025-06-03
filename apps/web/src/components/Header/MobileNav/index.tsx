'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { ABOUT_LINKS, DAO_LINKS, MOBILE_GENERAL_LINKS, PRODUCT_LINKS } from '../constants';

// Define ExternalIcon at the top level
const ExternalIcon = (props: { className?: string }) => (
  <OpenInNewIcon className={`h-4 w-4 mb-1 ${props.className || ''}`} sx={{ fontSize: '0.875rem' }} />
);

interface MobileNavLinkProps {
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  href: string;
  toggleMobileMenu: () => void;
}

const MobileNavLink = ({ children, href, toggleMobileMenu, external = false }: MobileNavLinkProps) => {
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
        isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
      {external && <ExternalIcon className="ml-1.5 h-4 w-4" />}
    </Link>
  );
};

const MobileNavGroup = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="pt-3 pb-2">
      <h3 className="px-3 text-xs text-gray-400 uppercase tracking-wider">{title}</h3>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  );
};

interface MobileNavProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const MobileNav = ({ toggleMobileMenu, isMobileMenuOpen }: MobileNavProps) => {
  return (
    <div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Clickable overlay to close menu */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu} />

        {/* Mobile Menu Content */}
        <div
          className={`fixed inset-0 w-full z-50 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="px-4 pt-5 pb-6 space-y-1 max-w-md mx-auto">
              {/* General Links */}
              {MOBILE_GENERAL_LINKS.map(link => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  toggleMobileMenu={toggleMobileMenu}
                  external={link.external}
                >
                  {link.name}
                </MobileNavLink>
              ))}

              {/* Products Section */}
              <MobileNavGroup title="Products">
                {PRODUCT_LINKS.map(link => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    toggleMobileMenu={toggleMobileMenu}
                    external={link.external}
                  >
                    {link.name}
                  </MobileNavLink>
                ))}
              </MobileNavGroup>

              {/* About Section */}
              <MobileNavGroup title="About">
                {ABOUT_LINKS.map(link => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    toggleMobileMenu={toggleMobileMenu}
                    external={link.external}
                  >
                    {link.name}
                  </MobileNavLink>
                ))}
              </MobileNavGroup>

              {/* DAO Section */}
              <MobileNavGroup title="DAO">
                {DAO_LINKS.map(link => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    toggleMobileMenu={toggleMobileMenu}
                    external={link.external}
                  >
                    {link.name}
                  </MobileNavLink>
                ))}
              </MobileNavGroup>

              {/* Launch App Button */}
              <div className="pt-4 pb-3 border-t border-gray-700">
                <a
                  href="https://app.niftyleague.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark"
                  onClick={toggleMobileMenu}
                >
                  Launch Web3 App
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
