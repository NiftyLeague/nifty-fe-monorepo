'use client'

import { useContext } from 'solid-js'

// IMX Provider
import IMXContext from '@/contexts/IMXContext'

const useIMXContext = (): JSX.ContextType<typeof IMXContext> => {
  const context = useContext(IMXContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useIMXContext
