'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Card, IconDatabase, IconStar, IconUser, Space, Tabs, Typography } from '@nl/ui/supabase';
import BackButton from '@/components/Header/BackButton';
import { useUserSession } from '@nl/playfab/hooks';
import type { User } from '@nl/playfab/types';
import useFlags from '@/hooks/useFlags';

import styles from './page.module.css';

// Dynamically import heavy components
const AccountDetails = dynamic(() => import('@nl/playfab/components').then(mod => ({ default: mod.AccountDetails })), {
  ssr: true,
  loading: () => <div>Loading account details...</div>,
});

const Inventory = dynamic(() => import('@nl/playfab/components').then(mod => ({ default: mod.Inventory })), {
  ssr: false,
  loading: () => <div>Loading inventory...</div>,
});

export default function ProfileClient({ user: initialUser }: { user: User }) {
  const router = useRouter();
  const mobile = useMediaQuery('(max-width:576px)');
  const flags = useFlags();
  const { user } = useUserSession() || { user: initialUser };

  useEffect(() => {
    if (!user?.isLoggedIn) {
      router.push('/login');
    }
  }, [router, user?.isLoggedIn]);

  return (
    <>
      <BackButton />
      <div className={styles.profileContainer}>
        <Card className={styles.profileCard}>
          <div className={styles.profileCardHeader}>
            {mobile ? (
              <div />
            ) : (
              <Image
                src="/img/logos/NL/white.webp"
                alt="Company Logo"
                width={50}
                height={48}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            <Typography.Text type="success">You&apos;re signed in</Typography.Text>
          </div>
          <Space direction="vertical" size={6} className={styles.userInfo}>
            <Tabs type="underlined" size="medium" tabBarStyle={{ marginTop: 16 }} tabBarGutter={8}>
              <Tabs.Panel id="account" icon={<IconUser />} label="Account">
                <Suspense fallback={<div>Loading account details...</div>}>
                  <AccountDetails
                    enableAvatars={flags.enableAvatars}
                    enableLinkProviders={flags.enableLinkProviders}
                    enableLinkWallet={flags.enableLinkWallet}
                  />
                </Suspense>
              </Tabs.Panel>
              {flags.enableInventory && (
                <Tabs.Panel id="inventory" icon={<IconDatabase />} label="Inventory">
                  <Suspense fallback={<div>Loading inventory...</div>}>
                    <Inventory />
                  </Suspense>
                </Tabs.Panel>
              )}
              {flags.enableStats && (
                <Tabs.Panel id="stats" icon={<IconStar />} label="Stats">
                  <div>coming soon...</div>
                </Tabs.Panel>
              )}
            </Tabs>
          </Space>
        </Card>
      </div>
    </>
  );
}
