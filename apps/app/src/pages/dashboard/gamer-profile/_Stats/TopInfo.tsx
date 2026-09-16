import { Show } from 'solid-js'
import { Copy } from 'lucide-solid'
import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'

import { useCopyToClipboard } from '@nl/ui/hooks/useCopyToClipboard'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { Profile } from '@/types/account'

import ProgressGamer from './ProgressGamer'
import DeferredProfileNameDialog from '@/components/providers/DeferredProfileNameDialog'
import TopInfoSkeleton from './TopInfoSkeleton'
import type { JSX } from 'solid-js'

interface TopInfoProps {
  profile: Profile | undefined
  walletAddress: string
}

const TopInfo = (props: TopInfoProps): JSX.Element => {
  const gamerProfile = useGamerProfileContext()
  const [, copy] = useCopyToClipboard()
  const total = () => props.profile?.stats?.total
  const profileName = () => props.profile?.name_cased ?? 'Unknown'

  const handleUpdateNewName = () => {
    gamerProfile.fetchUserProfile?.()
  }

  const renderTopInfo = () => {
    return (
      <div class="flex flex-col">
        <div class="flex flex-row items-center gap-10">
          <div class="w-1/2">
            <Title level={2}>
              {profileName()}{' '}
              <DeferredProfileNameDialog handleUpdateNewName={handleUpdateNewName} />
            </Title>
          </div>
          <div class="w-1/2">{total() && <ProgressGamer data={total()} />}</div>
        </div>
        <div class="flex flex-row items-center gap-10">
          <Title level={4} class="w-1/2 text-muted-foreground">
            {`${props.walletAddress.slice(0, 5)}...${props.walletAddress.slice(
              props.walletAddress.length - 5,
              props.walletAddress.length - 1
            )}`}{' '}
            <Button
              variant="ghost"
              size="icon"
              aria-label="copy"
              class="cursor-pointer"
              onClick={() => props.walletAddress && copy(props.walletAddress)}
            >
              <Copy
                aria-hidden="true"
                absoluteStrokeWidth
                size={18}
                strokeWidth={1.5}
                color="var(--color-muted-foreground)"
              />
            </Button>
          </Title>
          <Title level={4} class="w-1/2">
            {Math.round(total()?.xp || 0)}/{total()?.rank_xp_next}
            <span class="ml-1 text-muted-foreground">XP</span>
          </Title>
        </div>
      </div>
    )
  }

  return (
    <Show when={!gamerProfile.isLoadingProfile} fallback={<TopInfoSkeleton />}>
      {renderTopInfo()}
    </Show>
  )
}

export default TopInfo
