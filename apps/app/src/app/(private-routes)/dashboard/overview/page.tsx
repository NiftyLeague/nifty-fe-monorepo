'use client';

// import { useEffect, useState } from 'react';
// import ActiveRentalDialog from '@/components/dialog/ActiveRentalDialog';
// import { ALL_RENTAL_API_URL } from '@/constants/url';
// import useFetch from '@/hooks/useFetch';
// import type { Rentals } from '@/types/rentals';
// import EarningCap from './EarningCap';
// import MyRentals from './MyRentals';
// import useAuth from '@/hooks/useAuth';
import { Grid } from '@mui/material';
import MyComics from './MyComics';
import MyDegens from './MyDegens';
import MyItems from './MyItems';
import MyNFTL from './_MyNFTL';
import MyStats from './MyStats';

const DashboardOverview = (): React.ReactNode => {
  // const { authToken } = useAuth();
  // const headers = { authorizationToken: authToken || '' };
  // const { data } = useFetch<Rentals[]>(ALL_RENTAL_API_URL, {
  //   headers,
  //   enabled: !!authToken,
  // });

  // const [rental, setRental] = useState<Rentals>();
  // const [rentals, setRentals] = useState<Rentals[]>([] as Rentals[]);

  // useEffect(() => {
  //   if (data) {
  //     setRentals(data);

  //     if (data.length > 0) {
  //       setRental(data[0]);
  //     }
  //   }
  // }, [data]);

  return (
    <Grid container direction="row" spacing={4} sx={{ height: 'inherit' }}>
      <Grid container direction="column" size={{ xs: 12, lg: 5 }} spacing={4}>
        <Grid size={{ xs: 12 }}>
          <MyNFTL />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyStats />
        </Grid>
        {/* <Grid size={{ xs: 12 }}>
          <EarningCap rentals={rentals} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyRentals rentals={rentals} />
        </Grid> */}
      </Grid>
      <Grid container direction="column" size={{ xs: 12, lg: 7 }} spacing={4}>
        <Grid size={{ xs: 12 }}>
          <MyDegens />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyComics />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyItems />
        </Grid>
      </Grid>
      {/* {rental && (
        <ActiveRentalDialog degenId={rentals[0].degen_id} rental={rental} />
      )} */}
    </Grid>
  );
};

export default DashboardOverview;
