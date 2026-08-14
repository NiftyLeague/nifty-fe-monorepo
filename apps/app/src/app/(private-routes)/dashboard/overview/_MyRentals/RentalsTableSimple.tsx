import type { RentalDataGrid } from '@/types/rentalDataGrid'
import type { ColumnType } from '.'
import { Countdown } from '@nl/ui/base/countdown'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'
import { formatNumberToDisplay } from '@nl/ui/utils'
import ProgressBar from '@/components/wrapper/ProgressBar'

interface RentalsTableSimpleProps {
  rentals: RentalDataGrid[]
  columns: ColumnType[]
}

const renderRentalCell = (rental: RentalDataGrid, column: ColumnType): React.ReactNode => {
  const value = rental[column.id as keyof RentalDataGrid]

  if (column.id === 'earningCap') {
    return (
      <span className="text-base">
        {formatNumberToDisplay(rental.totalEarnings)} / {formatNumberToDisplay(value as number)}
      </span>
    )
  }

  if (column.id === 'rentalRenewsIn') {
    return (
      <span className="text-warning">
        <Countdown date={new Date((value as number) * 1000)} />
      </span>
    )
  }

  if (column.id === 'winRate') {
    return <>{formatNumberToDisplay(value as number)}%</>
  }

  if (column.id === 'profits' || column.id === 'netEarning') {
    return formatNumberToDisplay(value as number)
  }

  if (column.id === 'earningCapProgress') {
    const val = (100 / rental.earningCap) * (rental.totalEarnings ?? 0)

    return (
      <ProgressBar value={val}>
        {rental.earningCap !== rental.totalEarnings ? (
          `${rental.totalEarnings} / ${rental.earningCap}`
        ) : (
          <span className="text-[10px]">
            LIMIT REACHED. RENEWS IN{' '}
            <span className="text-[10px] text-warning">
              <Countdown date={new Date((rental.rentalRenewsIn ?? 0) * 1000)} />
            </span>
          </span>
        )}
      </ProgressBar>
    )
  }

  return value
}

const RentalsTableSimple = ({ rentals, columns }: RentalsTableSimpleProps): React.ReactNode => (
  <div className="h-full w-full overflow-hidden rounded-none bg-transparent">
    <div className="h-full max-h-[750px] overflow-auto rounded-lg border bg-background">
      <Table aria-label="simple table" className="border-collapse">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="border-0 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                scope="col"
                align={column.align}
                style={{ minWidth: column.minWidth }}
                className="px-4 py-3 font-medium text-muted-foreground"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals?.length > 0 ? (
            rentals.map((rental) => (
              <TableRow key={rental.rentalId || rental.id} className="border-0 hover:bg-accent/50">
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} className="px-4 py-3">
                    {renderRentalCell(rental, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-full px-4 py-3">
                <span className="text-muted-foreground">You don&apos;t have any rentals yet</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
)

export default RentalsTableSimple
