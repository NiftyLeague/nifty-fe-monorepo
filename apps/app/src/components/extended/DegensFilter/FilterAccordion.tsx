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

const FilterAccordion = (props: Props): JSX.Element => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={(props.expanded ?? true) ? 'item' : undefined}
    >
      <AccordionItem value="item" class="w-full border-0 bg-transparent">
        <AccordionTrigger class="min-h-9 px-3.5 py-0 hover:no-underline">
          <div class="flex w-full items-center justify-between">
            {props.summary}
            {(props.length ?? 0) > 0 && (
              <span
                class="mr-1 text-(--fs-10) text-(--badge-lavender)"
                style={{ '--fs-10': '10px' }}
              >
                {props.length}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent class={cn('filter-content-gutter', styles.filterContent)}>
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterAccordion
