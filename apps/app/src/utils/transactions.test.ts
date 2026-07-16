import { beforeEach, describe, expect, it, vi } from 'vitest';

const { calculateGasMarginMock, loadGasPriceMock, toastError, toastInfo, toastSuccess } = vi.hoisted(() => ({
  calculateGasMarginMock: vi.fn(() => 123n),
  loadGasPriceMock: vi.fn().mockResolvedValue(25n),
  toastError: vi.fn(),
  toastInfo: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('react-toastify', () => ({ toast: { error: toastError, info: toastInfo, success: toastSuccess } }));
vi.mock('eth-rpc-errors', () => ({
  serializeError: (error: unknown) => ({ message: `serialized: ${String(error)}` }),
}));
vi.mock('@/constants/index', () => ({ DEBUG: false }));
vi.mock('@/constants/networks', () => ({ TARGET_NETWORK: { label: 'Local', gasPrice: undefined } }));
vi.mock('@/utils/gas', () => ({ calculateGasMargin: calculateGasMarginMock, loadGasPrice: loadGasPriceMock }));

import { handleError, handleLocalNotify, sendTransaction, submitTxWithGasEstimate } from './bnc-notify';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('handleError', () => {
  it('uses direct and serialized error messages', () => {
    handleError({ message: 'rejected' });
    handleError({ code: -1 } as never);

    expect(toastError).toHaveBeenCalledTimes(2);
    expect(toastError.mock.calls[0]?.[1]).toMatchObject({ data: 'rejected', theme: 'dark' });
    expect(toastError.mock.calls[1]?.[1].data).toContain('serialized:');
  });

  it.each(['There was a WebSocket error', 'Configuration with scope local failed'])(
    'suppresses non-actionable transport errors: %s',
    message => {
      handleError({ message });
      expect(toastError).not.toHaveBeenCalled();
    },
  );
});

describe('submitTxWithGasEstimate', () => {
  it('estimates gas, applies the margin, and submits the contract result', async () => {
    const contractFn = Object.assign(vi.fn().mockReturnValue('contract-call'), {
      estimateGas: vi.fn().mockResolvedValue(100n),
    });
    const tx = vi.fn().mockResolvedValue({ hash: '0xsubmitted' });
    const callback = vi.fn();

    await expect(
      submitTxWithGasEstimate(tx, { mint: contractFn } as never, 'mint', [7], { value: 2n }, 80n, callback),
    ).resolves.toEqual({ hash: '0xsubmitted' });
    expect(calculateGasMarginMock).toHaveBeenCalledWith(100n, 80n);
    expect(contractFn).toHaveBeenCalledWith(7, { value: 2n, gasLimit: 123n });
    expect(tx).toHaveBeenCalledWith('contract-call', callback);
  });

  it('reports estimate failures and validates the requested method', async () => {
    const contractFn = Object.assign(vi.fn(), {
      estimateGas: vi.fn().mockRejectedValue({ error: { message: 'estimate failed' } }),
    });

    await expect(submitTxWithGasEstimate(vi.fn(), { mint: contractFn } as never, 'mint', [])).resolves.toBeUndefined();
    expect(toastError.mock.calls[0]?.[1]).toMatchObject({ data: 'estimate failed' });
    expect(() => submitTxWithGasEstimate(vi.fn(), {} as never, 'missing', [])).toThrow(
      'Function missing is not available',
    );

    const withoutEstimate = vi.fn();
    expect(() => submitTxWithGasEstimate(vi.fn(), { mint: withoutEstimate } as never, 'mint', [])).toThrow(
      'Function Estimate Gas is not available on mint',
    );
  });
});

describe('sendTransaction', () => {
  it('awaits an already-created transaction', async () => {
    const result = { hash: '0xpromise' };
    await expect(sendTransaction({} as never, Promise.resolve(result) as never)).resolves.toBe(result);
  });

  it('fills default gas fields before asking the signer to send', async () => {
    const result = { hash: '0xsent' };
    const sendTransactionMock = vi.fn().mockResolvedValue(result);

    await expect(
      sendTransaction({ sendTransaction: sendTransactionMock } as never, { to: '0xabc' } as never),
    ).resolves.toBe(result);
    expect(loadGasPriceMock).toHaveBeenCalled();
    expect(sendTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '0xabc', gasPrice: 25n, gasLimit: '0x01d4c0' }),
    );
  });
});

describe('handleLocalNotify', () => {
  it('waits for confirmation, emits notifications, and calls back with the receipt', async () => {
    const receipt = { status: 1 };
    const callback = vi.fn();
    const result = { hash: '0xconfirmed', wait: vi.fn().mockResolvedValue(receipt) };
    const signer = { provider: { getTransactionReceipt: vi.fn().mockResolvedValue(receipt) } };

    await handleLocalNotify(signer as never, result as never, callback);

    expect(result.wait).toHaveBeenCalled();
    expect(toastInfo).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(receipt);
  });

  it('does not request a receipt when no callback is supplied', async () => {
    const getTransactionReceipt = vi.fn();
    await handleLocalNotify(
      { provider: { getTransactionReceipt } } as never,
      { hash: '0xconfirmed', wait: vi.fn().mockResolvedValue(undefined) } as never,
    );

    expect(getTransactionReceipt).not.toHaveBeenCalled();
  });
});
