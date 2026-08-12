'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'

import { FAQS } from '@/constants/faq'

export default function OverviewFAQ() {
  return (
    <div className="bg-card border-1 rounded-md">
      <Accordion type="single" collapsible defaultValue="item-1">
        {FAQS.map(({ question, answer }, index) => (
          <AccordionItem value={`item-${index + 1}`} key={question}>
            <AccordionTrigger className="px-4 md:px-6">{question}</AccordionTrigger>
            <AccordionContent className="px-4 md:px-6 text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
