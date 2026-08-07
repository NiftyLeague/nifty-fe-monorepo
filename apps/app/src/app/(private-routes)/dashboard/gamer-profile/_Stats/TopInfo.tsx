'use client'

import { useMemo } from 'react'
import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { Title } from '@nl/ui/custom/typography'

import { useCopyToClipboard } from '@nl/ui/hooks/useCopyToClipboard'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { Profile } from '@/types/account'

import ProgressGamer from './ProgressGamer'
import ChangeProfileNameDialog from './ChangeProfileNameDialog'
import TopInfoSkeleton from './TopInfoSkeleton'

interface TopInfoProps {
  profile: Profile | undefined
  walletAddress: string
}

const TopInfo = ({ profile, walletAddress }: TopInfoProps): React.ReactNode => {
  const { isLoadingProfile, fetchUserProfile } = useGamerProfileContext()
  const [, copy] = useCopyToClipboard()
  const total = profile?.stats?.total
  const profileName = useMemo(() => profile?.name_cased ?? 'Unknown', [profile])

  const handleUpdateNewName = () => {
    fetchUserProfile?.()
  }

  const renderTopInfo = () => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-10">
          <div className="w-1/2">
            <Title level={2}>
              {profileName} <ChangeProfileNameDialog handleUpdateNewName={handleUpdateNewName} />
            </Title>
          </div>
          <div className="w-1/2">{total && <ProgressGamer data={total} />}</div>
        </div>
        <div className="flex flex-row items-center gap-10">
          <Title level={4} className="w-1/2 text-muted-foreground">
            {`${walletAddress.slice(0, 5)}...${walletAddress.slice(
              walletAddress.length - 5,
              walletAddress.length - 1
            )}`}{' '}
            <Button
              variant="ghost"
              size="icon"
              aria-label="copy"
              className="cursor-pointer"
              onClick={() => walletAddress && copy(walletAddress)}
            >
              <Icon name="copy" size="sm" color="var(--color-muted-foreground)" />
            </Button>
          </Title>
          <Title level={4} className="w-1/2">
            {Math.round(total?.xp || 0)}/{total?.rank_xp_next}
            <span className="ml-1 text-muted-foreground">XP</span>
          </Title>
        </div>
      </div>
    )
  }

  return isLoadingProfile ? <TopInfoSkeleton /> : renderTopInfo()
}

export default TopInfo
