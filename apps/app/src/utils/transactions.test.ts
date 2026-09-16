import { beforeEach, describe, expect, it, mock } from 'bun:test'

const { calculateGasMarginMock, loadGasPriceMock, toastError, toastInfo, toastSuccess } = {
  calculateGasMarginMock: mock(() => 123n),
  loadGasPriceMock: mock().mockResolvedValue(25n),
  toastError: mock(),
  toastInfo: mock(),
  toastSuccess: mock(),
}

let handleError: typeof import('./transactions').handleError
let notifyTransactionOutcome: typeof import('./transactions').notifyTransactionOutcome
let sendTransaction: typeof import('./transactions').sendTransaction
let submitTxWithGasEstimate: typeof import('./transactions').submitTxWithGasEstimate

beforeEach(() => {
  toastError.mockClear()
  toastInfo.mockClear()
  toastSuccess.mockClear()
  mock.module('solid-sonner', () => ({
    toast: { error: toastError, info: toastInfo, success: toastSuccess },
  }))
  mock.module('@/constants/index', () => ({ DEBUG: false }))
  mock.module('@/constants/networks', () => ({
    TARGET_NETWORK: {
      label: 'Local',
      gasPrice: undefined,
      blockExplorer: 'https://example.com',
    },
  }))
  mock.module('@/utils/gas', () => ({
    calculateGasMargin: calculateGasMarginMock,
    loadGasPrice: loadGasPriceMock,
  }))
})

const loadModule = async () => {
  const module = await import('./transactions')
  handleError = module.handleError
  notifyTransactionOutcome = module.notifyTransactionOutcome
  sendTransaction = module.sendTransaction
  submitTxWithGasEstimate = module.submitTxWithGasEstimate
}

const signer = () => ({ provider: { getTransactionReceipt: mock() } }) as never

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

describe('sendTransaction', () => {
  beforeEach(loadModule)

  it('awaits promise-shaped transactions untouched', async () => {
    const response = { hash: '0x1' }
    const result = await sendTransaction({} as never, Promise.resolve(response as never))
    expect(result).toBe(response)
  })

  it('fills gas defaults for request-shaped transactions', async () => {
    const sendMock = mock().mockResolvedValue({ hash: '0x2' })
    const fakeSigner = { sendTransaction: sendMock } as never

    await sendTransaction(fakeSigner, { to: '0xabc' } as never)

    expect(sendMock).toHaveBeenCalledWith({ to: '0xabc', gasPrice: 25n, gasLimit: '0x01d4c0' })
  })
})

describe('notifyTransactionOutcome', () => {
  beforeEach(loadModule)

  it('toasts sent and successful states and resolves the receipt callback', async () => {
    const receipt = { status: 1, hash: '0x3' }
    const result = { hash: '0x3', wait: mock().mockResolvedValue(receipt) }

    await notifyTransactionOutcome(signer(), result as never)

    expect(toastInfo).toHaveBeenCalledTimes(1)
    expect(toastSuccess).toHaveBeenCalledTimes(1)
    expect(toastError).not.toHaveBeenCalled()
  })

  it('toasts failure without a success toast when the receipt reverts', async () => {
    const receipt = { status: 0, hash: '0x4' }
    const result = { hash: '0x4', wait: mock().mockResolvedValue(receipt) }

    await notifyTransactionOutcome(signer(), result as never)

    expect(toastSuccess).not.toHaveBeenCalled()
    expect(toastError).toHaveBeenCalledTimes(1)
  })

  it('hands the receipt to the provided callback', async () => {
    const receipt = { status: 1, hash: '0x5' }
    const result = { hash: '0x5', wait: mock().mockResolvedValue(receipt) }
    const callback = mock()

    await notifyTransactionOutcome(signer(), result as never, callback)

    expect(callback).toHaveBeenCalledWith(receipt)
  })
})

describe('submitTxWithGasEstimate', () => {
  beforeEach(loadModule)

  it('applies the marginated gas estimate to the contract call', async () => {
    const txArg = { custom: true }
    const estimateGas = mock().mockResolvedValue(100n)
    const contractFn = mock().mockResolvedValue({ hash: '0x6' })
    const contract = { changeName: Object.assign(contractFn, { estimateGas }) } as never

    const result = await submitTxWithGasEstimate(
      () => Promise.resolve({ hash: '0x6' } as never),
      contract,
      'changeName',
      ['arg'],
      {},
      undefined
    )
    expect(estimateGas).toHaveBeenCalledWith('arg', {})
    expect(contractFn).toHaveBeenCalledWith('arg', { gasLimit: 123n })
  })

  it('returns null instead of throwing when estimation reverts', async () => {
    const estimateGas = mock().mockRejectedValue(new Error('cannot estimate'))
    const contract = { changeName: Object.assign(mock(), { estimateGas }) } as never

    const result = await submitTxWithGasEstimate(
      () => Promise.resolve({} as never),
      contract,
      'changeName',
      [],
      {}
    )

    expect(result).toBeNull()
    expect(toastError).toHaveBeenCalled()
  })
})
