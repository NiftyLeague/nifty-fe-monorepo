import { describe, expect, it } from 'bun:test'

import { createNavigationStore } from './navigation-store'
import { createNotificationStore, initialSnackbar } from './notification-store'

describe('navigation store', () => {
  it('scopes drawer state and supports deterministic reset', () => {
    const first = createNavigationStore()
    const second = createNavigationStore({ drawerOpen: true })

    first.toggleDrawer()
    expect(first.state.drawerOpen).toBe(true)
    expect(second.state.drawerOpen).toBe(true)

    first.setDrawerOpen(false)
    expect(first.state.drawerOpen).toBe(false)
    expect(second.state.drawerOpen).toBe(true)

    first.reset()
    expect(first.state.drawerOpen).toBe(false)
  })
})

describe('notification store', () => {
  it('normalizes input, closes, and resets without sharing instances', () => {
    const first = createNotificationStore()
    const second = createNotificationStore()

    first.openSnackbar({
      open: true,
      message: 'Saved',
      variant: 'alert',
      alert: { color: 'success' },
      close: false,
    })

    expect(first.state.snackbar).toMatchObject({
      open: true,
      message: 'Saved',
      variant: 'alert',
      alert: { color: 'success', variant: 'filled' },
      close: false,
    })
    expect(second.state.snackbar).toEqual(initialSnackbar)

    first.closeSnackbar()
    expect(first.state.snackbar.open).toBe(false)
    first.reset()
    expect(first.state.snackbar).toEqual(initialSnackbar)
  })
})
