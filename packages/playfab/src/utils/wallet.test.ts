import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test'

let signMessage: typeof import('./wallet').signMessage
let isEthereumSignatureValid: typeof import('./wallet').isEthereumSignatureValid
let originalEthereum: unknown

beforeEach(async () => {
  const { signMessage: sm, isEthereumSignatureValid: iesv } = await import('./wallet')
  signMessage = sm
  isEthereumSignatureValid = iesv
  originalEthereum = (window as { ethereum?: unknown }).ethereum
})

afterEach(() => {
  ;(window as { ethereum?: unknown }).ethereum = originalEthereum
})

describe('signMessage', () => {
  it('throws when no ethereum provider exists', async () => {
    ;(window as { ethereum?: unknown }).ethereum = undefined
    await expect(signMessage()).rejects.toThrow('No Ethereum provider found')
  })

  it('returns address, message, nonce and signature on success', async () => {
    const request = mock((args: { method: string }) =>
      args.method === 'eth_requestAccounts'
        ? Promise.resolve(['0xABCDEF0123456789000000000000000000009999'])
        : Promise.resolve('0xsignature')
    )
    ;(window as { ethereum?: unknown }).ethereum = { request }

    const result = await signMessage()
    expect(request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' })
    expect(result).not.toBeNull()
    expect(result?.address).toBe('0xABCDEF0123456789000000000000000000009999')
    expect(result?.signature).toBe('0xsignature')
    expect(result?.nonce).toMatch(/^0x[0-9a-f]{8}$/)
    expect(result?.message).toContain('belongs to you')
    // message includes shortened lowercase address
    expect(result?.message).toContain('0xabcd')
    expect(request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: [expect.stringMatching(/^0x[0-9a-f]+$/), result?.address],
    })
  })

  it('returns null when the provider returns no accounts', async () => {
    ;(window as { ethereum?: unknown }).ethereum = {
      request: mock().mockResolvedValue(undefined),
    }
    const result = await signMessage()
    expect(result).toBeNull()
  })
})

describe('isEthereumSignatureValid', () => {
  it('returns false when any argument is missing', async () => {
    expect(await isEthereumSignatureValid('', 'sig', 'nonce')).toBe(false)
    expect(await isEthereumSignatureValid('addr', '', 'nonce')).toBe(false)
    expect(await isEthereumSignatureValid('addr', 'sig', '')).toBe(false)
  })

  it('returns true when all arguments are present', async () => {
    expect(await isEthereumSignatureValid('0xaddr', '0xsig', '0xnonce')).toBe(true)
  })
})
