import Link from 'next/link'
import { Button } from '@nl/ui/base/button'
import SectionTitle from '@/components/sections/SectionTitle'
import RentalsTableSimple from './RentalsTableSimple'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import type { FC } from 'react'
import type { Rentals } from '@/types/rentals'
import { transformRentals } from '@/app/(private-routes)/dashboard/_utils/transformRentals'

export interface ColumnType {
  id:
    | 'renter'
    | 'playerNickname'
    | 'degenId'
    | 'winRate'
    | 'profits'
    | 'netEarning'
    | 'roi'
    | 'earningCap'
    | 'earningCapProgress'
    | 'rentalRenewsIn'
  label: string
  minWidth?: number
  align?: 'center'
}

const columns: ColumnType[] = [
  { id: 'renter', label: 'Player Address', minWidth: 150, align: 'center' },
  { id: 'playerNickname', label: 'Player Nickname', minWidth: 150 },
  { id: 'earningCap', label: 'Earning Cap', minWidth: 150 },
  { id: 'rentalRenewsIn', label: 'Rental Renews In', minWidth: 150, align: 'center' },
  { id: 'degenId', label: 'Degen ID', minWidth: 100, align: 'center' },
  { id: 'winRate', label: 'Win Rate', minWidth: 120, align: 'center' },
  { id: 'profits', label: 'Gross Gameplay Earnings', minWidth: 200, align: 'center' },
  { id: 'netEarning', label: 'Your NET Earnings', minWidth: 150, align: 'center' },
  { id: 'roi', label: 'ROI %', minWidth: 80, align: 'center' },
]
interface MyRentalsProps {
  rentals: Rentals[]
}
const MyRentals: FC<MyRentalsProps> = ({ rentals }): React.ReactNode => {
  const { profile } = usePlayerProfile()

  const rows = transformRentals(rentals, profile?.id || '')

  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="col-span-12">
        <SectionTitle
          firstSection
          actions={
            <div className="flex flex-row gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/rentals">View All Rentals</Link>
              </Button>
            </div>
          }
        >
          My Rentals
        </SectionTitle>
      </div>
      <div className="col-span-12 h-full">
        <RentalsTableSimple rentals={rows} columns={columns} />
      </div>
    </div>
  )
}

export default MyRentals
