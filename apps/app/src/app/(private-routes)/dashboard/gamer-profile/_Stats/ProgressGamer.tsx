import { Progress } from '@nl/ui/base/progress'
import { cn } from '@nl/ui/utils'

import type { ProfileTotal, ProfileNiftySmsher, ProfileMiniGame } from '@/types/account'

interface ProgressGamerProps {
  data?: ProfileTotal | ProfileNiftySmsher | ProfileMiniGame
  size?: 'sm' | 'md'
}

const ProgressGamer = ({ data, size = 'md' }: ProgressGamerProps): React.ReactNode => {
  const isMd = size === 'md'
  const badgeSize = isMd ? '54px' : '34px'
  const badgeFontSize = isMd ? '18px' : '14px'
  const rank = (data && data?.xp > data?.rank_xp_previous ? data?.rank + 1 : data?.rank) || 0

  return (
    <div className="relative">
      <Progress
        value={data ? (data?.xp / data?.rank_xp_next) * 100 : 0}
        className={cn('w-full', isMd ? 'h-[25px]' : 'h-[14px]')}
        style={{
          transform: 'translateZ(0)',
          backgroundColor: 'var(--color-muted-foreground)',
        }}
      />
      <span
        className="absolute -right-1.5 top-0 bottom-0 z-[1] m-auto flex items-center justify-center rounded-full bg-[var(--color-purple)] font-bold"
        style={{ width: badgeSize, height: badgeSize, fontSize: badgeFontSize }}
      >
        {rank}
      </span>
    </div>
  )
}

export default ProgressGamer
