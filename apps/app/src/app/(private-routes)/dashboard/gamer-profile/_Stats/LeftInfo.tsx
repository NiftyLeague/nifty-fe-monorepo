import { useMemo } from 'react'

import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import type { ProfileTotal, ProfileNiftySmsher } from '@/types/account'
import { formatNumberToDisplay } from '@nl/ui/utils'
import { secondsToHours } from '@/utils/dateTime'

import Item from './Item'

interface LeftInfoProps {
  data: ProfileTotal | ProfileNiftySmsher | undefined
}

const LeftInfo = ({ data }: LeftInfoProps): React.ReactNode => {
  const leftDataMapper: { label: string; value: string | number | undefined }[] = useMemo(() => {
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
  }, [data])

  const { isLoadingProfile } = useGamerProfileContext()
  return (
    <div className="flex flex-1 flex-col gap-2">
      {leftDataMapper.map((child) => (
        <Item key={child.label} {...child} isLoading={isLoadingProfile} />
      ))}
    </div>
  )
}

export default LeftInfo
