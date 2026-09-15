'use client'

import { createEffect, createSignal } from 'solid-js'
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
  summary: JSX.Element | JSX.Element[]
}

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem = (props: ExpandableListItemProps) => {
  const {
  checkboxSelection,
  details,
  onSelect,
  panelClass,
  row,
  scrollOptions,
  scrollToSelected,
  selected,
  summary,
} = props
  const panelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = createSignal(false)

  createEffect(() => {
    if (selected && scrollToSelected && panelRef.current) {
      panelRef.current.scrollIntoView(scrollOptions || { behavior: 'smooth', block: 'center' })
    }
  }, [selected, scrollToSelected, scrollOptions])

  return (
    <div ref={panelRef} class={cn(panelClass)}>
      <Accordion
        type="single"
        collapsible
        value={expanded ? 'row' : undefined}
        onValueChange={(value) => setExpanded(value === 'row')}
      >
        <AccordionItem value="row" class="border-0">
          <div class="flex items-center gap-2">
            {checkboxSelection && (
              <Checkbox
                aria-label={`Select ${String(row.id ?? row.user_id ?? 'row')}`}
                checked={selected}
                onCheckedChange={() => onSelect(row)}
              />
            )}
            <AccordionTrigger
              class={cn(
                'min-w-0 p-0 text-sm font-medium text-foreground hover:no-underline',
                '[&>svg]:size-6 [&>svg]:text-foreground [&>svg]:stroke-[1.5]'
              )}
            >
              <span class="flex w-full items-center">{summary}</span>
            </AccordionTrigger>
          </div>
          <AccordionContent class="p-0">
            <span class="block w-full text-sm text-muted-foreground opacity-50">{details}</span>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ExpandableListItem
