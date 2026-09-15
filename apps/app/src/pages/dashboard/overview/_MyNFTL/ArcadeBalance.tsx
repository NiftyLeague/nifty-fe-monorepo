'use client'

import { createSignal } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import { Button } from '@nl/ui/base/button'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import useTokensBalances from '@/hooks/balances/useTokensBalances'

import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog'
import HoverDataCard from '@/components/cards/HoverDataCard'

const ArcadeBalance = (): JSX.Element => {
  const router = useRouter()
  const { tokensBalances, loadingArcadeBal, refetchArcadeBal } = useTokensBalances()
  const [openBuyAT, setOpenBuyAT] = createSignal(false)

  const handleBuyArcadeTokens = () => {
    setOpenBuyAT(true)
  }

  const handlePlayArcade = (() => {
    gtm.sendEvent(GTM_EVENTS.PLAY_ARCADE_GAMES_BUTTON_TAPPED)
    router.push('/games')
  }, [router])

  return (
    <>
      <HoverDataCard
        title="Arcade Token Balance"
        primary={`${tokensBalances.AT} Tokens`}
        customStyle={{
          'background-color': 'var(--color-card)',
          border: 'var(--border-default)',
          position: 'relative',
        }}
        secondary=" "
        isLoading={loadingArcadeBal}
        actions={
          <>
            <div class="flex w-full flex-row items-center gap-2">
              <Button class="w-full" variant="outline" onClick={handleBuyArcadeTokens}>
                Buy Tokens
              </Button>
              <Button class="w-full" variant="default" onClick={handlePlayArcade}>
                Play Games
              </Button>
            </div>
          </>
        }
      />
      <BuyArcadeTokensDialog
        open={openBuyAT}
        onSuccess={() => {
          setOpenBuyAT(false)
          refetchArcadeBal()
        }}
        onClose={() => setOpenBuyAT(false)}
      />
    </>
  )
}

export default ArcadeBalance
