import {
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from '@mui/material';
import type { RentalDataGrid } from '@/types/rentalDataGrid';
import type { ColumnType } from '.';
import { v4 as uuidv4 } from 'uuid';
import Countdown from 'react-countdown';
import { formatNumberToDisplayWithCommas } from '@/utils/numbers';
import ProgressBar from '@/components/wrapper/ProgressBar';

interface RentalsTableSimpleProps {
  rentals: RentalDataGrid[];
  columns: ColumnType[];
}

const RentalsTableSimple = ({ rentals, columns }: RentalsTableSimpleProps): JSX.Element => {
  const { palette } = useTheme();

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 0,
        height: '100%',
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 750,
          backgroundColor: palette.background.default,
          borderRadius: 2,
          border: '1px solid',
          borderColor: palette.border,
          height: '100%',
        }}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column: ColumnType) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals?.length > 0 ? (
              rentals.map((rental: RentalDataGrid) => (
                <TableRow hover key={uuidv4()}>
                  {columns.map((column: ColumnType) => {
                    const value = rental[column.id as keyof RentalDataGrid];
                    if (column.id === 'earningCap') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography>
                            {formatNumberToDisplayWithCommas(rental.totalEarnings)} /{' '}
                            {formatNumberToDisplayWithCommas(value as number)}
                          </Typography>
                        </TableCell>
                      );
                    }

                    if (column.id === 'rentalRenewsIn') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography color={palette.warning.main}>
                            <Countdown date={new Date((value as number) * 1000)} />
                          </Typography>
                        </TableCell>
                      );
                    }

                    if (column.id === 'winRate') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {formatNumberToDisplayWithCommas(value as number)}%
                        </TableCell>
                      );
                    }

                    if (column.id === 'profits' || column.id === 'netEarning') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {formatNumberToDisplayWithCommas(value as number)}
                        </TableCell>
                      );
                    }

                    if (column.id === 'earningCapProgress') {
                      const val = (100 / rental.earningCap) * (rental.totalEarnings ?? 0);
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <ProgressBar value={val}>
                            {rental.earningCap !== rental.totalEarnings ? (
                              `${rental.totalEarnings} / ${rental.earningCap}`
                            ) : (
                              <Typography fontSize={10}>
                                LIMIT REACHED. RENEWS IN{' '}
                                <Typography color={palette.warning.main} variant="caption" fontSize={10}>
                                  <Countdown date={new Date((rental.rentalRenewsIn ?? 0) * 1000)} />
                                </Typography>
                              </Typography>
                            )}
                          </ProgressBar>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ height: '100%' }}>
                  <Typography color={palette.grey[500]}>You don&apos;t have any rentals yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RentalsTableSimple;
