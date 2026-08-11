import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { NavigationProvider, useNavigation } from './NavigationContext'

const wrapper = ({ children }: PropsWithChildren) => (
  <NavigationProvider>{children}</NavigationProvider>
)

describe('NavigationContext', () => {
  it('shares drawer state and supports functional toggles', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper })

    expect(result.current.drawerOpen).toBe(false)
    act(() => result.current.toggleDrawer())
    expect(result.current.drawerOpen).toBe(true)
    act(() => result.current.setDrawerOpen(false))
    expect(result.current.drawerOpen).toBe(false)
  })

  it('fails clearly when consumed outside its provider', () => {
    expect(() => renderHook(() => useNavigation())).toThrow(
      'useNavigation must be used within NavigationProvider'
    )
  })
})
