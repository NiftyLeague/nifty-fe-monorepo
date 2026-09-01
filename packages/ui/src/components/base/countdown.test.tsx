import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import Countdown from './countdown'

const setDocumentHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
}

describe('Countdown', () => {
  const originalHidden = document.hidden

  beforeEach(() => {
    jest.useFakeTimers()
    setDocumentHidden(false)
  })

  afterEach(() => {
    setDocumentHidden(originalHidden)
    jest.useRealTimers()
  })

  it('stops its refresh timer while the document is hidden and resumes on return', () => {
    const { unmount } = render(<Countdown date={new Date(Date.now() + 60_000)} />)

    expect(jest.getTimerCount()).toBe(1)

    setDocumentHidden(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(jest.getTimerCount()).toBe(0)

    setDocumentHidden(false)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(jest.getTimerCount()).toBe(1)

    unmount()
    expect(jest.getTimerCount()).toBe(0)
  })
})
