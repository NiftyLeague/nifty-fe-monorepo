import { lazy, Show, Suspense, type JSX, type ParentProps } from 'solid-js'

import { ScrollArea } from '@nl/ui/base/scroll-area'
import { cx } from '@nl/ui/class-names'

import {
  useDrawerOpen,
  useIsDesktopNavigation,
  useSetDrawerOpen,
} from '@/contexts/NavigationContext'
import LogoSection from '../_LogoSection'

const appDrawerWidth = 260
const desktopAppHeaderHeight = 60
const compactAppHeaderHeight = 56

const MobileSidebarSheet = lazy(() => import('./MobileSidebarSheet'))

interface SidebarFrameProps extends ParentProps {
  footer?: JSX.Element
}

const logo = () => (
  <div class="block lg:hidden">
    <div class="mx-auto flex p-2">
      <LogoSection />
    </div>
  </div>
)

function SidebarFrame(props: SidebarFrameProps) {
  const drawerOpen = useDrawerOpen()
  const isDesktopNavigation = useIsDesktopNavigation()
  const setDrawerOpen = useSetDrawerOpen()
  const isCompactScreen = () => !isDesktopNavigation()
  const appHeaderHeight = () =>
    isCompactScreen() ? compactAppHeaderHeight : desktopAppHeaderHeight

  const drawer = () => (
    <ScrollArea
      style={{ height: `calc(100dvh - ${appHeaderHeight()}px)` }}
      viewportClassName="px-4"
    >
      <div class="flex h-full flex-col justify-between">
        <div>{props.children}</div>
        <Show when={props.footer}>
          <div class="flex flex-col items-center">{props.footer}</div>
        </Show>
      </div>
    </ScrollArea>
  )

  return (
    <nav
      aria-label="Primary navigation"
      data-state={drawerOpen() ? 'open' : 'closed'}
      class={cx('shrink-0', isCompactScreen() ? 'w-0' : 'w-65')}
    >
      <Show when={isCompactScreen() && drawerOpen()}>
        <Suspense fallback={null}>
          <MobileSidebarSheet
            appHeaderHeight={appHeaderHeight()}
            drawer={drawer()}
            logo={logo()}
            onOpenChange={setDrawerOpen}
            open={drawerOpen()}
          />
        </Suspense>
      </Show>

      <Show when={isDesktopNavigation()}>
        <aside
          id="app-primary-navigation"
          class={cx(
            'bg-sidebar text-sidebar-foreground fixed bottom-0 left-0 z-40 border-r-0 transition-transform duration-200 w-(--aside-w) top-(--app-top)',
            drawerOpen()
              ? 'pointer-events-auto translate-x-0'
              : 'pointer-events-none -translate-x-full'
          )}
          aria-hidden={!drawerOpen()}
          style={{ '--aside-w': `${appDrawerWidth}px`, '--app-top': `${appHeaderHeight()}px` }}
        >
          <Show when={drawerOpen()}>
            {logo()}
            {drawer()}
          </Show>
        </aside>
      </Show>
    </nav>
  )
}

export default SidebarFrame
