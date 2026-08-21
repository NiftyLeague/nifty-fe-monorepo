import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let bncNotifyLoaded = false
const sendTransactionMock = mock()
const notifyFactory = mock(() => ({ hash: mock(() => ({ emitter: { on: mock() } })) }))

mock.module('bnc-notify', () => {
  bncNotifyLoaded = true
  return { default: notifyFactory }
})

mock.module('@/utils/bnc-notify', () => ({
  handleError: mock(),
  handleLocalNotify: mock(),
  sendTransaction: sendTransactionMock,
}))

mock.module('@/constants/networks', () => ({
  TARGET_NETWORK: { blockExplorer: 'https://example.com', chainId: 1 },
  VALID_NOTIFY_NETWORKS: [1],
}))

mock.module('@/constants/index', () => ({ DEBUG: false }))

describe('useNotify', () => {
  let useNotify: typeof import('./useNotify').default

  beforeEach(async () => {
    bncNotifyLoaded = false
    sendTransactionMock.mockReset()
    notifyFactory.mockClear()
    useNotify = (await import('./useNotify')).default
  })

  it('does not load Blocknative until a transaction is submitted', () => {
    renderHook(() => useNotify({} as never))

    expect(bncNotifyLoaded).toBe(false)
  })

  it('loads Blocknative when a transaction is submitted', async () => {
    const transaction = {
      hash: '0xsubmitted',
      wait: mock().mockResolvedValue(undefined),
    }
    sendTransactionMock.mockResolvedValue(transaction)
    const { result } = renderHook(() => useNotify({} as never))

    await act(async () => {
      await result.current(Promise.resolve({}) as never)
    })

    expect(bncNotifyLoaded).toBe(true)
    expect(sendTransactionMock).toHaveBeenCalled()
  })
})
