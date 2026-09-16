import { useContext } from 'solid-js'

// auth provider
import GamerProfileContext from '@/contexts/GamerProfileContext'

// ==============================|| AUTH HOOKS ||============================== //

const useGamerProfileContext = () => {
  const context = useContext(GamerProfileContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useGamerProfileContext
