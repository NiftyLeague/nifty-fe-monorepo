'use client'

import { createContext, useContext, useRef, type PropsWithChildren } from 'react'
import { useStore } from 'zustand'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'

import {
  createNavigationStore,
  type NavigationState,
  type NavigationStore,
} from '@/state/navigation-store'

const NavigationContext = createContext<NavigationStore | null>(null)

export function NavigationProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<NavigationStore | null>(null)
  if (!storeRef.current) storeRef.current = createNavigationStore()

  return (
    <NavigationContext.Provider value={storeRef.current}>{children}</NavigationContext.Provider>
  )
}

export function useNavigation<T>(selector: (state: NavigationState) => T): T {
  const store = useContext(NavigationContext)
  if (!store) throw new Error('useNavigation must be used within NavigationProvider')
  return useStore(store, selector)
}

export const useDrawerOpen = () => useNavigation((state) => state.drawerOpen)
export const useSetDrawerOpen = () => useNavigation((state) => state.setDrawerOpen)
export const useToggleDrawer = () => useNavigation((state) => state.toggleDrawer)
export const useIsDesktopNavigation = () => useMediaQuery(desktopNavigationMediaQuery)
