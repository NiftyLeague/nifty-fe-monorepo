'use client';

import { useEffect, useState, ReactElement } from 'react';

// material-ui
import Box from '@mui/material/Box';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

import { Icon } from '@nl/ui/base/icon';

type AccordionItem = {
  id: string;
  title: ReactElement | string;
  content: ReactElement | string;
  disabled?: boolean;
  expanded?: boolean;
  defaultExpand?: boolean | undefined;
};

interface accordionProps {
  data: AccordionItem[];
  defaultExpandedId?: string | boolean | null;
  expandIcon?: ReactElement;
  square?: boolean;
  toggle?: boolean;
}

// ==============================|| ACCORDION ||============================== //

const Accordion = ({ data, defaultExpandedId = null, expandIcon, square, toggle }: accordionProps) => {
  const [expanded, setExpanded] = useState<string | boolean | null>(null);
  const handleChange = (panel: string) => (event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
    toggle && setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(defaultExpandedId);
  }, [defaultExpandedId]);

  return (
    <Box sx={{ width: '100%' }}>
      {data &&
        data.map((item: AccordionItem) => (
          <MuiAccordion
            key={item.id}
            defaultExpanded={!item.disabled && item.defaultExpand}
            expanded={(!toggle && !item.disabled && item.expanded) || (toggle && expanded === item.id)}
            disabled={item.disabled}
            square={square}
            onChange={handleChange(item.id)}
          >
            <MuiAccordionSummary
              expandIcon={expandIcon || expandIcon === false ? expandIcon : <Icon name="chevron-down" />}
              sx={{ color: 'var(--color-foreground)', fontWeight: 500 }}
            >
              {item.title}
            </MuiAccordionSummary>
            <MuiAccordionDetails>{item.content}</MuiAccordionDetails>
          </MuiAccordion>
        ))}
    </Box>
  );
};

export default Accordion;
