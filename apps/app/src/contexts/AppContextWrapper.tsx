'use server'

// third party
import type { PropsWithChildren } from 'react'
import WalletContextWrapper from '@/contexts/WalletContextWrapper'

const AppContextWrapper = async ({ children }: PropsWithChildren) => {
  return <WalletContextWrapper includeCoreProviders>{children}</WalletContextWrapper>
}

export default AppContextWrapper
