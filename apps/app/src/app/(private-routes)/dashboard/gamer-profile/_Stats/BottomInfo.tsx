import Link from 'next/link'
import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { Title } from '@nl/ui/custom/typography'
import ProgressGamer from './ProgressGamer'
import GameCard from '@/components/cards/GameCard'
import LeftInfo from './LeftInfo'
import MiniGameContent from './MiniGameContent'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'

import type { ProfileNiftySmsher, ProfileMiniGame } from '@/types/account'

interface BottomInfoProps {
  nifty_smashers: ProfileNiftySmsher | undefined
  wen_game: ProfileMiniGame | undefined
  crypto_winter: ProfileMiniGame | undefined
}

const BottomInfo = ({
  nifty_smashers,
  wen_game,
  crypto_winter,
}: BottomInfoProps): React.ReactNode => {
  const { isLoadingProfile } = useGamerProfileContext()

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/smashers/nifty-smashers-poster.webp"
          contents={
            <div className="flex flex-col gap-4 p-4">
              {nifty_smashers && <ProgressGamer size="sm" data={nifty_smashers} />}
              <div className="flex flex-row items-center justify-between">
                <Title level={3}>2D Smashers</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <Skeleton className="inline-block h-[19.76px] w-[15%] rounded" />
                  ) : (
                    `${Math.round(nifty_smashers?.xp || 0)}/${nifty_smashers?.rank_xp_next || 0}`
                  )}
                  <span className="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <LeftInfo data={nifty_smashers} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=nifty_smashers">View Leaderboards</Link>
              </Button>
            </div>
          }
        />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/wen-poster.webp"
          contents={
            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
              {wen_game && <ProgressGamer size="sm" data={wen_game} />}
              <div className="flex flex-row items-center justify-between">
                <Title level={3}>WEN Game</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <Skeleton className="inline-block h-[19.76px] w-[15%] rounded" />
                  ) : (
                    `${Math.round(wen_game?.xp || 0)}/${wen_game?.rank_xp_next || 0}`
                  )}
                  <span className="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={wen_game} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=wen_game">View Leaderboards</Link>
              </Button>
            </div>
          }
        />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/crypto-winter.webp"
          contents={
            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
              <ProgressGamer size="sm" data={crypto_winter} />
              <div className="flex flex-row items-center justify-between">
                <Title level={3}>CRYPTO WINTER</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <Skeleton className="inline-block h-[19.76px] w-[15%] rounded" />
                  ) : (
                    `${Math.round(crypto_winter?.xp || 0)}/${crypto_winter?.rank_xp_next || 0}`
                  )}
                  <span className="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={crypto_winter} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=crypto_winter">View Leaderboards</Link>
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default BottomInfo
