import * as SelectPrimitive from '@kobalte/core/select'
import { splitProps, type ComponentProps, type JSX } from 'solid-js'
import { CheckIcon, ChevronDownIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'

// Kobalte's Select is options-driven rather than declarative: pass `options`
// plus `optionValue`/`optionTextValue` on the root, and items render through
// `itemComponent` (SelectItem below is the default).
type SelectProps<Option = string> = SelectPrimitive.SelectRootProps<Option> &
  Omit<SelectPrimitive.SelectRootCommonProps<HTMLElement>, 'id'> &
  Omit<ComponentProps<'div'>, 'onChange'> & {
    id?: string
    className?: string
    /** Radix-era alias for Kobalte's `onChange`. */
    onValueChange?: (value: Option | Option[] | null) => void
  }

function Select<Option = string>(props: SelectProps<Option>) {
  const [local, others] = splitProps(props, ['onValueChange', 'multiple'])
  // Kobalte discriminates single/multiple selection on literal `multiple` and
  // requires `options`; both flow through the caller's props, so bind the
  // root's prop type explicitly at this wrapper boundary.
  const rootProps = {
    'data-slot': 'select',
    multiple: (local.multiple ?? false) as true,
    onChange: local.onValueChange as never,
    ...others,
  } as ComponentProps<typeof SelectPrimitive.Root>
  return <SelectPrimitive.Root {...rootProps} />
}

// Radix auto-rendered the selected option's text; Kobalte exposes a render
// prop, so default to the selected option (or its text value when options are
// objects).
function SelectValue<Option = string>(
  props: SelectPrimitive.SelectValueProps<Option> & ComponentProps<'span'>
) {
  return (
    <SelectPrimitive.Value data-slot="select-value" {...props}>
      {(state) => {
        const selected = state.selectedOption() as Option | { label?: string } | null | undefined
        if (selected && typeof selected === 'object') return (selected as { label?: string }).label
        return selected as JSX.Element
      }}
    </SelectPrimitive.Value>
  )
}

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
  className?: string
  size?: 'sm' | 'default'
}

function SelectTrigger(props: SelectTriggerProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'size', 'children'])
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={local.size ?? 'default'}
      class={cn(
        "border-input data-placeholder-shown:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
        local.className
      )}
      {...others}
    >
      {local.children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon class="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent(
  props: ComponentProps<typeof SelectPrimitive.Content> & { className?: string }
) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        class={cn(
          'bg-popover text-popover-foreground data-expanded:animate-in data-closed:animate-out data-closed:fade-out-0 data-expanded:fade-in-0 data-closed:zoom-out-95 data-expanded:zoom-in-95 relative z-50 max-h-(--kb-popper-content-available-height) min-w-(--kb-popper-trigger-width) origin-(--kb-popper-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
          local.class,
          local.className
        )}
        {...others}
      >
        <SelectPrimitive.Listbox class="p-1" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// Rendered through the root's `itemComponent` prop; `item` is the option object.
function SelectItem(props: ComponentProps<typeof SelectPrimitive.Item> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      class={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
        local.className
      )}
      {...others}
    >
      <SelectPrimitive.ItemLabel>{props.item?.rawValue as JSX.Element}</SelectPrimitive.ItemLabel>
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon class="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectLabel(props: ComponentProps<typeof SelectPrimitive.Label> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      class={cn('text-muted-foreground px-2 py-1.5 text-xs', local.class, local.className)}
      {...others}
    />
  )
}

function SelectSeparator(props: ComponentProps<'hr'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <hr
      data-slot="select-separator"
      class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', local.class, local.className)}
      {...others}
    />
  )
}

// `SelectGroup`, `SelectScrollUpButton`, and `SelectScrollDownButton` from the
// Radix API have no Kobalte equivalent — group via `options` sections, and the
// popper scrolls natively.

export {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
