'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import { desktopNavigationMediaQuery } from '@/app/_layout/navigation-breakpoints'

interface NavigationContextValue {
  drawerOpen: boolean
  isDesktopNavigation: boolean
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
  toggleDrawer: () => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: PropsWithChildren) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isDesktopNavigation = useMediaQuery(desktopNavigationMediaQuery)
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), [])
  const value = useMemo(
    () => ({ drawerOpen, isDesktopNavigation, setDrawerOpen, toggleDrawer }),
    [drawerOpen, isDesktopNavigation, toggleDrawer]
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used within NavigationProvider')
  return context
}
