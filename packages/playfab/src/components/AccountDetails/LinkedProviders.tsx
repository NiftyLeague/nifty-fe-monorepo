'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { cn } from '@nl/ui/utils';
import { SocialIconButton } from '@nl/ui/custom/social-icon-button';
import { useUserContext } from '../../hooks/useUserContext';
import { fetchJson } from '../../utils/fetchJson';
import type { Provider, UserContextType } from '../../types';

export interface Props {
  providers: Provider[];
  socialLayout?: 'horizontal' | 'vertical';
  loading?: boolean;
}

export default function LinkedProviders({ providers, socialLayout = 'horizontal', loading = false }: Props) {
  const player: UserContextType = useUserContext();
  const [optimisticLinked, setOptimisticLinked] = useState<Provider[]>([]);
  const [optimisticUnlinked, setOptimisticUnlinked] = useState<Provider[]>([]);
  const session = useSession();
  const pathname = usePathname();

  const linkedProviders = useMemo(() => {
    const fromProfile =
      player.profile?.LinkedAccounts?.map(p => (p.Platform === 'GooglePlay' ? 'google' : p.Platform?.toLowerCase())) ||
      [];
    return [...new Set([...fromProfile, ...optimisticLinked])].filter(p => !optimisticUnlinked.includes(p as never));
  }, [player.profile, optimisticLinked, optimisticUnlinked]);

  const handleLinkProvider = useCallback(
    async (provider: Provider, accessToken: string) => {
      if (!linkedProviders.includes(provider)) {
        try {
          setOptimisticLinked(prev => [...prev, provider]);
          await fetchJson('/api/playfab/user/link-provider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, accessToken }),
          });
        } catch (e) {
          console.error(e);
          setOptimisticLinked(prev => prev.filter(p => p !== provider));
        }
      }
    },
    [linkedProviders],
  );

  const handleUnlinkProvider = async (provider: Provider) => {
    try {
      setOptimisticUnlinked(prev => [...prev, provider]);
      await fetchJson('/api/playfab/user/unlink-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
    } catch (e) {
      console.error(e);
      setOptimisticUnlinked(prev => prev.filter(p => p !== provider));
    }
  };

  // handle link provider on redirect if NextAuth session authenticated
  useEffect(() => {
    if (pathname.includes('#') && session.status === 'authenticated') {
      const { provider, accessToken } = session.data as unknown as { provider: Provider; accessToken: string };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleLinkProvider(provider, accessToken);
    }
  }, [pathname, session.status, session.data, handleLinkProvider]);

  const handleSignIn = async (provider: Provider) => {
    await signIn(provider, { callbackUrl: `/profile#link-${provider}` });
  };

  return providers && providers.length > 0 ? (
    <div className={cn('w-full grid gap-2', socialLayout === 'horizontal' && 'grid-cols-2 md:grid-cols-4')}>
      {providers.map(provider => {
        const isLinked = linkedProviders.includes(provider);
        return (
          <div key={provider} className="w-full">
            <SocialIconButton
              key={provider}
              label={isLinked ? 'Unlink' : 'Sign in'}
              onClick={isLinked ? () => handleUnlinkProvider(provider) : () => handleSignIn(provider)}
              provider={provider}
              withColor={isLinked}
              disabled={loading}
            />
          </div>
        );
      })}
    </div>
  ) : null;
}
