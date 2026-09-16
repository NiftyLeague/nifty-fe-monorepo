import { createStore } from 'solid-js/store'
import type { SetStateAction } from '@/types'

export type NavigationState = {
  drawerOpen: boolean
}

export type NavigationStore = ReturnType<typeof createNavigationStore>

const initialNavigationState: NavigationState = { drawerOpen: false }

export const createNavigationStore = (initialState: Partial<NavigationState> = {}) => {
  const [state, setState] = createStore<NavigationState>({
    ...initialNavigationState,
    ...initialState,
  })

  return {
    state,
    setDrawerOpen: (next: SetStateAction<boolean>) =>
      setState('drawerOpen', (previous) => (typeof next === 'function' ? next(previous) : next)),
    toggleDrawer: () => setState('drawerOpen', (previous) => !previous),
    reset: () => setState({ ...initialNavigationState }),
  }
}
