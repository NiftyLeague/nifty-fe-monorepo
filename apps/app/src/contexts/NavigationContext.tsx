import { createContext, createMemo, useContext, type Accessor, type JSX } from 'solid-js'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'

import {
  createNavigationStore,
  type NavigationState,
  type NavigationStore,
} from '@/state/navigation-store'

const NavigationContext = createContext<NavigationStore | null>(null)

export function NavigationProvider(props: { children?: JSX.Element }) {
  // Component bodies run once in Solid, so the store is created directly.
  const store = createNavigationStore()

  return <NavigationContext.Provider value={store}>{props.children}</NavigationContext.Provider>
}

function useNavigationStore(): NavigationStore {
  const store = useContext(NavigationContext)
  if (!store) throw new Error('useNavigation must be used within NavigationProvider')
  return store
}

export function useNavigation<T>(selector: (state: NavigationState) => T): Accessor<T> {
  const store = useNavigationStore()
  return createMemo(() => selector(store.state))
}

export const useDrawerOpen = () => useNavigation((state) => state.drawerOpen)
// Store actions are stable references; they do not need reactivity.
export const useSetDrawerOpen = () => useNavigationStore().setDrawerOpen
export const useToggleDrawer = () => useNavigationStore().toggleDrawer
export const useIsDesktopNavigation = () => useMediaQuery(desktopNavigationMediaQuery)
