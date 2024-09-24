import { Accordion, AccordionSummary, AccordionDetails, Stack, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactNode } from 'react';

interface Props {
  summary: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  length?: number;
}

const FilterAccordion = ({ summary, children, expanded = true, length = 0 }: Props): JSX.Element => {
  return (
    <Accordion
      defaultExpanded={expanded}
      sx={{
        background: 'transparent',
        '&.Mui-expanded': {
          margin: 0,
        },
        '&:before': {
          display: 'none',
        },
        width: '100%',
      }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownIcon width={18} />}
        sx={{
          minHeight: 36,
          padding: '0px 14px',
          '&.Mui-expanded': {
            minHeight: 36,
          },
          '& .MuiAccordionSummary-content': {
            my: 1,
            '&.Mui-expanded': {
              my: 1,
            },
          },
        }}
      >
        <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
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
