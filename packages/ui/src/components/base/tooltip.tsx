import * as TooltipPrimitive from '@kobalte/core/tooltip'
import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> & {
  /** Radix-era alias for Kobalte's `gutter`. */
  sideOffset?: number
  /** Radix-era alias for Kobalte's `openDelay`. */
  delayDuration?: number
}

function Tooltip(props: TooltipProps) {
  const [local, others] = splitProps(props, ['sideOffset', 'delayDuration'])
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      gutter={local.sideOffset}
      openDelay={local.delayDuration ?? 0}
      {...others}
    />
  )
}

// Kept for call-site compatibility with the Radix-era API; Kobalte needs no
// provider — a plain fragment wrapper preserves the exported name.
function TooltipProvider(props: { children?: unknown; delayDuration?: number }) {
  return <>{props.children}</>
}

type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger> & {
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

function TooltipTrigger(props: TooltipTriggerProps) {
  const [local, others] = splitProps(props, ['type'])
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      // Same reasoning as the shared Button: an implicit `submit` inside a form
      // would turn a tooltip trigger into a submitter. `asChild` renders the
      // caller's own element, which has no button type.
      {...(props.asChild ? {} : { type: local.type ?? 'button' })}
      {...others}
    />
  )
}

function TooltipContent(
  props: ComponentProps<typeof TooltipPrimitive.Content> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        class={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 w-fit origin-(--kb-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          local.class,
          local.className
        )}
        {...others}
      >
        {local.children}
        <TooltipPrimitive.Arrow class="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
