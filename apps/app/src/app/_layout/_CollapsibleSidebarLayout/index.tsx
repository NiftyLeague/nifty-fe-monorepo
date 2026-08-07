import { useEffect, ReactNode, SetStateAction, useCallback } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

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

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setIsDrawerOpen(!matchDownLG)
  }, [matchDownLG, setIsDrawerOpen])

  return (
    <div className="relative flex flex-row items-start">
      {/* Filter drawer */}
      <div
        className="shrink-0 rounded-md border-none"
        style={{
          width: drawerWidth,
          backgroundColor: 'var(--color-sidebar)',
          position: matchDownLG ? 'fixed' : 'fixed',
          height: matchDownLG ? '100%' : 'auto',
          marginLeft: '16px',
          zIndex: isDrawerOpen ? 1100 : -1,
          visibility: isDrawerOpen ? 'visible' : 'hidden',
          borderRadius: 'var(--radius-default)',
          boxSizing: 'border-box',
        }}
      >
        <PerfectScrollbar
          style={{
            height: matchDownLG ? '100vh' : `calc(100vh - ${appHeaderHeight + 100}px)`,
            padding: '20px 16px',
          }}
        >
          {renderDrawer()}
        </PerfectScrollbar>
      </div>
      {/* Main grid */}
      <div
        className="flex-grow"
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
