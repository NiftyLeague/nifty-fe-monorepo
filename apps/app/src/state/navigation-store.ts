import type { SetStateAction } from 'react'
import { createStore } from 'zustand/vanilla'

export type NavigationState = {
  drawerOpen: boolean
  setDrawerOpen: (next: SetStateAction<boolean>) => void
  toggleDrawer: () => void
  reset: () => void
}

export type NavigationStore = ReturnType<typeof createNavigationStore>

const initialNavigationState = { drawerOpen: false }

export const createNavigationStore = (initialState: Partial<typeof initialNavigationState> = {}) =>
  createStore<NavigationState>()((set) => ({
    ...initialNavigationState,
    ...initialState,
    setDrawerOpen: (next) =>
      set((state) => ({
        drawerOpen: typeof next === 'function' ? next(state.drawerOpen) : next,
      })),
    toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
    reset: () => set(initialNavigationState),
  }))
