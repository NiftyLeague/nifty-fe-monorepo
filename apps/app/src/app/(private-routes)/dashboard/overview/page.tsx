'use client';

// import { useEffect, useState } from 'react';
// import ActiveRentalDialog from '@/components/dialog/ActiveRentalDialog';
// import { ALL_RENTAL_API_URL } from '@/constants/url';
// import useFetch from '@/hooks/useFetch';
// import type { Rentals } from '@/types/rentals';
// import EarningCap from './EarningCap';
// import MyRentals from './MyRentals';
// import useAuth from '@/hooks/useAuth';
import { Grid2 } from '@mui/material';
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
  // const [rentals, setRentals] = useState<Rentals[] | any>([]);

  // useEffect(() => {
  //   if (data) {
  //     setRentals(data);

  //     if (data.length > 0) {
  //       setRental(data[0]);
  //     }
  //   }
  // }, [data]);

  return (
    <Grid2 container flexDirection="row" spacing={4} sx={{ height: 'inherit' }}>
      <Grid2 container flexDirection="column" size={{ xs: 12, md: 5 }} spacing={4}>
        <Grid2 size={{ xs: 12 }}>
          <MyNFTL />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <MyStats />
        </Grid2>
        {/* <Grid2 size={{ xs: 12 }}>
          <EarningCap rentals={rentals} />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <MyRentals rentals={rentals} />
        </Grid2> */}
      </Grid2>
      <Grid2 container flexDirection="column" size={{ xs: 12, md: 7 }} spacing={4}>
        <MyDegens />
        <MyComics />
        <MyItems />
      </Grid2>
      {/* {rental && (
        <ActiveRentalDialog degenId={rentals[0].degen_id} rental={rental} />
      )} */}
    </Grid2>
  );
};

export default DashboardOverview;
