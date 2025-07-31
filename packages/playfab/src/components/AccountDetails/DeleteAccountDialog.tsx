'use client';

import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import { AlertDialog } from '@nl/ui/custom/AlertDialog';
import { Button } from '@nl/ui/base/button';
import { Icon } from '@nl/ui/base/icon';

import { fetchJson } from '../../utils/fetchJson';
import { errorMsgHandler } from '../../utils/errorHandlers';
import { useUserSession } from '../../hooks/useUserSession';

export default function DeleteAccountDialog({ loading = false }) {
  const { mutateUser } = useUserSession({ redirectTo: '/login' });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
    <AlertDialog
      title="Delete Account"
      description="Are you sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      confirmText="Delete Account"
      confirmVariant="destructive"
      onConfirm={handleDeleteUser}
      triggerElement={
        <Button
          variant="destructive"
          size="lg"
          className="w-full cursor-pointer disabled:cursor-not-allowed"
          disabled={loading}
        >
          <Icon name="trash" />
          Delete Account
        </Button>
      }
    />
  );
}
