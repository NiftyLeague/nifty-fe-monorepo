import MAINNET_DEPLOYMENTS from '@nl/contracts/deployments/mainnet'
import TESTNET_DEPLOYMENTS from '@nl/contracts/deployments/sepolia'

export const CONTRACT_METHODS = {
  RENAME: '0xc39cbef1',
}

export const CHAIN_ID = {
  mainnet: 1,
  sepolia: 11155111,
}

export const NFTL_ADDRESS = {
  mainnet: MAINNET_DEPLOYMENTS.contracts.NFTLToken.address,
  sepolia: TESTNET_DEPLOYMENTS.contracts.NFTLToken.address,
}
export const NFTL_CONTRACT_NAME = 'NFTLToken'
export const DEGEN_CONTRACT_NAME = 'NiftyDegen'
export const COMICS_CONTRACT_NAME = 'NiftyLaunchComics'
export const ITEMS_CONTRACT_NAME = 'NiftyItemL2'
export const COMICS_BURNER_CONTRACT_NAME = 'NiftyBurningComicsL2'
