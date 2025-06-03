'use client';

import { useState } from 'react';
import { DialogTitle, DialogContent, Stack, Typography, TextField, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { Controller, SubmitHandler, useForm, Resolver } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { RentalDataGrid } from '@/types/rentalDataGrid';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import useAuth from '@/hooks/useAuth';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Props {
  rental: RentalDataGrid;
  updateNickname: (name: string, id: string) => void;
}
interface IFormInput {
  name: string;
  isCheckedTerm: boolean;
}

const validationSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    isCheckedTerm: yup.boolean().required().oneOf([true]),
  }) satisfies yup.ObjectSchema<IFormInput>;

const ChangeNicknameDialog = ({ rental, updateNickname }: Props): React.ReactNode => {
  const { authToken } = useAuth();
  const [nicknames, setNicknames] = useLocalStorage<{ [address: string]: string }>('player-nicknames', {});
  const [isLoadingRename, setLoadingRename] = useState(false);
  const { rentalId, degenId, renter, playerAddress } = rental;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema) as Resolver<IFormInput>,
    mode: 'onChange',
    defaultValues: { name: '', isCheckedTerm: false },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (!rentalId || !degenId || !data.name || !authToken) {
      return;
    }
    setLoadingRename(true);
    setNicknames({ ...nicknames, [playerAddress as string]: data.name });
    setLoadingRename(false);
    onRenameRentalSuccess(data.name);
  };

  const onRenameRentalSuccess = (newName: string) => {
    toast.success('Rename Rental Successful!', { theme: 'dark' });
    updateNickname(newName, rentalId);
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

export default ChangeNicknameDialog;
