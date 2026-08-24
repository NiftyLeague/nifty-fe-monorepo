'use client'

import { useEffect } from 'react'

interface NavbarScrollStateProps {
  targetId: string
}

const NAVBAR_SCROLL_THRESHOLD = 80

export default function NavbarScrollState({ targetId }: NavbarScrollStateProps): null {
  useEffect(() => {
    const header = document.getElementById(targetId)
    if (!header) return

    // Modern browsers can run the visual transition on the compositor with
    // the CSS scroll timeline declared by NavbarScrollFrame. Keep the JS
    // listener for browsers without that support and for reduced-motion users
    // (where the CSS animation is intentionally disabled).
    const supportsCssScrollTimeline =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()') === true
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (supportsCssScrollTimeline && !prefersReducedMotion) return

    let frameId: number | null = null
    let isScrolled = header.dataset.scrolled === 'true'
    const updateScrollState = () => {
      frameId = null
      const nextIsScrolled = window.scrollY > NAVBAR_SCROLL_THRESHOLD
      if (nextIsScrolled === isScrolled) return

      isScrolled = nextIsScrolled
      header.dataset.scrolled = String(nextIsScrolled)
    }

    const handleScroll = () => {
      if (window.scrollY > NAVBAR_SCROLL_THRESHOLD === isScrolled) return
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [targetId])

  return null
}
