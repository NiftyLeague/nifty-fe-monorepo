import React, { useEffect, useRef } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import type {
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummaryProps,
  Row,
  SvgIconProps,
  TypographyProps,
} from './types';

type ExpandableListItemProps = {
  AccordionDetailsProps?: AccordionDetailsProps;
  AccordionDetailsTypographyProps?: TypographyProps<'div'>;
  AccordionMoreIconProps?: SvgIconProps;
  AccordionProps?: AccordionProps;
  AccordionSummaryProps?: AccordionSummaryProps;
  AccordionSummaryTypographyProps?: TypographyProps;
  checkboxSelection?: boolean;
  details: React.ReactNode;
  onSelect: (row: Row) => void;
  panelClass?: string;
  row: Row;
  scrollOptions?: ScrollIntoViewOptions;
  scrollToSelected: boolean;
  selected: boolean;
  SelectedAccordionProps?: AccordionProps;
  summary: React.ReactNode | React.ReactNode[];
};

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem: React.FC<ExpandableListItemProps> = ({
  AccordionDetailsProps,
  AccordionDetailsTypographyProps,
  AccordionMoreIconProps,
  AccordionProps,
  AccordionSummaryProps,
  AccordionSummaryTypographyProps,
  checkboxSelection,
  details,
  onSelect,
  panelClass,
  row,
  scrollOptions,
  scrollToSelected,
  selected,
  SelectedAccordionProps,
  summary,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && scrollToSelected && panelRef.current) {
      panelRef.current.scrollIntoView(scrollOptions || { behavior: 'smooth', block: 'center' });
    }
  }, [selected, scrollToSelected, scrollOptions]);

  const handleSelect: React.MouseEventHandler<HTMLButtonElement> = event => {
    onSelect(row);
    event.stopPropagation();
  };

  const rootProps = selected ? { ...AccordionProps, ...SelectedAccordionProps } : AccordionProps;

  return (
    <Accordion sx={{ marginBottom: 0 }} className={panelClass && panelClass} {...rootProps} ref={panelRef}>
      <AccordionSummary expandIcon={<ExpandMoreIcon {...AccordionMoreIconProps} />} {...AccordionSummaryProps}>
        {checkboxSelection && (
          <Checkbox style={{ padding: `0 10px 5px 0` }} checked={selected} onClick={handleSelect} />
        )}
        <Typography
          style={{
            width: '100%',
            display: 'flex',
          }}
          variant="subtitle1"
          {...AccordionSummaryTypographyProps}
        >
          {summary}
        </Typography>
      </AccordionSummary>
      <AccordionDetails {...AccordionDetailsProps}>
        <Typography
          style={{
            opacity: 0.5,
            width: '100%',
          }}
          gutterBottom
          component="div"
          {...AccordionDetailsTypographyProps}
        >
          {details}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpandableListItem;
