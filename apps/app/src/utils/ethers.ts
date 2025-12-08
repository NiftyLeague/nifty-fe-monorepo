import { Contract, formatUnits, getAddress, JsonRpcSigner, parseUnits, type InterfaceAbi, ZeroAddress } from 'ethers';
import type { Provider, PublicProvider, UserProvider } from '@/types/web3';

export * from './dateTime';

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export const isZero = (hexNumberString: string): boolean => /^0x0*$/.test(hexNumberString);

export const formatBalance = (value: bigint | undefined | null, decimals = 18, maxFraction = 0): string => {
  if (value === undefined || value === null) return '0';
  try {
    const formatted = formatUnits(value, decimals);
    const split = formatted.split('.');
    if (maxFraction > 0 && split.length > 1) {
      return `${split[0]}.${split[1]?.substring(0, maxFraction)}`;
    }
    return split[0] ?? '0';
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
};

export const parseBalance = (value: string, decimals = 18): bigint => parseUnits(value || '0', decimals);

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = (value: unknown): string | false => {
  try {
    return getAddress(value as string);
  } catch {
    return false;
  }
};

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
};

// account is not optional
export const getSigner = (provider: UserProvider, account: string): JsonRpcSigner =>
  new JsonRpcSigner(provider, account);

// account is optional
export const getProviderOrSigner = (provider: UserProvider, account?: string): Provider | JsonRpcSigner =>
  account && 'getSigner' in provider ? getSigner(provider, account) : provider;

export const getContract = (address: string, ABI: InterfaceAbi, signer: JsonRpcSigner): Contract => {
  if (!isAddress(address) || address === ZeroAddress) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, signer);
};

export const getProviderAndSigner = async (
  providerOrSigner: Provider | JsonRpcSigner,
): Promise<{ provider: Provider | undefined; signer: JsonRpcSigner | undefined }> => {
  let signer: JsonRpcSigner | undefined;
  let provider: Provider | undefined;
  if (providerOrSigner && 'signMessage' in providerOrSigner) {
    signer = providerOrSigner as JsonRpcSigner;
    provider = signer.provider;
  } else if (providerOrSigner && 'getSigner' in providerOrSigner) {
    signer = await (providerOrSigner as UserProvider).getSigner();
    provider = providerOrSigner as UserProvider;
  } else {
    signer = undefined;
    provider = providerOrSigner as PublicProvider;
  }

  return { provider, signer };
};
