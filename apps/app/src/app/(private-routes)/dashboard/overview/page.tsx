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

const DashboardOverview = (): JSX.Element => {
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
    <Grid container flexDirection="row" spacing={4} sx={{ maxHeight: 'cacl(100vh - 100px)' }}>
      <Grid item xs={12} md={12} lg={5}>
        <Grid container flexDirection="column" spacing={6}>
          <Grid item xs={12}>
            <MyNFTL />
          </Grid>
          <Grid item xs={12}>
            <MyStats />
          </Grid>
          {/* <Grid item xs={12}>
            <EarningCap rentals={rentals} />
          </Grid>
          <Grid item xs={12}>
            <MyRentals rentals={rentals} />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} lg={7}>
        <Grid container flexDirection="column" spacing={{ lg: 6, xs: 4, md: 4 }}>
          <Grid item xs={12}>
            <MyDegens />
          </Grid>
          <Grid item xs={12}>
            <MyComics />
          </Grid>
          <Grid item xs={12}>
            <MyItems />
          </Grid>
        </Grid>
      </Grid>
      {/* {rental && (
        <ActiveRentalDialog degenId={rentals[0].degen_id} rental={rental} />
      )} */}
    </Grid>
  );
};

export default DashboardOverview;
