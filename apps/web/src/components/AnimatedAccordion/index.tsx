'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AnimatedWrapper } from '@nl/ui/animations';
import { styled } from '@nl/theme';

const StyledAccordion = styled(Accordion)({
  border: 'none',
  marginBottom: 12,
  background: '#1e242b',
  backdropFilter: 'blur(65.0688px)',
  borderRadius: 10,

  '& .MuiCollapse-wrapper': { marginBottom: 12 },
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: 'var(--color-light)',
    fontWeight: 600,
    padding: '12px 24px',
  },
  '& .MuiAccordionDetails-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'var(--color-light)', padding: 24 },
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
            expandIcon={<ExpandMoreIcon />}
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
