import { ReactNode } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import { cn } from '@nl/ui/utils'

import styles from './index.module.css'

interface Props {
  summary: ReactNode
  children: ReactNode
  expanded?: boolean
  length?: number
}

const FilterAccordion = ({
  summary,
  children,
  expanded = true,
  length = 0,
}: Props): React.ReactNode => {
  return (
    <Accordion type="single" collapsible defaultValue={expanded ? 'item' : undefined}>
      <AccordionItem value="item" className="w-full border-0 bg-transparent">
        <AccordionTrigger className="min-h-9 px-3.5 py-0 hover:no-underline">
          <div className="flex w-full items-center justify-between">
            {summary}
            {length > 0 && <span className="mr-1 text-[10px] text-[#D7DCFF]">{length}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent className={cn('filter-content-gutter', styles.filterContent)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterAccordion
