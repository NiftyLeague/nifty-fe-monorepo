'use client'

import { createContext, useContext, useRef, type PropsWithChildren } from 'react'
import { useStore } from 'zustand'

import {
  createNotificationStore,
  type NotificationState,
  type NotificationStore,
  type SnackbarInput,
} from '@/state/notification-store'

export type { SnackbarInput } from '@/state/notification-store'

const NotificationContext = createContext<NotificationStore | null>(null)

export function NotificationProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<NotificationStore | null>(null)
  if (!storeRef.current) storeRef.current = createNotificationStore()

  return (
    <NotificationContext.Provider value={storeRef.current}>{children}</NotificationContext.Provider>
  )
}

export function useNotification<T>(selector: (state: NotificationState) => T): T {
  const store = useContext(NotificationContext)
  if (!store) throw new Error('useNotification must be used inside NotificationProvider')
  return useStore(store, selector)
}

export const useSnackbar = () => useNotification((state) => state.snackbar)
export const useOpenSnackbar = (): ((input: SnackbarInput) => void) =>
  useNotification((state) => state.openSnackbar)
export const useCloseSnackbar = () => useNotification((state) => state.closeSnackbar)
