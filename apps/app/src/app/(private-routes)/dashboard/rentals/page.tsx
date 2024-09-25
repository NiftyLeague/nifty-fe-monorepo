'use client';

import { useEffect, useState } from 'react';
import { Stack, Typography, FormControl, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import MyRentalsDataGrid from './MyRentalsDataGrid';
import {
  ALL_RENTAL_API_URL,
  ALL_RENTAL_API_URL_INACTIVE,
  MY_RENTAL_API_URL,
  MY_RENTAL_API_URL_INACTIVE,
  RENTED_FROM_ME_API_URL,
} from '@/constants/url';
import type { Rentals, RentalType } from '@/types/rentals';
import SearchRental from './SearchRental';
import InputLabel from '@/components/extended/Form/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import { getUniqueListBy } from '@/utils/array';
import useTeminateRental from '@/hooks/useTeminateRental';
import useAuth from '@/hooks/useAuth';

const DashboardRentalPage = (): JSX.Element => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const [rentals, setRentals] = useState<Rentals[]>([]);
  const [category, setCategory] = useState<RentalType>('all');
  const terminalRental = useTeminateRental();

  const getFetchUrl = (): string[] => {
    switch (category) {
      case 'all':
        return [
          ALL_RENTAL_API_URL,
          ALL_RENTAL_API_URL_INACTIVE,
          RENTED_FROM_ME_API_URL,
          MY_RENTAL_API_URL,
          MY_RENTAL_API_URL_INACTIVE,
        ];
      case 'owned-sponsorship':
      case 'non-owned-sponsorship':
        return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE];

      case 'direct-rental':
      case 'recruited':
        return [MY_RENTAL_API_URL, MY_RENTAL_API_URL_INACTIVE];

      case 'direct-renter':
        return [RENTED_FROM_ME_API_URL];

      default:
        return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE];
    }
  };

  const fetchRentals = async (): Promise<Rentals[]> => {
    const urls = getFetchUrl();
    const responses = await Promise.all(
      urls.map(url =>
        fetch(url, {
          method: 'GET',
          headers,
        }),
      ),
    );

    const rentalArrays = await Promise.all(responses.map(response => response.json()));

    const totalRentals = rentalArrays.reduce((flattened, arr) => [...flattened, ...arr]);
    return getUniqueListBy<Rentals>(totalRentals, 'id');
  };

  const { data, isLoading, isFetching, refetch, isSuccess } = useQuery<Rentals[]>({
    queryKey: ['rentals'],
    queryFn: fetchRentals,
    // TODO: enable if query needed
    enabled: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setRentals(data || []);
    }
  }, [isSuccess, data]);

  const terminateRentalById = async (rentalId: string) => {
    try {
      const result: any = await terminalRental(rentalId);
      if (!result.ok) {
        const errMsg = await result.text();
        toast.error(`Can not terminate the rental: ${errMsg}`, {
          theme: 'dark',
        });
        return;
      }
      const res = await result.json();
      if (res) {
        toast.success('Terminate rental successfully!', { theme: 'dark' });
        refetch();
      }
    } catch (error) {
      toast.error(`Can not terminate the rental: ${error}`, {
        theme: 'dark',
      });
    }
  };

  const updateRentalName = (newName: string, id: string) => {
    const newRentals = rentals.find(ren => ren.id === id);
    const rentalIndex = rentals.findIndex(ren => ren.id === id);

    setRentals([
      ...rentals.slice(0, rentalIndex),
      {
        ...newRentals,
        name: newName,
      },
      ...rentals.slice(rentalIndex + 1),
    ] as Rentals[]);
    refetch();
  };

  const handleSearch = (currentValue: string) => {
    if (currentValue?.trim() === '') {
      if (data) setRentals(data);
      return;
    }
    const newCurrentValue = currentValue.toLowerCase();
    const newRental: any = data?.filter(
      (rental: any) =>
        rental?.accounts?.player?.address.toLowerCase().includes(newCurrentValue) ||
        rental?.degen?.id.toLowerCase().includes(newCurrentValue) ||
        rental?.accounts?.player?.name.toLowerCase().includes(newCurrentValue),
    );
    setRentals(newRental);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    const newCategory = event.target.value as RentalType;
    if (newCategory !== category) {
      setCategory(newCategory);
      setRentals([]);
    } else {
      refetch();
    }
  };

  useEffect(() => {
    if (!authToken) {
      return;
    }

    refetch();
  }, [authToken, category, refetch]);

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        flexWrap="wrap"
        columnGap={3}
        rowGap={1}
      >
        <Typography variant="h2">My Rentals</Typography>

        {/* Header form */}
        <Stack direction="row" rowGap={1} columnGap={2} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Category"
              onChange={handleChangeCategory}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="direct-rental">Direct Rental</MenuItem>
              <MenuItem value="recruited">Recruited</MenuItem>
              <MenuItem value="owned-sponsorship">Owned Sponsorship</MenuItem>
              <MenuItem value="non-owned-sponsorship">Non-Owned Sponsorship</MenuItem>
              <MenuItem value="direct-renter">Direct Renter</MenuItem>
              <MenuItem value="terminated">Terminated</MenuItem>
              <MenuItem value="full-history">Full History</MenuItem>
            </Select>
          </FormControl>
          <SearchRental handleSearch={handleSearch} />
        </Stack>
      </Stack>

      <Box height="calc(100vh - 208px)">
        <MyRentalsDataGrid
          loading={isLoading || isFetching}
          rows={rentals}
          category={category}
          onTerminateRental={terminateRentalById}
          updateRentalName={updateRentalName}
        />
      </Box>
    </Stack>
  );
};

export default DashboardRentalPage;
