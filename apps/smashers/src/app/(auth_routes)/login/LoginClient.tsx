'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import Card from '@nl/ui/supabase/Card';
import Space from '@nl/ui/supabase/Space';
import Typography from '@nl/ui/supabase/Typography';
import { PlayFabAuthForm } from '@nl/playfab/components';
import BackButton from '@/components/Header/BackButton';
import useFlags from '@/hooks/useFlags';
import type { User } from '@nl/playfab/types';
import SearchParamsHandler from './SearchParamsHandler';

interface SessionData {
  user: User | null;
}

export default function LoginClient({ sessionData }: { sessionData: SessionData }) {
  const { enableAccountCreation, enableProviderSignOn } = useFlags();
  const mobile = useMediaQuery('(max-width:640px)');

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler sessionData={sessionData} />
      </Suspense>
      <BackButton />
      <div style={{ display: 'flex', maxWidth: '450px', height: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Card style={{ margin: 'auto' }}>
          <Space direction="vertical" size={8}>
            <div>
              <Image
                src="/img/logos/NL/white.webp"
                alt="Company Logo"
                width={50}
                height={50}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <Typography.Title
                level={3}
                style={{ marginTop: mobile ? 70 : 16, fontSize: mobile ? '1.15rem' : '1.35rem', whiteSpace: 'nowrap' }}
              >
                Welcome to Nifty League
              </Typography.Title>
            </div>
            <PlayFabAuthForm
              enableAccountCreation={enableAccountCreation}
              enableProviderSignOn={enableProviderSignOn}
              redirectTo="/profile"
              socialButtonSize="xlarge"
              socialLayout="horizontal"
              view="sign_in"
            />
          </Space>
        </Card>
      </div>
    </>
  );
}
