'use client';

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';
import { AnimatedWrapper } from '@nl/ui/animations';
import ExternalIcon from '@/components/ExternalIcon';
import { SOCIAL_LINKS } from '@/constants/socials';

import styles from './index.module.css';
export default function Footer({ classes }: { classes?: { footer?: string } }) {
  const mobile = useMediaQuery('(max-width:768px)');
  return (
    <footer className={cn(styles.footer, classes?.footer)}>
      <AnimatedWrapper>
        <div className={cn(styles.footer_container, 'mx-auto transition-fade transition-fade-start delay-lite')}>
          <div className="flex m-0 py-0 md:py-5 relative justify-between">
            <div className="px-0 pt-4 md:pt-0">
              <div className="flex flex-col m-0 p-0 relative">
                <Link href="/">Home</Link>
                <Link href="/roadmap" className="mt-2 hover:text-purple transition-colors">
                  Roadmap
                </Link>
                <Link href="/overview" className="mt-2 hover:text-purple transition-colors">
                  Overview
                </Link>
                <Link href="/community" className="mt-2 hover:text-purple transition-colors">
                  Community
                </Link>
              </div>
            </div>
            <div className="px-0 pt-4 md:pt-0">
              <div className="flex flex-col m-0 p-0 relative">
                <Link href="/games" className="hover:text-purple transition-colors">
                  Games
                </Link>
                <Link href="/degens" className="mt-2 hover:text-purple transition-colors">
                  DEGENs
                </Link>
                <Link href="/niftyverse" className="mt-2 hover:text-purple transition-colors">
                  NiftyVerse
                </Link>
                <Link href="/lore" className="mt-2 hover:text-purple transition-colors">
                  Lore
                </Link>
              </div>
            </div>
            <div className="px-0 pt-4 md:pt-0">
              <div className="flex flex-col m-0 p-0 relative">
                {/* <Link href="/team">Team</Link> */}
                {/* <Link href="/careers">Careers</Link> */}
                <Link href="/tally" className="hover:text-purple transition-colors">
                  Nifty DAO {!mobile ? <ExternalIcon className="ml-1" /> : null}
                </Link>
                <Link href="/docs" className="mt-2 hover:text-purple transition-colors">
                  Docs {!mobile ? <ExternalIcon className="ml-1" /> : null}
                </Link>
                <Link
                  href="/blog"
                  className="mt-2 hover:text-purple transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Blog {!mobile ? <ExternalIcon className="ml-1" /> : null}
                </Link>
                <Link
                  href="/contact"
                  className="mt-2 hover:text-purple transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact {!mobile ? <ExternalIcon /> : null}
                </Link>
                {/* <Link href="/shop" className="mt-2">
                  Merch {!mobile ? <ExternalIcon /> : null}
                </Link> */}
                {/* <a href="https://maddies.co/official/nifty-league/" className="mt-2" target="_blank" rel="noreferrer">
                  Merch {!mobile ? <ExternalIcon /> : null}
                </a> */}
              </div>
            </div>
            <div className="px-0 pt-4 md:pt-0">
              <div className="flex flex-col m-0 p-0">
                <Link href="/terms-of-service" className="hover:text-purple transition-colors">
                  Terms
                </Link>
                <Link href="/disclaimer" className="mt-2 hover:text-purple transition-colors">
                  Disclaimer
                </Link>
                <Link href="/privacy-policy" className="mt-2 hover:text-purple transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="mt-2 hover:text-purple transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center justify-center space-x-4">
              {SOCIAL_LINKS.map(social => (
                <a className="px-2 py-2" href={social.link} target="_blank" rel="noreferrer" key={social.name}>
                  <Image src={social.image} width={20} height={20} alt={social.description} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    </footer>
  );
}
