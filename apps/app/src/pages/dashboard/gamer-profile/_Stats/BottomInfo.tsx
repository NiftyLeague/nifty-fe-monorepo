import Link from '@/runtime/Link'
import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { Title } from '@nl/ui/custom/typography'
import ProgressGamer from './ProgressGamer'
import GameCard from '@/components/cards/GameCard'
import LeftInfo from './LeftInfo'
import MiniGameContent from './MiniGameContent'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'

import type { ProfileNiftySmsher, ProfileMiniGame } from '@/types/account'
import type { JSX } from 'solid-js'

interface BottomInfoProps {
  nifty_smashers: ProfileNiftySmsher | undefined
  wen_game: ProfileMiniGame | undefined
  crypto_winter: ProfileMiniGame | undefined
}

const BottomInfo = ({ nifty_smashers, wen_game, crypto_winter }: BottomInfoProps): JSX.Element => {
  const { isLoadingProfile } = useGamerProfileContext()

  return (
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/smashers/nifty-smashers-poster.webp"
          contents={
            <div class="flex flex-col gap-4 p-4">
              {nifty_smashers && <ProgressGamer size="sm" data={nifty_smashers} />}
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>2D Smashers</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(nifty_smashers?.xp || 0)}/${nifty_smashers?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <LeftInfo data={nifty_smashers} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=nifty_smashers" prefetch={false}>
                  View Leaderboards
                </Link>
              </Button>
            </div>
          }
        />
      </div>
      <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/wen-poster.webp"
          contents={
            <div class="flex flex-1 flex-col justify-between gap-4 p-4">
              {wen_game && <ProgressGamer size="sm" data={wen_game} />}
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>WEN Game</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(wen_game?.xp || 0)}/${wen_game?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={wen_game} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=wen_game" prefetch={false}>
                  View Leaderboards
                </Link>
              </Button>
            </div>
          }
        />
      </div>
      <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/crypto-winter.webp"
          contents={
            <div class="flex flex-1 flex-col justify-between gap-4 p-4">
              <ProgressGamer size="sm" data={crypto_winter} />
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>CRYPTO WINTER</Title>
                <Title level={4}>
                  {isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(crypto_winter?.xp || 0)}/${crypto_winter?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={crypto_winter} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=crypto_winter" prefetch={false}>
                  View Leaderboards
                </Link>
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default BottomInfo
