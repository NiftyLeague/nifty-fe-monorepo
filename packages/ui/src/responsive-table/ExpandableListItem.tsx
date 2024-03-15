/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpansionPanel from '@mui/material/Accordion';
import ExpansionPanelSummary from '@mui/material/AccordionSummary';
import ExpansionPanelDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

type ExpandableListItemProps = {
  checkboxSelection?: boolean;
  panelClass?: string;
  details: JSX.Element;
  selected: boolean;
  summary: JSX.Element | JSX.Element[];
  ExpansionPanelDetailsProps?: any;
  ExpansionPanelDetailsTypographyProps?: any;
  ExpansionPanelMoreIconProps?: any;
  ExpansionPanelProps?: any;
  ExpansionPanelSummaryProps?: any;
  ExpansionPanelSummaryTypographyProps?: any;
  SelectedExpansionPanelProps?: any;
  onSelect: (row: any) => void;
  row: any;
  scrollToSelected: boolean;
  scrollOptions?: ScrollIntoViewOptions;
};

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem: React.FC<ExpandableListItemProps> = ({
  checkboxSelection,
  panelClass,
  details,
  selected,
  summary,
  ExpansionPanelDetailsProps,
  ExpansionPanelDetailsTypographyProps,
  ExpansionPanelMoreIconProps,
  ExpansionPanelProps,
  ExpansionPanelSummaryProps,
  ExpansionPanelSummaryTypographyProps,
  SelectedExpansionPanelProps,
  onSelect,
  row,
  scrollToSelected,
  scrollOptions,
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

  const rootProps = selected ? { ...ExpansionPanelProps, ...SelectedExpansionPanelProps } : ExpansionPanelProps;

  return (
    <ExpansionPanel sx={{ marginBottom: 0 }} className={panelClass && panelClass} {...rootProps} ref={panelRef}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon {...ExpansionPanelMoreIconProps} />}
        {...ExpansionPanelSummaryProps}
      >
        {checkboxSelection && (
          <Checkbox style={{ padding: `0 10px 5px 0` }} checked={selected} onClick={handleSelect} />
        )}
        <Typography
          style={{
            width: '100%',
            display: 'flex',
          }}
          variant="subtitle1"
          {...ExpansionPanelSummaryTypographyProps}
        >
          {summary}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails {...ExpansionPanelDetailsProps}>
        <Typography
          style={{
            opacity: 0.5,
            width: '100%',
          }}
          gutterBottom
          component="div"
          {...ExpansionPanelDetailsTypographyProps}
        >
          {details}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ExpandableListItem;
