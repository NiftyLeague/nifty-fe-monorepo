'use client'

import { Suspense } from 'react'
import { BookHeart, Database, User as UserIcon } from 'lucide-react'

import { cn } from '@nl/ui/utils'
import { Card, CardContent, CardHeader, CardDescription } from '@nl/ui/base/card'
import NativeImage from '@nl/ui/custom/native-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nl/ui/base/tabs'
import AccountDetails from '@nl/playfab/components/AccountDetails'
import Inventory from '@nl/playfab/components/Inventory'
import Stats from '@nl/playfab/components/Stats'

import BackButton from '@/components/Header/BackButton'
import type { User } from '@nl/playfab/types'
import useFlags from '@/hooks/useFlags'

interface SessionData {
  user: User
}

/**
 * The interactive profile island. The Next version deferred each tab panel with
 * `dynamic(..., { ssr: false })`; here the whole page is a `client:only` island,
 * so the account panel loads directly and the tab panels stay behind Suspense.
 */
export default function ProfileClient({ sessionData: _sessionData }: { sessionData: SessionData }) {
  const flags = useFlags()
  const tabsEnabled = flags.enableInventory || flags.enableStats

  return (
    <>
      <BackButton />
      <div className="w-full h-screen flex justify-center items-center">
        <Card className="relative w-full max-w-[800px] h-screen md:h-auto overflow-auto md:overflow-hidden">
          <CardHeader className="pt-8 md:pt-0">
            <NativeImage
              src="/img/logos/NL/white.webp"
              alt="Company Logo"
              width={50}
              height={48}
              className="absolute inset-6 h-10 w-10"
            />
            <CardDescription className="ml-auto text-success">
              You&apos;re signed in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full gap-4">
              <TabsList className={cn('w-full', !tabsEnabled && 'bg-card')}>
                <TabsTrigger
                  value="account"
                  className={cn(
                    tabsEnabled
                      ? 'cursor-pointer data-[state=active]:cursor-not-allowed'
                      : '!bg-card border-0 border-b-1 rounded-none outline-none justify-start'
                  )}
                >
                  <UserIcon aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />{' '}
                  Account
                </TabsTrigger>
                {flags.enableInventory && (
                  <TabsTrigger
                    value="inventory"
                    className="cursor-pointer data-[state=active]:cursor-not-allowed"
                  >
                    <Database aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />{' '}
                    Inventory
                  </TabsTrigger>
                )}
                {flags.enableStats && (
                  <TabsTrigger
                    value="stats"
                    className="cursor-pointer data-[state=active]:cursor-not-allowed"
                  >
                    <BookHeart aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />{' '}
                    Stats
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="account">
                <Suspense
                  fallback={<div className="text-center py-8">Loading account details...</div>}
                >
                  <AccountDetails
                    enableAvatars={flags.enableAvatars}
                    enableLinkProviders={flags.enableLinkProviders}
                    enableLinkWallet={flags.enableLinkWallet}
                  />
                </Suspense>
              </TabsContent>
              <TabsContent value="inventory">
                <Suspense
                  fallback={<div className="text-center py-8">Loading player inventory...</div>}
                >
                  <Inventory />
                </Suspense>
              </TabsContent>
              <TabsContent value="stats">
                <Suspense
                  fallback={<div className="text-center py-8">Loading player stats...</div>}
                >
                  <Stats />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
