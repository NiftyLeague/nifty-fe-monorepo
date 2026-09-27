import { beforeEach, describe, expect, it, mock } from 'bun:test'

const { toastError, toastInfo, toastSuccess, writeContractMock, receiptWaitMock } = {
  toastError: mock(),
  toastInfo: mock(),
  toastSuccess: mock(),
  writeContractMock: mock(),
  receiptWaitMock: mock(),
}

let handleError: typeof import('./transactions').handleError
let executeContractWrite: typeof import('./transactions').executeContractWrite

beforeEach(() => {
  toastError.mockClear()
  toastInfo.mockClear()
  toastSuccess.mockClear()
  writeContractMock.mockReset()
  receiptWaitMock.mockReset()
  mock.module('solid-sonner', () => ({
    toast: { error: toastError, info: toastInfo, success: toastSuccess },
  }))
  mock.module('@wagmi/core', () => ({
    writeContract: writeContractMock,
    waitForTransactionReceipt: receiptWaitMock,
  }))
  mock.module('@/constants/networks', () => ({
    TARGET_NETWORK: {
      label: 'Local',
      gasPrice: undefined,
      blockExplorer: 'https://example.com',
    },
  }))
})

const loadModule = async () => {
  const module = await import('./transactions')
  handleError = module.handleError
  executeContractWrite = module.executeContractWrite
}

const CONFIG = {} as never
const PARAMS = {
  address: '0xabc' as const,
  abi: [] as never,
  functionName: 'burnComics',
  args: [1n],
}

describe('handleError', () => {
  beforeEach(loadModule)

  it('toasts user rejections, nested RPC messages, and fallbacks', () => {
    handleError({ code: 'ACTION_REJECTED' } as never)
    expect(toastError).toHaveBeenCalledWith(
      expect.stringContaining('Transaction Error: Transaction rejected')
    )

    handleError({ error: { message: 'insufficient funds' } } as never)
    expect(toastError).toHaveBeenLastCalledWith(
      expect.stringContaining('Transaction Error: insufficient funds')
    )

    handleError({} as never)
    expect(toastError).toHaveBeenLastCalledWith(expect.stringContaining('Unknown error'))
  })
})

describe('executeContractWrite', () => {
  beforeEach(loadModule)

  it('toasts sent and confirmed states, resolves the callback, returns the hash', async () => {
    const receipt = { status: 'success', blockNumber: 5n }
    writeContractMock.mockResolvedValue('0xhash')
    receiptWaitMock.mockResolvedValue(receipt)
    const callback = mock()

    const hash = await executeContractWrite(CONFIG, PARAMS, callback)

    expect(hash).toBe('0xhash')
    expect(toastInfo).toHaveBeenCalledTimes(1)
    expect(toastSuccess).toHaveBeenCalledTimes(1)
    expect(toastError).not.toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(receipt)
  })

  it('toasts failure without a success toast when the receipt reverts', async () => {
    writeContractMock.mockResolvedValue('0xhash')
    receiptWaitMock.mockResolvedValue({ status: 'reverted', blockNumber: 6n })

    const hash = await executeContractWrite(CONFIG, PARAMS)

    expect(hash).toBeNull()
    expect(toastSuccess).not.toHaveBeenCalled()
    expect(toastError).toHaveBeenCalledTimes(1)
  })

  it('returns null without throwing when the write rejects', async () => {
    writeContractMock.mockRejectedValue(new Error('user rejected'))

    const hash = await executeContractWrite(CONFIG, PARAMS)

    expect(hash).toBeNull()
    expect(toastError).toHaveBeenCalledWith(expect.stringContaining('user rejected'))
  })
})
