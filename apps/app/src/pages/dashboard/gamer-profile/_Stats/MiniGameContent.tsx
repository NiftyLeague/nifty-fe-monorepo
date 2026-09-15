import { createMemo, For, type JSX } from 'solid-js'

import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { ProfileMiniGame } from '@/types/account'
import { secondsToHours } from '@/utils/dateTime'
import Item from './Item'

interface MiniGameContentProps {
  data: ProfileMiniGame | undefined
}

const MiniGameContent = (props: MiniGameContentProps): JSX.Element => {
  const profile = useGamerProfileContext()
  const leftDataMapper = createMemo((): { label: string; value: string | number | undefined }[] => {
    const data = props.data
    return [
      { label: 'XP Rank', value: data?.rank || 0 },
      { label: 'XP', value: Math.round(data?.xp || 0) },
      { label: 'High Score', value: data?.score || 0 },
      { label: 'Games', value: data?.matches || 0 },
      { label: 'Time Played', value: `${secondsToHours(data?.time_played ?? 0)} Hours` },
    ]
  })

  return (
    <div class="flex flex-1 flex-col gap-2">
      <For each={leftDataMapper()}>
        {(child) => <Item {...child} isLoading={profile.isLoadingProfile} />}
      </For>
    </div>
  )
}

export default MiniGameContent
