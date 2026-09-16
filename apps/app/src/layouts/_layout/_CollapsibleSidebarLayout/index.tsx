import { createEffect, Show, type JSX } from 'solid-js'
import { X } from 'lucide-solid'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { ScrollArea } from '@nl/ui/base/scroll-area'
import { IconButton } from '@nl/ui/base/icon-button'
import { cn } from '@nl/ui/utils'
import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'

interface Props {
  drawerWidth?: number
  renderDrawer: () => JSX.Element
  renderMain: () => JSX.Element
  isDrawerOpen: boolean
  setIsDrawerOpen: (v: boolean | ((prev: boolean) => boolean)) => void
}

const CollapsibleSidebarLayout = (props: Props): JSX.Element => {
  const isDesktopNavigation = useMediaQuery(desktopNavigationMediaQuery)
  const matchDownLG = () => !isDesktopNavigation()
  const drawerWidth = () => props.drawerWidth ?? 320
  const isDrawerOpen = () => props.isDrawerOpen

  // toggle sidebar
  const handleDrawerOpen = () => {
    props.setIsDrawerOpen((prevState) => !prevState)
  }

  // close drawer by default on mobile, open on desktop
  createEffect(() => {
    props.setIsDrawerOpen(!matchDownLG())
  })

  const isMobileDrawer = () => matchDownLG() && isDrawerOpen()

  return (
    <div class="relative flex flex-row items-start">
      {/* Mobile overlay */}
      <Show when={isMobileDrawer()}>
        <div
          aria-hidden="true"
          class="fixed inset-0 z-1090 bg-black/50"
          onClick={handleDrawerOpen}
        />
      </Show>

      {/* Filter drawer */}
      <div
        class={cn(
          'w-(--drawer-w) fixed bg-sidebar box-border rounded-(--radius-default)',
          matchDownLG()
            ? 'top-15 left-4 h-[calc(100vh-60px)] ml-0'
            : 'top-auto left-auto h-auto ml-4',
          isDrawerOpen() ? 'z-(--drawer-z) visible' : 'z-(--drawer-z) invisible'
        )}
        style={{
          '--drawer-w': `min(${drawerWidth()}px, calc(100vw - 32px))`,
          '--drawer-z': isDrawerOpen() ? '1100' : '-1',
        }}
      >
        {/* Close button for mobile */}
        <Show when={matchDownLG() && isDrawerOpen()}>
          <IconButton
            type="button"
            aria-label="Close filters"
            variant="ghost"
            size="icon"
            class="absolute right-3 top-3 z-1101 size-8 cursor-pointer p-1 text-muted-foreground hover:bg-foreground/10"
            onClick={handleDrawerOpen}
          >
            <X aria-hidden="true" size={20} stroke-width={1.5} />
          </IconButton>
        </Show>
        <div class={matchDownLG() ? 'h-full' : 'h-[calc(100vh-160px)]'}>
          <ScrollArea class="h-full w-full">
            <div class={matchDownLG() ? 'px-4 pt-11 pb-5' : 'px-4 py-5'}>
              {isDrawerOpen() ? props.renderDrawer() : null}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main grid */}
      <div
        class={cn(
          'flex-grow min-w-0 transition-(--margin-trans) duration-200',
          isDrawerOpen() && !matchDownLG()
            ? 'ml-(--main-ml) pl-6 ease-out'
            : 'ml-(--main-ml) pl-0 ease-(--drawer-ease)'
        )}
        style={{
          '--main-ml': isDrawerOpen() && !matchDownLG() ? `${drawerWidth()}px` : '0px',
        }}
      >
        <div class="mr-6 h-[calc(100vh-160px)] overflow-hidden rounded-lg bg-sidebar">
          <ScrollArea class="h-full w-full">
            <div class={matchDownLG() ? 'px-4 py-2.5' : 'px-6 py-4'}>{props.renderMain()}</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default CollapsibleSidebarLayout
