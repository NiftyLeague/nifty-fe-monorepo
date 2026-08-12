import type { PropsWithChildren } from 'react'

import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'

import LogoSection from '@/app/_layout/_MainLayout/_LogoSection'
import styles from '@/app/_layout/_MainLayout/MainLayout.module.css'
import PublicDesktopSidebarToggle from './PublicDesktopSidebarToggle'
import PublicMainContent from './PublicMainContent'
import PublicMobileNavigationTrigger from './PublicMobileNavigationTrigger'
import PublicNavLinks from './PublicNavLinks'

const pages = [
  { name: 'Website', link: 'https://niftyleague.com/' },
  { name: 'Mobile Smashers', link: 'https://niftysmashers.com/' },
  { name: 'Docs', link: 'https://niftyleague.com/docs' },
]

export default function PublicNavigation({ children }: PropsWithChildren) {
  return (
    <div
      className={cn('flex', styles.publicNavigationShell)}
      data-public-navigation
      data-sidebar-open="true"
    >
      <header className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
        <div className="py-1 lg:py-0">
          <div className="flex w-full flex-row items-center justify-between">
            <div className={cn('flex items-center', styles.publicHeaderControls)}>
              <div className="hidden flex-grow lg:block">
                <LogoSection />
              </div>
              <PublicDesktopSidebarToggle />
              <PublicMobileNavigationTrigger>
                <PublicNavLinks />
              </PublicMobileNavigationTrigger>
            </div>
            <div className="hidden items-center justify-between gap-4 lg:flex">
              {pages.map((page) => (
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
        </div>
      </header>

      <nav
        id="public-desktop-navigation"
        aria-label="Primary navigation"
        className="hidden w-[260px] shrink-0 lg:block"
      >
        <aside
          className={cn(
            styles.publicDesktopSidebar,
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200'
          )}
          style={{ width: 260, top: 60 }}
        >
          <div className="h-full overflow-y-auto px-4 py-5">
            <PublicNavLinks />
          </div>
        </aside>
      </nav>

      <main className={styles.publicMain}>
        <PublicMainContent>{children}</PublicMainContent>
      </main>
    </div>
  )
}
