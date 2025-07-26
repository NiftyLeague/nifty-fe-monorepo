import { ReactNode } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Stack, Typography } from '@mui/material';
import { Icon } from '@nl/ui/base/icon';

interface Props {
  summary: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  length?: number;
}

const FilterAccordion = ({ summary, children, expanded = true, length = 0 }: Props): React.ReactNode => {
  return (
    <Accordion
      defaultExpanded={expanded}
      sx={{
        background: 'transparent',
        '&.Mui-expanded': { margin: 0 },
        '&:before': { display: 'none' },
        width: '100%',
      }}
    >
      <AccordionSummary
        expandIcon={<Icon name="chevron-down" />}
        sx={{
          minHeight: 36,
          padding: '0px 14px',
          '&.Mui-expanded': { minHeight: 36 },
          '& .MuiAccordionSummary-content': { my: 1, '&.Mui-expanded': { my: 1 } },
        }}
      >
        <Stack width="100%" direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {summary}
          {length > 0 && (
            <Typography sx={{ color: '#D7DCFF' }} fontSize="10px" mr={1}>
              {length}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
