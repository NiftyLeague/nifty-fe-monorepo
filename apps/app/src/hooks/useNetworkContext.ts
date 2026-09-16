import { useContext } from 'solid-js'

// Network Provider
import NetworkContext, { type NetworkContextValue } from '@/contexts/NetworkContext'

const useNetworkContext = (): NetworkContextValue => {
  const context = useContext(NetworkContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useNetworkContext
