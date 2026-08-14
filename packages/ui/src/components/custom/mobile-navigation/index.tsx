import type { ReactNode } from 'react'

import { cn } from '@nl/ui/utils'

interface MobileNavigationDisclosureProps {
  children: ReactNode
  id: string
  label: string
  className?: string
  panelClassName?: string
  summaryClassName?: string
}

export function MobileNavigationDisclosure({
  children,
  className,
  id,
  label,
  panelClassName,
  summaryClassName,
}: MobileNavigationDisclosureProps) {
  return (
    <details className={cn('group relative', className)}>
      <summary
        role="button"
        aria-controls={id}
        aria-label={label}
        className={cn(
          'flex size-10 cursor-pointer list-none items-center justify-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden',
          summaryClassName
        )}
      >
        <span aria-hidden="true" className="flex size-6 flex-col justify-center gap-1.5">
          <span className="h-0.5 w-full rounded-full bg-current transition-transform group-open:translate-y-2 group-open:rotate-45" />
          <span className="h-0.5 w-full rounded-full bg-current transition-opacity group-open:opacity-0" />
          <span className="h-0.5 w-full rounded-full bg-current transition-transform group-open:-translate-y-2 group-open:-rotate-45" />
        </span>
        <span className="sr-only">{label}</span>
      </summary>
      <div id={id} className={cn(panelClassName)}>
        {children}
      </div>
    </details>
  )
}

export default MobileNavigationDisclosure
