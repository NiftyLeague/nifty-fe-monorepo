'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { cn } from '@nl/ui/utils';
import { Card, CardContent, CardHeader, CardDescription } from '@nl/ui/base/card';
import { Icon } from '@nl/ui/base/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nl/ui/base/tabs';

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

const Stats = dynamic(() => import('@nl/playfab/components/Stats'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Fetching player stats...</div>,
});

interface SessionData {
  user: User;
}

export default function ProfileClient({ sessionData }: { sessionData: SessionData }) {
  const flags = useFlags();
  const tabsEnabled = flags.enableInventory || flags.enableStats;
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
            <Tabs defaultValue="account" className="w-full gap-4">
              <TabsList className={cn('w-full', !tabsEnabled && 'bg-card')}>
                <TabsTrigger
                  value="account"
                  className={cn(
                    tabsEnabled
                      ? 'cursor-pointer data-[state=active]:cursor-not-allowed'
                      : '!bg-card border-0 border-b-1 rounded-none outline-none justify-start',
                  )}
                >
                  <Icon name="user" /> Account
                </TabsTrigger>
                {flags.enableInventory && (
                  <TabsTrigger value="inventory" className="cursor-pointer data-[state=active]:cursor-not-allowed">
                    <Icon name="database" /> Inventory
                  </TabsTrigger>
                )}
                {flags.enableStats && (
                  <TabsTrigger value="stats" className="cursor-pointer data-[state=active]:cursor-not-allowed">
                    <Icon name="book-heart" /> Stats
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="account">
                <Suspense fallback={<div className="text-center py-8">Loading account details...</div>}>
                  <AccountDetails
                    enableAvatars={flags.enableAvatars}
                    enableLinkProviders={flags.enableLinkProviders}
                    enableLinkWallet={flags.enableLinkWallet}
                  />
                </Suspense>
              </TabsContent>
              <TabsContent value="inventory">
                <Suspense fallback={<div className="text-center py-8">Loading player inventory...</div>}>
                  <Inventory />
                </Suspense>
              </TabsContent>
              <TabsContent value="stats">
                <Suspense fallback={<div className="text-center py-8">Loading player stats...</div>}>
                  <Stats />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
