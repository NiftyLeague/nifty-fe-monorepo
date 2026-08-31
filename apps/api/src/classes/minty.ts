import { CID } from 'multiformats/cid'
import { config } from 'node-config-ts'
import type { Contract, EventLog } from 'ethers'
import { create } from 'kubo-rpc-client'
import { concat } from 'uint8arrays/concat'
import { toString } from 'uint8arrays/to-string'

import { ContractName, TargetNetwork, NFTInfo } from '@/types'
import { getContractFactory } from '@/contracts'
import { refreshOpenSea } from '@/utils/refreshMetadata'
import { uploadToS3 } from '@/utils/uploadToS3'
import all from '@/utils/it-all'
import {
  stripIpfsUriPrefix,
  makeGatewayURL,
  extractCID,
  ensureIpfsUriPrefix,
} from '@/utils/uriHelpers'
import { IPFS_OPTIONS } from '@/constants/ipfs'

/**
 * Minty is the main object responsible for storing NFT data and interacting with the smart contract.
 * Before constructing, make sure that the contract has been deployed
 * Minty requires async initialization
 */
export class Minty {
  targetNetwork: TargetNetwork
  contractName: ContractName
  _initialized: boolean
  contract: Contract | null
  ipfs: ReturnType<typeof create> | null

  constructor(targetNetwork: TargetNetwork, contractName: ContractName) {
    this.targetNetwork = targetNetwork
    this.contractName = contractName
    this._initialized = false
    this.contract = null
    this.ipfs = null
  }

  async init() {
    if (this._initialized) return
    // connect to the smart contract using the address and ABI
    this.contract = await getContractFactory(this.targetNetwork, this.contractName)

    // connect to the IPFS HTTP API (e.g. NFT.Storage / Infura)
    this.ipfs = create({
      protocol: config.ipfs.protocol as 'https' | 'http',
      host: config.ipfs.host,
      port: config.ipfs.port,
      apiPath: config.ipfs.path || '/api/v0',
      headers: {
        authorization: `Basic ${config.ipfs.authorization}`,
      },
    })

    this._initialized = true
  }

  //////////////////////////////////////////////
  // -------- NFT Retreival
  //////////////////////////////////////////////

  /**
   * Check if Metadata exists for tokenId
   * @param {string} tokenId
   *
   * @typedef {object} ExistsInfo
   * @property {boolean} tokenId
   * @property {object} metadata
   * @property {string} metadataURI
   * @returns {Promise<ExistsInfo>}
   */
  async checkTokenMetadataExists(tokenId: string | number) {
    const { metadata, metadataURI } = await this.getNFTMetadata(tokenId)
    return {
      exists: Boolean(metadata && Object.keys(metadata).length),
      metadata,
      metadataURI,
    }
  }

  /**
   * Get information about an existing token.
   * By default, this includes the token id, owner address, metadata, and metadata URI.
   * To include info about when the token was created and by whom, set `opts.fetchCreationInfo` to true.
   * To include the full asset data (base64 encoded), set `opts.fetchAsset` to true.
   *
   * @param {string} tokenId
   * @param {object} opts
   * @param {?boolean} opts.fetchAsset - if true, asset data will be fetched from IPFS and returned in assetData (base64 encoded)
   * @param {?boolean} opts.fetchCreationInfo - if true, fetch historical info (creator address and block number)
   *
   *
   * @typedef {object} NFTInfo
   * @property {string} tokenId
   * @property {string} ownerAddress
   * @property {object} metadata
   * @property {string} metadataURI
   * @property {string} metadataGatewayURI
   * @property {string} assetURI
   * @property {string} assetGatewayURL
   * @property {?string} assetDataBase64
   * @property {?object} creationInfo
   * @property {string} creationInfo.creatorAddress
   * @property {number} creationInfo.blockNumber
   * @returns {Promise<NFTInfo>}
   */
  async getNFT(
    tokenId: string | number,
    opts: { fetchAsset?: boolean; fetchCreationInfo?: boolean }
  ): Promise<NFTInfo> {
    const { metadata, metadataURI } = await this.getNFTMetadata(tokenId)
    if (!metadata) return { tokenId, metadata, metadataURI }
    const ownerAddress = await this.getTokenOwner(tokenId)
    const metadataGatewayURL = makeGatewayURL(metadataURI)
    const nft = {
      tokenId,
      metadata,
      metadataURI,
      metadataGatewayURL,
      ownerAddress,
      assetURI: undefined,
      assetGatewayURL: '',
      assetDataBase64: '',
      creationInfo: undefined,
    } as NFTInfo

    const { fetchAsset, fetchCreationInfo } = opts || {}
    if (metadata.image) {
      nft.assetURI = metadata.image
      nft.assetGatewayURL = makeGatewayURL(metadata.image)
      if (fetchAsset) {
        nft.assetDataBase64 = (await this.getIPFSBase64(metadata.image)) || ''
      }
    }

    if (fetchCreationInfo) {
      nft.creationInfo = await this.getCreationInfo(tokenId)
    }
    return nft
  }

