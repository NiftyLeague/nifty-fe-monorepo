'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { DeferredSkeleton } from '@nl/ui/custom/deferred-skeleton'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import IdleGate from '@/components/IdleGate'

type ViewportVideoProps = ComponentPropsWithoutRef<typeof ViewportVideo>

/**
 * Web-only video gate: the poster stays visible while the page's own critical
 * path finishes, then the viewport-controlled playback mounts. Keeps the
 * first-viewport video payload from competing with the LCP image.
 */
export default function GatedViewportVideo({ label = 'video', ...props }: ViewportVideoProps & { label?: string }) {
  return (
    <IdleGate
      fallback={
        <DeferredSkeleton
          role="status"
          aria-live="polite"
          aria-label={`Loading ${label}`}
          className="h-full w-full"
        />
      }
    >
      <ViewportVideo {...props} />
    </IdleGate>
  )
}
