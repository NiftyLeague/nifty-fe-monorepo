import { createMemo, For, type JSX } from 'solid-js'

import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { ProfileTotal, ProfileNiftySmsher } from '@/types/account'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import { secondsToHours } from '@/utils/dateTime'

import Item from './Item'

interface LeftInfoProps {
  data: ProfileTotal | ProfileNiftySmsher | undefined
}

const LeftInfo = (props: LeftInfoProps): JSX.Element => {
  const profile = useGamerProfileContext()
  const leftDataMapper = createMemo((): { label: string; value: string | number | undefined }[] => {
    const data = props.data
    return [
      { label: 'XP Rank', value: data?.rank || 0 },
      { label: 'XP', value: Math.round(data?.xp || 0) },
      { label: 'Matches', value: data?.matches || 0 },
      { label: 'Wins', value: data?.wins || 0 },
      {
        label: 'Win Rate',
        value: `${(data?.wins && data?.matches && formatNumberToDisplay((data?.wins / data?.matches) * 100)) || 0}%`,
      },
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

export default LeftInfo
