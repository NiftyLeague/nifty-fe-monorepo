'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@nl/ui/utils'

interface NavbarScrollFrameProps {
  children: ReactNode
  className?: string
}

export function NavbarScrollFrame({ children, className }: NavbarScrollFrameProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (supportsScrollTimeline && !prefersReducedMotion) return

    const updateScrollState = () => {
      frameRef.current = null
      const nextIsScrolled = window.scrollY > 80
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled))
    }

    const handleScroll = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <header
      className={cn(
        'navbar-scroll-frame fixed inset-x-0 top-0 z-50 h-20 bg-transparent data-[scrolled=true]:backdrop-blur-xs',
        className
      )}
      data-scrolled={isScrolled}
    >
      {children}
    </header>
  )
}

export default NavbarScrollFrame
