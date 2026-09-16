import Link from '@/runtime/Link'
import { Button } from '@nl/ui/base/button'
import SectionTitle from '@/components/sections/SectionTitle'
import { useGamerProfile } from '@/hooks/useGamerProfile'
import GamerProfileContext from '@/contexts/GamerProfileContext'
import LeftInfo from '../gamer-profile/_Stats/LeftInfo'
import type { Profile } from '@/types/account'
import { Show, type JSX } from 'solid-js'

const MyStats = (props: { profile?: Profile }): JSX.Element => {
  return (
    <div class="grid h-full grid-cols-12 gap-4">
      <div class="col-span-12">
        <SectionTitle
          firstSection
          variant="h3"
          actions={
            <div class="flex flex-row gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/gamer-profile" prefetch={false}>
                  View All Stats
                </Link>
              </Button>
            </div>
          }
        >
          My Stats
        </SectionTitle>
      </div>
      <div class="col-span-12 h-full">
        <div class="flex flex-row gap-10">
          <LeftInfo data={props.profile?.stats?.total} />
        </div>
      </div>
    </div>
  )
}

const MyStatsContext = () => {
  const gamerProfile = useGamerProfile()
  return (
    <Show when={!gamerProfile.error && (gamerProfile.profile || gamerProfile.loadingProfile)}>
      <GamerProfileContext.Provider
        value={{
          get isLoadingProfile() {
            return gamerProfile.loadingProfile
          },
          isLoadingDegens: false,
          isLoadingComics: false,
          isLoadingItems: false,
        }}
      >
        <MyStats profile={gamerProfile.profile} />
      </GamerProfileContext.Provider>
    </Show>
  )
}

export default MyStatsContext
