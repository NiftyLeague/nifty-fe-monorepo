import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import AccountDetails from './AccountDetailsClient';
import type { AccountDetailsProps } from './AccountDetailsClient';
import type { Session } from 'next-auth';

export default function AccountDetailsWithSessionProvider({
  enableAvatars = false,
  enableLinkProviders = false,
  enableLinkWallet = false,
  session = null,
}: AccountDetailsProps & { session?: Session | null }) {
  return (
    <Suspense fallback={null}>
      <SessionProvider session={session}>
        <AccountDetails
          enableAvatars={enableAvatars}
          enableLinkProviders={enableLinkProviders}
          enableLinkWallet={enableLinkWallet}
        />
      </SessionProvider>
    </Suspense>
  );
}
