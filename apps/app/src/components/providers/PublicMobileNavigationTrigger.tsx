'use client'

import dynamic from 'next/dynamic'
import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { IconButton } from '@nl/ui/base/icon-button'

const PublicMobileNavigation = dynamic(() => import('./PublicMobileNavigation'), {
  ssr: false,
})

export default function PublicMobileNavigationTrigger({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        type="button"
        variant="ghost"
        size="icon"
        className="h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="public-mobile-navigation"
      >
        <Menu aria-hidden="true" absoluteStrokeWidth size={24} />
      </IconButton>
      {open ? (
        <PublicMobileNavigation open={open} onOpenChange={setOpen}>
          {children}
        </PublicMobileNavigation>
      ) : null}
    </>
  )
}
