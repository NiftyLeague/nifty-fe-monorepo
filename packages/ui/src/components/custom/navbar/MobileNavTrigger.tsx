'use client'

import dynamic from 'next/dynamic'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import type { NavItemData, NavbarActionButton } from './index'

const MobileNavMenu = dynamic(() => import('./MobileNavMenu'), { ssr: false })

interface MobileNavTriggerProps {
  actionButton?: NavbarActionButton
  navItems: NavItemData[]
}

export default function MobileNavTrigger({ actionButton, navItems }: MobileNavTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex md:hidden">
      <button
        type="button"
        aria-controls="nifty-mobile-navigation"
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" className="size-7" />
      </button>
      {open ? (
        <MobileNavMenu
          actionButton={actionButton}
          navItems={navItems}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </div>
  )
}
