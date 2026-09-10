'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Delays third-party media (YouTube iframes) until the first-party page has
 * finished loading and the browser is idle. The trailer still autoplays once
 * mounted; on constrained connections this keeps the visitor's bandwidth on
 * the page's own LCP image instead of the embed's player payload.
 */
export default function IdleGate({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let cancelled = false
    const activate = () => {
      if (!cancelled) setIdle(true)
    }
    const release = () => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(activate, { timeout: 2500 })
      else setTimeout(activate, 1500)
    }
    if (document.readyState === 'complete') release()
    else {
      window.addEventListener('load', release, { once: true })
      // Never hold the embed past a hard cap, even if load stalls.
      const cap = setTimeout(activate, 6000)
      return () => {
        cancelled = true
        window.removeEventListener('load', release)
        clearTimeout(cap)
      }
    }
    return () => {
      cancelled = true
    }
  }, [])

  return <>{idle ? children : fallback}</>
}
