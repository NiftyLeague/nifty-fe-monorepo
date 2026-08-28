import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'

import styles from './index.module.css'
export default function Navbar() {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="sm:hidden">
        <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
          <div className={styles.logo_container}>
            <OptimizedImage
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
          {/* Keep the public home shell free of Next's navigation runtime. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/profile">
            <div className={cx(styles.nav_item, styles.profile_mobile)}>
              <OptimizedImage
                src="/icons/user.svg"
                alt="Profile Icon"
                width={28}
                height={28}
                style={{ margin: 'auto', width: 28, height: 28 }}
              />
            </div>
          </a>
        </nav>
      </div>

      {/* Desktop Navbar */}
      <div className={cx('hidden sm:block', styles.desktop_nav)}>
        <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
          <div className={styles.logo_container}>
            <OptimizedImage
              src="/img/logos/NL/white.webp"
              alt="Company Logo"
              className={styles.logo}
              width={50}
              height={48}
            />
          </div>
        </a>
        <nav className={styles.navbar}>
          <div className={styles.navbar_inner}>
            <a
              href="https://discord.gg/niftyleague"
              target="_blank"
              rel="noreferrer"
              className={styles.nav_item}
            >
              <OptimizedImage
                src="/icons/socials/discord.svg"
                alt="Discord Logo"
                width={22}
                height={22}
              />
            </a>
            <a
              href="https://twitter.com/NiftyLeague"
              target="_blank"
              rel="noreferrer"
              className={styles.nav_item}
            >
              <OptimizedImage
                src="/icons/socials/twitter.svg"
                alt="Twitter Logo"
                width={22}
                height={22}
              />
            </a>
            <a
              href="https://www.twitch.tv/niftyleagueofficial"
              target="_blank"
              rel="noreferrer"
              className={styles.nav_item}
            >
              <OptimizedImage
                src="/icons/socials/twitch.svg"
                alt="Twitch Logo"
                width={22}
                height={22}
              />
            </a>
            <a
              href="https://opensea.io/collection/niftydegen"
              target="_blank"
              rel="noreferrer"
              className={styles.nav_item}
            >
              <OptimizedImage src="/icons/opensea.svg" alt="OpenSea Logo" width={22} height={22} />
            </a>
          </div>
          {/* Keep the public home shell free of Next's navigation runtime. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/profile">
            <div className={cx(styles.nav_item, styles.profile)}>
              <div className={styles.profile_icon}>
                <OptimizedImage src="/icons/user.svg" alt="Profile Icon" width={22} height={22} />
              </div>
            </div>
          </a>
        </nav>
      </div>
    </>
  )
}
