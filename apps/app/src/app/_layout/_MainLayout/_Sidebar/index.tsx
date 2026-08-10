import { memo, useMemo } from 'react'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'

// third-party
// project imports
import { ScrollArea } from '@nl/ui/base/scroll-area'
import MenuList from './_MenuList'
import LogoSection from '../_LogoSection'
import { openDrawer } from '@/store/slices/menu'
import { useDispatch, useSelector } from '@/store/hooks'
import UserProfile from './_UserProfile'
import LogoutButton from './_LogoutButton'

const appDrawerWidth = 260
const appHeaderHeight = 60

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const isSmallScreen = useMediaQuery('(max-width:1024px)')

  const dispatch = useDispatch()
  const { drawerOpen } = useSelector((state) => state.menu)

  const logo = useMemo(
    () => (
      <div className="block lg:hidden">
        <div className="mx-auto flex p-2">
          <LogoSection />
        </div>
      </div>
    ),
    []
  )

  const drawer = useMemo(
    () => (
      <ScrollArea
        style={{
          height: isSmallScreen ? 'calc(100vh - 56px)' : 'calc(100vh - 100px)',
        }}
        viewportClassName="px-4"
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <UserProfile />
            <MenuList />
            {/* <OnboardingCard /> */}
          </div>
          <div className="flex flex-col items-center">
            <LogoutButton sx={{ marginBottom: 12, width: '85%' }} />
          </div>
        </div>
      </ScrollArea>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSmallScreen]
  )

  return (
    <nav
      aria-label="mailbox folders"
      className={cn('shrink-0', isSmallScreen ? 'w-auto' : 'w-[260px]')}
      style={{ flexShrink: isSmallScreen ? undefined : 0 }}
    >
      {/* temporary drawer (mobile) */}
      {isSmallScreen && (
        <div
          className={cn(
            'fixed inset-0 z-50 transition-opacity',
            drawerOpen
              ? 'pointer-events-auto bg-black/50 opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          onClick={() => dispatch(openDrawer(!drawerOpen))}
        >
          <div
            className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 border-r-0"
            style={{ width: appDrawerWidth }}
            onClick={(e) => e.stopPropagation()}
          >
            {drawerOpen && logo}
            {drawerOpen && drawer}
          </div>
        </div>
      )}

      {/* persistent drawer (desktop) */}
      {!isSmallScreen && (
        <aside
          className={cn(
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200',
            !drawerOpen && '-translate-x-full'
          )}
          style={{ width: appDrawerWidth, top: appHeaderHeight }}
        >
          {drawerOpen && logo}
          {drawerOpen && drawer}
        </aside>
      )}
    </nav>
  )
}

export default memo(Sidebar)
