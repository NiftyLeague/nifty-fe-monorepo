import type { TargetNetwork } from '@/types'
import { ITEMS_METADATA } from '@/constants/metadata/items'
import { ITEMS_CONTRACT_NAME } from '@/constants/contracts'
import { ITEMS_IMAGES_CID } from '@/constants/ipfs'
import { MarketplaceCollection } from './marketplaceCollection'

/**
 * Construct and asynchronously initialize a new Item instance.
 * @returns {Promise<Item>} a new instance of Item, ready to mint NFTs.
 */
export async function MakeItem(targetNetwork: TargetNetwork) {
  const m = new Item(targetNetwork)
  await m.init()
  return m
}

/**
 * Item is the main object responsible for storing NFT data and interacting with the smart contract.
 * Before constructing, make sure that the contract has been deployed
 *
 * Item requires async initialization, so the Item class (and its constructor) are not exported.
 * To make one, use the async {@link MakeItem} function.
 */
class Item extends MarketplaceCollection {
  constructor(targetNetwork: TargetNetwork) {
    super(targetNetwork, {
      contractName: ITEMS_CONTRACT_NAME,
      metadataList: ITEMS_METADATA,
      assetDirectory: 'items',
      fileExtension: '.gif',
      ipfsPathPrefix: '/items',
      imagesCID: ITEMS_IMAGES_CID,
    })
  }

  /**
   * Generate Item NFT from tokenId, uploading to local IPFS
   *
   * @param {number} tokenId - the unique ID of the new token
   *
   * @returns {Promise<GenerateNFTResult>}
   */
  generateItem(tokenId: number) {
    return this.generateNFT(tokenId)
  }

  /**
   * Update token metadata
   * @param {string|number} tokenId
   *
   * @returns {Promise<NameChangeInfo>}
   */
  updateItemMetadata(tokenId: number) {
    return this.updateMetadata(tokenId)
  }
}
