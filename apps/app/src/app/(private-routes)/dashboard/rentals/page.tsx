'use client';

import { useEffect, useState, useMemo } from 'react';
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

const DashboardRentalPage = (): React.ReactNode => {
  const { authToken } = useAuth();
  const headers = { authorizationToken: authToken || '' };
  const [searchTerm, setSearchTerm] = useState('');
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
    const responses = await Promise.all(urls.map(url => fetch(url, { method: 'GET', headers })));

    const rentalArrays = await Promise.all(responses.map(response => response.json()));

    const totalRentals = rentalArrays.reduce((flattened, arr) => [...flattened, ...arr]);
    return getUniqueListBy<Rentals>(totalRentals, 'id');
  };

  const { data, isLoading, isFetching, refetch } = useQuery<Rentals[]>({
    queryKey: ['rentals'],
    queryFn: fetchRentals,
    // TODO: enable if query needed
    enabled: false,
  });

  const rentals = useMemo(() => {
    if (!data) return [];
    if (searchTerm.trim() === '') return data;

    const lowercasedValue = searchTerm.toLowerCase();
    return data.filter(
      (rental: Rentals) =>
        rental?.accounts?.player?.address?.toLowerCase().includes(lowercasedValue) ||
        rental?.degen?.id?.toLowerCase().includes(lowercasedValue) ||
        rental?.accounts?.player?.name?.toLowerCase().includes(lowercasedValue),
    );
  }, [data, searchTerm]);

  const terminateRentalById = async (rentalId: string) => {
    try {
      const result = await terminalRental(rentalId);
      if (result && !result.ok) {
        const errMsg = await result.text();
        toast.error(`Can not terminate the rental: ${errMsg}`, { theme: 'dark' });
        return;
      }
      const res = await result?.json();
      if (res) {
        toast.success('Terminate rental successfully!', { theme: 'dark' });
        refetch();
      }
    } catch (error) {
      toast.error(`Can not terminate the rental: ${error}`, { theme: 'dark' });
    }
  };

  const updateRentalName = () => {
    refetch();
  };

  const handleSearch = (currentValue: string) => {
    setSearchTerm(currentValue);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    const newCategory = event.target.value as RentalType;
    if (newCategory !== category) {
      setCategory(newCategory);
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
