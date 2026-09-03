#!/usr/bin/env tsx

// This file contains the main entry point for the command line `minty` app, and the command line option parsing code.
// See minty.js for the core functionality.

import type { NFTInfo, TargetNetwork } from './src/types'

import { Command } from 'commander'
import chalk from 'chalk'
import { colorize } from 'json-colorizer'
import { config } from 'node-config-ts'
import path from 'path'

import { COLORIZE_OPTIONS } from './src/constants/commandLine'
import { createComic, createItem, updateComic, updateItem } from '@/utils/marketplace'
import { getItemIdByTokenId_SAFE } from './src/utils/getItemIdByTokenId'
import { getWallet } from './src/utils/wallet'
import { handleNameChangeById } from './src/utils/handleNameChange'
import { MakeDegen } from './src/classes/degen'
import { mint } from './src/imx/minting/mint'
import { sleep } from './src/utils/api'
import alignOutput from './src/utils/alignOutput'
import handleMetadataUpdate from './src/utils/handleMetadataUpdate'
import { refreshImmutable, refreshOpenSea } from './src/utils/refreshMetadata'

const targetNetwork = config.eth.network as TargetNetwork

async function main() {
  const program = new Command()

  program
    .command('refresh-degen <token-id>')
    .description('"refresh" degen images and metadata on OpenSea')
    .action(refreshDegen)

  program
    .command('refresh-degens')
    .description('"refresh" all degens images and metadata on OpenSea')
    .action(refreshAllDegens)

  program
    .command('rename-degen <token-id>')
    .description('"rename" degen from contract to metadata')
    .action(updateDegenName)

  program
    .command('rename-degens')
    .description('"rename" all degens from contract to metadata')
    .action(updateDegensNames)

  program
    .command('update-degen <token-id>')
    .description('"update" nft metadata')
    .action(updateDegen)

  program.command('update-degens').description('"update" all degens metadata').action(updateDegens)

  program
    .command('get-degen <token-id>')
    .description('get info about an NFT using its token ID')
    .option(
      '-c, --creation-info',
      'include the creator address and block number the NFT was minted'
    )
    .action(getDegen)

  program.command('mint-item <token-id>').description('"mints" imx item on-chain').action(mintItem)
  program.command('mint-items').description('"mints" imx items on-chain').action(mintItems)

  program
    .command('create-item <token-id>')
    .description('"pins" imx item metadata')
    .action(createItem)
  program.command('create-items').description('"pins" imx items metadata').action(createItems)

  program
    .command('create-comic <token-id>')
    .description('"pins" imx comic metadata')
    .action(createComic)
  program.command('create-comics').description('"pins" imx comics metadata').action(createComics)

  program
    .command('update-imx')
    .description('"update" imx items & comics metadata')
    .action(updateIMX)
  program
    .command('refresh-imx')
    .description('"refresh" imx items & comics metadata')
    .action(refreshIMX)

  // The getconfig modules expect to be running from the root directory of the project,
  // so we change the current directory to the parent dir of this script file to make things work
  // even if you call minty from elsewhere
  const __dirname = path.resolve()
  const rootDir = path.join(__dirname, '..')
  process.chdir(rootDir)

  await program.parseAsync(process.argv)
}

//////////////////////////////////////////////
// -------- Command Action Functions
//////////////////////////////////////////////

// ---- DEGENS

const TOTAL_DEGENS = 10000
const START_INDEX = 1

async function refreshDegen(tokenId: number) {
  await refreshOpenSea(targetNetwork, tokenId)
  await sleep(500)
}

async function refreshAllDegens() {
  for (let i = START_INDEX; i <= TOTAL_DEGENS; i++) {
    await refreshDegen(i)
  }
}

async function updateDegenName(tokenId: number) {
  await handleNameChangeById(targetNetwork, tokenId)
}

async function updateDegensNames() {
  for (let i = START_INDEX; i <= TOTAL_DEGENS; i++) {
    await updateDegenName(i)
  }
}

async function updateDegen(tokenId: number) {
  await handleMetadataUpdate(targetNetwork, tokenId)
}

async function updateDegens() {
  for (let i = START_INDEX; i <= TOTAL_DEGENS; i++) {
    await updateDegen(i)
  }
}

async function getDegen(tokenId: number, options: { creationInfo: any }) {
  const { creationInfo: fetchCreationInfo } = options
  const minty = await MakeDegen(targetNetwork)
  const nft = (await minty.getNFT(tokenId, { fetchCreationInfo })) as NFTInfo

  const output: [string, string][] = [
    ['Token ID:', chalk.green(`${nft.tokenId}`)],
    ['Owner Address:', chalk.yellow(nft.ownerAddress || '')],
  ]
  if (nft.creationInfo) {
    output.push(['Creator Address:', chalk.yellow(nft.creationInfo.creatorAddress)])
    output.push(['Block Number:', `${nft.creationInfo?.blockNumber}`])
  }
  output.push(['Metadata Address:', chalk.blue(nft.metadataURI || '')])
  output.push(['Metadata Gateway URL:', chalk.blue(nft.metadataGatewayURL || '')])
  output.push(['Asset Address:', chalk.blue(nft.assetURI || 'N/A')])
  output.push(['Asset Gateway URL:', chalk.blue(nft.assetGatewayURL || 'N/A')])
  alignOutput(output)

  console.log('NFT Metadata:')
  console.log(colorize(JSON.stringify(nft.metadata), COLORIZE_OPTIONS))
}

//////////////////////////////////////////////
// -------- Marketplace
//////////////////////////////////////////////

// ---- ITEMS

const TOTAL_ITEMS = 7

async function createItems() {
  for (let i = 101; i <= 100 + TOTAL_ITEMS; i++) {
    await createItem(i)
  }
}

async function updateItems() {
  for (let i = 101; i <= 100 + TOTAL_ITEMS; i++) {
    await updateItem(i)
  }
}

async function mintItem(tokenId: number) {
  if (targetNetwork !== 'mainnet') {
    const itemId = await getItemIdByTokenId_SAFE(`${tokenId}`)
    console.log(`⚠️  Minting new IMX item tokenID:`, tokenId)
    const deployer = getWallet(targetNetwork)
    const { contractAddress } = config.imx[targetNetwork].collection
    await mint(targetNetwork, contractAddress, deployer.address, [`${tokenId}`], `${itemId}`)
  }
}

async function mintItems() {
  const START_INDEX = 120
  const END_INDEX = 210
  for (let i = START_INDEX; i <= END_INDEX; i++) {
    await mintItem(i)
  }
}

// ---- Comics

const TOTAL_COMICS = 6
async function createComics() {
  for (let i = 1; i <= TOTAL_COMICS; i++) {
    await createComic(i)
  }
}

async function updateComics() {
  for (let i = 1; i <= TOTAL_COMICS; i++) {
    await updateComic(i)
  }
}

// ---- IMX Collections

async function updateIMX() {
  await updateComics()
  await updateItems()
}

async function refreshIMX() {
  await refreshImmutable(targetNetwork)
}

// ---- main entry point when running as a script

// make sure we catch all errors
main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
