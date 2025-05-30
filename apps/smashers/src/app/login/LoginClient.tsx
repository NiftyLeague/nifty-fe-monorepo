'use client';

import Image from 'next/image';
import { Card, Typography, Space } from '@nl/ui/supabase';
import { PlayFabAuthForm } from '@nl/playfab/components';
import BackButton from '@/components/BackButton';
import useFlags from '@/hooks/useFlags';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function LoginClient() {
  const { enableAccountCreation, enableProviderSignOn } = useFlags();
  const mobile = useMediaQuery('(max-width:576px)');

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          maxWidth: '450px',
          height: '100%',
          margin: 'auto',
          overflowY: 'auto',
        }}
      >
        <Card style={{ margin: 'auto' }}>
          <Space direction="vertical" size={8}>
            <div>
              <Image
                src="/img/logos/NL/white.webp"
                alt="Company Logo"
                width={50}
                height={50}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <Typography.Title
                level={3}
                style={{
                  marginTop: mobile ? 70 : 16,
                  fontSize: mobile ? '1.15rem' : '1.35rem',
                  whiteSpace: 'nowrap',
                }}
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
