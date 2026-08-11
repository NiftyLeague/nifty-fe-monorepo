'use client'

import { useScrollDetection } from '@nl/ui/hooks/useScrollDetection'
import { cn } from '@nl/ui/utils'

export default function NavbarScrollFrame({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'header'>) {
  const { ref: scrollSentinelRef, isIntersecting } = useScrollDetection()

  return (
    <>
      <div ref={scrollSentinelRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />
      <header
        {...props}
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-20 transition-all duration-500',
          isIntersecting ? 'bg-transparent backdrop-blur-xs' : 'bg-background/90 backdrop-blur-sm',
          className
        )}
      >
        {children}
      </header>
    </>
  )
}
