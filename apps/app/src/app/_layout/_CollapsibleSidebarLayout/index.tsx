import { useEffect, ReactNode, SetStateAction, useCallback } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { Icon } from '@nl/ui/base/icon'

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
          <button
            type="button"
            aria-label="Close filters"
            className="absolute right-3 top-3 z-[1101] cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-foreground/10"
            onClick={handleDrawerOpen}
          >
            <Icon name="x" size="md" />
          </button>
        )}
        <PerfectScrollbar
          style={{
            height: matchDownLG
              ? `calc(100vh - ${appHeaderHeight}px)`
              : `calc(100vh - ${appHeaderHeight + 100}px)`,
            padding: matchDownLG ? '44px 16px 20px' : '20px 16px',
          }}
        >
          {renderDrawer()}
        </PerfectScrollbar>
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
        <PerfectScrollbar
          style={{
            padding: matchDownLG ? '10px 16px' : '16px 24px',
            height: `calc(100vh - ${appHeaderHeight + 100}px)`,
            borderRadius: '10px',
            backgroundColor: 'var(--color-sidebar)',
            marginRight: '24px',
          }}
        >
          {renderMain()}
        </PerfectScrollbar>
      </div>
    </div>
  )
}

export default CollapsibleSidebarLayout
