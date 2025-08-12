import { formatNumberToDisplay } from '@nl/ui/utils';
import { useUserContext } from '../../hooks/useUserContext';
import { Input } from '@nl/ui/custom/input';

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
};

export default function Stats() {
  const { stats, isLoggedIn } = useUserContext();

  return isLoggedIn ? (
    <div className="grid gap-4">
      <fieldset>
        <div className="grid gap-2">
          <legend>
            <h3 className="text-lg">Player STATs</h3>
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {stats?.map(stat => {
              const { StatisticName, Value } = stat;
              if (!StatisticName) return null;
              const statInfo = STAT_MAP[StatisticName as keyof typeof STAT_MAP] ?? {
                displayName: StatisticName,
                icon: '⭐',
              };
              return (
                <Input
                  key={StatisticName}
                  id={StatisticName}
                  className="w-full text-center !opacity-100 !bg-purple/20 !text-purple-200"
                  type="text"
                  value={`${statInfo.icon} ${formatNumberToDisplay(Value, 0)}`}
                  label={statInfo.displayName}
                  disabled
                />
              );
            })}
          </div>
        </div>
      </fieldset>
    </div>
  ) : null;
}
