'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import Button from '@nl/ui/supabase/Button';
import Modal from '@nl/ui/supabase/Modal';
import { IconTrash } from '@nl/ui/supabase/Icon';

import fetchJson from '../../utils/fetchJson';
import { errorMsgHandler } from '../../utils/errorHandlers';
import useUserSession from '../../hooks/useUserSession';

import styles from '../../styles/profile.module.css';

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
        block
        className={styles.button_danger}
        disabled={loading}
        icon={<IconTrash />}
        size="medium"
        type="default"
        onClick={handleClickOpen}
      >
        Delete Account
      </Button>
      <Modal
        visible={open}
        onCancel={handleClose}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        variant="danger"
        size="small"
        onConfirm={handleDeleteUser}
        confirmText="Delete Account"
        cancelText="Cancel"
        closable
      />
    </div>
  );
}
