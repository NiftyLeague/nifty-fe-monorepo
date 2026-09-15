'use client'

import { createEffect } from 'solid-js'

function syncSidebarState(details: HTMLDetailsElement) {
  const shell = details.closest<HTMLElement>('[data-public-navigation]')
  if (shell) shell.dataset.publicSidebarState = details.open ? 'open' : 'closed'
}

export default function PublicDesktopNavigationToggle() {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  createEffect(() => {
    if (detailsRef.current) syncSidebarState(detailsRef.current)
  }, [])

  return (
    <details
      ref={detailsRef}
      id="public-desktop-navigation-toggle"
      open
      class="hidden lg:block"
      onToggle={(event) => syncSidebarState(event.currentTarget)}
    >
      <summary
        aria-controls="public-desktop-navigation"
        class="flex h-[34px] w-[34px] cursor-pointer list-none items-center justify-center overflow-hidden rounded-md bg-muted text-blue outline-none transition-colors duration-200 hover:bg-purple hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" class="flex size-6 flex-col justify-center gap-1.5">
          <span class="h-0.5 w-full rounded-full bg-current" />
          <span class="h-0.5 w-full rounded-full bg-current" />
          <span class="h-0.5 w-full rounded-full bg-current" />
        </span>
        {/* The name comes from this text rather than an `aria-label`, so the
            visible control and its name cannot drift apart, and the summary keeps
            its implicit disclosure role: `role="button"` would replace the
            browser's mapping and take aria-expanded with it. */}
        <span class="sr-only">Toggle sidebar</span>
      </summary>
    </details>
  )
}
