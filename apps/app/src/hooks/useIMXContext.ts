'use client'

import { useContext } from 'solid-js'

// IMX Provider
import IMXContext, { type IMXContextValue } from '@/contexts/IMXContext'

const useIMXContext = (): IMXContextValue => {
  const context = useContext(IMXContext)

  if (!context) throw new Error('context must be use inside provider')

  return context
}

export default useIMXContext
