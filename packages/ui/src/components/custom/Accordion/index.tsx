'use client';

import { AnimatedWrapper } from '@nl/ui/custom/animated-wrapper';
import { Accordion as AccordionBase, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion';

interface AccordionItemProps {
  question: string | React.ReactNode;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  collapsible?: boolean;
  defaultValue?: `item-${number}` | `item-${number}`[];
  items: AccordionItemProps[];
  type?: 'single' | 'multiple';
}

export function Accordion({ collapsible = true, defaultValue, items, type = 'single' }: AccordionProps) {
  return (
    <AnimatedWrapper>
      <div className="transition-fade-quick transition-fade-start delay-normal bg-card border-1 rounded-md">
        <AccordionBase collapsible={collapsible} defaultValue={defaultValue as undefined} type={type}>
          {items.map(({ question, answer }, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index + 1}>
              <AccordionTrigger className="px-4 md:px-6">{question}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </AccordionBase>
      </div>
    </AnimatedWrapper>
  );
}

export default Accordion;
