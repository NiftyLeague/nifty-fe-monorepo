import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let isConnected = false
const connectEvm = mock(async () => ({ request: async () => [] }))

mock.module('wagmi', () => ({
  useAccount: () => ({ isConnected }),
  useConnectorClient: () => ({ data: undefined }),
}))
mock.module('@nl/imx-passport', () => ({
  default: { connectEvm },
}))

describe('useImxProvider', () => {
  let useImxProvider: typeof import('./useImxProvider').useImxProvider

  beforeEach(async () => {
    isConnected = false
    connectEvm.mockClear()
    useImxProvider = (await import('./useImxProvider')).useImxProvider
  })

  it('does not initialize Passport until a wallet is connected', async () => {
    const { result, rerender } = renderHook(() => useImxProvider())

    expect(result.current).toBeUndefined()
    expect(connectEvm).not.toHaveBeenCalled()

    isConnected = true
    rerender()
    await waitFor(() => expect(connectEvm).toHaveBeenCalledTimes(1))
  })
})
