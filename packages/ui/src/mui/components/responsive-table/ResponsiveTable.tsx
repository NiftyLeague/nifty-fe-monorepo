/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Dispatch, SetStateAction } from 'react';
import Hidden from '@mui/material/Hidden';

import DataList from './DataList';
import DataTable from './DataTable';
import { Breakpoint } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
type ResponsiveTableProps = {
  checkboxSelection?: boolean;
  columns: GridColDef[];
  count: number;
  data: any[];
  DataGridProps?: any;
  excludePrimaryFromDetails?: boolean;
  ExpansionPanelDetailsProps?: any;
  ExpansionPanelDetailsTypographyProps?: any;
  ExpansionPanelMoreIconProps?: any;
  ExpansionPanelProps?: any;
  ExpansionPanelSummaryProps?: any;
  ExpansionPanelSummaryTypographyProps?: any;
  implementation?: 'js' | 'css';
  listBreakpoints?: Breakpoint[];
  noContentText?: string;
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>;
  onSelectionChange?: (selected: any) => void;
  paginationModel: { pageSize: number; page: number };
  rowsClassArray?: any[];
  showPagination: boolean;
  TableBodyCellProps?: any;
  TableBodyProps?: any;
  TableBodyRowProps?: any;
  tableBreakpoints?: Breakpoint[];
  TableHeadCellProps?: any;
  TableHeadProps?: any;
  TableHeadRowProps?: any;
  TablePaginationProps?: any;
  TableProps?: any;
};

/**
 * Responsive read-only table (desktop devices) <-> read-only expandable list (tablet/mobile devices) for material-ui 1.0-beta.
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  checkboxSelection,
  columns,
  count,
  data,
  DataGridProps,
  excludePrimaryFromDetails,
  ExpansionPanelDetailsProps,
  ExpansionPanelDetailsTypographyProps,
  ExpansionPanelMoreIconProps,
  ExpansionPanelProps,
  ExpansionPanelSummaryProps,
  ExpansionPanelSummaryTypographyProps,
  implementation,
  listBreakpoints,
  noContentText,
  onPaginationModelChange,
  onSelectionChange,
  paginationModel,
  rowsClassArray,
  showPagination,
  TableBodyCellProps,
  TableBodyProps,
  TableBodyRowProps,
  tableBreakpoints,
  TableHeadCellProps,
  TableHeadProps,
  TableHeadRowProps,
  TablePaginationProps,
  TableProps,
}) => {
  const handleChangePage = (event: React.MouseEvent | null, page: number) => {
    onPaginationModelChange(model => ({ page, pageSize: model.pageSize }));
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
          DataGridProps={DataGridProps}
          noContentText={noContentText}
          onPaginationModelChange={onPaginationModelChange}
          paginationModel={paginationModel}
          rowsClassArray={rowsClassArray}
          showPagination={showPagination}
          TableBodyCellProps={TableBodyCellProps}
          TableBodyProps={TableBodyProps}
          TableBodyRowProps={TableBodyRowProps}
          TableHeadCellProps={TableHeadCellProps}
          TableHeadProps={TableHeadProps}
          TableHeadRowProps={TableHeadRowProps}
          TablePaginationProps={TablePaginationProps}
          TableProps={TableProps}
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
          page={paginationModel.page}
          rowsPerPage={paginationModel.pageSize}
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
