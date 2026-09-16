import { act, renderHook } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const sendTransactionMock = mock()
const notifyOutcomeMock = mock()

mock.module('@/utils/transactions', () => ({
  handleError: mock(),
  notifyTransactionOutcome: notifyOutcomeMock,
  sendTransaction: sendTransactionMock,
}))

mock.module('@/constants/index', () => ({ DEBUG: false }))

describe('useNotify', () => {
  let useNotify: typeof import('./useNotify').default

  beforeEach(async () => {
    sendTransactionMock.mockReset()
    notifyOutcomeMock.mockReset()
    useNotify = (await import('./useNotify')).default
  })

  it('does nothing without a signer', async () => {
    const { result } = renderHook(() => useNotify())

    let returned: unknown
    await act(async () => {
      returned = await result.current(Promise.resolve({}) as never)
    })

    expect(returned).toBeNull()
    expect(sendTransactionMock).not.toHaveBeenCalled()
  })

  it('sends the transaction and toasts its outcome', async () => {
    const transaction = { hash: '0xsubmitted', wait: mock().mockResolvedValue(undefined) }
    sendTransactionMock.mockResolvedValue(transaction)
    const { result } = renderHook(() => useNotify(() => ({}) as never))

    let returned: unknown
    await act(async () => {
      returned = await result.current(Promise.resolve({}) as never)
    })

    expect(sendTransactionMock).toHaveBeenCalled()
    expect(notifyOutcomeMock).toHaveBeenCalled()
    expect(returned).toBe(transaction)
  })
})
