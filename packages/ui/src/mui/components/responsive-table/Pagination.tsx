/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';

interface PaginationProps {
  component?: React.ElementType;
  count: number;
  rowsPerPage: number;
  page: number;
  TablePaginationProps?: any;
  onChangePage: (event: React.MouseEvent | null, page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  component,
  count,
  rowsPerPage,
  page,
  TablePaginationProps,
  onChangePage,
}) => {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    onChangePage(event, page);
  };

  return (
    <TablePagination
      {...TablePaginationProps}
      component={component || TableCell}
      count={count}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[rowsPerPage]}
      page={page}
      onPageChange={handleChangePage}
    />
  );
};

export default Pagination;
