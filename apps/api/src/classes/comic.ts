import type { TargetNetwork } from '@/types'
import { COMICS_METADATA } from '@/constants/metadata/comics'
import { COMICS_CONTRACT_NAME } from '@/constants/contracts'
import { COMICS_IMAGES_CID } from '@/constants/ipfs'
import { MarketplaceCollection } from './marketplaceCollection'

/**
 * Construct and asynchronously initialize a new Comic instance.
 * @returns {Promise<Comic>} a new instance of Comic, ready to mint NFTs.
 */
export async function MakeComic(targetNetwork: TargetNetwork) {
  const m = new Comic(targetNetwork)
  await m.init()
  return m
}

/**
 * Comic is the main object responsible for storing NFT data and interacting with the smart contract.
 * Before constructing, make sure that the contract has been deployed
 *
 * Comic requires async initialization, so the Comic class (and its constructor) are not exported.
 * To make one, use the async {@link MakeComic} function.
 */
class Comic extends MarketplaceCollection {
  constructor(targetNetwork: TargetNetwork) {
    super(targetNetwork, {
      contractName: COMICS_CONTRACT_NAME,
      metadataList: COMICS_METADATA,
      assetDirectory: 'comics',
      fileExtension: '.png',
      ipfsPathPrefix: '/nifty-launch-comics',
      imagesCID: COMICS_IMAGES_CID,
    })
  }

  /**
   * Generate Comic NFT from tokenId, uploading to local IPFS
   *
   * @param {number} tokenId - the unique ID of the new token
   *
   * @returns {Promise<GenerateNFTResult>}
   */
  generateComic(tokenId: number) {
    return this.generateNFT(tokenId)
  }

  /**
   * Update token metadata
   * @param {string|number} tokenId
   *
   * @returns {Promise<NameChangeInfo>}
   */
  updateComicMetadata(tokenId: number) {
    return this.updateMetadata(tokenId)
  }
}
