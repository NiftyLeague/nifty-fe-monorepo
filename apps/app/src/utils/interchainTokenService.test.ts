import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { parseEther } from 'viem'
import { IMX_TESTNET_ID, MAINNET_ID, SEPOLIA_ID } from '@/constants/networks'
import { INTERCHAIN_TOKEN_SERVICE_ADDRESS } from '@/constants/contracts'

const readContractMock = mock()
const writeContractMock = mock()
const receiptWaitMock = mock()

mock.module('@wagmi/core', () => ({
  readContract: readContractMock,
  writeContract: writeContractMock,
  waitForTransactionReceipt: receiptWaitMock,
}))

import {
  bridgeNFTL,
  getInterchainTokenRecord,
  increaseBridgeAllowance,
} from './interchainTokenService'

beforeEach(() => {
  readContractMock.mockClear()
  writeContractMock.mockClear()
  receiptWaitMock.mockClear()
})

describe('interchain token service', () => {
  it('looks up supported token records and rejects unknown networks', () => {
    expect(getInterchainTokenRecord(MAINNET_ID)).toMatch(/^0x/)
    expect(() => getInterchainTokenRecord(999_999)).toThrow('Interchain token record not found')
  })

  it('approves only when Immutable needs more allowance', async () => {
    const approveReceipt = { status: 'success' }
    readContractMock.mockResolvedValue(0n)
    writeContractMock.mockResolvedValue('0xapprove')
    receiptWaitMock.mockResolvedValue(approveReceipt)

    await expect(
      increaseBridgeAllowance({} as never, '0xwallet', IMX_TESTNET_ID, 5n)
    ).resolves.toMatchObject({ status: 'success' })
    expect(writeContractMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        functionName: 'approve',
        args: [INTERCHAIN_TOKEN_SERVICE_ADDRESS, 5n],
      })
    )

    readContractMock.mockResolvedValue(6n)
    await expect(
      increaseBridgeAllowance({} as never, '0xwallet', IMX_TESTNET_ID, 5n)
    ).resolves.toBeNull()
    expect(writeContractMock).toHaveBeenCalledTimes(1)

    await expect(
      increaseBridgeAllowance({} as never, '0xwallet', SEPOLIA_ID, 5n)
    ).resolves.toBeNull()

    readContractMock.mockRejectedValueOnce(new Error('wallet rejected'))
    await expect(
      increaseBridgeAllowance({} as never, '0xwallet', IMX_TESTNET_ID, 5n)
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
    writeContractMock.mockResolvedValue('0xhash')
    const transferReceipt = { status: 'success' }
    receiptWaitMock.mockResolvedValue(transferReceipt)
    const amount = parseEther('2')

    await expect(bridgeNFTL({} as never, '0xwallet', SEPOLIA_ID, amount)).resolves.toMatchObject({
      status: 'success',
    })
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
    expect(writeContractMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        functionName: 'interchainTransfer',
        args: [
          expect.stringMatching(/^0x/),
          'ethereum-sepolia',
          '0xwallet',
          amount,
          '0x',
          parseEther('0.0001'),
        ],
        value: 770123n,
      })
    )
    await expect(
      bridgeNFTL({} as never, '0xwallet', IMX_TESTNET_ID, amount)
    ).resolves.toMatchObject({ status: 'success' })
  })
})
