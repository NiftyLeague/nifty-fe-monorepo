'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import Icon from '@nl/ui/base/Icon';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)({
  border: 'none',
  marginBottom: 12,
  backdropFilter: 'blur(65.0688px)',
  backgroundColor: 'transparent',
  borderRadius: 20,

  '& .MuiCollapse-wrapper': { marginBottom: 12 },
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'var(--color-background-3)',
    color: 'var(--color-foreground)',
    fontWeight: 600,
    padding: '12px 24px',
    borderRadius: 20,
  },
  '& .MuiAccordionSummary-expandIconWrapper': { color: 'var(--color-foreground)' },
  '& .MuiAccordionDetails-root': {
    backgroundColor: 'var(--color-background-2)',
    color: 'var(--color-foreground)',
    padding: 24,
    borderRadius: 20,
  },
});

const AnimatedAccordion = ({
  index,
  question,
  answer,
}: {
  index: number;
  question: string;
  answer: React.ReactNode;
}) => {
  return (
    <AnimatedWrapper>
      <div className="transition-fade-quick transition-fade-start delay-normal">
        <StyledAccordion>
          <AccordionSummary
            expandIcon={<Icon name="chevron-down" size="xl" strokeWidth={2.5} />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            {question}
          </AccordionSummary>
          <AccordionDetails>{answer}</AccordionDetails>
        </StyledAccordion>
      </div>
    </AnimatedWrapper>
  );
};

export default AnimatedAccordion;
