'use client'

import Link from 'next/link'
import { Button } from '@nl/ui/base/button'
import SectionTitle from '@/components/sections/SectionTitle'
import { useGamerProfile } from '@/hooks/useGamerProfile'
import GamerProfileContext from '@/contexts/GamerProfileContext'
import LeftInfo from '../gamer-profile/_Stats/LeftInfo'
import type { Profile } from '@/types/account'

const MyStats = ({ profile }: { profile?: Profile }): React.ReactNode => {
  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="col-span-12">
        <SectionTitle
          firstSection
          variant="h3"
          actions={
            <div className="flex flex-row gap-4">
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
      <div className="col-span-12 h-full">
        <div className="flex flex-row gap-10">
          <LeftInfo data={profile?.stats?.total} />
        </div>
      </div>
    </div>
  )
}

const MyStatsContext = () => {
  const { profile, error, loadingProfile } = useGamerProfile()
  return !error && (profile || loadingProfile) ? (
    <GamerProfileContext.Provider
      value={{
        isLoadingProfile: loadingProfile,
        isLoadingDegens: false,
        isLoadingComics: false,
        isLoadingItems: false,
      }}
    >
      <MyStats profile={profile} />
    </GamerProfileContext.Provider>
  ) : null
}

export default MyStatsContext
