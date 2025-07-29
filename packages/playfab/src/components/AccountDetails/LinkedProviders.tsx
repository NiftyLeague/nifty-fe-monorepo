'use client';

import { useCallback, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Space from '@nl/ui/supabase/Space';
import { usePathname } from 'next/navigation';

import { SocialIconButton } from '@nl/ui/custom/SocialIconButton';
import PlayFabAuthForm from '../PlayFabAuthForm';
import fetchJson from '../../utils/fetchJson';
import type { Provider, UserContextType } from '../../types';

export interface Props {
  providers: Provider[];
  socialButtonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  socialLayout?: 'horizontal' | 'vertical';
}

export default function LinkedProviders({ providers, socialButtonSize = 'md', socialLayout = 'horizontal' }: Props) {
  const player: UserContextType = PlayFabAuthForm.useUserContext();
  const verticalSocialLayout = socialLayout === 'vertical' ? true : false;
  const [linkedProviders, setLinkedProviders] = useState<Provider[]>([]);
  const session = useSession();
  const pathname = usePathname();

  // initialize linkedProviders from playfab
  useEffect(() => {
    if (player.profile && player.profile.LinkedAccounts) {
      const providersList = player.profile.LinkedAccounts.map(p =>
        p.Platform === 'GooglePlay' ? 'google' : p.Platform?.toLowerCase(),
      );
      setLinkedProviders(providersList as Provider[]);
    }
  }, [player.profile]);

  const handleLinkProvider = useCallback(
    async (provider: Provider, accessToken: string) => {
      if (!linkedProviders.includes(provider)) {
        try {
          await fetchJson('/api/playfab/user/link-provider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, accessToken }),
          });
          // Update the local state to show the provider is now linked
          setLinkedProviders(prev => [...prev, provider]);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [linkedProviders],
  );

  const handleUnlinkProvider = async (provider: Provider) => {
    try {
      await fetchJson('/api/playfab/user/unlink-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      // Update the local state to show the provider is now unlinked
      setLinkedProviders(prev => prev.filter(p => p !== provider));
    } catch (e) {
      console.error(e);
    }
  };

  // handle link provider on redirect if NextAuth session authenticated
  useEffect(() => {
    if (pathname.includes('#') && session.status === 'authenticated') {
      const { provider, accessToken } = session.data as unknown as { provider: Provider; accessToken: string };
      handleLinkProvider(provider, accessToken);
    }
  }, [pathname, session.status, session.data, handleLinkProvider]);

  const handleSignIn = async (provider: Provider) => {
    await signIn(provider, { callbackUrl: `/profile#link-${provider}` });
  };

  return providers && providers.length > 0 ? (
    <Space size={2} direction={socialLayout}>
      {providers.map(provider => {
        const isLinked = linkedProviders.includes(provider);
        return (
          <div key={provider} style={!verticalSocialLayout ? { flexGrow: 1 } : {}}>
            <SocialIconButton
              key={provider}
              label={isLinked ? 'Unlink' : 'Sign in'}
              onClick={isLinked ? () => handleUnlinkProvider(provider) : () => handleSignIn(provider)}
              provider={provider}
              withColor={isLinked}
            />
          </div>
        );
      })}
    </Space>
  ) : null;
}
