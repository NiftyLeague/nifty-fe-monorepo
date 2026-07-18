import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';

const getSigner = mock();
const getAddress = mock();
const signMessageMock = mock();

class MockBrowserProvider {
  getSigner = getSigner;
}

let signMessage: typeof import('./wallet').signMessage;
let isEthereumSignatureValid: typeof import('./wallet').isEthereumSignatureValid;
let originalEthereum: unknown;

beforeEach(async () => {
  mock.module('ethers', () => ({ BrowserProvider: MockBrowserProvider }));
  const { signMessage: sm, isEthereumSignatureValid: iesv } = await import('./wallet');
  signMessage = sm;
  isEthereumSignatureValid = iesv;
  originalEthereum = (window as { ethereum?: unknown }).ethereum;
  getSigner.mockReset();
  getAddress.mockReset();
  signMessageMock.mockReset();
});

afterEach(() => {
  (window as { ethereum?: unknown }).ethereum = originalEthereum;
});

describe('signMessage', () => {
  it('throws when no ethereum provider exists', async () => {
    (window as { ethereum?: unknown }).ethereum = undefined;
    await expect(signMessage()).rejects.toThrow('No Ethereum provider found');
  });

  it('returns address, message, nonce and signature on success', async () => {
    const request = mock().mockResolvedValue(undefined);
    (window as { ethereum?: unknown }).ethereum = { request };
    getAddress.mockResolvedValue('0xABCDEF0123456789000000000000000000009999');
    signMessageMock.mockResolvedValue('0xsignature');
    getSigner.mockResolvedValue({ getAddress, signMessage: signMessageMock });

    const result = await signMessage();
    expect(request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    expect(result).not.toBeNull();
    expect(result?.address).toBe('0xABCDEF0123456789000000000000000000009999');
    expect(result?.signature).toBe('0xsignature');
    expect(result?.nonce).toMatch(/^0x[0-9a-f]{8}$/);
    expect(result?.message).toContain('belongs to you');
    // message includes shortened lowercase address
    expect(result?.message).toContain('0xabcd');
  });

  it('returns null when signer is falsy', async () => {
    (window as { ethereum?: unknown }).ethereum = { request: mock().mockResolvedValue(undefined) };
    getSigner.mockResolvedValue(undefined);
    const result = await signMessage();
    expect(result).toBeNull();
  });
});

describe('isEthereumSignatureValid', () => {
  it('returns false when any argument is missing', async () => {
    expect(await isEthereumSignatureValid('', 'sig', 'nonce')).toBe(false);
    expect(await isEthereumSignatureValid('addr', '', 'nonce')).toBe(false);
    expect(await isEthereumSignatureValid('addr', 'sig', '')).toBe(false);
  });

  it('returns true when all arguments are present', async () => {
    expect(await isEthereumSignatureValid('0xaddr', '0xsig', '0xnonce')).toBe(true);
  });
});
