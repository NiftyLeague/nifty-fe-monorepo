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

const BottomInfo = (props: BottomInfoProps): JSX.Element => {
  const gamerProfile = useGamerProfileContext()

  return (
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <GameCard
          image="/img/games/smashers/nifty-smashers-poster.webp"
          contents={
            <div class="flex flex-col gap-4 p-4">
              {props.nifty_smashers && <ProgressGamer size="sm" data={props.nifty_smashers} />}
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>2D Smashers</Title>
                <Title level={4}>
                  {gamerProfile.isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(props.nifty_smashers?.xp || 0)}/${props.nifty_smashers?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <LeftInfo data={props.nifty_smashers} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=nifty_smashers">View Leaderboards</Link>
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
              {props.wen_game && <ProgressGamer size="sm" data={props.wen_game} />}
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>WEN Game</Title>
                <Title level={4}>
                  {gamerProfile.isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(props.wen_game?.xp || 0)}/${props.wen_game?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={props.wen_game} />
              <Button variant="secondary" asChild>
                <Link href="/leaderboards?game=wen_game">View Leaderboards</Link>
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
              <ProgressGamer size="sm" data={props.crypto_winter} />
              <div class="flex flex-row items-center justify-between">
                <Title level={3}>CRYPTO WINTER</Title>
                <Title level={4}>
                  {gamerProfile.isLoadingProfile ? (
                    <DeferredSkeleton
                      class="inline-block h-(--skel-h) w-3/20 rounded"
                      style={{ '--skel-h': '19.76px' }}
                    />
                  ) : (
                    `${Math.round(props.crypto_winter?.xp || 0)}/${props.crypto_winter?.rank_xp_next || 0}`
                  )}
                  <span class="ml-1 text-muted-foreground">XP</span>
                </Title>
              </div>
              <MiniGameContent data={props.crypto_winter} />
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
