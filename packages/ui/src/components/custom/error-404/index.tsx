import { splitProps, type ComponentProps } from 'solid-js'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { cn } from '@nl/ui/utils'

export function Error404(props: ComponentProps<'div'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      class={cn(
        `flex min-h-[95vh] mt-[5vh] items-center justify-center bg-transparent text-foreground`,
        local.class,
        local.className
      )}
      {...others}
    >
      <div class="flex w-full flex-col items-center justify-center gap-4">
        <div class="relative mx-auto w-full max-w-180 aspect-[720/360]">
          <OptimizedImage src="/img/maintenance/img-error-bg-dark.svg" alt="Background Dark" fill />
          <OptimizedImage src="/img/maintenance/img-error-bg.svg" alt="Background Light" fill />
          <OptimizedImage
            src="/img/maintenance/img-error-text.svg"
            alt="404 Text"
            fill
            class="animate-[custom-bounce_3s_ease-in-out_infinite]"
          />
          <OptimizedImage
            src="/img/maintenance/img-error-blue.svg"
            alt="Blue Shapes"
            fill
            class="animate-[wings_15s_ease-in-out_infinite]"
          />
          <OptimizedImage
            src="/img/maintenance/img-error-purple.svg"
            alt="Purple Shapes"
            fill
            class="animate-[wings_12s_ease-in-out_infinite]"
          />
        </div>
        <div class="mx-auto px-4 max-w-137.5 text-center">
          <div class="flex flex-col gap-4">
            <h4>Something is wrong...</h4>
            <p class="text-base">
              The page you are looking for was moved, removed, renamed, or might have never existed!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error404
