import path from 'path'
import fs from 'fs'

import { Metadata, TargetNetwork } from '@/types'
import { getAssetPath } from '@/utils/assets'
import { downloadImage, generateImageURL } from '@/utils/imageGenerator'

import {
  CHARACTER_BACKGROUNDS,
  CHARACTER_TRAIT_TYPES,
  DEGEN_METADATA,
  TRAIT_VALUE_MAP,
} from '@/constants/metadata/degens'
import { DEGEN_CONTRACT_NAME } from '@/constants/contracts'
import { S3_DEGENS_BUCKET } from '@/constants/aws'
import { Minty } from './minty'

/**
 * Construct and asynchronously initialize a new Minty instance.
 * @returns {Promise<Degen>} a new instance of Minty, ready to mint NFTs.
 */
export async function MakeDegen(targetNetwork: TargetNetwork) {
  const m = new Degen(targetNetwork, DEGEN_CONTRACT_NAME)
  await m.init()
  return m
}

/**
 * Minty is the main object responsible for storing NFT data and interacting with the smart contract.
 * Before constructing, make sure that the contract has been deployed
 *
 * Minty requires async initialization, so the Minty class (and its constructor) are not exported.
 * To make one, use the async {@link MakeDegen} function.
 */
export class Degen extends Minty {
  //////////////////////////////////////////////
  // ------ DEGEN NFT Generation
  //////////////////////////////////////////////

  /**
   * Generate NFT from tokenId, uploading to local IPFS
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
    const traits = await this.getCharacterTraits(tokenId)
    const rarity = 1
    const filePath = getAssetPath('degens', `${tokenId}.${rarity < 3 ? 'png' : 'gif'}`)
    const content = await fs.promises.readFile(filePath)
    // Upload NFT asset from file
    const basename = path.basename(filePath)
    const { assetURI, assetGatewayURL } = await this.pinImage(`/degens/${basename}`, content)
    await this.uploadToS3(`${this.targetNetwork}/images/${basename}`, content, S3_DEGENS_BUCKET)
    const metadata = await this.makeNFTMetadata(tokenId, traits, rarity, assetGatewayURL)
    await this.refreshOpenSea(tokenId)

    return {
      tokenId,
      metadata,
      assetURI,
      assetGatewayURL,
    }
  }

  /**
   * Helper to generate image from character options
   *
   * @param {number} tokenId - the unique ID of the new token
   * @param {[]} traits - list of character traits from contract
   * @param {number} rarity - number of background rarity 0-3
   *
   * @returns {string} - NFT image filepath
   */

  async generateImage(tokenId: number, traits: number[], rarity: number) {
    const filePath = getAssetPath('degens', `${tokenId}.${rarity < 3 ? 'png' : 'gif'}`)
    const url = generateImageURL(traits, rarity, tokenId)
    console.log('🎮 Unity image url:', url)
    console.log('')
    await downloadImage(url, filePath)
    return filePath
  }

  /**
   * Helper to construct metadata JSON for character NFTs
   *
   * @param {number} tokenId - the unique ID of the new token
   * @param {[]} traits - list of character traits from contract
   * @param {number} rarity - number of background rarity 0-3
   * @param {string} assetGatewayURL - IPFS Gateway URL for the NFT asset
   *
   * @typedef {object} CreateMetadataResult
   * @property {string} name - optional name to set in NFT metadata
   * @property {object} image - an ipfs:// URI for the NFT asset
   * @property {string} description - optional description to store in NFT metadata
   * @property {string} external_url - an HTTP gateway URL for the NFT asset
   * @property {string} background_color - optional image background color to store in NFT metadata
   * @property {string} attributes - optional attributes to store in NFT metadata
   *
   * @returns {Promise<CreateMetadataResult>}
   */
  async makeNFTMetadata(
    tokenId: number,
    traits: number[],
    rarity: number,
    assetGatewayURL: string
  ) {
    const attributes = [{ trait_type: 'Background', value: CHARACTER_BACKGROUNDS[rarity] }]
    traits.forEach((trait, i) => {
      if (trait !== 0) {
        attributes.push({
          trait_type: CHARACTER_TRAIT_TYPES[i],
          value: TRAIT_VALUE_MAP[trait],
        })
      }
    })
    const metadata = {
      name:
        (this.contract ? await this.contract.getName(tokenId) : undefined) || `DEGEN #${tokenId}`,
      image: assetGatewayURL,
      description: DEGEN_METADATA[this.targetNetwork].description,
      external_url: `${DEGEN_METADATA[this.targetNetwork].externalURL}/${tokenId}`,
      animation_url: `${DEGEN_METADATA[this.targetNetwork].animation_url}/${tokenId}`,
      attributes,
    }
    await this.uploadToS3(
      `${this.targetNetwork}/metadata/${tokenId}.json`,
      JSON.stringify(metadata, null, 2),
      S3_DEGENS_BUCKET
    )
    return metadata
  }

