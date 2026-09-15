import { For } from 'solid-js'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { Menu } from 'lucide-solid'

import {
  useDrawerOpen,
  useIsDesktopNavigation,
  useToggleDrawer,
} from '@/contexts/NavigationContext'

import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { APP_EXTERNAL_LINKS } from '@/constants/navigation'
import LogoSection from '../_LogoSection'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const drawerOpen = useDrawerOpen()
  const isDesktopNavigation = useIsDesktopNavigation()
  const toggleDrawer = useToggleDrawer()
  const isCompactScreen = () => !isDesktopNavigation()

  return (
    <div class="flex w-full flex-row items-center justify-between">
      {/* logo & toggler button */}
      <div
        class="flex items-center"
        style={{
          width: isCompactScreen() ? 'auto' : drawerOpen() ? '228px' : '80px',
        }}
      >
        <div class="hidden flex-grow lg:block">
          <LogoSection />
        </div>
        <button
          type="button"
          data-slot="button"
          class={buttonVariants({
            variant: 'ghost',
            size: 'icon',
            className:
              'h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground',
          })}
          onClick={toggleDrawer}
          aria-label="toggle sidebar"
          aria-controls="app-primary-navigation"
          aria-expanded={drawerOpen()}
        >
          <Menu aria-hidden="true" size={20} stroke-width={1.5} />
        </button>
      </div>
      <div class="hidden items-center justify-between gap-4 lg:flex">
        <For each={APP_EXTERNAL_LINKS}>
          {(page) => (
            <a
              href={page.link}
              target="_blank"
              rel="noopener noreferrer"
              class="cursor-pointer text-foreground underline-offset-4 hover:underline"
            >
              {page.name} <ExternalIcon />
            </a>
          )}
        </For>
      </div>
    </div>
  )
}

export default Header
