'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'

import LogoSection from '@/app/_layout/_MainLayout/_LogoSection'
import PublicNavLinks from './PublicNavLinks'
import styles from '@/app/_layout/_MainLayout/MainLayout.module.css'

const PublicMobileNavigation = dynamic(() => import('./PublicMobileNavigation'), {
  ssr: false,
})

const pages = [
  { name: 'Website', link: 'https://niftyleague.com/' },
  { name: 'Mobile Smashers', link: 'https://niftysmashers.com/' },
  { name: 'Docs', link: 'https://niftyleague.com/docs' },
]

export default function PublicNavigation({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const isNoFilterPage = pathname ? /(degens|dashboard\/degens)/.test(pathname) : false

  return (
    <div className="flex">
      <header className="fixed top-0 right-0 left-0 z-50 border-0 bg-sidebar">
        <div className="py-1 lg:py-0">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex items-center" style={{ width: desktopSidebarOpen ? 228 : 80 }}>
              <div className="hidden flex-grow lg:block">
                <LogoSection />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground lg:inline-flex"
                onClick={() => setDesktopSidebarOpen((open) => !open)}
                aria-label={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={desktopSidebarOpen}
                aria-controls="public-desktop-navigation"
              >
                <Menu aria-hidden="true" absoluteStrokeWidth size={24} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground lg:hidden"
                onClick={() => setMobileNavigationOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileNavigationOpen}
                aria-controls="public-mobile-navigation"
              >
                <Menu aria-hidden="true" absoluteStrokeWidth size={24} />
              </Button>
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
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200',
            !desktopSidebarOpen && '-translate-x-full'
          )}
          style={{ width: 260, top: 60 }}
        >
          <div className="h-full overflow-y-auto px-4 py-5">
            <PublicNavLinks />
          </div>
        </aside>
      </nav>

      <main
        className={cn(
          styles.publicMain,
          desktopSidebarOpen ? styles.publicMainOpen : styles.publicMainClosed
        )}
      >
        {isNoFilterPage ? children : <div className="container py-5 md:py-10">{children}</div>}
      </main>

      {mobileNavigationOpen && (
        <PublicMobileNavigation
          open={mobileNavigationOpen}
          onOpenChange={setMobileNavigationOpen}
        />
      )}
    </div>
  )
}
