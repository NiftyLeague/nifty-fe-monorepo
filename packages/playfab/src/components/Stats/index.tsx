import { For, Show } from 'solid-js'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import { useUserContext } from '../../hooks/useUserContext'
import DisplayField from '../DisplayField'

const STAT_MAP = {
  NiftyPlayersWin: { displayName: 'Total Wins', icon: '🏆' },
  PlayerExp: { displayName: 'Experience', icon: '🌟' },
  NiftyPlayersTotalMatch: { displayName: 'Matches Played', icon: '🎮' },
  NiftyPlayersTotalPoints: { displayName: 'Total Points', icon: '✨' },
  NiftyPlayersTotalBonks: { displayName: 'Total Bonks', icon: '🔨' },
  NiftyPlayersTotalDeaths: { displayName: 'Total Deaths', icon: '💀' },
  NiftyPlayersTimePlayed: { displayName: 'Time Played', icon: '⏱️' },
  NiftyPlayersTotalKills: { displayName: 'Total Kills', icon: '⚔️' },
  NiftyPlayersRankAllTime: { displayName: 'All-Time Rank', icon: '👑' },
  PlayerExpV2: { displayName: 'Experience V2', icon: '🚀' },
  nifty_wen_leaderboard: { displayName: 'WEN Leaderboard', icon: '📈' },
  NiftyTrophyStatistic: { displayName: 'Trophies', icon: '🏆' },
}

export default function Stats() {
  const { userInfo, isLoggedIn } = useUserContext()

  return (
    <Show when={isLoggedIn()}>
      <div class="grid gap-4">
        <fieldset>
          <div class="grid gap-2">
            <legend>
              <h3 class="text-lg">Player STATs</h3>
            </legend>
            <div class="grid grid-cols-2 gap-2">
              <For each={userInfo()?.PlayerStatistics}>
                {(stat) => {
                  const { StatisticName, Value } = stat
                  if (!StatisticName) return null
                  const statInfo = STAT_MAP[StatisticName as keyof typeof STAT_MAP] ?? {
                    displayName: StatisticName,
                    icon: '⭐',
                  }
                  return (
                    <DisplayField
                      id={StatisticName}
                      value={`${statInfo.icon} ${formatNumberToDisplay(Value, 0)}`}
                      label={statInfo.displayName}
                      className="w-full bg-purple/20"
                      inputClassName="text-center !opacity-100 !text-purple-200"
                    />
                  )
                }}
              </For>
            </div>
          </div>
        </fieldset>
      </div>
    </Show>
  )
}