  /**
   * Fetch the NFT metadata for a given token id.
   *
   * @param tokenId - the id of an existing token
   * @returns {Promise<{metadata: object, metadataURI: string}>} - resolves to an object containing the metadata and
   * metadata URI. Fails if the token does not exist, or if fetching the data fails.
   */
  async getNFTMetadata(tokenId: string | number) {
    const metadataURI = this.contract ? await this.contract.tokenURI(tokenId) : undefined
    if (!metadataURI) return { metadata: undefined, metadataURI }
    let metadata
    try {
      if (metadataURI.startsWith('ipfs')) {
        metadata = await this.getIPFSJSON(metadataURI)
      } else {
        const response = await fetch(metadataURI)
        if (response.status < 400) metadata = await response.json()
      }
    } catch (e) {
      console.error('Error', e)
    }
    return { metadata, metadataURI }
  }

  //////////////////////////////////////////////
  // --------- Smart contract interactions
  //////////////////////////////////////////////

  /**
   * Get the address that owns the given token id.
   *
   * @param {string} tokenId - the id of an existing token
   * @returns {Promise<string>} - the ethereum address of the token owner. Fails if no token with the given id exists.
   */
  async getTokenOwner(tokenId: string | number) {
    return this.contract?.ownerOf(tokenId)
  }

  /**
   * Get historical information about the token.
   *
   * @param {string} tokenId - the id of an existing token
   *
   * @typedef {object} NFTCreationInfo
   * @property {number} blockNumber - the block height at which the token was minted
   * @property {string} creatorAddress - the ethereum address of the token's initial owner
   *
   * @returns {Promise<NFTCreationInfo>}
   */
  async getCreationInfo(tokenId: string | number) {
    if (this.contract) {
      const filter = await this.contract.filters.Transfer(null, null, BigInt(tokenId))

      const logs = (await this.contract.queryFilter(filter)) as EventLog[]
      const firstLog = logs[0]
      if (!firstLog) return
      const blockNumber = firstLog.blockNumber
      const creatorAddress = firstLog.args?.to
      return {
        blockNumber,
        creatorAddress,
      }
    }
  }

  //////////////////////////////////////////////
  // --------- IPFS helpers
  //////////////////////////////////////////////

  /**
   * Get the full contents of the IPFS object identified by the given CID or URI.
   *
   * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
   * @returns {Promise<Uint8Array>} - contents of the IPFS object
   */
  async getIPFS(cidOrURI: string) {
    const cid = stripIpfsUriPrefix(cidOrURI)
    return this.ipfs && concat(await all(this.ipfs.cat(cid)))
  }

  /**
   * Get the contents of the IPFS object identified by the given CID or URI, and return it as a string.
   *
   * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
   * @returns {Promise<string>} - the contents of the IPFS object as a string
   */
  async getIPFSString(cidOrURI: string) {
    const bytes = await this.getIPFS(cidOrURI)
    return bytes && toString(bytes)
  }

  /**
   * Get the full contents of the IPFS object identified by the given CID or URI, and return it as a base64 encoded string.
   *
   * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
   * @returns {Promise<string>} - contents of the IPFS object, encoded to base64
   */
  async getIPFSBase64(cidOrURI: string) {
    const bytes = await this.getIPFS(cidOrURI)
    return bytes && toString(bytes, 'base64')
  }

