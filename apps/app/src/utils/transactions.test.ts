import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { mock } from 'bun:test'
const { calculateGasMarginMock, loadGasPriceMock, toastError, toastInfo, toastSuccess } = {
  calculateGasMarginMock: mock(() => 123n),
  loadGasPriceMock: mock().mockResolvedValue(25n),
  toastError: mock(),
  toastInfo: mock(),
  toastSuccess: mock(),
}

let handleError: typeof import('./bnc-notify').handleError
let handleLocalNotify: typeof import('./bnc-notify').handleLocalNotify
let sendTransaction: typeof import('./bnc-notify').sendTransaction
let submitTxWithGasEstimate: typeof import('./bnc-notify').submitTxWithGasEstimate

beforeEach(() => {
  mock.module('sonner', () => ({
    toast: { error: toastError, info: toastInfo, success: toastSuccess },
  }))
  mock.module('eth-rpc-errors', () => ({
    serializeError: (error: unknown) => ({ message: `serialized: ${String(error)}` }),
  }))
  mock.module('@/constants/index', () => ({ DEBUG: false }))
  mock.module('@/constants/networks', () => ({
    TARGET_NETWORK: { label: 'Local', gasPrice: undefined },
  }))
  mock.module('@/utils/gas', () => ({
    calculateGasMargin: calculateGasMarginMock,
    loadGasPrice: loadGasPriceMock,
  }))
  return import('./bnc-notify').then((module) => {
    handleError = module.handleError
    handleLocalNotify = module.handleLocalNotify
    sendTransaction = module.sendTransaction
    submitTxWithGasEstimate = module.submitTxWithGasEstimate
  })
})

beforeEach(() => {
  mock.clearAllMocks()
  spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('handleError', () => {
  it('uses direct and serialized error messages', () => {
    handleError({ message: 'rejected' })
    handleError({ code: -1 } as never)

    expect(toastError).toHaveBeenCalledTimes(2)
    expect(toastError.mock.calls[0]?.[0]).toBe('Transaction Error: rejected')
    expect(toastError.mock.calls[1]?.[0]).toContain('serialized:')
  })

  it.each<string>(['There was a WebSocket error', 'Configuration with scope local failed'])(
    'suppresses non-actionable transport errors: %s',
    (message) => {
      handleError({ message })
      expect(toastError).not.toHaveBeenCalled()
    }
  )
})

describe('submitTxWithGasEstimate', () => {
  it('estimates gas, applies the margin, and submits the contract result', async () => {
    const contractFn = Object.assign(mock().mockReturnValue('contract-call'), {
      estimateGas: mock().mockResolvedValue(100n),
    })
    const tx = mock().mockResolvedValue({ hash: '0xsubmitted' })
    const callback = mock()

    await expect(
      submitTxWithGasEstimate(
        tx,
        { mint: contractFn } as never,
        'mint',
        [7],
        { value: 2n },
        80n,
        callback
      )
    ).resolves.toEqual({ hash: '0xsubmitted' })
    expect(calculateGasMarginMock).toHaveBeenCalledWith(100n, 80n)
    expect(contractFn).toHaveBeenCalledWith(7, { value: 2n, gasLimit: 123n })
    expect(tx).toHaveBeenCalledWith('contract-call', callback)
  })

  it('reports estimate failures and validates the requested method', async () => {
    const contractFn = Object.assign(mock(), {
      estimateGas: mock().mockRejectedValue({ error: { message: 'estimate failed' } }),
    })

    await expect(
      submitTxWithGasEstimate(mock(), { mint: contractFn } as never, 'mint', [])
    ).resolves.toBeNull()
    expect(toastError.mock.calls[0]?.[0]).toContain('estimate failed')
    await expect(submitTxWithGasEstimate(mock(), {} as never, 'missing', [])).rejects.toThrow(
      'Function missing is not available'
    )

    const withoutEstimate = mock()
    await expect(
      submitTxWithGasEstimate(mock(), { mint: withoutEstimate } as never, 'mint', [])
    ).rejects.toThrow('Function Estimate Gas is not available on mint')
  })
})

describe('sendTransaction', () => {
  it('awaits an already-created transaction', async () => {
    const result = { hash: '0xpromise' }
    await expect(sendTransaction({} as never, Promise.resolve(result) as never)).resolves.toBe(
      result
    )
  })

  it('fills default gas fields before asking the signer to send', async () => {
    const result = { hash: '0xsent' }
    const sendTransactionMock = mock().mockResolvedValue(result)

    await expect(
      sendTransaction({ sendTransaction: sendTransactionMock } as never, { to: '0xabc' } as never)
    ).resolves.toBe(result)
    expect(loadGasPriceMock).toHaveBeenCalled()
    expect(sendTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '0xabc', gasPrice: 25n, gasLimit: '0x01d4c0' })
    )
  })
})

describe('handleLocalNotify', () => {
  it('waits for confirmation, emits notifications, and calls back with the receipt', async () => {
    const receipt = { status: 1 }
    const callback = mock()
    const result = { hash: '0xconfirmed', wait: mock().mockResolvedValue(receipt) }
    const signer = { provider: { getTransactionReceipt: mock().mockResolvedValue(receipt) } }

    await handleLocalNotify(signer as never, result as never, callback)

    expect(result.wait).toHaveBeenCalled()
    expect(toastInfo).toHaveBeenCalled()
    expect(toastSuccess).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(receipt)
  })

  it('does not request a receipt when no callback is supplied', async () => {
    const getTransactionReceipt = mock()
    await handleLocalNotify(
      { provider: { getTransactionReceipt } } as never,
      { hash: '0xconfirmed', wait: mock().mockResolvedValue(undefined) } as never
    )

    expect(getTransactionReceipt).not.toHaveBeenCalled()
  })
})
