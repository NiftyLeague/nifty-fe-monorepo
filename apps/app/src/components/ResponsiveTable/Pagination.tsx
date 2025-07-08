import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import { TablePaginationProps } from './types';

interface PaginationProps {
  component?: React.ElementType;
  count: number;
  onChangePage: (event: React.MouseEvent | null, page: number) => void;
  page: number;
  rowsPerPage: number;
  TablePaginationProps?: TablePaginationProps;
}

const Pagination: React.FC<PaginationProps> = ({
  component,
  count,
  onChangePage,
  page,
  rowsPerPage,
  TablePaginationProps,
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
