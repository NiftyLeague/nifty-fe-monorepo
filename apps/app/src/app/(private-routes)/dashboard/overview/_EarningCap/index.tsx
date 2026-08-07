import SectionTitle from '@/components/sections/SectionTitle'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { transformRentals } from '@/app/(private-routes)/dashboard/_utils/transformRentals'
import { FC } from 'react'
import type { Rentals } from '@/types/rentals'
import { ColumnType } from '../_MyRentals'
import RentalsTableSimple from '../_MyRentals/RentalsTableSimple'
interface EarningCapProps {
  rentals: Rentals[]
  hideTitle?: boolean
}
const EarningCap: FC<EarningCapProps> = ({ rentals, hideTitle }) => {
  const { profile } = usePlayerProfile()

  const rows = transformRentals(rentals, profile?.id || '')
  const columns: ColumnType[] = [
    { id: 'degenId', label: 'DEGEN ID' },
    { id: 'earningCapProgress', label: 'Earnings Cap' },
  ]
  return (
    <div className="grid h-full grid-cols-12 gap-4">
      {!hideTitle && (
        <div className="col-span-12">
          <SectionTitle firstSection>Earnings Cap</SectionTitle>
        </div>
      )}
      <div className="col-span-12 h-full">
        <RentalsTableSimple rentals={rows} columns={columns} />
      </div>
    </div>
  )
}

export default EarningCap
