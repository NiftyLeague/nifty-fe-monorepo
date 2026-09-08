'use client'

import { useState, type PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { createAppQueryClient } from './app-query'

export default function AppQueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(createAppQueryClient)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
