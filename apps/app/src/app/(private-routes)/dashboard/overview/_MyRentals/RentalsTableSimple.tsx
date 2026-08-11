import type { RentalDataGrid } from '@/types/rentalDataGrid'
import type { ColumnType } from '.'
import { Countdown } from '@nl/ui/base/countdown'
import { formatNumberToDisplay } from '@nl/ui/utils'
import ProgressBar from '@/components/wrapper/ProgressBar'

interface RentalsTableSimpleProps {
  rentals: RentalDataGrid[]
  columns: ColumnType[]
}

const RentalsTableSimple = ({ rentals, columns }: RentalsTableSimpleProps): React.ReactNode => (
  <div className="h-full w-full overflow-hidden rounded-none bg-transparent">
    <div className="h-full max-h-[750px] overflow-auto rounded-lg border bg-background">
      <table className="w-full border-collapse text-sm" aria-label="simple table">
        <thead className="sticky top-0 z-10 bg-background">
          <tr>
            {columns.map((column: ColumnType) => (
              <th
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                className="px-4 py-3 font-medium text-muted-foreground"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rentals?.length > 0 ? (
            rentals.map((rental: RentalDataGrid) => (
              <tr key={rental.rentalId || rental.id} className="hover:bg-accent/50">
                {columns.map((column: ColumnType) => {
                  const value = rental[column.id as keyof RentalDataGrid]
                  if (column.id === 'earningCap') {
                    return (
                      <td key={column.id} align={column.align} className="px-4 py-3">
                        <span className="text-base">
                          {formatNumberToDisplay(rental.totalEarnings)} /{' '}
                          {formatNumberToDisplay(value as number)}
                        </span>
                      </td>
                    )
                  }

                  if (column.id === 'rentalRenewsIn') {
                    return (
                      <td key={column.id} align={column.align} className="px-4 py-3">
                        <span className="text-warning">
                          <Countdown date={new Date((value as number) * 1000)} />
                        </span>
                      </td>
                    )
                  }

                  if (column.id === 'winRate') {
                    return (
                      <td key={column.id} align={column.align} className="px-4 py-3">
                        {formatNumberToDisplay(value as number)}%
                      </td>
                    )
                  }

                  if (column.id === 'profits' || column.id === 'netEarning') {
                    return (
                      <td key={column.id} align={column.align} className="px-4 py-3">
                        {formatNumberToDisplay(value as number)}
                      </td>
                    )
                  }

                  if (column.id === 'earningCapProgress') {
                    const val = (100 / rental.earningCap) * (rental.totalEarnings ?? 0)
                    return (
                      <td key={column.id} align={column.align} className="px-4 py-3">
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
                      </td>
                    )
                  }

                  return (
                    <td key={column.id} align={column.align} className="px-4 py-3">
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="h-full px-4 py-3">
                <span className="text-muted-foreground">You don&apos;t have any rentals yet</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export default RentalsTableSimple
