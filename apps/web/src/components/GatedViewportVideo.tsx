'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { DeferredSkeleton } from '@nl/ui/custom/deferred-skeleton'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import IdleGate from '@/components/IdleGate'

type ViewportVideoProps = ComponentPropsWithoutRef<typeof ViewportVideo>

export default function GatedViewportVideo({
  label = 'video',
  ...props
}: ViewportVideoProps & { label?: string }) {
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
