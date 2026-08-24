'use client'

import { useEffect } from 'react'

interface NavbarScrollStateProps {
  targetId: string
}

export default function NavbarScrollState({ targetId }: NavbarScrollStateProps): null {
  useEffect(() => {
    const header = document.getElementById(targetId)
    if (!header) return

    let frameId: number | null = null
    const updateScrollState = () => {
      frameId = null
      header.dataset.scrolled = String(window.scrollY > 80)
    }

    const handleScroll = () => {
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
