'use client'

import { useContext } from 'solid-js'

// Network Provider
import NetworkContext from '@/contexts/NetworkContext'

const useNetworkContext = (): JSX.ContextType<typeof NetworkContext> => {
  const context = useContext(NetworkContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useNetworkContext
