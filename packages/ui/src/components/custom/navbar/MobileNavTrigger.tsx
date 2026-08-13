'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { IconButton } from '@nl/ui/base/icon-button'

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
      <IconButton
        type="button"
        variant="ghost"
        size="icon"
        aria-controls="nifty-mobile-navigation"
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="size-10 cursor-pointer text-foreground"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" className="flex size-6 flex-col justify-center gap-1.5">
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
        </span>
      </IconButton>
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
