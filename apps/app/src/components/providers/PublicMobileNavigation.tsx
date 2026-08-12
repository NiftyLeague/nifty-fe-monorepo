'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@nl/ui/base/sheet'
import type { ReactNode } from 'react'

import LogoSection from '@/app/_layout/_MainLayout/_LogoSection'

interface PublicMobileNavigationProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PublicMobileNavigation({
  children,
  open,
  onOpenChange,
}: PublicMobileNavigationProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="public-mobile-navigation"
        side="left"
        className="bg-sidebar text-sidebar-foreground sm:max-w-xs"
      >
        <SheetHeader className="border-b border-sidebar-border px-4 py-3">
          <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
            <LogoSection />
            <span>Primary navigation</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Navigate through the public app</SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Primary navigation"
          className="overflow-y-auto px-4"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) onOpenChange(false)
          }}
        >
          {children}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
