import { ZeroAddress } from 'ethers';
import { afterEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
;
import {
  formatBalance,
  getContract,
  getProviderAndSigner,
  getProviderOrSigner,
  isAddress,
  isZero,
  parseBalance,
  shortenAddress,
} from './ethers';

const ADDRESS = '0x0000000000000000000000000000000000000001';

afterEach(() => mock.restore());

describe('Ethereum value helpers', () => {
  it('formats, parses, and validates common values', () => {
    expect(isZero('0x000')).toBe(true);
    expect(isZero('0x001')).toBe(false);
    expect(formatBalance(undefined)).toBe('0');
    expect(formatBalance(null)).toBe('0');
    expect(formatBalance(1_234_567n, 6, 2)).toBe('1.23');
    expect(formatBalance(1_000_000n, 6)).toBe('1');
    expect(parseBalance('', 6)).toBe(0n);
    expect(parseBalance('1.5', 6)).toBe(1_500_000n);
    expect(isAddress(ADDRESS)).toBe(ADDRESS);
    expect(isAddress('invalid')).toBe(false);
    expect(shortenAddress(ADDRESS)).toBe('0x0000...0001');
    expect(() => shortenAddress('invalid')).toThrow("Invalid 'address'");
  });

  it('returns zero when balance formatting fails', () => {
    spyOn(console, 'error').mockImplementation(() => undefined);
    expect(formatBalance(1n, 81)).toBe('0');
  });

  it('rejects invalid contracts and chooses providers or signers by capability', async () => {
    expect(() => getContract(ZeroAddress, [], {} as never)).toThrow("Invalid 'address'");
    expect(() => getContract('invalid', [], {} as never)).toThrow("Invalid 'address'");

    const directSigner = { signMessage: mock(), provider: { id: 'direct-provider' } };
    await expect(getProviderAndSigner(directSigner as never)).resolves.toEqual({
      signer: directSigner,
      provider: directSigner.provider,
    });

    const signer = { id: 'resolved-signer' };
    const userProvider = { getSigner: mock().mockResolvedValue(signer) };
    await expect(getProviderAndSigner(userProvider as never)).resolves.toEqual({ signer, provider: userProvider });
    expect(getProviderOrSigner(userProvider as never)).toBe(userProvider);

    const publicProvider = { id: 'public' };
    await expect(getProviderAndSigner(publicProvider as never)).resolves.toEqual({
      signer: undefined,
      provider: publicProvider,
    });
  });
});
