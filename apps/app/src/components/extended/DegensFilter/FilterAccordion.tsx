import type { JSX } from 'solid-js'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import { cn } from '@nl/ui/utils'

import styles from './index.module.css'

interface Props {
  summary: JSX.Element
  children: JSX.Element
  expanded?: boolean
  length?: number
}

const FilterAccordion = ({
  summary,
  children,
  expanded = true,
  length = 0,
}: Props): JSX.Element => {
  return (
    <Accordion type="single" collapsible defaultValue={expanded ? 'item' : undefined}>
      <AccordionItem value="item" class="w-full border-0 bg-transparent">
        <AccordionTrigger class="min-h-9 px-3.5 py-0 hover:no-underline">
          <div class="flex w-full items-center justify-between">
            {summary}
            {length > 0 && <span class="mr-1 text-[10px] text-[#D7DCFF]">{length}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent class={cn('filter-content-gutter', styles.filterContent)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterAccordion
