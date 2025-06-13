import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@nl/ui/lib/utils';
import useMediaQuery from '@mui/material/useMediaQuery';

import styles from './index.module.css';
export default function Navbar() {
  const mobile = useMediaQuery('(max-width:576px)');
  return mobile ? (
    <>
      <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
        <div className={styles.logo_container}>
          <Image
            src="/img/logos/NL/white.webp"
            alt="Company Logo"
            className={styles.logo}
            width={50}
            height={48}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </a>
      <nav className={styles.navbar}>
        <Link href="/profile">
          <div className={cn(styles.nav_item, styles.profile_mobile)}>
            <Image
              src="/icons/user.svg"
              alt="Profile Icon"
              width={28}
              height={28}
              style={{ margin: 'auto', width: 28, height: 28 }}
            />
          </div>
        </Link>
      </nav>
    </>
  ) : (
    <div className={styles.desktop_nav}>
      <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
        <div className={styles.logo_container}>
          <Image src="/img/logos/NL/white.webp" alt="Company Logo" className={styles.logo} width={50} height={48} />
        </div>
      </a>
      <nav className={styles.navbar}>
        <div className={styles.navbar_inner}>
          <a href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer" className={styles.nav_item}>
            <Image src="/icons/socials/discord.svg" alt="Discord Logo" width={22} height={22} />
          </a>
          <a href="https://twitter.com/NiftyLeague" target="_blank" rel="noreferrer" className={styles.nav_item}>
            <Image src="/icons/socials/twitter.svg" alt="Twitter Logo" width={22} height={22} />
          </a>
          <a
            href="https://www.twitch.tv/niftyleagueofficial"
            target="_blank"
            rel="noreferrer"
            className={styles.nav_item}
          >
            <Image src="/icons/socials/twitch.svg" alt="Twitch Logo" width={22} height={22} />
          </a>
          <a
            href="https://opensea.io/collection/niftydegen"
            target="_blank"
            rel="noreferrer"
            className={styles.nav_item}
          >
            <Image src="/icons/opensea.svg" alt="OpenSea Logo" width={22} height={22} />
          </a>
        </div>
        <Link href="/profile">
          <div className={cn(styles.nav_item, styles.profile)}>
            <div className={styles.profile_icon}>
              <Image src="/icons/user.svg" alt="Profile Icon" width={22} height={22} />
            </div>
          </div>
        </Link>
      </nav>
    </div>
  );
}
