'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import { cn } from '@nl/ui/utils'

import type { Row } from './types'

interface ExpandableListItemProps {
  checkboxSelection?: boolean
  details: React.ReactNode
  onSelect: (row: Row) => void
  panelClass?: string
  row: Row
  scrollOptions?: ScrollIntoViewOptions
  scrollToSelected: boolean
  selected: boolean
  summary: React.ReactNode | React.ReactNode[]
}

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem: React.FC<ExpandableListItemProps> = ({
  checkboxSelection,
  details,
  onSelect,
  panelClass,
  row,
  scrollOptions,
  scrollToSelected,
  selected,
  summary,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (selected && scrollToSelected && panelRef.current) {
      panelRef.current.scrollIntoView(scrollOptions || { behavior: 'smooth', block: 'center' })
    }
  }, [selected, scrollToSelected, scrollOptions])

  return (
    <div ref={panelRef} className={cn(panelClass)}>
      <Accordion
        type="single"
        collapsible
        value={expanded ? 'row' : undefined}
        onValueChange={(value) => setExpanded(value === 'row')}
      >
        <AccordionItem value="row" className="border-0">
          <div className="flex items-center gap-2">
            {checkboxSelection && (
              <Checkbox
                aria-label={`Select ${String(row.id ?? row.user_id ?? 'row')}`}
                checked={selected}
                onCheckedChange={() => onSelect(row)}
              />
            )}
            <AccordionTrigger
              className={cn(
                'min-w-0 p-0 text-sm font-medium text-foreground hover:no-underline',
                '[&>svg]:size-6 [&>svg]:text-foreground [&>svg]:stroke-[1.5]'
              )}
            >
              <span className="flex w-full items-center">{summary}</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="p-0">
            <span className="block w-full text-sm text-muted-foreground opacity-50">{details}</span>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ExpandableListItem
