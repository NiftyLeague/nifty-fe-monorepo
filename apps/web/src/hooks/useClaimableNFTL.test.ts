import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { renderHook, waitFor } from '@testing-library/react'

import useClaimableNFTL, { readAccumulatedNFTL } from './useClaimableNFTL'

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

describe('useClaimableNFTL', () => {
  it('reports loading while the RPC read is in flight, then settles with the balance', async () => {
    // 1 ETH worth of 10^18 units -> formatted balance "1"
    let resolveFetch: (response: Response) => void
    const fetchMock = spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve
        })
    )

    const { result } = renderHook(() => useClaimableNFTL(7))

    expect(result.current.loading).toBe(true)
    expect(result.current.balance).toBe(0)

    resolveFetch!(new Response(JSON.stringify({ result: '0x0de0b6b3a7640000' }), { status: 200 }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.balance).toBe(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('stops loading when the RPC read fails', async () => {
    spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('', { status: 500 }))
    const consoleError = spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useClaimableNFTL(1))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.balance).toBe(0)
    expect(consoleError).toHaveBeenCalled()
  })

  it('does not fetch and immediately finishes loading for an invalid token id', async () => {
    const fetchMock = spyOn(globalThis, 'fetch')

    const { result } = renderHook(() => useClaimableNFTL(Number.NaN))

    expect(result.current.loading).toBe(false)
    expect(result.current.balance).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
