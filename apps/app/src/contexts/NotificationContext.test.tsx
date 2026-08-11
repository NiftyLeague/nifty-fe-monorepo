import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { NotificationProvider, useNotification } from './NotificationContext'

const wrapper = ({ children }: PropsWithChildren) => (
  <NotificationProvider>{children}</NotificationProvider>
)

describe('NotificationContext', () => {
  it('normalizes themed notification input and closes it without Redux', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() =>
      result.current.openSnackbar({
        open: true,
        message: 'Saved',
        variant: 'alert',
        alert: { color: 'success' },
        close: false,
      })
    )

    expect(result.current.snackbar).toMatchObject({
      open: true,
      message: 'Saved',
      variant: 'alert',
      alert: { color: 'success', variant: 'filled' },
      close: false,
    })

    act(() => result.current.closeSnackbar())
    expect(result.current.snackbar.open).toBe(false)
  })

  it('fails clearly when consumed outside its provider', () => {
    expect(() => renderHook(() => useNotification())).toThrow(
      'useNotification must be used inside NotificationProvider'
    )
  })
})
