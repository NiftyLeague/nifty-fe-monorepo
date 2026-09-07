'use client'

import { useEffect, useRef } from 'react'

function syncSidebarState(details: HTMLDetailsElement) {
  const shell = details.closest<HTMLElement>('[data-public-navigation]')
  if (shell) shell.dataset.publicSidebarState = details.open ? 'open' : 'closed'
}

export default function PublicDesktopNavigationToggle() {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (detailsRef.current) syncSidebarState(detailsRef.current)
  }, [])

  return (
    <details
      ref={detailsRef}
      id="public-desktop-navigation-toggle"
      open
      className="hidden lg:block"
      onToggle={(event) => syncSidebarState(event.currentTarget)}
    >
      <summary
        role="button"
        aria-controls="public-desktop-navigation"
        aria-label="Toggle sidebar"
        className="flex h-[34px] w-[34px] cursor-pointer list-none items-center justify-center overflow-hidden rounded-md bg-muted text-blue outline-none transition-colors duration-200 hover:bg-purple hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" className="flex size-6 flex-col justify-center gap-1.5">
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
          <span className="h-0.5 w-full rounded-full bg-current" />
        </span>
        <span className="sr-only">Toggle sidebar</span>
      </summary>
    </details>
  )
}
