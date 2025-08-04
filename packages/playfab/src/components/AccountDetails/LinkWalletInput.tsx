import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Button } from '@nl/ui/base/button';
import { Input } from '@nl/ui/custom/input';
import { Icon } from '@nl/ui/base/icon';

import { errorMsgHandler } from '../../utils/errorHandlers';
import { fetchJson } from '../../utils/fetchJson';
import { signMessage } from '../../utils/wallet';
import { useUserContext } from '../../hooks/useUserContext';

export default function LinkWalletInput({
  index,
  address,
  loading,
}: {
  index: number;
  address?: string;
  loading?: boolean;
}) {
  const [error, setError] = useState<string | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { refetchPlayer } = useUserContext();

  const handleLinkWallet = async () => {
    setError(undefined);
    try {
      const result = await signMessage();
      if (result) {
        const { address, nonce, signature } = result;
        await fetchJson('/api/playfab/user/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature, nonce }),
        });
        await refetchPlayer();
        enqueueSnackbar('Wallet link success!', { variant: 'success' });
      }
    } catch (e) {
      const msg = errorMsgHandler(e);
      setError(msg);
    }
  };

  const handleUnLinkWallet = async () => {
    setError(undefined);
    setDeleteLoading(true);
    if (address) {
      try {
        const [chain, wallet] = address.split(':');
        await fetchJson('/api/playfab/user/unlink-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet, chain }),
        });
        await refetchPlayer();
        enqueueSnackbar('Unlink wallet link success!', { variant: 'success' });
      } catch (e) {
        const msg = errorMsgHandler(e);
        if (e instanceof Error) {
          setError(msg);
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }
    }
    setDeleteLoading(false);
  };

  const linked = Boolean(address && address.length > 1);
  const addressParsed = address?.split(':')[1] || '';

  return (
    <>
      <Input
        key={index}
        type="text"
        disabled
        copy={linked}
        error={!!error}
        value={addressParsed}
        hiddenLabel
        label={`Link Wallet ${index}`}
        className={!linked ? '!bg-transparent' : ''}
        actions={
          linked
            ? [
                <Button
                  key="remove"
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                  onClick={handleUnLinkWallet}
                >
                  Remove
                </Button>,
              ]
            : [
                <Button
                  key="connect"
                  variant="dashed"
                  size="sm"
                  className="cursor-pointer disabled:cursor-progress"
                  disabled={loading}
                  onClick={handleLinkWallet}
                >
                  <Icon name="link-2" />
                  Connect Wallet
                </Button>,
              ]
        }
      />
      {error && error.length > 0 && <p className="text-error text-xs font-bold !mt-2">{error}</p>}
    </>
  );
}
