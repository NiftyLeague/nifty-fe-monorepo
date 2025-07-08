import NFTL_TOKEN_ABI from './abis/NFTLToken.json';
import NIFTY_DEGEN_ABI from './abis/NiftyDegen.json';

const CONTRACTS: { [contractName: string]: { address: `0x${string}`; abi: unknown[] } } = {
  NFTLToken: { address: '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638', abi: NFTL_TOKEN_ABI },
  NiftyDegen: { address: '0x986aea67C7d6A15036e18678065eb663Fc5BE883', abi: NIFTY_DEGEN_ABI },
};

export default CONTRACTS;
