'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardDescription } from '@nl/ui/base/card';
import { Icon } from '@nl/ui/base/icon';
import Tabs from '@nl/ui/supabase/Tabs';

import BackButton from '@/components/Header/BackButton';
import type { User } from '@nl/playfab/types';
import useFlags from '@/hooks/useFlags';

// Dynamically import heavy components
const AccountDetails = dynamic(() => import('@nl/playfab/components/AccountDetails'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Fetching account details...</div>,
});

const Inventory = dynamic(() => import('@nl/playfab/components/Inventory'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Fetching player inventory...</div>,
});

interface SessionData {
  user: User;
}

export default function ProfileClient({ sessionData }: { sessionData: SessionData }) {
  const flags = useFlags();
  return (
    <>
      <BackButton />
      <div className="w-full h-screen flex justify-center items-center">
        <Card className="relative w-full max-w-[800px] overflow-hidden">
          <CardHeader className="">
            <Image
              src="/img/logos/NL/white.webp"
              alt="Company Logo"
              width={50}
              height={48}
              className="absolute inset-6 h-10 w-10"
            />
            <CardDescription className="ml-auto text-success">You&apos;re signed in</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs type="underlined" size="md" tabBarStyle={{ marginTop: 16 }} tabBarGutter={8}>
              <Tabs.Panel id="account" icon={<Icon name="user" />} label="Account">
                <Suspense fallback={<div className="text-center py-8">Loading account details...</div>}>
                  <AccountDetails
                    enableAvatars={flags.enableAvatars}
                    enableLinkProviders={flags.enableLinkProviders}
                    enableLinkWallet={flags.enableLinkWallet}
                  />
                </Suspense>
              </Tabs.Panel>
              {flags.enableInventory && (
                <Tabs.Panel id="inventory" icon={<Icon name="database" />} label="Inventory">
                  <Suspense fallback={<div className="text-center py-8">Loading player inventory...</div>}>
                    <Inventory />
                  </Suspense>
                </Tabs.Panel>
              )}
              {flags.enableStats && (
                <Tabs.Panel id="stats" icon={<Icon name="book-heart" />} label="Stats">
                  <div>coming soon...</div>
                </Tabs.Panel>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
