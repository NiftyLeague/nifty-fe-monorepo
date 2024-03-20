/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { CellRenderer, LabelRenderer } from './Renderer';
import ExpandableListItem from './ExpandableListItem';
import NoContent from './NoContent';
import Pagination from './Pagination';
import { cloneDeep } from 'lodash';

interface DataListProps {
  data: any[];
  onChangePage: (event: React.MouseEvent | null, page: number) => void;
  onSelectionChange: (params: any) => void;
  rowsClassArray?: string[];
  columns: any[];
  count: number;
  checkboxSelection?: boolean;
  excludePrimaryFromDetails?: boolean;
  noContentText?: string;
  page: number;
  rowsPerPage: number;
  scrollToSelected?: boolean;
  scrollOptions?: any;
  showPagination: boolean;
  ExpansionPanelDetailsProps: any;
  ExpansionPanelDetailsTypographyProps: any;
  ExpansionPanelMoreIconProps: any;
  ExpansionPanelProps: any;
  ExpansionPanelSummaryProps: any;
  ExpansionPanelSummaryTypographyProps: any;
  SelectedExpansionPanelProps?: any;
  TablePaginationProps: any;
}

/**
 * List with expandable items - mobile table analogue
 */
const DataList: React.FC<DataListProps> = props => {
  const {
    data,
    onChangePage,
    onSelectionChange,
    rowsClassArray,
    columns,
    count,
    checkboxSelection,
    excludePrimaryFromDetails,
    noContentText,
    page,
    rowsPerPage,
    scrollToSelected = false,
    scrollOptions,
    showPagination,
    ExpansionPanelDetailsProps,
    ExpansionPanelDetailsTypographyProps,
    ExpansionPanelMoreIconProps,
    ExpansionPanelProps,
    ExpansionPanelSummaryProps,
    ExpansionPanelSummaryTypographyProps,
    SelectedExpansionPanelProps,
    TablePaginationProps,
  } = props;

  const [selection, setSelection] = useState<any[]>([]);

  const handleChangePage = (event: React.MouseEvent | null, page: number) => onChangePage(event, page);

  const handleSelection = (row: any) => {
    const newSelection = cloneDeep(selection);
    if (newSelection.indexOf(row.id) === -1) {
      newSelection.push(row.id);
    } else {
      newSelection.splice(newSelection.indexOf(row.id), 1);
    }
    setSelection(newSelection);
    onSelectionChange({ rowIds: newSelection });
  };

  const handleSelectAll = () => {
    let newSelection = cloneDeep(selection);
    if (newSelection.length > 0) {
      newSelection = [];
    } else {
      newSelection = data.map(row => row.id);
    }
    setSelection(newSelection);
    onSelectionChange({ rowIds: newSelection });
  };

  const getRowClass = (index: number) => {
    return rowsClassArray && rowsClassArray[index] ? rowsClassArray[index] : '';
  };

  const createListItemTitle = (columns: any[], row: any, data: any) => {
    const primaryColumns = columns.filter(column => column.primary);
    return primaryColumns.length === 0 ? (
      <CellRenderer column={columns[0]} row={row} data={data} />
    ) : (
      primaryColumns.map((column, index) => (
        <Typography sx={{ flex: index === 0 ? 0.5 : 1 }} key={column.field}>
          <CellRenderer column={column} row={row} data={data} />
        </Typography>
      ))
    );
  };

  const createListItemDescription = (columns: any[], row: any, data: any, excludePrimary = false) => (
    <div>
      {columns
        .filter(column => !excludePrimary || !column.primary)
        .map((column, index) => (
          <Grid key={`${column.headerName}-${index}`} container>
            <Grid item xs>
              <LabelRenderer column={column} data={data} />
            </Grid>
            <Grid item xs>
              <CellRenderer column={column} row={row} data={data} />
            </Grid>
          </Grid>
        ))}
    </div>
  );

  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(columns) || columns.length === 0) {
    return <NoContent text={noContentText} />;
  }

  return (
    <div>
      {checkboxSelection && (
        <Box style={{ padding: `12px 16px` }}>
          <Checkbox
            style={{ padding: `0 10px 5px 0` }}
            checked={selection.length > 0}
            indeterminate={selection.length > 0}
            onClick={handleSelectAll}
          />
          <Typography component={`span`}>Select All</Typography>
        </Box>
      )}
      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
        <ExpandableListItem
          key={index}
          onSelect={handleSelection}
          panelClass={getRowClass(index)}
          summary={createListItemTitle(columns, row, data)}
          row={row}
          details={createListItemDescription(columns, row, data, excludePrimaryFromDetails)}
          checkboxSelection={checkboxSelection}
          selected={selection.indexOf(row.id) !== -1}
          scrollToSelected={scrollToSelected}
          scrollOptions={scrollOptions}
          ExpansionPanelDetailsProps={ExpansionPanelDetailsProps}
          ExpansionPanelDetailsTypographyProps={ExpansionPanelDetailsTypographyProps}
          ExpansionPanelMoreIconProps={ExpansionPanelMoreIconProps}
          ExpansionPanelProps={ExpansionPanelProps}
          ExpansionPanelSummaryProps={ExpansionPanelSummaryProps}
          ExpansionPanelSummaryTypographyProps={ExpansionPanelSummaryTypographyProps}
          SelectedExpansionPanelProps={SelectedExpansionPanelProps}
        />
      ))}
      {showPagination && (
        <Pagination
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          TablePaginationProps={TablePaginationProps}
          onChangePage={handleChangePage}
        />
      )}
    </div>
  );
};

export default DataList;
