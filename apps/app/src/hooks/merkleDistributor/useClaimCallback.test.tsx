import { renderHook } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { immutableZkEvmTestnet } from 'viem/chains'

const writeContract = mock(async () => '0xclaimhash' as `0x${string}`)
const waitForTransactionReceipt = mock(async () => ({ status: 'success' }))
const config = { chains: [] }
const address = '0x0000000000000000000000000000000000000001' as `0x${string}`

mock.module('@wagmi/core', () => ({ writeContract, waitForTransactionReceipt }))
mock.module('@/runtime/wagmi', () => ({ useWagmiConfig: () => config }))
mock.module('@/hooks/useIMXContext', () => ({
  default: () => ({ address, imxChainId: immutableZkEvmTestnet.id }),
}))
mock.module('@/hooks/useImxProvider', () => ({
  useConnectedToIMXCheck: () => () => true,
}))
mock.module('./useUserClaimData', () => ({
  default: () => ({
    claimData: { index: 7, amount: '1000000000000000000', proof: ['0xproof'] },
  }),
}))

const useClaimCallback = (await import('./useClaimCallback')).default

describe('useClaimCallback', () => {
  beforeEach(() => {
    writeContract.mockClear()
    waitForTransactionReceipt.mockClear()
  })

  it('submits the IMX claim through viem and waits for confirmation', async () => {
    const { result } = renderHook(() => useClaimCallback())

    await expect(result.current.claimCallback()).resolves.toBe('0xclaimhash')

    expect(writeContract).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        address: expect.stringMatching(/^0x[0-9a-fA-F]{40}$/),
        functionName: 'claim',
        args: [7n, address, 1000000000000000000n, ['0xproof']],
        chainId: immutableZkEvmTestnet.id,
      })
    )
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(config, {
      hash: '0xclaimhash',
      confirmations: 1,
    })
  })
})
