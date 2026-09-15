import { act, render } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import Countdown from './countdown'

const setDocumentHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
}

describe('Countdown', () => {
  const originalHidden = document.hidden

  beforeEach(() => {
    setDocumentHidden(false)
  })

  afterEach(() => {
    setDocumentHidden(originalHidden)
  })

  it('stops its refresh timer while the document is hidden and resumes on return', () => {
    const setIntervalSpy = spyOn(globalThis, 'setInterval')
    const clearIntervalSpy = spyOn(globalThis, 'clearInterval')

    const { unmount } = render(() => <Countdown date={new Date(Date.now() + 60_000)} />)
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    expect(clearIntervalSpy).not.toHaveBeenCalled()

    setDocumentHidden(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)

    setDocumentHidden(false)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(setIntervalSpy).toHaveBeenCalledTimes(2)

    unmount()
    expect(clearIntervalSpy).toHaveBeenCalledTimes(2)
  })
})
