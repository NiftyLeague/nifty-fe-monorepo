import { createEffect, type JSX } from 'solid-js'
import { X } from 'lucide-react'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { IconButton } from '@nl/ui/base/icon-button'
import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'

const appHeaderHeight = 60

interface Props {
  drawerWidth?: number
  renderDrawer: () => JSX.Element
  renderMain: () => JSX.Element
  isDrawerOpen: boolean
  setIsDrawerOpen: (v: boolean | ((prev: boolean) => boolean)) => void
}

const CollapsibleSidebarLayout = ({
  drawerWidth = 320,
  renderDrawer,
  renderMain,
  isDrawerOpen,
  setIsDrawerOpen,
}: Props): JSX.Element => {
  const isDesktopNavigation = useMediaQuery(desktopNavigationMediaQuery)
  const matchDownLG = !isDesktopNavigation

  // toggle sidebar
  const handleDrawerOpen = (() => {
    setIsDrawerOpen((prevState) => !prevState)
  }, [setIsDrawerOpen])

  // close drawer by default on mobile, open on desktop
  createEffect(() => {
    setIsDrawerOpen(!matchDownLG)
  }, [matchDownLG, setIsDrawerOpen])

  const isMobileDrawer = matchDownLG && isDrawerOpen

  return (
    <div class="relative flex flex-row items-start">
      {/* Mobile overlay */}
      {isMobileDrawer && (
        <div
          aria-hidden="true"
          class="fixed inset-0 z-[1090] bg-black/50"
          onClick={handleDrawerOpen}
        />
      )}

      {/* Filter drawer */}
      <div
        class="shrink-0 rounded-md border-none"
        style={{
          width: `min(${drawerWidth}px, calc(100vw - 32px))`,
          'background-color': 'var(--color-sidebar)',
          position: 'fixed',
          top: matchDownLG ? appHeaderHeight : 'auto',
          left: matchDownLG ? '16px' : 'auto',
          height: matchDownLG ? `calc(100vh - ${appHeaderHeight}px)` : 'auto',
          'margin-left': matchDownLG ? 0 : '16px',
          'z-index': isDrawerOpen ? 1100 : -1,
          visibility: isDrawerOpen ? 'visible' : 'hidden',
          'border-radius': 'var(--radius-default)',
          boxSizing: 'border-box',
        }}
      >
        {/* Close button for mobile */}
        {matchDownLG && isDrawerOpen && (
          <IconButton
            type="button"
            aria-label="Close filters"
            variant="ghost"
            size="icon"
            class="absolute right-3 top-3 z-[1101] size-8 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-foreground/10"
            onClick={handleDrawerOpen}
          >
            <X aria-hidden="true" absoluteStrokeWidth size={20} stroke-width={1.5} />
          </IconButton>
        )}
        <ScrollArea
          style={{
            height: matchDownLG
              ? `calc(100vh - ${appHeaderHeight}px)`
              : `calc(100vh - ${appHeaderHeight + 100}px)`,
          }}
          viewportClassName={matchDownLG ? 'px-4 pt-11 pb-5' : 'px-4 py-5'}
        >
          {isDrawerOpen ? renderDrawer() : null}
        </ScrollArea>
      </div>

      {/* Main grid */}
      <div
        class="flex-grow min-w-0"
        style={{
          'padding-left': isDrawerOpen && !matchDownLG ? 24 : 0,
          'margin-left': isDrawerOpen && !matchDownLG ? `${drawerWidth}px` : 0,
          transition: `margin 200ms cubic-bezier(${isDrawerOpen ? '0, 0, 0.2, 1' : '0.4, 0, 0.6, 1'}) 0ms`,
        }}
      >
        <ScrollArea
          style={{
            height: `calc(100vh - ${appHeaderHeight + 100}px)`,
            'border-radius': '10px',
            'background-color': 'var(--color-sidebar)',
            'margin-right': '24px',
          }}
          viewportClassName={matchDownLG ? 'px-4 py-2.5' : 'px-6 py-4'}
        >
          {renderMain()}
        </ScrollArea>
      </div>
    </div>
  )
}

export default CollapsibleSidebarLayout
