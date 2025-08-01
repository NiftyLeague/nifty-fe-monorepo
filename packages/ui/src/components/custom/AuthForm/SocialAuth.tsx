'use client';

import { useState } from 'react';
import { cn } from '@nl/ui/utils';
import { useProviders, type Provider } from '@nl/ui/hooks/useProviders';
import { SocialIconButton } from '@nl/ui/custom/SocialIconButton';

const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export interface SocialAuthProps {
  disabled?: boolean;
  enableSocialColors?: boolean;
  handleProviderLogin: (provider: Provider) => Promise<void>;
}

export function SocialAuth({
  disabled = false,
  enableSocialColors = false,
  handleProviderLogin,
}: SocialAuthProps): React.ReactNode {
  const providers = useProviders();
  const [loading, setLoading] = useState<Provider>();

  const handleClick = async (provider: Provider) => {
    setLoading(provider);
    await handleProviderLogin(provider);
    setLoading(undefined);
  };

  return (
    <>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
      </div>
      <div className={cn('grid gap-4', gridCols[providers.length])}>
        {providers.map(provider => (
          <SocialIconButton
            key={provider}
            disabled={disabled || loading !== undefined}
            loading={loading === provider}
            onClick={() => handleClick(provider)}
            provider={provider}
            withColor={enableSocialColors}
          />
        ))}
      </div>
    </>
  );
}

export default SocialAuth;
