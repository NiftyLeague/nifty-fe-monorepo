import { describe, expect, it } from 'bun:test'

import { createNavigationStore } from './navigation-store'
import { createNotificationStore, initialSnackbar } from './notification-store'

describe('navigation store', () => {
  it('scopes drawer state and supports deterministic reset', () => {
    const first = createNavigationStore()
    const second = createNavigationStore({ drawerOpen: true })

    first.getState().toggleDrawer()
    expect(first.getState().drawerOpen).toBe(true)
    expect(second.getState().drawerOpen).toBe(true)

    first.getState().setDrawerOpen(false)
    expect(first.getState().drawerOpen).toBe(false)
    expect(second.getState().drawerOpen).toBe(true)

    first.getState().reset()
    expect(first.getState().drawerOpen).toBe(false)
  })
})

describe('notification store', () => {
  it('normalizes input, closes, and resets without sharing instances', () => {
    const first = createNotificationStore()
    const second = createNotificationStore()

    first.getState().openSnackbar({
      open: true,
      message: 'Saved',
      variant: 'alert',
      alert: { color: 'success' },
      close: false,
    })

    expect(first.getState().snackbar).toMatchObject({
      open: true,
      message: 'Saved',
      variant: 'alert',
      alert: { color: 'success', variant: 'filled' },
      close: false,
    })
    expect(second.getState().snackbar).toEqual(initialSnackbar)

    first.getState().closeSnackbar()
    expect(first.getState().snackbar.open).toBe(false)
    first.getState().reset()
    expect(first.getState().snackbar).toEqual(initialSnackbar)
  })
})
