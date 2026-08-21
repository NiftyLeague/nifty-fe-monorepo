import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let clientData:
  | {
      account: { address: string }
      chain: { id: number; name: string; contracts?: { ensRegistry?: { address: string } } }
      transport: unknown
    }
  | undefined

mock.module('wagmi', () => ({
  useConnectorClient: () => ({ data: clientData }),
}))

const mockBrowserProvider = mock()
const mockJsonRpcSigner = mock()

mock.module('ethers', () => ({
  BrowserProvider: mockBrowserProvider,
  JsonRpcSigner: mockJsonRpcSigner,
}))

describe('useEthersSigner', () => {
  let useEthersSigner: typeof import('./useEthersSigner').default

  beforeEach(async () => {
    clientData = undefined
    mockBrowserProvider.mockClear()
    mockJsonRpcSigner.mockClear()
    useEthersSigner = (await import('./useEthersSigner')).default
  })

  it('returns undefined when no connector client is available', () => {
    const { result } = renderHook(() => useEthersSigner())
    expect(result.current).toBeUndefined()
    expect(mockBrowserProvider).not.toHaveBeenCalled()
    expect(mockJsonRpcSigner).not.toHaveBeenCalled()
  })

  it('returns undefined when connector client has no data', () => {
    clientData = undefined
    const { result } = renderHook(() => useEthersSigner())
    expect(result.current).toBeUndefined()
  })

  it('creates a signer from the viem client', () => {
    const transport = {}
    clientData = {
      account: { address: '0xABCDEF0123456789000000000000000000009999' },
      chain: {
        id: 1,
        name: 'Ethereum',
        contracts: { ensRegistry: { address: '0x00000000000AbC123000000000000000000000000' } },
      },
      transport,
    }

    mockBrowserProvider.mockReturnValue({ connect: mock() })
    mockJsonRpcSigner.mockReturnValue({ getAddress: mock() })

    const { result } = renderHook(() => useEthersSigner())

    expect(mockBrowserProvider).toHaveBeenCalledWith(transport, {
      chainId: 1,
      name: 'Ethereum',
      ensAddress: '0x00000000000AbC123000000000000000000000000',
    })
    expect(mockJsonRpcSigner).toHaveBeenCalledWith(
      expect.any(Object),
      '0xABCDEF0123456789000000000000000000009999'
    )
    expect(result.current).toBe(mockJsonRpcSigner.mock.results[0].value)
  })

  it('passes chainId to useConnectorClient', () => {
    clientData = {
      account: { address: '0xABCDEF0123456789000000000000000000009999' },
      chain: { id: 137, name: 'Polygon' },
      transport: {},
    }

    mockBrowserProvider.mockReturnValue({ connect: mock() })
    mockJsonRpcSigner.mockReturnValue({ getAddress: mock() })

    const { result } = renderHook(() => useEthersSigner({ chainId: 137 }))

    expect(result.current).toBe(mockJsonRpcSigner.mock.results[0].value)
  })

  it('handles a chain without ENS registry', () => {
    clientData = {
      account: { address: '0xABCDEF0123456789000000000000000000009999' },
      chain: {
        id: 1,
        name: 'Ethereum',
        contracts: {},
      },
      transport: {},
    }

    mockBrowserProvider.mockReturnValue({ connect: mock() })
    mockJsonRpcSigner.mockReturnValue({ getAddress: mock() })

    const { result } = renderHook(() => useEthersSigner())

    expect(mockBrowserProvider).toHaveBeenCalledWith(expect.any(Object), {
      chainId: 1,
      name: 'Ethereum',
      ensAddress: undefined,
    })
    expect(result.current).toBe(mockJsonRpcSigner.mock.results[0].value)
  })

  it('memoizes the signer when the client does not change', () => {
    const transport = {}
    clientData = {
      account: { address: '0xABCDEF0123456789000000000000000000009999' },
      chain: { id: 1, name: 'Ethereum' },
      transport,
    }

    mockBrowserProvider.mockReturnValue({ connect: mock() })
    mockJsonRpcSigner.mockReturnValue({ getAddress: mock() })

    const { result, rerender } = renderHook(() => useEthersSigner())

    const firstSigner = result.current
    rerender()
    const secondSigner = result.current

    expect(firstSigner).toBe(secondSigner)
    expect(mockBrowserProvider).toHaveBeenCalledTimes(1)
    expect(mockJsonRpcSigner).toHaveBeenCalledTimes(1)
  })
})
