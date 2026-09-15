'use client'

import DeferredSection from '@nl/ui/custom/deferred-section'
import DegenBalance from './DegenBalance'
import GameBalance from './GameBalance'
import TitleSection from './TitleSection'
import WalletBalances from './WalletBalances'
import type { JSX } from 'solid-js'

const loadArcadeBalance = () => import('./ArcadeBalance')

const MyNFTL = (): JSX.Element => (
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12 mt-2 mb-1">
      <TitleSection />
    </div>
    <div class="col-span-12 grid grid-cols-12 gap-4">
      <WalletBalances />
    </div>
    <div class="col-span-12 grid grid-cols-12 gap-4">
      <div class="col-span-12 sm:col-span-6">
        <GameBalance />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <DegenBalance />
      </div>
    </div>
    <div class="col-span-12">
      <DeferredSection label="Arcade balance" load={loadArcadeBalance} />
    </div>
  </div>
)

export default MyNFTL
