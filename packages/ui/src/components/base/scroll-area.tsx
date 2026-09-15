import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

// No headless primitive is needed here: the Radix version only added a custom
// overlay scrollbar, which duplicated native behavior. A plain overflow
// container keeps the DOM simpler and the platform's own scrolling semantics
// (momentum, pinch, keyboard) intact.
type ScrollAreaProps = ComponentProps<'div'> & {
  className?: string
  viewportClassName?: string
}

function ScrollArea(props: ScrollAreaProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'viewportClassName', 'children'])
  return (
    <div
      data-slot="scroll-area"
      class={cn('relative overflow-hidden', local.class, local.className)}
      {...others}
    >
      <div
        data-slot="scroll-area-viewport"
        class={cn('h-full w-full overflow-auto rounded-[inherit]', local.viewportClassName)}
      >
        {local.children}
      </div>
    </div>
  )
}

// Kept as a no-op for call-site compatibility: the browser's own scrollbar is
// used now, so there is no custom bar to render.
function ScrollBar(_props: { className?: string; orientation?: 'vertical' | 'horizontal' }) {
  return null
}

export { ScrollArea, ScrollBar }
