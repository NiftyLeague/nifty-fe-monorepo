import { describe, expect, it } from 'bun:test'
import accountReducer, { initialState as accountInitialState, login, logout } from './account'
import menuReducer, { activeItem, openDrawer } from './menu'
import snackbarReducer, { closeSnackbar, openSnackbar } from './snackbar'

describe('account reducer', () => {
  it('logs in and out without mutating the shared initial state', () => {
    const loggedIn = accountReducer(accountInitialState, login())
    expect(loggedIn.isLoggedIn).toBe(true)
    expect(accountInitialState.isLoggedIn).toBe(false)
    expect(accountReducer(loggedIn, logout()).isLoggedIn).toBe(false)
  })
})

describe('menu reducer', () => {
  it('updates active items and drawer visibility', () => {
    const selected = menuReducer(undefined, activeItem(['games']))
    expect(selected.openItem).toEqual(['games'])
    expect(menuReducer(selected, openDrawer(true)).drawerOpen).toBe(true)
  })
})

describe('snackbar reducer', () => {
  it('opens with supplied presentation options and closes cleanly', () => {
    const opened = snackbarReducer(
      undefined,
      openSnackbar({
        open: true,
        message: 'Saved',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
        transition: 'SlideLeft',
        close: false,
        actionButton: true,
      })
    )

    expect(opened).toMatchObject({ open: true, message: 'Saved', close: false, actionButton: true })
    expect(opened.alert).toEqual({ color: 'success', variant: 'outlined' })
    expect(snackbarReducer(opened, closeSnackbar()).open).toBe(false)
  })

  it('falls back to stable defaults for omitted options', () => {
    const opened = snackbarReducer(undefined, openSnackbar({ open: true }))
    expect(opened.message).toBe('Note archived')
    expect(opened.close).toBe(true)
  })
})
