'use client'

import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { IconButton } from '@nl/ui/base/icon-button'

const PUBLIC_NAVIGATION_SELECTOR = '[data-public-navigation]'

export default function PublicDesktopSidebarToggle() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    document
      .querySelector<HTMLElement>(PUBLIC_NAVIGATION_SELECTOR)
      ?.setAttribute('data-sidebar-open', String(open))
  }, [open])

  return (
    <IconButton
      type="button"
      variant="ghost"
      size="icon"
      className="hidden h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-md bg-muted text-blue transition-all duration-200 hover:bg-purple hover:text-foreground lg:inline-flex"
      onClick={() => setOpen((current) => !current)}
      aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      aria-expanded={open}
      aria-controls="public-desktop-navigation"
    >
      <Menu aria-hidden="true" absoluteStrokeWidth size={24} />
    </IconButton>
  )
}
