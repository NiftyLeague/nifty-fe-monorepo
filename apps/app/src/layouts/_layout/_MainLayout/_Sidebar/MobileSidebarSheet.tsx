'use client'

import type { JSX } from 'solid-js'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@nl/ui/base/sheet'

interface MobileSidebarSheetProps {
  appHeaderHeight: number
  drawer: JSX.Element
  logo: JSX.Element
  onOpenChange: (open: boolean) => void
  open: boolean
}

export default function MobileSidebarSheet({
  appHeaderHeight,
  drawer,
  logo,
  onOpenChange,
  open,
}: MobileSidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="app-primary-navigation"
        side="left"
        aria-label="Primary navigation"
        closeLabel="Close sidebar"
        closeClassName="top-2 right-2 z-20 h-8 w-8 opacity-100 hover:opacity-100"
        overlayClassName="bg-black/50"
        overlayStyle={{ top: `${appHeaderHeight}px` }}
        class="w-[260px] max-w-[260px] gap-0 border-r-0 bg-sidebar p-0 text-sidebar-foreground"
        style={{ top: `${appHeaderHeight}px`, bottom: 0, height: 'auto' }}
      >
        <SheetTitle class="sr-only">Primary navigation</SheetTitle>
        <SheetDescription class="sr-only">Navigate through the private app</SheetDescription>
        {logo}
        {drawer}
      </SheetContent>
    </Sheet>
  )
}
