import chalk from 'chalk'
import { colorize } from 'json-colorizer'
import { config } from 'node-config-ts'

import type { TargetNetwork } from '@/types'
import { COLORIZE_OPTIONS } from '@/constants/commandLine'
import alignOutput from '@/utils/alignOutput'
import { MakeItem } from '@/classes/item'
import { MakeComic } from '@/classes/comic'

const targetNetwork = config.eth.network as TargetNetwork

//////////////////////////////////////////////
// -------- ITEMS
//////////////////////////////////////////////

export async function createItem(tokenId: number) {
  const minty = await MakeItem(targetNetwork)
  console.log(`⚠️  Generating asset and metadata for item id ${tokenId}:`)
  const nft = await minty.generateItem(tokenId)
  console.log('')
  alignOutput([
    ['Token ID:', chalk.green(`${nft.tokenId}`)],
    ['Asset Address:', chalk.blue(nft.assetURI)],
    ['Asset Gateway URL:', chalk.blue(nft.assetGatewayURL)],
  ])
  console.log('NFT Metadata:')
  console.log(colorize(JSON.stringify(nft.metadata), COLORIZE_OPTIONS))
  return
}

export async function updateItem(tokenId: number) {
  const minty = await MakeItem(targetNetwork)
  console.log(`⚠️  Updating Metadata for item tokenID:`, tokenId)
  const { newMetadata } = await minty.updateItemMetadata(tokenId)
  console.log('')
  console.log('Updated NFT Metadata:')
  console.log(colorize(JSON.stringify(newMetadata), COLORIZE_OPTIONS))
  return { metadata: newMetadata }
}

//////////////////////////////////////////////
// -------- COMICS
//////////////////////////////////////////////

export async function createComic(tokenId: number) {
  const minty = await MakeComic(targetNetwork)
  console.log(`⚠️  Generating asset and metadata for comic id ${tokenId}:`)
  const nft = await minty.generateComic(tokenId)
  console.log('')
  alignOutput([
    ['Token ID:', chalk.green(`${nft.tokenId}`)],
    ['Asset Address:', chalk.blue(nft.assetURI)],
    ['Asset Gateway URL:', chalk.blue(nft.assetGatewayURL)],
  ])
  console.log('NFT Metadata:')
  console.log(colorize(JSON.stringify(nft.metadata), COLORIZE_OPTIONS))
  return
}

export async function updateComic(tokenId: number) {
  const minty = await MakeComic(targetNetwork)
  console.log(`⚠️  Updating Metadata for comic tokenID:`, tokenId)
  const { newMetadata } = await minty.updateComicMetadata(tokenId)
  console.log('')
  console.log('Updated NFT Metadata:')
  console.log(colorize(JSON.stringify(newMetadata), COLORIZE_OPTIONS))
  return { metadata: newMetadata }
}
