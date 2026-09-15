import { createMemo } from 'solid-js'

import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { ProfileMiniGame } from '@/types/account'
import { secondsToHours } from '@/utils/dateTime'
import Item from './Item'

interface MiniGameContentProps {
  data: ProfileMiniGame | undefined
}

const MiniGameContent = ({ data }: MiniGameContentProps): JSX.Element => {
  const leftDataMapper: { label: string; value: string | number | undefined }[] = createMemo(() => {
    return [
      { label: 'XP Rank', value: data?.rank || 0 },
      { label: 'XP', value: Math.round(data?.xp || 0) },
      { label: 'High Score', value: data?.score || 0 },
      { label: 'Games', value: data?.matches || 0 },
      { label: 'Time Played', value: `${secondsToHours(data?.time_played ?? 0)} Hours` },
    ]
  }, [data])

  const { isLoadingProfile } = useGamerProfileContext()
  return (
    <div class="flex flex-1 flex-col gap-2">
      {leftDataMapper.map((child) => (
        <Item {...child} isLoading={isLoadingProfile} />
      ))}
    </div>
  )
}

export default MiniGameContent
