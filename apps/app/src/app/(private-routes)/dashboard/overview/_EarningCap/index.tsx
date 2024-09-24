import { Grid2 } from '@mui/material';
import SectionTitle from '@/components/sections/SectionTitle';
import usePlayerProfile from '@/hooks/usePlayerProfile';
import { transformRentals } from '@/app/(private-routes)/dashboard/_utils/transformRentals';
import { FC } from 'react';
import { sectionSpacing } from '@nl/theme';
import type { Rentals } from '@/types/rentals';
import { ColumnType } from '../_MyRentals';
import RentalsTableSimple from '../_MyRentals/RentalsTableSimple';
interface EarningCapProps {
  rentals: Rentals[];
  hideTitle?: boolean;
}
const EarningCap: FC<EarningCapProps> = ({ rentals, hideTitle }) => {
  const { profile } = usePlayerProfile();

  const rows = transformRentals(rentals, profile?.id || '');
  const columns: ColumnType[] = [
    {
      id: 'degenId',
      label: 'DEGEN ID',
    },
    {
      id: 'earningCapProgress',
      label: 'Earnings Cap',
    },
  ];
  return (
    <Grid2 container spacing={sectionSpacing} sx={{ height: '100%' }}>
      {!hideTitle && (
        <Grid2 size={{ xs: 12 }}>
          <SectionTitle firstSection>Earnings Cap</SectionTitle>
        </Grid2>
      )}
      <Grid2 size={{ xs: 12 }} sx={{ height: '100%' }}>
        <RentalsTableSimple rentals={rows} columns={columns} />
      </Grid2>
    </Grid2>
  );
};

export default EarningCap;
