import { splitProps, type JSX } from 'solid-js'
import { DeferredSkeleton } from '@nl/ui/custom/deferred-skeleton'
import { ViewportVideo, type ViewportVideoProps } from '@nl/ui/custom/viewport-video'
import IdleGate from '@/components/IdleGate'

type GatedViewportVideoProps = ViewportVideoProps & { label?: string }

const GatedViewportVideo = (props: GatedViewportVideoProps): JSX.Element => {
  const [local, videoProps] = splitProps(props, ['label'])
  return (
    <IdleGate
      fallback={
        <DeferredSkeleton
          role="status"
          aria-live="polite"
          aria-label={`Loading ${local.label ?? 'video'}`}
          class="h-full w-full"
        />
      }
    >
      <ViewportVideo {...videoProps} />
    </IdleGate>
  )
}

export default GatedViewportVideo
