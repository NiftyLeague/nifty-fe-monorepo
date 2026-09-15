import { renderHook, waitFor } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { createSignal } from 'solid-js'

const [isConnected, setIsConnected] = createSignal(false)
const connectEvm = mock(async () => ({ request: async () => [] }))

mock.module('@/runtime/wagmi', () => ({
  useAccount: () => ({
    get isConnected() {
      return isConnected()
    },
  }),
  useConnectorClient: () => ({ data: undefined }),
}))
mock.module('@nl/imx-passport', () => ({
  default: { connectEvm },
}))

describe('useImxProvider', () => {
  let useImxProvider: typeof import('./useImxProvider').useImxProvider

  beforeEach(async () => {
    setIsConnected(false)
    connectEvm.mockClear()
    useImxProvider = (await import('./useImxProvider')).useImxProvider
  })

  it('does not initialize Passport until a wallet is connected', async () => {
    const { result } = renderHook(() => useImxProvider())

    expect(result.current()).toBeUndefined()
    expect(connectEvm).not.toHaveBeenCalled()

    setIsConnected(true)
    await waitFor(() => expect(connectEvm).toHaveBeenCalledTimes(1))
  })
})
