'use client';

import { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  TextField,
  // FormControl,
  // FormControlLabel,
  // Checkbox,
  DialogActions,
  // Link,
  Box,
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { RentalDataGrid } from '@/types/rentalDataGrid';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import { RENAME_RENTAL_API_URL } from '@/constants/url';
// import useFetch from '@/hooks/useFetch';
// import type { Degen } from '@/types/degens';
import { useDispatch } from '@/store/hooks';
import { openSnackbar } from '@/store/slices/snackbar';
import useAuth from '@/hooks/useAuth';

interface IFormInput {
  name: string;
}

const validationSchema = yup.object().shape({ name: yup.string().required('Name is required') });

interface Props {
  rental: RentalDataGrid;
  updateRentalName: (name: string, id: string) => Promise<void>;
}

const RenameRentalDialogContent = ({ rental, updateRentalName }: Props): React.ReactNode => {
  const { authToken } = useAuth();
  const dispatch = useDispatch();
  const [isLoadingRename, setIsLoadingRename] = useState(false);
  const { degenId, renter } = rental;

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(validationSchema), mode: 'onChange', defaultValues: { name: '' } });

  const onSubmit = async (data: IFormInput) => {
    if (!rental.id || !degenId || !data.name || !authToken) {
      return;
    }

    try {
      setIsLoadingRename(true);
      const result = await fetch(`${RENAME_RENTAL_API_URL}?id=${encodeURIComponent(rental.id)}`, {
        method: 'POST',
        body: JSON.stringify({ name: data.name, degen_id: degenId }),
        headers: { authorizationToken: authToken } as Record<string, string>,
      });
      const res = await result.json();
      setIsLoadingRename(false);
      if (res.statusCode === 400) {
        setError('name', { type: 'custom', message: res.body });
        return;
      }
      onRenameRentalSuccess(data.name);
    } catch (error) {
      setIsLoadingRename(false);
      setError('name', { type: 'custom', message: error as unknown as string });
    }
  };

  const onRenameRentalSuccess = (newName: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Rename Rental Successful',
        variant: 'alert',
        alert: { color: 'success' },
        close: false,
      }),
    );
    updateRentalName(newName, rental.id);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <DialogTitle sx={{ textAlign: 'center' }}>Assign a Nickname</DialogTitle>
        <DialogContent dividers sx={{ maxWidth: '380px' }}>
          <Stack rowGap={2}>
            <Stack rowGap={1}>
              {degenId && <DegenImage tokenId={degenId} />}
              <Typography variant="caption" component="p" sx={{ textAlign: 'center' }}>
                Recruit
              </Typography>
              <Typography variant="caption" component="p" sx={{ textAlign: 'center' }}>
                {renter}
              </Typography>
            </Stack>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter nickname for recruit wallet"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoadingRename}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => reset()} disabled={isLoadingRename}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoadingRename}
            disabled={isLoadingRename}
            type="submit"
            variant="contained"
            fullWidth
          >
            Add Nickname
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Box>
  );
};

export default RenameRentalDialogContent;
