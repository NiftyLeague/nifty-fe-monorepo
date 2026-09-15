import type { JSX } from 'solid-js'

import { cx } from '@nl/ui/class-names'

interface MobileNavigationDisclosureProps {
  children: JSX.Element
  id: string
  label: string
  className?: string
  panelClassName?: string
  summaryClassName?: string
}

/**
 * Native `<details>` disclosure for the compact navigation menu.
 *
 * The summary keeps its implicit button role and the expanded state the browser
 * derives from `<details open>`; an explicit `role="button"` would replace that
 * mapping and drop `aria-expanded` from the accessibility tree, so the toggle
 * announces as a plain button with no state. The accessible name comes from the
 * `sr-only` text rather than an `aria-label`, so the visible control and its
 * name cannot drift apart.
 */
export function MobileNavigationDisclosure(props: MobileNavigationDisclosureProps) {
  return (
    <details class={cx('group relative', props.className)}>
      <summary
        aria-controls={props.id}
        class={cx(
          'flex size-10 cursor-pointer list-none items-center justify-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden',
          props.summaryClassName
        )}
      >
        {/* The bars fold into a cross while open; reduced motion gets the state
            change without the transition. */}
        <span aria-hidden="true" class="flex size-6 flex-col justify-center gap-1.5">
          <span class="h-0.5 w-full rounded-full bg-current transition-transform motion-reduce:transition-none group-open:translate-y-2 group-open:rotate-45" />
          <span class="h-0.5 w-full rounded-full bg-current transition-opacity motion-reduce:transition-none group-open:opacity-0" />
          <span class="h-0.5 w-full rounded-full bg-current transition-transform motion-reduce:transition-none group-open:-translate-y-2 group-open:-rotate-45" />
        </span>
        <span class="sr-only">{props.label}</span>
      </summary>
      <div id={props.id} class={cx(props.panelClassName)}>
        {props.children}
      </div>
    </details>
  )
}

export default MobileNavigationDisclosure
