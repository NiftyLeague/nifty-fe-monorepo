import Link from 'next/link';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '@/styles/navbar.module.css';
import cn from 'classnames';

export default function Navbar() {
  const mobile = useMediaQuery('(max-width:576px)');
  return mobile ? (
    <>
      <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
        <div className={styles.logo_container}>
          <Image
            src="/logo/white.png"
            alt="Company Logo"
            className={styles.logo}
            width={50}
            height={48}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
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
              style={{
                margin: 'auto',
                width: 28,
                height: 28,
              }}
            />
          </div>
        </Link>
      </nav>
    </>
  ) : (
    <div className={styles.desktop_nav}>
      <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
        <div className={styles.logo_container}>
          <Image
            src="/logo/white.png"
            alt="Company Logo"
            className={styles.logo}
            width={50}
            height={48}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
      </a>
      <nav className={styles.navbar}>
        <div className={styles.navbar_inner}>
          <a href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer" className={styles.nav_item}>
            <Image
              src="/icons/discord.svg"
              alt="Discord Logo"
              width={22}
              height={22}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </a>
          <a href="https://twitter.com/NiftyLeague" target="_blank" rel="noreferrer" className={styles.nav_item}>
            <Image
              src="/icons/twitter.svg"
              alt="Twitter Logo"
              width={22}
              height={22}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </a>
          <a
            href="https://www.twitch.tv/niftyleagueofficial"
            target="_blank"
            rel="noreferrer"
            className={styles.nav_item}
          >
            <Image
              src="/icons/twitch.svg"
              alt="Twitch Logo"
              width={22}
              height={22}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </a>
          <a
            href="https://opensea.io/collection/niftydegen"
            target="_blank"
            rel="noreferrer"
            className={styles.nav_item}
          >
            <Image
              src="/icons/opensea.svg"
              alt="OpenSea Logo"
              width={22}
              height={22}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </a>
        </div>
        <Link href="/profile">
          <div className={cn(styles.nav_item, styles.profile)}>
            <div className={styles.profile_icon}>
              <Image
                src="/icons/user.svg"
                alt="Profile Icon"
                width={22}
                height={22}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </Link>
      </nav>
    </div>
  );
}
