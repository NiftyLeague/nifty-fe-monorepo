import type { PropsWithChildren } from 'react'

import AppBar from '@nl/ui/custom/app-bar'
import { cx } from '@nl/ui/class-names'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import MobileNavigationDisclosure from '@nl/ui/custom/mobile-navigation'

import LogoSection from '@/app/_layout/_MainLayout/_LogoSection'
import { APP_EXTERNAL_LINKS } from '@/constants/navigation'
import styles from '@/app/_layout/_MainLayout/MainLayout.module.css'
import PublicNavLinks from './PublicNavLinks'
import PublicUserProfile from './PublicUserProfile'

export default function PublicNavigation({ children }: PropsWithChildren) {
  return (
    <div className={cx('flex', styles.publicNavigationShell)} data-public-navigation>
      <header className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
        <AppBar>
          <div className="flex w-full flex-row items-center justify-between">
            <div className={cx('flex items-center', styles.publicHeaderControls)}>
              <div className="hidden flex-grow lg:block">
                <LogoSection />
              </div>
              <details id="public-desktop-navigation-toggle" open className="hidden lg:block">
                <summary
                  role="button"
                  aria-controls="public-desktop-navigation"
                  aria-label="Toggle sidebar"
                  className="flex h-[34px] w-[34px] cursor-pointer list-none items-center justify-center overflow-hidden rounded-md bg-muted text-blue outline-none transition-colors duration-200 hover:bg-purple hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
                >
                  <span aria-hidden="true" className="flex size-6 flex-col justify-center gap-1.5">
                    <span className="h-0.5 w-full rounded-full bg-current" />
                    <span className="h-0.5 w-full rounded-full bg-current" />
                    <span className="h-0.5 w-full rounded-full bg-current" />
                  </span>
                  <span className="sr-only">Toggle sidebar</span>
                </summary>
              </details>
              <MobileNavigationDisclosure
                id="public-mobile-navigation"
                label="Toggle navigation"
                className="lg:hidden"
                summaryClassName="h-[34px] w-[34px] overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground"
                panelClassName="fixed top-14 bottom-0 left-0 z-40 w-full max-w-xs overflow-y-auto bg-sidebar text-sidebar-foreground shadow-lg"
              >
                <div className="border-b border-sidebar-border px-4 py-3">
                  <div className="flex items-center gap-3 text-sidebar-foreground">
                    <LogoSection />
                    <span>Primary navigation</span>
                  </div>
                </div>
                <div className="border-b border-sidebar-border p-4">
                  <PublicUserProfile placement="mobile" />
                </div>
                <nav aria-label="Primary navigation" className="px-4">
                  <PublicNavLinks />
                </nav>
              </MobileNavigationDisclosure>
            </div>
            <div className="hidden items-center justify-between gap-4 lg:flex">
              {APP_EXTERNAL_LINKS.map((page) => (
                <a
                  key={page.name}
                  href={page.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-foreground underline-offset-4 hover:underline"
                >
                  {page.name} <ExternalIcon />
                </a>
              ))}
            </div>
          </div>
        </AppBar>
      </header>

      <nav
        id="public-desktop-navigation"
        aria-label="Primary navigation"
        className="hidden w-[260px] shrink-0 lg:block"
      >
        <aside
          className={cx(
            styles.publicDesktopSidebar,
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200'
          )}
          style={{ width: 260, top: 60 }}
        >
          <div className="h-full overflow-y-auto px-4 py-5">
            <div className="mb-5">
              <PublicUserProfile placement="desktop" />
            </div>
            <PublicNavLinks />
          </div>
        </aside>
      </nav>

      <main className={styles.publicMain}>{children}</main>
    </div>
  )
}
