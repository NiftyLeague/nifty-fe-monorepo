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

interface Props {
  rental: RentalDataGrid;
  updateRentalName: (name: string, id: string) => void;
}
interface IFormInput {
  name: string;
  isCheckedTerm?: boolean;
}

const validationSchema = yup
  .object({
    name: yup.string().required(),
    isCheckedTerm: yup.bool().oneOf([true]),
  })
  .required();

const RenameRentalDialogContent = ({ rental, updateRentalName }: Props): React.ReactNode => {
  const { authToken } = useAuth();
  const dispatch = useDispatch();
  const [isLoadingRename, setLoadingRename] = useState(false);
  const { rentalId, degenId, renter } = rental;

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver<IFormInput>(validationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      isCheckedTerm: false,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (!rentalId || !degenId || !data.name || !authToken) {
      return;
    }

    try {
      setLoadingRename(true);
      const result: any = await fetch(`${RENAME_RENTAL_API_URL}?id=${encodeURIComponent(rentalId)}`, {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          degen_id: degenId,
        }),
        headers: {
          authorizationToken: authToken,
        } as any,
      });
      const res = await result.json();
      setLoadingRename(false);
      if (res.statusCode === 400) {
        setError('name', {
          type: 'custom',
          message: res.body,
        });
        return;
      }
      onRenameRentalSuccess(data.name);
    } catch (error) {
      setLoadingRename(false);
      setError('name', {
        type: 'custom',
        message: error as unknown as string,
      });
    }
  };

  const onRenameRentalSuccess = (newName: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Rename Rental Successful',
        variant: 'alert',
        alert: {
          color: 'success',
        },
        close: false,
      }),
    );
    updateRentalName(newName, rentalId);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                helperText={errors.name && errors.name.message}
                disabled={isLoadingRename}
              />
            )}
          />
          {/* <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4">Renaming Fee</Typography>
            {!degenDetail ? (
              <Skeleton variant="rectangular" width={50} height={20} />
            ) : (
              <Typography>{degenDetail?.price}</Typography>
            )}
          </Stack> */}
          {/* <Controller
            name="isCheckedTerm"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormControlLabel
                  label={
                    <Typography
                      textAlign="left"
                      variant="body1"
                      sx={{ opacity: 0.7 }}
                    >
                      I have read the
                      <Link
                        color="inherit"
                        sx={{ mx: '4px' }}
                        variant="body1"
                        href="#"
                      >
                        terms & conditions
                      </Link>
                      regarding renaming a rental
                    </Typography>
                  }
                  control={
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  }
                />
              </FormControl>
            )}
          /> */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isLoadingRename}
          disabled={isLoadingRename}
          type="submit"
          variant="contained"
          fullWidth
          onClick={() => handleSubmit(onSubmit)}
        >
          Add Nickname
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default RenameRentalDialogContent;
