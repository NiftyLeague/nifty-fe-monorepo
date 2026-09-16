import { useContext } from 'solid-js'
import NFTsBalanceContext from '@/contexts/NFTsBalanceContext'

const useNFTsBalances = () => {
  const context = useContext(NFTsBalanceContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useNFTsBalances
