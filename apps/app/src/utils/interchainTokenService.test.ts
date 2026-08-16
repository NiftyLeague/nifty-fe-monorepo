import { parseEther } from 'ethers'
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { IMX_TESTNET_ID, MAINNET_ID, SEPOLIA_ID } from '@/constants/networks'
import { INTERCHAIN_SERVICE_CONTRACT, NFTL_CONTRACT } from '@/constants/contracts'

let bridgeNFTL: typeof import('./interchainTokenService').bridgeNFTL
let getInterchainTokenRecord: typeof import('./interchainTokenService').getInterchainTokenRecord
let increaseBridgeAllowance: typeof import('./interchainTokenService').increaseBridgeAllowance

beforeEach(async () => {
  const interchain = await import('./interchainTokenService')
  bridgeNFTL = interchain.bridgeNFTL
  getInterchainTokenRecord = interchain.getInterchainTokenRecord
  increaseBridgeAllowance = interchain.increaseBridgeAllowance
})

afterEach(() => {
  mock.restore()
})

describe('interchain token service', () => {
  it('looks up supported token records and rejects unknown networks', async () => {
    await expect(getInterchainTokenRecord(MAINNET_ID)).resolves.toMatch(/^0x/)
    await expect(getInterchainTokenRecord(999_999)).rejects.toThrow(
      'Interchain token record not found'
    )
  })

  it('approves only when Immutable needs more allowance', async () => {
    const wait = mock().mockResolvedValue('approval-receipt')
    const approve = mock().mockResolvedValue({ wait })
    const nftl = { allowance: mock().mockResolvedValue(0n), approve }
    const contracts = { [NFTL_CONTRACT]: nftl }

    await expect(
      increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)
    ).resolves.toBe('approval-receipt')
    expect(approve).toHaveBeenCalled()

    nftl.allowance.mockResolvedValueOnce(6n)
    await expect(
      increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)
    ).resolves.toBeNull()
    await expect(
      increaseBridgeAllowance(contracts as never, '0xwallet', SEPOLIA_ID, 5n)
    ).resolves.toBeNull()

    nftl.allowance.mockRejectedValueOnce(new Error('wallet rejected'))
    await expect(
      increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)
    ).resolves.toBeNull()
  })

  it('estimates gas and submits an interchain transfer', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            result: {
              source_base_fee_string: '0.000000000000000123',
              source_token: { decimals: 18, gas_price: '0.000000000000000001' },
            },
          }),
          { status: 200 }
        )
    )
    const wait = mock().mockResolvedValue('transfer-receipt')
    const interchainTransfer = mock().mockResolvedValue({ hash: '0xhash', wait })
    const contracts = { [INTERCHAIN_SERVICE_CONTRACT]: { interchainTransfer } }
    const amount = parseEther('2')

    await expect(bridgeNFTL(contracts as never, '0xwallet', SEPOLIA_ID, amount)).resolves.toBe(
      'transfer-receipt'
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://testnet.api.gmp.axelarscan.io',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          method: 'getFees',
          destinationChain: 'immutable',
          sourceChain: 'ethereum-sepolia',
          sourceTokenSymbol: 'ETH',
        }),
      })
    )
    expect(interchainTransfer).toHaveBeenCalledWith(
      expect.stringMatching(/^0x/),
      'ethereum-sepolia',
      '0xwallet',
      amount,
      '0x',
      parseEther('0.0001'),
      { value: 770123n }
    )
    await expect(bridgeNFTL(contracts as never, '0xwallet', IMX_TESTNET_ID, amount)).resolves.toBe(
      'transfer-receipt'
    )

    const unavailable = { [INTERCHAIN_SERVICE_CONTRACT]: { interchainTransfer: undefined } }
    await expect(
      bridgeNFTL(unavailable as never, '0xwallet', MAINNET_ID, amount)
    ).resolves.toBeNull()
  })
})
