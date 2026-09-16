import type { ParentProps } from 'solid-js'

import NFTDataProviders from '@/contexts/NFTDataProviders'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'

export default function WalletFeatureProviders(props: ParentProps) {
  return (
    <NFTDataProviders>
      <TokensBalanceProvider>{props.children}</TokensBalanceProvider>
    </NFTDataProviders>
  )
}
