'use client';

import { useState, useEffect } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Set scrollbar width on mount
  useEffect(() => {
    // Set the scrollbar width as a CSS variable
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }, []);

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isMobileMenuOpen) {
      // Add classes to prevent scrolling
      html.classList.add('overflow-hidden');
      body.classList.add('overflow-hidden');
      // Apply padding to prevent content shift
      body.style.paddingRight = `var(--scrollbar-width, 0)`;
    } else {
      // Remove classes to re-enable scrolling
      html.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');
      // Reset padding
      body.style.paddingRight = '';
    }

    // Cleanup function
    return () => {
      html.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');
      body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background bg-opacity-90 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <DesktopNav toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      <MobileNav toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
    </nav>
  );
};

export default Header;
