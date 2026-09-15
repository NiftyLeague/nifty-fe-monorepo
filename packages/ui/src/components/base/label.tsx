import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '@nl/ui/utils'

type LabelProps = ComponentProps<'label'> & {
  className?: string
  /** Radix-era alias for Solid's `for`. */
  htmlFor?: string
}

function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'htmlFor'])
  return (
    <label
      data-slot="label"
      for={local.htmlFor}
      class={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

export { Label }
