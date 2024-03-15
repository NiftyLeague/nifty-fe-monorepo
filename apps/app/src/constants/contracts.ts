'use client';

import { LOCAL_CHAIN_ID, GOERLI_ID, MAINNET_ID } from './networks';

export const COMICS_BURNER_CONTRACT = 'NiftyBurningComicsL2';
export const COMICS_CONTRACT = 'NiftyLaunchComics';
export const DEGEN_CONTRACT = 'NiftyDegen';
export const GAME_ACCOUNT_CONTRACT = 'BalanceManager';
export const HYDRA_DISTRIBUTOR = 'HydraDistributor';
export const NFTL_CONTRACT = 'NFTLToken';
export const NFTL_RAFFLE_CONTRACT = 'NFTLRaffle';

type ChainAddressSearch = { [chainId: number]: `0x${string}` };

export const MERKLE_DISTRIBUTOR_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x921c673a4d2f6a429551c0726316c1ad07571db5',
  [GOERLI_ID]: '0xFeB2f45A3817EF9156a6c771FfC90098d3DFe003',
  [LOCAL_CHAIN_ID]: '0x998abeb3E57409262aE5b751f60747921B33613E',
};

export const MERKLE_ROOT = 'https://raw.githubusercontent.com/NiftyLeague/merkle-distributor/master/data/result.json';

export const COMICS_MERKLE_DISTRIBUTOR_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x038FbfE31A113952C15C688Df5b025959f589ad7',
  [GOERLI_ID]: '0x5DCcEEd8E10a3EE1aF095B248ad66E8F33875045',
  [LOCAL_CHAIN_ID]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};

export const COMICS_MERKLE_ROOT =
  'https://raw.githubusercontent.com/NiftyLeague/merkle-distributor-comics56/main/data/result.json';

export const COWSWAP_VAULT_RELAYER_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

export const WETH_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [GOERLI_ID]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
};

export const IMX_NL_ITEMS: ChainAddressSearch = {
  [MAINNET_ID]: '0xc21909b7E596000C01318668293A7DFB4B37A578',
  [GOERLI_ID]: '0xbf1238C6aF46C19169c921e6058E330a97040CFD',
};

export const NFTL_TOKEN_ADDRESS: ChainAddressSearch = {
  [MAINNET_ID]: '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
  [GOERLI_ID]: '0x5803033a15F49dA0664ff8b0775a6E578422CAfD',
};
