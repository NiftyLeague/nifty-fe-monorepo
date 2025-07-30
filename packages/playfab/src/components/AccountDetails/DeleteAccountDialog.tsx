'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import { Button } from '@nl/ui/base/button';
import Modal from '@nl/ui/supabase/Modal';
import { Icon } from '@nl/ui/base/icon';

import { fetchJson } from '../../utils/fetchJson';
import { errorMsgHandler } from '../../utils/errorHandlers';
import { useUserSession } from '../../hooks/useUserSession';

export default function DeleteAccountDialog({ loading = false }) {
  const { mutateUser } = useUserSession({ redirectTo: '/login' });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteUser = async () => {
    try {
      mutateUser(
        await fetchJson('/api/playfab/user/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      router.push('/login');
      enqueueSnackbar('Delete Account Success!', { variant: 'success' });
    } catch (e) {
      const msg = errorMsgHandler(e);
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <div>
      <Button
        variant="destructive"
        size="lg"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={loading}
        onClick={handleClickOpen}
      >
        <Icon name="trash" />
        Delete Account
      </Button>
      <Modal
        visible={open}
        onCancel={handleClose}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        variant="danger"
        size="sm"
        onConfirm={handleDeleteUser}
        confirmText="Delete Account"
        cancelText="Cancel"
        closable
      />
    </div>
  );
}
