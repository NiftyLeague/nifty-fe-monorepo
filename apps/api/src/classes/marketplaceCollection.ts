import fs from 'fs'

import type { ContractName, Metadata, TargetNetwork } from '@/types'
import { getAssetPath, type AssetKind } from '@/utils/assets'
import { S3_MARKETPLACE_BUCKET } from '@/constants/aws'
import { makeGatewayURL } from '@/utils/uriHelpers'
import { Minty } from './minty'

/**
 * Collection-specific constants that parameterize the shared marketplace
 * collection behavior (items, comics).
 */
export interface MarketplaceCollectionConfig {
  /** Contract name used to look up the deployed contract. */
  contractName: ContractName
  /** Metadata entries for every token in the collection. */
  metadataList: Metadata[]
  /** Local asset directory name (e.g. "items"). */
  assetDirectory: AssetKind
  /** Asset file extension including the dot (e.g. ".gif"). */
  fileExtension: string
  /** Path prefix used when pinning the image to IPFS. */
  ipfsPathPrefix: string
  /** CID of the collection images directory. */
  imagesCID: string
}

/**
 * Shared behavior for marketplace collections (Nifty Items, Nifty Launch
 * Comics): build metadata, generate NFTs, and refresh token metadata.
 *
 * Subclasses only supply a {@link MarketplaceCollectionConfig}; everything
 * else lives here to avoid duplicating the Item/Comic implementation.
 */
export class MarketplaceCollection extends Minty {
  private readonly config: MarketplaceCollectionConfig

  constructor(targetNetwork: TargetNetwork, config: MarketplaceCollectionConfig) {
    super(targetNetwork, config.contractName)
    this.config = config
  }

  /**
   * Helper to construct metadata JSON for collection NFTs
   *
   * @param {number} tokenId - the unique ID of the new token
   * @param {string} assetGatewayURL - IPFS Gateway URL for the NFT asset
   *
   * @typedef {object} CreateMetadataResult
   * @property {string} name - optional name to set in NFT metadata
   * @property {object} image - an ipfs:// URI for the NFT asset
   * @property {string} description - optional description to store in NFT metadata
   *
   * @returns {Promise<CreateMetadataResult>}
   */
  async makeMetadata(tokenId: number, assetGatewayURL: string) {
    const { metadataList } = this.config
    const entry = metadataList.find((m) => m.id === Number(tokenId))
    if (!entry) throw new Error(`Metadata for token ID ${tokenId} not found`)
    const metadata: Metadata = { ...entry }
    metadata.image = assetGatewayURL
    await this.uploadToS3(
      `metadata/${tokenId}.json`,
      JSON.stringify(metadata, null, 2),
      S3_MARKETPLACE_BUCKET
    )
    return metadata
  }

  /**
   * Generate collection NFT from tokenId, uploading the asset to IPFS and S3
   *
   * @param {number} tokenId - the unique ID of the new token
   *
   * @typedef {object} GenerateNFTResult
   * @property {string} tokenId - the unique ID of the new token
   * @property {object} metadata - the JSON metadata stored in IPFS and referenced by the token's metadata URI
   * @property {string} assetURI - an ipfs:// URI for the NFT asset
   * @property {string} assetGatewayURL - an HTTP gateway URL for the NFT asset
   *
   * @returns {Promise<GenerateNFTResult>}
   */
  async generateNFT(tokenId: number) {
    const { assetDirectory, fileExtension, ipfsPathPrefix } = this.config
    const assetFileName = `${tokenId}${fileExtension}`
    const filePath = getAssetPath(assetDirectory, assetFileName)
    const content = await fs.promises.readFile(filePath)
    const { assetURI, assetGatewayURL } = await this.pinImage(
      `${ipfsPathPrefix}/${assetFileName}`,
      content
    )
    await this.uploadToS3(`images/${assetFileName}`, content, S3_MARKETPLACE_BUCKET)
    const metadata = await this.makeMetadata(tokenId, assetGatewayURL)

    return {
      tokenId,
      metadata,
      assetURI,
      assetGatewayURL,
    }
  }

  /**
   * Update token metadata
   * @param {string|number} tokenId
   * @property {object} metadata
   *
   * @typedef {object} NameChangeInfo
   * @property {object} newMetadata
   * @returns {Promise<NameChangeInfo>}
   */
  async updateMetadata(tokenId: number) {
    const { assetDirectory, fileExtension, imagesCID } = this.config
    const assetGatewayURL = makeGatewayURL(
      `ipfs://${imagesCID}/${assetDirectory}/${tokenId}${fileExtension}`
    )
    const newMetadata = await this.makeMetadata(tokenId, assetGatewayURL)
    return { newMetadata }
  }
}
