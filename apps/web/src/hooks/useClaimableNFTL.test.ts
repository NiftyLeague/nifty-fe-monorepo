import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { readAccumulatedNFTL } from './useClaimableNFTL'

afterEach(() => {
  mock.restore()
})

describe('readAccumulatedNFTL', () => {
  it('reads accumulated NFTL with the minimal eth_call payload', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response(JSON.stringify({ result: '0x01c8' }), { status: 200 })
    )

    await expect(readAccumulatedNFTL(42)).resolves.toBe(456n)

    const [, request] = fetchMock.mock.calls[0] ?? []
    expect(request?.method).toBe('POST')
    expect(request?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(request?.body).toBe(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            to: '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
            data: `0xc607cde7${'2a'.padStart(64, '0')}`,
          },
          'latest',
        ],
      })
    )
  })

  it('rejects invalid token indexes before making a request', async () => {
    const fetchMock = spyOn(globalThis, 'fetch')

    await expect(readAccumulatedNFTL(-1)).rejects.toThrow('non-negative safe integer')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