  //////////////////////////////////////////////
  // ------ DEGEN NFT Updates
  //////////////////////////////////////////////

  /**
   * Update token metadata with new name
   * @param {string|number} tokenId
   * @property {object} metadata
   *
   * @typedef {object} NameChangeInfo
   * @property {object} newMetadata
   * @returns {Promise<NameChangeInfo>}
   */
  async updateDegenName(tokenId: string | number, metadata: Metadata) {
    const name = await this.getName(tokenId)
    const newMetadata = { ...metadata }
    newMetadata.name = name || `DEGEN #${tokenId}`
    await this.uploadToS3(
      `${this.targetNetwork}/metadata/${tokenId}.json`,
      JSON.stringify(newMetadata, null, 2),
      S3_DEGENS_BUCKET
    )
    await this.refreshOpenSea(tokenId)
    return { newMetadata }
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
  async updateDegenMetadata(tokenId: number, metadata: Metadata) {
    const newMetadata = {
      name: metadata.name,
      image: metadata.image,
      // image: makeGatewayURL(metadata.image),
      description: DEGEN_METADATA[this.targetNetwork].description,
      external_url: `${DEGEN_METADATA[this.targetNetwork].externalURL}/${tokenId}`,
      animation_url: `${DEGEN_METADATA[this.targetNetwork].animation_url}/${tokenId}`,
      attributes: metadata.attributes,
    }
    await this.uploadToS3(
      `${this.targetNetwork}/metadata/${tokenId}.json`,
      JSON.stringify(newMetadata, null, 2),
      S3_DEGENS_BUCKET
    )
    await this.refreshOpenSea(tokenId)
    return { newMetadata }
  }

  /**
   * Update token image and pin to metadata
   * @param {string|number} tokenId
   * @property {object} metadata
   *
   * @typedef {object} NameChangeInfo
   * @property {object} newMetadata
   * @returns {Promise<NameChangeInfo>}
   */
  async updateDegenImage(tokenId: number, metadata: Metadata) {
    // Upload new image to IPFS
    const background = metadata.attributes.find((attr) => attr.trait_type === 'Background')
    const filePath = getAssetPath(
      'degens',
      `${tokenId}.${background?.value === 'Legendary' ? 'gif' : 'png'}`
    )
    const content = await fs.promises.readFile(filePath)
    const basename = path.basename(filePath)
    const { assetURI } = await this.pinImage(`/degens/${basename}`, content)
    await this.uploadToS3(`${this.targetNetwork}/images/${basename}`, content, S3_DEGENS_BUCKET)
    // Update S3 metadata with new image URI
    const newMetadata = { ...metadata }
    newMetadata.image = assetURI
    const s3MetadataPath = `${this.targetNetwork}/metadata/${tokenId}.json`
    await this.uploadToS3(s3MetadataPath, JSON.stringify(newMetadata, null, 2), S3_DEGENS_BUCKET)
    await this.refreshOpenSea(tokenId)
    return { newMetadata }
  }

  //////////////////////////////////////////////
  // -------- Contract Calls
  //////////////////////////////////////////////

  /**
   * Get the name for a specific token.
   *
   * @param {string} tokenId - the id of an existing token
   * @returns {Promise<string>} - current name of token
   */
  async getName(tokenId: string | number): Promise<string> {
    if (Number(tokenId) === 10000) return 'Satoshi'
    if (Number(tokenId) === 9999) return 'RugMan'
    const name = this.contract ? await this.contract.getName(tokenId) : undefined
    const nameString = name?.toString()?.toLowerCase()
    if (
      nameString &&
      (nameString === 'satoshi' || nameString === 'rugman') &&
      Number(tokenId) < 9999
    ) {
      return `DEGEN #${tokenId}`
    }
    return name || `DEGEN #${tokenId}`
  }

  /**
   * Get the name for a specific token.
   *
   * @param {number} tokenId - the id of an existing token
   * @returns {Promise<[number]>} - list of character traits
   */
  async getCharacterTraits(tokenId: number): Promise<number[]> {
    return this.contract ? await this.contract.getCharacterTraits(tokenId) : []
  }
}
