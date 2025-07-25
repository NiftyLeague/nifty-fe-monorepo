import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion';

interface AccordionItemProps {
  question: string;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemProps[];
}

const AnimatedAccordion = ({ items }: AccordionProps) => {
  return (
    <AnimatedWrapper>
      <div className="transition-fade-quick transition-fade-start delay-normal bg-card border-1 rounded-md">
        <Accordion type="single" collapsible>
          {items.map(({ question, answer }, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="px-4 md:px-6">{question}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedWrapper>
  );
};

export default AnimatedAccordion;
