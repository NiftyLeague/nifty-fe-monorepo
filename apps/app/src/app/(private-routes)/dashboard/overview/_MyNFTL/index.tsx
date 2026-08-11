'use client'

import DeferredDashboardSection from '@/components/providers/DeferredDashboardSection'
import DegenBalance from './DegenBalance'
import GameBalance from './GameBalance'
import TitleSection from './TitleSection'
import WalletBalances from './WalletBalances'

const loadArcadeBalance = () => import('./ArcadeBalance')

const MyNFTL = (): React.ReactNode => (
  <div className="grid grid-cols-12 gap-4">
    <div className="col-span-12 mt-2 mb-1">
      <TitleSection />
    </div>
    <div className="col-span-12 grid grid-cols-12 gap-4">
      <WalletBalances />
    </div>
    <div className="col-span-12 grid grid-cols-12 gap-4">
      <div className="col-span-12 sm:col-span-6">
        <GameBalance />
      </div>
      <div className="col-span-12 sm:col-span-6">
        <DegenBalance />
      </div>
    </div>
    <div className="col-span-12">
      <DeferredDashboardSection label="Arcade balance" load={loadArcadeBalance} />
    </div>
  </div>
)

export default MyNFTL
