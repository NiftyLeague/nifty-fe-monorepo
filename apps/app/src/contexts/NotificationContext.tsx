import { createContext, createMemo, useContext, type Accessor, type JSX } from 'solid-js'

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
  const store = useNotificationStore()
  return createMemo(() => selector(store.state))
}

export const useSnackbar = () => useNotification((state) => state.snackbar)
// Store actions are stable references; they do not need reactivity.
export const useOpenSnackbar = (): ((input: SnackbarInput) => void) =>
  useNotificationStore().openSnackbar
export const useCloseSnackbar = () => useNotificationStore().closeSnackbar
