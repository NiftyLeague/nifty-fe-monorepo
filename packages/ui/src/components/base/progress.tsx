import * as ProgressPrimitive from '@kobalte/core/progress'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> & { className?: string }

function Progress(props: ProgressProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'value'])
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      // The value has to reach the primitive: it is what exposes
      // `aria-valuenow`, so without it the bar reports progress visually and
      // tells assistive technology nothing. An undefined value stays
      // indeterminate, which correctly omits the value attribute.
      value={local.value}
      {...others}
    >
      <ProgressPrimitive.Track
        class={cn(
          'bg-primary/20 dark:bg-success/20 relative h-2 w-full overflow-hidden rounded-full',
          local.class,
          local.className
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        <ProgressPrimitive.Fill
          data-slot="progress-indicator"
          class="bg-primary dark:bg-success h-full transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
