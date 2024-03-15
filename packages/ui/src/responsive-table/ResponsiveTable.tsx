/* eslint-disable @typescript-eslint/no-explicit-any */

import Hidden from '@mui/material/Hidden';

import DataList from './DataList';
import DataTable from './DataTable';
import { Breakpoint } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
type ResponsiveTableProps = {
  columns: GridColDef[];
  count: number;
  checkboxSelection?: boolean;
  data: any[];
  rowsClassArray?: any[];
  excludePrimaryFromDetails?: boolean;
  noContentText?: string;
  tableBreakpoints?: Breakpoint[];
  listBreakpoints?: Breakpoint[];
  onSelectionChange?: (selected: any) => void;
  page: number;
  rowsPerPage: number;
  showPagination: boolean;
  DataGridProps?: any;
  implementation?: 'js' | 'css';
  ExpansionPanelDetailsProps?: any;
  ExpansionPanelDetailsTypographyProps?: any;
  ExpansionPanelMoreIconProps?: any;
  ExpansionPanelProps?: any;
  ExpansionPanelSummaryProps?: any;
  ExpansionPanelSummaryTypographyProps?: any;
  TableBodyCellProps?: any;
  TableBodyProps?: any;
  TableBodyRowProps?: any;
  TableHeadCellProps?: any;
  TableHeadProps?: any;
  TableHeadRowProps?: any;
  TablePaginationProps?: any;
  TableProps?: any;
  onChangePage: (page: number) => void;
};

/**
 * Responsive read-only table (desktop devices) <-> read-only expandable list (tablet/mobile devices) for material-ui 1.0-beta.
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  count,
  checkboxSelection,
  data,
  rowsClassArray,
  excludePrimaryFromDetails,
  noContentText,
  tableBreakpoints,
  listBreakpoints,
  onSelectionChange,
  page,
  rowsPerPage,
  showPagination,
  DataGridProps,
  implementation,
  ExpansionPanelDetailsProps,
  ExpansionPanelDetailsTypographyProps,
  ExpansionPanelMoreIconProps,
  ExpansionPanelProps,
  ExpansionPanelSummaryProps,
  ExpansionPanelSummaryTypographyProps,
  TableBodyCellProps,
  TableBodyProps,
  TableBodyRowProps,
  TableHeadCellProps,
  TableHeadProps,
  TableHeadRowProps,
  TablePaginationProps,
  TableProps,
  onChangePage,
}) => {
  const handleChangePage = (event: React.MouseEvent | null, page: number) => {
    onChangePage(page);
  };

  const handleSelectionChange = (selected: any) => {
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  };

  return (
    <div>
      {/* DESKTOP BIG TABLE */}
      <Hidden only={tableBreakpoints || ['xs', 'sm', 'md']} implementation={implementation || 'js'}>
        <DataTable
          columns={columns}
          count={count}
          data={data}
          rowsClassArray={rowsClassArray}
          noContentText={noContentText}
          page={page}
          rowsPerPage={rowsPerPage}
          showPagination={showPagination}
          DataGridProps={DataGridProps}
          TableBodyCellProps={TableBodyCellProps}
          TableBodyProps={TableBodyProps}
          TableBodyRowProps={TableBodyRowProps}
          TableHeadCellProps={TableHeadCellProps}
          TableHeadProps={TableHeadProps}
          TableHeadRowProps={TableHeadRowProps}
          TablePaginationProps={TablePaginationProps}
          TableProps={TableProps}
          onChangePage={handleChangePage}
        />
      </Hidden>

      {/* MOBILE EXPANDABLE LIST OF CARDS */}
      <Hidden only={listBreakpoints || ['lg', 'xl']} implementation={implementation || 'js'}>
        <DataList
          columns={columns}
          count={count}
          checkboxSelection={checkboxSelection}
          data={data}
          onSelectionChange={handleSelectionChange}
          rowsClassArray={rowsClassArray}
          excludePrimaryFromDetails={excludePrimaryFromDetails}
          noContentText={noContentText}
          page={page}
          rowsPerPage={rowsPerPage}
          showPagination={showPagination}
          ExpansionPanelDetailsProps={ExpansionPanelDetailsProps}
          ExpansionPanelDetailsTypographyProps={ExpansionPanelDetailsTypographyProps}
          ExpansionPanelMoreIconProps={ExpansionPanelMoreIconProps}
          ExpansionPanelProps={ExpansionPanelProps}
          ExpansionPanelSummaryProps={ExpansionPanelSummaryProps}
          ExpansionPanelSummaryTypographyProps={ExpansionPanelSummaryTypographyProps}
          TablePaginationProps={TablePaginationProps}
          onChangePage={handleChangePage}
        />
      </Hidden>
    </div>
  );
};

export default ResponsiveTable;
