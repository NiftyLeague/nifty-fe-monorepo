import { Progress } from '@nl/ui/base/progress'
import { cn } from '@nl/ui/utils'

import type { ProfileTotal, ProfileNiftySmsher, ProfileMiniGame } from '@/types/account'
import type { JSX } from 'solid-js'

interface ProgressGamerProps {
  data?: ProfileTotal | ProfileNiftySmsher | ProfileMiniGame
  size?: 'sm' | 'md'
}

const ProgressGamer = ({ data, size = 'md' }: ProgressGamerProps): JSX.Element => {
  const isMd = size === 'md'
  const badgeSize = isMd ? '54px' : '34px'
  const badgeFontSize = isMd ? '18px' : '14px'
  const rank = (data && data?.xp > data?.rank_xp_previous ? data?.rank + 1 : data?.rank) || 0

  return (
    <div class="relative">
      <Progress
        value={data ? (data?.xp / data?.rank_xp_next) * 100 : 0}
        class={cn('w-full translate-z-0 bg-muted-foreground', isMd ? 'h-6.25' : 'h-3.5')}
      />
      <span
        class="absolute -right-1.5 top-0 bottom-0 z-1 m-auto flex w-(--badge-size) h-(--badge-size) items-center justify-center rounded-full bg-purple text-(--badge-fs) font-bold"
        style={{
          '--badge-size': badgeSize,
          '--badge-fs': badgeFontSize,
        }}
      >
        {rank}
      </span>
    </div>
  )
}

export default ProgressGamer
