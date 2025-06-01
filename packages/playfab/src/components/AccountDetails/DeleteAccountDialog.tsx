'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import cn from 'classnames';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, IconTrash } from '@nl/ui/supabase';

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
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{
          container: styles.delete_account_dialog,
          paper: styles.delete_account_dialog_paper,
        }}
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure you want to delete your account?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#fff' }}>
            Once your account is deleted all of your data will be removed and there will be no way to recover your
            account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className={cn(styles.button_secondary)} onClick={handleClose}>
            Cancel
          </button>
          <button className={cn(styles.button_danger)} onClick={handleDeleteUser}>
            Delete Account
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
