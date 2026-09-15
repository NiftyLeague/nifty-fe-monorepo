'use client'

import { createEffect, createSignal, Show, type JSX } from 'solid-js'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import { cn } from '@nl/ui/utils'

import type { Row } from './types'

interface ExpandableListItemProps {
  checkboxSelection?: boolean
  details: JSX.Element
  onSelect: (row: Row) => void
  panelClass?: string
  row: Row
  scrollOptions?: ScrollIntoViewOptions
  scrollToSelected: boolean
  selected: boolean
  summary: JSX.Element
}

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem = (props: ExpandableListItemProps) => {
  const [panel, setPanel] = createSignal<HTMLDivElement>()
  const [expanded, setExpanded] = createSignal(false)

  createEffect(() => {
    const el = panel()
    if (props.selected && props.scrollToSelected && el) {
      el.scrollIntoView(props.scrollOptions || { behavior: 'smooth', block: 'center' })
    }
  })

  return (
    <div ref={setPanel} class={cn(props.panelClass)}>
      <Accordion
        collapsible
        value={expanded() ? 'row' : undefined}
        onValueChange={(value) => setExpanded(value.includes('row'))}
      >
        <AccordionItem value="row" class="border-0">
          <div class="flex items-center gap-2">
            <Show when={props.checkboxSelection}>
              <Checkbox
                aria-label={`Select ${String(props.row.id ?? props.row.user_id ?? 'row')}`}
                checked={props.selected}
                onCheckedChange={() => props.onSelect(props.row)}
              />
            </Show>
            <AccordionTrigger
              class={cn(
                'min-w-0 p-0 text-sm font-medium text-foreground hover:no-underline',
                '[&>svg]:size-6 [&>svg]:text-foreground [&>svg]:stroke-[1.5]'
              )}
            >
              <span class="flex w-full items-center">{props.summary}</span>
            </AccordionTrigger>
          </div>
          <AccordionContent class="p-0">
            <span class="block w-full text-sm text-muted-foreground opacity-50">
              {props.details}
            </span>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ExpandableListItem
