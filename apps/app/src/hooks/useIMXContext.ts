'use client'

import { useContext } from 'react'

// IMX Provider
import IMXContext from '@/contexts/IMXContext'

const useIMXContext = (): React.ContextType<typeof IMXContext> => {
  const context = useContext(IMXContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useIMXContext
