import dynamic from 'next/dynamic'
import { Button } from '@nl/ui/base/button'

import { useDispatch, useSelector } from '@/store/hooks'
import { openDrawer } from '@/store/slices/menu'

// assets
import { Icon } from '@nl/ui/base/icon'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import LogoSection from '../_LogoSection'

const AddNFTL = dynamic(() => import('./AddNFTLToMetamask'), { ssr: false })

const appHeaderHeight = 60

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const pages = [
  { name: 'Website', link: 'https://niftyleague.com/' },
  { name: 'Mobile Smashers', link: 'https://niftysmashers.com/' },
  { name: 'Docs', link: 'https://niftyleague.com/docs' },
] as { name: string; link: string }[]

const Header = ({ showWalletActions = false }: { showWalletActions?: boolean }) => {
  const dispatch = useDispatch()
  const { drawerOpen } = useSelector((state) => state.menu)

  return (
    <div className="flex w-full flex-row items-center justify-between">
      {/* logo & toggler button */}
      <div
        className="flex items-center"
        style={{
          width: drawerOpen ? 228 : 80,
        }}
      >
        <div className="hidden flex-grow lg:block">
          <LogoSection />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground"
          onClick={() => dispatch(openDrawer(!drawerOpen))}
          aria-label="toggle sidebar"
        >
          <Icon name="menu" />
        </Button>
      </div>
      <div className="hidden items-center justify-between gap-4 lg:flex">
        {showWalletActions && <AddNFTL />}
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
  )
}

export default Header
