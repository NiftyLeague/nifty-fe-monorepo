import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { parseEther } from 'viem'
import { IMX_TESTNET_ID, MAINNET_ID, SEPOLIA_ID } from '@/constants/networks'
import {
  INTERCHAIN_SERVICE_CONTRACT,
  INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NFTL_CONTRACT,
} from '@/constants/contracts'

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
})
