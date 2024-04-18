import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Card, IconDatabase, IconStar, IconUser, Space, Tabs, Typography } from '@nl/ui/supabase';
import { withSessionSsr } from '@/utils/session';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountDetails from '@/components/AccountDetails';
import Inventory from '@/components/Inventory';
import BackButton from '@/components/BackButton';
import { useUserSession } from '@/lib/playfab/hooks';
import type { User } from '@/lib/playfab/types';
import useFlags from '@/hooks/useFlags';

import styles from '@/styles/profile.module.css';

export default function Profile() {
  const { user } = useUserSession();
  const mobile = useMediaQuery('(max-width:576px)');
  const router = useRouter();
  const { enableInventory, enableStats } = useFlags();

  useEffect(() => {
    // logout caught after session
    if (user && !user.isLoggedIn) {
      router.push('/login');
    }
  }, [router, user]);

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
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            )}
            <Typography.Text type="success">You&apos;re signed in</Typography.Text>
          </div>
          <Space direction="vertical" size={6} className={styles.userInfo}>
            <Tabs type="underlined" size="medium" tabBarStyle={{ marginTop: 16 }} tabBarGutter={8}>
              <Tabs.Panel id="account" icon={<IconUser />} label="Account">
                <AccountDetails />
              </Tabs.Panel>
              {enableInventory ? (
                <Tabs.Panel id="inventory" icon={<IconDatabase />} label="Inventory">
                  <Inventory />
                </Tabs.Panel>
              ) : (
                <Tabs.Panel id="inventory" />
              )}
              {enableStats ? (
                <Tabs.Panel id="stats" icon={<IconStar />} label="Stats">
                  <div>coming soon...</div>
                </Tabs.Panel>
              ) : (
                <Tabs.Panel id="stats" />
              )}
            </Tabs>
          </Space>
        </Card>
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const user = req.session.user;
  // redirect to login if no user found
  if (!user || !user.isLoggedIn) {
    return {
      props: { user: { isLoggedIn: false } as User },
      redirect: { destination: '/login', permanent: false },
    };
  }
  return { props: { user } };
});
