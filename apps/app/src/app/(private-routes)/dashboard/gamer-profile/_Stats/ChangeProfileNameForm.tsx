'use client';

import { useState, useContext } from 'react';
import { Stack, Typography, TextField, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { PROFILE_RENAME_API } from '@/constants/url';
import { DialogContext } from '@/components/dialog';

import { useProfileRenameFee } from '@/hooks/useGamerProfile';
import useAuth from '@/hooks/useAuth';

interface ChangeProfileNameFormProps {
  updateNewName: (name: string) => void;
}
interface IFormInput {
  name: string;
}

const validationSchema = yup.object({
  name: yup.string().required(),
});

const ChangeProfileNameForm = ({ updateNewName }: ChangeProfileNameFormProps): JSX.Element => {
  const [isLoadingRename, setLoadingRename] = useState(false);
  const { fee, loadingFee } = useProfileRenameFee();
  const [, setIsOpen] = useContext(DialogContext);
  const { authToken } = useAuth();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (!data.name || !authToken) {
      return;
    }

    try {
      setLoadingRename(true);
      const response = await fetch(PROFILE_RENAME_API, {
        headers: { authorizationToken: authToken as string },
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
        }),
      });
      if (!response.ok) {
        const errMsg = await response.text();
        setLoadingRename(false);
        toast.error(`Can not update the new name: ${errMsg}`, {
          theme: 'dark',
        });
        return;
      }
      const res = await response.json();
      onRenameRentalSuccess(res?.name_cased);
    } catch (error) {
      setLoadingRename(false);
      toast.error(`Can not update the new name: ${error}`, {
        theme: 'dark',
      });
    }
  };

  const onRenameRentalSuccess = (newName: string) => {
    setLoadingRename(false);
    toast.success('Rename Profile Successful!', { theme: 'dark' });
    updateNewName(newName);
    setIsOpen(false);
    reset();
  };

  const renderFee = () => {
    if (loadingFee) {
      return <Skeleton variant="rectangular" width="100%" height="18.67px" />;
    }
    if (!loadingFee && fee) {
      return (
        <Typography variant="h5" component="p">
          There is a {fee} NFTL fee for changing your gamer profile username
        </Typography>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack rowGap={2}>
        {renderFee()}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter the new name"
              variant="outlined"
              size="small"
              fullWidth
              error={!!errors.name}
              helperText={errors.name && errors.name.message}
              disabled={isLoadingRename}
            />
          )}
        />
        <LoadingButton loading={isLoadingRename} disabled={isLoadingRename} type="submit" variant="contained" fullWidth>
          Update
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default ChangeProfileNameForm;
