'use client'

import { createContext, useContext, type Accessor, type JSX } from 'solid-js'

import { useStore } from '@/state/use-store'
import {
  createNotificationStore,
  type NotificationState,
  type NotificationStore,
  type SnackbarInput,
} from '@/state/notification-store'

export type { SnackbarInput } from '@/state/notification-store'

const NotificationContext = createContext<NotificationStore | null>(null)

export function NotificationProvider(props: { children?: JSX.Element }) {
  // Component bodies run once in Solid, so the store is created directly.
  const store = createNotificationStore()

  return <NotificationContext.Provider value={store}>{props.children}</NotificationContext.Provider>
}

function useNotificationStore(): NotificationStore {
  const store = useContext(NotificationContext)
  if (!store) throw new Error('useNotification must be used inside NotificationProvider')
  return store
}

export function useNotification<T>(selector: (state: NotificationState) => T): Accessor<T> {
  return useStore(useNotificationStore(), selector)
}

export const useSnackbar = () => useNotification((state) => state.snackbar)
// Store actions are stable references; they do not need a subscription.
export const useOpenSnackbar = (): ((input: SnackbarInput) => void) =>
  useNotificationStore().getState().openSnackbar
export const useCloseSnackbar = () => useNotificationStore().getState().closeSnackbar
