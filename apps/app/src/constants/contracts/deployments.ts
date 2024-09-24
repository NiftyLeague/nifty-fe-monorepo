import type { InterfaceAbi } from 'ethers6';
import { mainnet, sepolia, hardhat, immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';

import MAINNET_DEPLOYMENTS from './deployments.mainnet';
import TESTNET_DEPLOYMENTS from './deployments.sepolia';
import IMX_TESTNET_DEPLOYMENTS from './deployments.imxTestnet';
import IMX_MAINNET_DEPLOYMENTS from './deployments.imxMainnet';

const CONTRACTS: {
  [chainId: number]: {
    [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi };
  };
} = {
  [hardhat.id]: {
    AllowedColorsStorage: {
      address: '0x4cf79525c3447AA62B2dafFA876878BEA02e85EA',
      abi: TESTNET_DEPLOYMENTS.contracts.AllowedColorsStorage.abi,
    },
    BalanceManager: {
      address: '0x5F8E75aC1F58aa14FE93F796509B8472F97692EE',
      abi: TESTNET_DEPLOYMENTS.contracts.BalanceManager.abi,
    },
    HydraDistributor: {
      address: '0x600cE05982738A0a899547Eb2C60410830e58aDA',
      abi: TESTNET_DEPLOYMENTS.contracts.HydraDistributor.abi,
    },
    NFTLToken: {
      address: '0x5803033a15F49dA0664ff8b0775a6E578422CAfD',
      abi: TESTNET_DEPLOYMENTS.contracts.NFTLToken.abi,
    },
    NiftyBurningComicsL2: {
      address: '0xc69A84860462309cBbfA65733DDA58F631186388',
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyBurningComicsL2.abi,
    },
    NiftyDegen: {
      address: '0x08d49340c8D3Bfe1CEad341d8597BD07B959eaab',
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyDegen.abi,
    },
    NiftyItemL2: {
      address: '0xbf1238C6aF46C19169c921e6058E330a97040CFD',
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyItemL2.abi,
    },
    NiftyLaunchComics: {
      address: '0xABd074430D0B06366bbc72f5cB62d965Eae1881D',
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyLaunchComics.abi,
    },
  },
  [sepolia.id]: {
    AllowedColorsStorage: {
      address: TESTNET_DEPLOYMENTS.contracts.AllowedColorsStorage.address,
      abi: TESTNET_DEPLOYMENTS.contracts.AllowedColorsStorage.abi,
    },
    BalanceManager: {
      address: TESTNET_DEPLOYMENTS.contracts.BalanceManager.address,
      abi: TESTNET_DEPLOYMENTS.contracts.BalanceManager.abi,
    },
    HydraDistributor: {
      address: TESTNET_DEPLOYMENTS.contracts.HydraDistributor.address,
      abi: TESTNET_DEPLOYMENTS.contracts.HydraDistributor.abi,
    },
    NFTLRaffle: {
      address: TESTNET_DEPLOYMENTS.contracts.NFTLRaffle.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NFTLRaffle.abi,
    },
    NFTLToken: {
      address: TESTNET_DEPLOYMENTS.contracts.NFTLToken.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NFTLToken.abi,
    },
    NiftyBurningComicsL2: {
      address: TESTNET_DEPLOYMENTS.contracts.NiftyBurningComicsL2.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyBurningComicsL2.abi,
    },
    NiftyDegen: {
      address: TESTNET_DEPLOYMENTS.contracts.NiftyDegen.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyDegen.abi,
    },
    NiftyItemL2: {
      address: TESTNET_DEPLOYMENTS.contracts.NiftyItemL2.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyItemL2.abi,
    },
    NiftyLaunchComics: {
      address: TESTNET_DEPLOYMENTS.contracts.NiftyLaunchComics.address,
      abi: TESTNET_DEPLOYMENTS.contracts.NiftyLaunchComics.abi,
    },
  },
  [mainnet.id]: {
    AllowedColorsStorage: {
      address: MAINNET_DEPLOYMENTS.contracts.AllowedColorsStorage.address,
      abi: MAINNET_DEPLOYMENTS.contracts.AllowedColorsStorage.abi,
    },
    BalanceManager: {
      address: MAINNET_DEPLOYMENTS.contracts.BalanceManager.address,
      abi: MAINNET_DEPLOYMENTS.contracts.BalanceManager.abi,
    },
    HydraDistributor: {
      address: MAINNET_DEPLOYMENTS.contracts.HydraDistributor.address,
      abi: MAINNET_DEPLOYMENTS.contracts.HydraDistributor.abi,
    },
    NFTLRaffle: {
      address: MAINNET_DEPLOYMENTS.contracts.NFTLRaffle.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NFTLRaffle.abi,
    },
    NFTLToken: {
      address: MAINNET_DEPLOYMENTS.contracts.NFTLToken.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NFTLToken.abi,
    },
    NiftyBurningComicsL2: {
      address: MAINNET_DEPLOYMENTS.contracts.NiftyBurningComicsL2.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NiftyBurningComicsL2.abi,
    },
    NiftyDegen: {
      address: MAINNET_DEPLOYMENTS.contracts.NiftyDegen.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NiftyDegen.abi,
    },
    NiftyItemL2: {
      address: MAINNET_DEPLOYMENTS.contracts.NiftyItemL2.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NiftyItemL2.abi,
    },
    NiftyLaunchComics: {
      address: MAINNET_DEPLOYMENTS.contracts.NiftyLaunchComics.address,
      abi: MAINNET_DEPLOYMENTS.contracts.NiftyLaunchComics.abi,
    },
  },
  [immutableZkEvmTestnet.id]: {
    // ComicsBurner: {
    //   address: IMX_TESTNET_DEPLOYMENTS.contracts.ComicsBurner.address,
    //   abi: IMX_TESTNET_DEPLOYMENTS.contracts.ComicsBurner.abi,
    // },
    NFTL: {
      address: IMX_TESTNET_DEPLOYMENTS.contracts.NFTL.address,
      abi: IMX_TESTNET_DEPLOYMENTS.contracts.NFTL.abi,
    },
    NiftyMarketplace: {
      address: IMX_TESTNET_DEPLOYMENTS.contracts.NiftyMarketplace.address,
      abi: IMX_TESTNET_DEPLOYMENTS.contracts.NiftyMarketplace.abi,
    },
  },
  [immutableZkEvm.id]: {
    // ComicsBurner: {
    //   address: IMX_MAINNET_DEPLOYMENTS.contracts.ComicsBurner.address,
    //   abi: IMX_MAINNET_DEPLOYMENTS.contracts.ComicsBurner.abi,
    // },
    NFTL: {
      address: IMX_MAINNET_DEPLOYMENTS.contracts.NFTL.address,
      abi: IMX_MAINNET_DEPLOYMENTS.contracts.NFTL.abi,
    },
    NiftyMarketplace: {
      address: IMX_MAINNET_DEPLOYMENTS.contracts.NiftyMarketplace.address,
      abi: IMX_MAINNET_DEPLOYMENTS.contracts.NiftyMarketplace.abi,
    },
  },
};

export default CONTRACTS;
