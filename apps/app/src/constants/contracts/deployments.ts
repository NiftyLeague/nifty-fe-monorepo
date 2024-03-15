import { mainnet, goerli } from 'viem/chains';
import ALLOWED_COLORS_STORAGE_ABI from './abis/AllowedColorsStorage.json';
import BALANCE_MANAGER_ABI from './abis/BalanceManager.json';
import HYDRA_DISTRIBUTOR_ABI from './abis/HydraDistributor.json';
import NFTL_RAFFLE_ABI from './abis/NFTLRaffle.json';
import NFTL_TOKEN_ABI from './abis/NFTLToken.json';
import NIFTY_BURNING_COMICS_L2_ABI from './abis/NiftyBurningComicsL2.json';
import NIFTY_DEGEN_ABI from './abis/NiftyDegen.json';
import NIFTY_ITEM_L2 from './abis/NiftyItemL2.json';
import NIFTY_LAUNCH_COMICS_ABI from './abis/NiftyLaunchComics.json';
import { LOCAL_CHAIN_ID } from '@/constants/networks';
import type { InterfaceAbi } from 'ethers6';

const CONTRACTS: {
  [chainId: number]: {
    [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi };
  };
} = {
  [LOCAL_CHAIN_ID]: {
    AllowedColorsStorage: {
      address: '0x4cf79525c3447AA62B2dafFA876878BEA02e85EA',
      abi: ALLOWED_COLORS_STORAGE_ABI,
    },
    BalanceManager: {
      address: '0x5F8E75aC1F58aa14FE93F796509B8472F97692EE',
      abi: BALANCE_MANAGER_ABI,
    },
    HydraDistributor: {
      address: '0x600cE05982738A0a899547Eb2C60410830e58aDA',
      abi: HYDRA_DISTRIBUTOR_ABI,
    },
    NFTLToken: {
      address: '0x5803033a15F49dA0664ff8b0775a6E578422CAfD',
      abi: NFTL_TOKEN_ABI,
    },
    NiftyBurningComicsL2: {
      address: '0xc69A84860462309cBbfA65733DDA58F631186388',
      abi: NIFTY_BURNING_COMICS_L2_ABI,
    },
    NiftyDegen: {
      address: '0x08d49340c8D3Bfe1CEad341d8597BD07B959eaab',
      abi: NIFTY_DEGEN_ABI,
    },
    NiftyItemL2: {
      address: '0xbf1238C6aF46C19169c921e6058E330a97040CFD',
      abi: NIFTY_ITEM_L2,
    },
    NiftyLaunchComics: {
      address: '0xABd074430D0B06366bbc72f5cB62d965Eae1881D',
      abi: NIFTY_LAUNCH_COMICS_ABI,
    },
  },
  [goerli.id]: {
    AllowedColorsStorage: {
      address: '0x4cf79525c3447AA62B2dafFA876878BEA02e85EA',
      abi: ALLOWED_COLORS_STORAGE_ABI,
    },
    BalanceManager: {
      address: '0x5F8E75aC1F58aa14FE93F796509B8472F97692EE',
      abi: BALANCE_MANAGER_ABI,
    },
    HydraDistributor: {
      address: '0x600cE05982738A0a899547Eb2C60410830e58aDA',
      abi: HYDRA_DISTRIBUTOR_ABI,
    },
    NFTLRaffle: {
      address: '0xE369B3D6CEE75De8C43aF0760D1FF06C95712a0c',
      abi: NFTL_RAFFLE_ABI,
    },
    NFTLToken: {
      address: '0x5803033a15F49dA0664ff8b0775a6E578422CAfD',
      abi: NFTL_TOKEN_ABI,
    },
    NiftyBurningComicsL2: {
      address: '0xc69A84860462309cBbfA65733DDA58F631186388',
      abi: NIFTY_BURNING_COMICS_L2_ABI,
    },
    NiftyDegen: {
      address: '0x08d49340c8D3Bfe1CEad341d8597BD07B959eaab',
      abi: NIFTY_DEGEN_ABI,
    },
    NiftyItemL2: {
      address: '0xbf1238C6aF46C19169c921e6058E330a97040CFD',
      abi: NIFTY_ITEM_L2,
    },
    NiftyLaunchComics: {
      address: '0xABd074430D0B06366bbc72f5cB62d965Eae1881D',
      abi: NIFTY_LAUNCH_COMICS_ABI,
    },
  },
  [mainnet.id]: {
    AllowedColorsStorage: {
      address: '0xee7b4d3C69DE4883daE82EcDb3B629d24A5590d7',
      abi: ALLOWED_COLORS_STORAGE_ABI,
    },
    BalanceManager: {
      address: '0x20362c5B7Ea1beDc84d28deEcd47d6807beBB18a',
      abi: BALANCE_MANAGER_ABI,
    },
    HydraDistributor: {
      address: '0x3410a1583fB26CDBF2a1439A2302B5Bc0464Fd39',
      abi: HYDRA_DISTRIBUTOR_ABI,
    },
    NFTLRaffle: {
      address: '0x33c84c36e79dd50F031dbDD103268cD6e895bAD9',
      abi: NFTL_RAFFLE_ABI,
    },
    NFTLToken: {
      address: '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
      abi: NFTL_TOKEN_ABI,
    },
    NiftyBurningComicsL2: {
      address: '0x9ede1004559cD9A6162FEe0F0E5ACe11DB3888D4',
      abi: NIFTY_BURNING_COMICS_L2_ABI,
    },
    NiftyDegen: {
      address: '0x986aea67C7d6A15036e18678065eb663Fc5BE883',
      abi: NIFTY_DEGEN_ABI,
    },
    NiftyItemL2: {
      address: '0xc21909b7E596000C01318668293A7DFB4B37A578',
      abi: NIFTY_ITEM_L2,
    },
    NiftyLaunchComics: {
      address: '0xBc8542e65ab801f7c9e3edd23238d37a2e3972d6',
      abi: NIFTY_LAUNCH_COMICS_ABI,
    },
  },
};

export default CONTRACTS;
