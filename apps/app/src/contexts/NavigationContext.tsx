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

interface NavigationContextValue {
  drawerOpen: boolean
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
  toggleDrawer: () => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: PropsWithChildren) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), [])
  const value = useMemo(
    () => ({ drawerOpen, setDrawerOpen, toggleDrawer }),
    [drawerOpen, toggleDrawer]
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used within NavigationProvider')
  return context
}
