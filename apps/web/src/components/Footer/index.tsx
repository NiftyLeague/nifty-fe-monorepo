'use client';

import Link from 'next/link';
import type { UrlObject } from 'url';
import { cn } from '@nl/ui/utils';
import { SocialsFooter, animateClass, linkClass } from '@nl/ui/custom/socials-footer';
import { ExternalIcon } from '@nl/ui/custom/external-icon';

interface FooterLinkProps {
  external?: boolean;
  first?: boolean;
  href: string | UrlObject;
  name: string;
}

const FooterLink = ({ href, name, external = false, first = false }: FooterLinkProps) => (
  <Link
    href={href}
    className={cn(
      'inline-flex items-center justify-center sm:justify-start',
      linkClass,
      animateClass,
      !first && 'mt-2',
    )}
    target={external ? '_blank' : undefined}
    rel={external ? 'noreferrer' : undefined}
  >
    <span className="whitespace-nowrap">{name}</span>
    {external && <ExternalIcon />}
  </Link>
);

export default function Footer() {
  return (
    <SocialsFooter>
      <div className="flex justify-evenly mb-10 sm:mb-12">
        <div className="flex flex-col">
          <FooterLink href="/" name="Home" first />
          <FooterLink href="/games" name="Games" />
          <FooterLink href="/degens" name="DEGENs" />
          <FooterLink href="/niftyworld" name="NiftyWorld" />
        </div>
        <div className="flex flex-col">
          <FooterLink href="/overview" name="Overview" first />
          <FooterLink href="/roadmap" name="Roadmap" />
          <FooterLink href="/community" name="Community" />
          <FooterLink href="/lore" name="Lore" />
          {/* <FooterLink href="/team" name="Team" /> */}
          {/* <FooterLink href="/careers" name="Careers" /> */}
          {/* <FooterLink href="/shop" name="Merch" external /> */}
        </div>
        <div className="flex flex-col">
          <FooterLink href="/tally" name="NiftyDAO" external first />
          <FooterLink href="/docs" name="Docs" external />
          <FooterLink href="/blog" name="Blog" external />
          <FooterLink href="/contact" name="Contact" external />
        </div>
      </div>
    </SocialsFooter>
  );
}
