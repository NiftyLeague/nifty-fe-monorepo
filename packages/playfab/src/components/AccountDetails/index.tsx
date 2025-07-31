'use client';

import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useSnackbar } from 'notistack';

import { fetchJson } from '../../utils/fetchJson';
import { parseLinkedWalletResult } from '../../utils/parseData';
import { useUserContext } from '../../hooks/useUserContext';
import { useProviders } from '@nl/ui/hooks/useProviders';

import { Button } from '@nl/ui/base/button';
import { Input } from '@nl/ui/custom/Input';
import { Icon } from '@nl/ui/base/icon';
import { Separator } from '@nl/ui/base/separator';

import Avatar from '../Avatar';
import DeleteAccountDialog from './DeleteAccountDialog';
import LinkedProviders from './LinkedProviders';
import LinkWalletInput from './LinkWalletInput';
import LogoutButton from './LogoutButton';

type Profile = { avatar_url?: string; displayName?: string; email?: string };

export type AccountDetailsProps = {
  enableAvatars?: boolean;
  enableLinkProviders?: boolean;
  enableLinkWallet?: boolean;
};

export default function AccountDetails({
  enableAvatars = false,
  enableLinkProviders = false,
  enableLinkWallet = false,
}: AccountDetailsProps) {
  const user = useUserContext();
  const { account, isLoggedIn, playFabId: uid, profile, publisherData } = user;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Profile['email']>();
  const [displayName, setDisplayName] = useState<Profile['displayName']>();
  const [linkedWallets, setLinkedWallets] = useState<string[]>([]);
  const [avatar_url, setAvatarUrl] = useState<Profile['avatar_url']>();
  const providers = useProviders();

  useEffect(() => {
    if (account && !isEmpty(account)) {
      setEmail(account.PrivateInfo?.Email);
      setAvatarUrl(profile?.AvatarUrl);
      setDisplayName(publisherData?.DisplayName?.Value);
      setLinkedWallets(parseLinkedWalletResult(publisherData) ?? []);
      setLoading(false);
    }
  }, [account, profile, publisherData]);

  async function updateProfile({ avatar_url, displayName, email }: Profile) {
    try {
      setLoading(true);
      if (!account || !profile) throw new Error('No user');
      const body = {} as Profile;

      // Update Account Display Name
      if (displayName && displayName !== publisherData?.DisplayName?.Value) body.displayName = displayName;
      // Update Profile Contact Email
      if (email && email !== account.PrivateInfo?.Email) body.email = email;
      // Update Profile Avatar
      if (avatar_url && avatar_url !== profile.AvatarUrl) body.avatar_url = avatar_url;

      await fetchJson('/api/playfab/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      enqueueSnackbar('Profile updated!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating the data.', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return isLoggedIn ? (
    <div className="grid gap-4">
      {uid && enableAvatars ? (
        <Avatar
          uid={uid}
          url={avatar_url}
          size={125}
          onUpload={url => {
            setAvatarUrl(url);
            updateProfile({ avatar_url: url });
          }}
        />
      ) : null}

      <Input id="email" label="Email" type="email" value={email ?? ''} disabled startIcon={<Icon name="mail" />} />

      <Input
        id="display-name"
        label="Display Name"
        type="text"
        value={displayName ?? ''}
        disabled={loading}
        onChange={e => setDisplayName(e.target.value)}
        startIcon={<Icon name="user-pen" />}
        actions={[
          <Button
            key="save"
            size="sm"
            disabled={loading}
            className="cursor-pointer disabled:cursor-progress"
            onClick={() => updateProfile({ displayName })}
          >
            {loading ? <Icon name="loader" className="animate-spin" /> : <Icon name="save" />}
            {loading ? 'Loading' : 'Update'}
          </Button>,
        ]}
      />

      {enableLinkWallet && (
        <fieldset>
          <div className="grid gap-2">
            <legend>Linked Wallet(s)</legend>
            <div className="grid gap-1">
              <LinkWalletInput index={1} address={linkedWallets[0] || ''} loading={loading} />
              {Boolean(linkedWallets[0]) && (
                <LinkWalletInput index={2} address={linkedWallets[1] || ''} loading={loading} />
              )}
              {Boolean(linkedWallets[1]) && (
                <LinkWalletInput index={3} address={linkedWallets[2] || ''} loading={loading} />
              )}
            </div>
          </div>
        </fieldset>
      )}

      {enableLinkProviders && (
        <fieldset>
          <div className="grid gap-2">
            <legend>Linked Provider(s)</legend>
            <LinkedProviders providers={providers} loading={loading} />
          </div>
        </fieldset>
      )}

      <Separator orientation="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        <LogoutButton loading={loading} />
        <DeleteAccountDialog loading={loading} />
      </div>
    </div>
  ) : null;
}
