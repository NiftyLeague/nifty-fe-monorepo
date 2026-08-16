import { useEffect, ReactNode, SetStateAction, useCallback } from 'react'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { IconButton } from '@nl/ui/base/icon-button'
import { AppNavIcon } from '@/components/AppNavIcon'

const appHeaderHeight = 60

interface Props {
  drawerWidth?: number
  renderDrawer: () => ReactNode
  renderMain: () => ReactNode
  isDrawerOpen: boolean
  setIsDrawerOpen: React.Dispatch<SetStateAction<boolean>>
}

const CollapsibleSidebarLayout = ({
  drawerWidth = 320,
  renderDrawer,
  renderMain,
  isDrawerOpen,
  setIsDrawerOpen,
}: Props): React.ReactNode => {
  const matchDownLG = useMediaQuery('(max-width:1024px)')

  // toggle sidebar
  const handleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((prevState) => !prevState)
  }, [setIsDrawerOpen])

  // close drawer by default on mobile, open on desktop
  useEffect(() => {
    setIsDrawerOpen(!matchDownLG)
  }, [matchDownLG, setIsDrawerOpen])

  const isMobileDrawer = matchDownLG && isDrawerOpen

  return (
    <div className="relative flex flex-row items-start">
      {/* Mobile overlay */}
      {isMobileDrawer && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[1090] bg-black/50"
          onClick={handleDrawerOpen}
        />
      )}

      {/* Filter drawer */}
      <div
        className="shrink-0 rounded-md border-none"
        style={{
          width: `min(${drawerWidth}px, calc(100vw - 32px))`,
          backgroundColor: 'var(--color-sidebar)',
          position: 'fixed',
          top: matchDownLG ? appHeaderHeight : 'auto',
          left: matchDownLG ? '16px' : 'auto',
          height: matchDownLG ? `calc(100vh - ${appHeaderHeight}px)` : 'auto',
          marginLeft: matchDownLG ? 0 : '16px',
          zIndex: isDrawerOpen ? 1100 : -1,
          visibility: isDrawerOpen ? 'visible' : 'hidden',
          borderRadius: 'var(--radius-default)',
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
            className="absolute right-3 top-3 z-[1101] size-8 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-foreground/10"
            onClick={handleDrawerOpen}
          >
            <AppNavIcon name="x" aria-hidden="true" size={20} strokeWidth={1.5} />
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
        className="flex-grow min-w-0"
        style={{
          paddingLeft: isDrawerOpen && !matchDownLG ? 24 : 0,
          marginLeft: isDrawerOpen && !matchDownLG ? `${drawerWidth}px` : 0,
          transition: `margin 200ms cubic-bezier(${isDrawerOpen ? '0, 0, 0.2, 1' : '0.4, 0, 0.6, 1'}) 0ms`,
        }}
      >
        <ScrollArea
          style={{
            height: `calc(100vh - ${appHeaderHeight + 100}px)`,
            borderRadius: '10px',
            backgroundColor: 'var(--color-sidebar)',
            marginRight: '24px',
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
