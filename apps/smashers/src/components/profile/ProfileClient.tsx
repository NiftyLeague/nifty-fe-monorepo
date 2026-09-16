import { Show, type ParentComponent } from 'solid-js'
import { BookHeart, Database, User as UserIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'
import { Card, CardContent, CardHeader, CardDescription } from '@nl/ui/base/card'
import NativeImage from '@nl/ui/custom/native-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nl/ui/base/tabs'
import AccountDetails from '@nl/playfab/components/AccountDetails'
import Inventory from '@nl/playfab/components/Inventory'
import Stats from '@nl/playfab/components/Stats'

import BackButton from '@/components/Header/BackButton'
import AuthProviders from '@/contexts/AuthProviders'
import type { User } from '@nl/playfab/types'
import useFlags from '@/hooks/useFlags'

interface SessionData {
  user: User
}

/**
 * The interactive profile island. The Next version deferred each tab panel with
 * `dynamic(..., { ssr: false })`; here the whole page is a hydrated
 * `client:load` island, so the account panel loads directly and the tab panels
 * render inline.
 *
 * It renders the providers itself rather than being wrapped by them in the
 * layout. Astro gives every `client:*` element its own root, so a provider
 * island in `Auth.astro` could not supply context to this one: the account
 * panel read `isLoggedIn` as false and rendered nothing, and the tabs saw empty
 * feature flags.
 */
const ProfileClient: ParentComponent<{ sessionData: SessionData }> = (props) => (
  <AuthProviders>
    <ProfileContent sessionData={props.sessionData} />
  </AuthProviders>
)

/**
 * Inner body, inside the provider root. Not exported: mounting it directly
 * would reintroduce the split-root bug this split exists to prevent.
 */
function ProfileContent(_props: { sessionData: SessionData }) {
  const flags = useFlags()
  const tabsEnabled = flags.enableInventory || flags.enableStats

  return (
    <>
      <BackButton />
      <div class="w-full h-screen flex justify-center items-center">
        <Card class="relative h-screen w-full max-w-200 overflow-auto md:h-auto md:overflow-hidden">
          {/* Mobile-only top spacing sits on a transparent wrapper: the header
           * component owns its own padding, and a block wrapper renders the
           * identical box. */}
          <div class="pt-8 md:pt-0">
            <CardHeader>
              <NativeImage
                src="/img/logos/NL/white.webp"
                alt="Company Logo"
                width={50}
                height={48}
                class="absolute inset-6 h-10 w-10"
              />
              <CardDescription class="ml-auto text-success">You&apos;re signed in</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <Tabs defaultValue="account" class="w-full">
              {/* `mb-2` + the tabs' own root gap (8px) reproduces the previous
               * 16px gap between the list and its panels. */}
              <TabsList class={cn('mb-2 w-full', !tabsEnabled && 'bg-card')}>
                <TabsTrigger
                  value="account"
                  class={cn(
                    tabsEnabled
                      ? 'cursor-pointer data-[state=active]:cursor-not-allowed'
                      : '!bg-card justify-start'
                  )}
                >
                  <UserIcon aria-hidden="true" absoluteStrokeWidth size={20} stroke-width={1.5} />{' '}
                  Account
                </TabsTrigger>
                <Show when={flags.enableInventory}>
                  <TabsTrigger
                    value="inventory"
                    class="cursor-pointer data-[state=active]:cursor-not-allowed"
                  >
                    <Database aria-hidden="true" absoluteStrokeWidth size={20} stroke-width={1.5} />{' '}
                    Inventory
                  </TabsTrigger>
                </Show>
                <Show when={flags.enableStats}>
                  <TabsTrigger
                    value="stats"
                    class="cursor-pointer data-[state=active]:cursor-not-allowed"
                  >
                    <BookHeart
                      aria-hidden="true"
                      absoluteStrokeWidth
                      size={20}
                      stroke-width={1.5}
                    />{' '}
                    Stats
                  </TabsTrigger>
                </Show>
              </TabsList>
              <TabsContent value="account">
                <AccountDetails
                  enableAvatars={flags.enableAvatars}
                  enableLinkProviders={flags.enableLinkProviders}
                  enableLinkWallet={flags.enableLinkWallet}
                />
              </TabsContent>
              <TabsContent value="inventory">
                <Inventory />
              </TabsContent>
              <TabsContent value="stats">
                <Stats />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ProfileClient