  /**
   * Get the contents of the IPFS object identified by the given CID or URI, and parse it as JSON, returning the parsed object.
   *
   * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
   * @returns {Promise<string>} - contents of the IPFS object, as a javascript object (or array, etc depending on what was stored). Fails if the content isn't valid JSON.
   */
  async getIPFSJSON(cidOrURI: string) {
    const str = await this.getIPFSString(cidOrURI)
    return str && JSON.parse(str)
  }

  //////////////////////////////////////////////
  // -------- Remote services
  //////////////////////////////////////////////

  async uploadToS3(s3Path: string, content: Buffer | Uint8Array | string, bucket: string) {
    await uploadToS3(s3Path, content, true, bucket)
  }

  async refreshOpenSea(tokenId: string | number) {
    await refreshOpenSea(this.targetNetwork, tokenId, this.contractName)
  }

  /**
   * When you add an object to IPFS with a directory prefix in its path,
   * IPFS will create a directory structure for you. This is nice, because
   * it gives us URIs with descriptive filenames in them e.g.
   * 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/cat-pic.png' instead of
   * 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM'
   */
  async pinImage(imgPath: string, content: Buffer | Uint8Array) {
    if (this.ipfs) {
      const { cid: assetCid } = await this.ipfs.add({ path: imgPath, content }, IPFS_OPTIONS)
      console.log('✅ Image pinned to Infura IPFS')
      // Pin the same CID on Pinata via their REST API
      const { pinataApiKey, pinataSecretApiKey } = config.ipfs.pinata
      const res = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
        body: JSON.stringify({
          hashToPin: assetCid.toString(),
          pinataMetadata: { name: imgPath },
        }),
      })
      if (!res.ok) {
        const body = await res.text()
        console.warn('Pinata pinByHash failed:', res.status, body)
      } else {
        console.log('✅ Image pinned to Pinata IPFS')
      }
      const assetURI = ensureIpfsUriPrefix(assetCid.toString()) + imgPath
      return {
        assetCid,
        assetURI,
        assetGatewayURL: makeGatewayURL(assetURI),
      }
    }
    return {
      assetCid: undefined,
      assetURI: '',
      assetGatewayURL: '',
    }
  }

  /**
   * Request that the remote pinning service pin the given CID or ipfs URI.
   *
   * @param {string} cidOrURI - a CID or ipfs:// URI
   * @returns {Promise<void>}
   */
  async pin(cidOrURI: string) {
    const cid = extractCID(cidOrURI)
    // Check if we've already pinned this CID to avoid a "duplicate pin" error.
    const pinned = await this.isPinned(cid)
    if (pinned) {
      console.log(`CID (${cid}) already pinned`)
      return
    }
    // Ask the remote service to pin the content.
    // Behind the scenes, this will cause the pinning service to connect to our local IPFS node
    // and fetch the data using Bitswap, IPFS's transfer protocol.
    await this.ipfs?.pin.add(cid)
  }

  /**
   * Request that the remote pinning service unpin the given CID or ipfs URI.
   *
   * @param {string|CID} cid - a CID
   * @returns {Promise<void>}
   */
  async unpin(cid: string | CID) {
    // Check if we've actually pinned this CID to be removed.
    const pinned = await this.isPinned(cid)
    if (pinned) {
      // Ask the remote service to unpin the content.
      // Removes pin object matching query allowing it to be garbage collected
      console.log(`Unpinning CID (${cid})`)
      await this.ipfs?.pin.rm(typeof cid === 'string' ? CID.parse(cid) : cid)
    }
  }

  /**
   * Check if a cid is already pinned.
   *
   * @param {string|CID} cid
   * @returns {Promise<boolean>} - true if the pinning service has already pinned the given cid
   */
  async isPinned(cid: string | CID) {
    if (this.ipfs) {
      const cidObj = typeof cid === 'string' ? CID.parse(cid) : cid
      for await (const _result of this.ipfs.pin.ls({ paths: [cidObj] })) {
        return true
      }
    }
    return false
  }
}
