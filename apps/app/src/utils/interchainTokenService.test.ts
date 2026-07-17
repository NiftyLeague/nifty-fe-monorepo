import { parseEther } from 'ethers';
import { afterEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
import { IMX_TESTNET_ID, MAINNET_ID, SEPOLIA_ID } from '@/constants/networks';
import { INTERCHAIN_SERVICE_CONTRACT, NFTL_CONTRACT } from '@/constants/contracts';
import { bridgeNFTL, getInterchainTokenRecord, increaseBridgeAllowance } from './interchainTokenService';

const sdk = { estimateGasFee: mock().mockResolvedValue(123n) };

mock.module('@axelar-network/axelarjs-sdk', () => ({
  AxelarQueryAPI: class {
    estimateGasFee = sdk.estimateGasFee;
  },
  Environment: { MAINNET: 'mainnet', TESTNET: 'testnet' },
  EvmChain: { ETHEREUM: 'ethereum', IMMUTABLE: 'immutable', SEPOLIA: 'sepolia' },
  GasToken: { ETH: 'eth', SEPOLIA: 'sepolia' },
}));

afterEach(() => {
  mock.restore();
  sdk.estimateGasFee.mockClear();
});

describe('interchain token service', () => {
  it('looks up supported token records and rejects unknown networks', async () => {
    await expect(getInterchainTokenRecord(MAINNET_ID)).resolves.toMatch(/^0x/);
    await expect(getInterchainTokenRecord(999_999)).rejects.toThrow('Interchain token record not found');
  });

  it('approves only when Immutable needs more allowance', async () => {
    const wait = mock().mockResolvedValue('approval-receipt');
    const approve = mock().mockResolvedValue({ wait });
    const nftl = { allowance: mock().mockResolvedValue(0n), approve };
    const contracts = { [NFTL_CONTRACT]: nftl };

    await expect(increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)).resolves.toBe(
      'approval-receipt',
    );
    expect(approve).toHaveBeenCalled();

    nftl.allowance.mockResolvedValueOnce(6n);
    await expect(increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)).resolves.toBeNull();
    await expect(increaseBridgeAllowance(contracts as never, '0xwallet', SEPOLIA_ID, 5n)).resolves.toBeNull();

    nftl.allowance.mockRejectedValueOnce(new Error('wallet rejected'));
    await expect(increaseBridgeAllowance(contracts as never, '0xwallet', IMX_TESTNET_ID, 5n)).resolves.toBeNull();
  });

  it('estimates gas and submits an interchain transfer', async () => {
    const wait = mock().mockResolvedValue('transfer-receipt');
    const interchainTransfer = mock().mockResolvedValue({ hash: '0xhash', wait });
    const contracts = { [INTERCHAIN_SERVICE_CONTRACT]: { interchainTransfer } };
    const amount = parseEther('2');

    await expect(bridgeNFTL(contracts as never, '0xwallet', SEPOLIA_ID, amount)).resolves.toBe('transfer-receipt');
    expect(sdk.estimateGasFee).toHaveBeenCalledWith('sepolia', 'immutable', 700_000, 1.1, 'sepolia');
    expect(interchainTransfer).toHaveBeenCalledWith(
      expect.stringMatching(/^0x/),
      'sepolia',
      '0xwallet',
      amount,
      '0x',
      parseEther('0.0001'),
      { value: 123n },
    );
    await expect(bridgeNFTL(contracts as never, '0xwallet', IMX_TESTNET_ID, amount)).resolves.toBe('transfer-receipt');

    const unavailable = { [INTERCHAIN_SERVICE_CONTRACT]: { interchainTransfer: undefined } };
    await expect(bridgeNFTL(unavailable as never, '0xwallet', MAINNET_ID, amount)).resolves.toBeNull();
  });
});
