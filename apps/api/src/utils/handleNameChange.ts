import { colorize } from 'json-colorizer'
import { ethers, BytesLike } from 'ethers'
import type { TargetNetwork } from '@/types'
import { COLORIZE_OPTIONS } from '@/constants/commandLine'
import { DEGEN_CONTRACT_NAME } from '@/constants/contracts'
import { MakeDegen } from '@/classes/degen'
import { getContractABI } from '@/contracts'

export async function handleNameChangeById(targetNetwork: TargetNetwork, tokenId: string | number) {
  const degen = await MakeDegen(targetNetwork)
  const { exists, metadata } = await degen.checkTokenMetadataExists(tokenId)
  if (exists) {
    console.log(`⚠️  Updating Metadata for token id: ${tokenId}`)
    const { newMetadata } = await degen.updateDegenName(tokenId, metadata)
    console.log('')
    console.log('Updated NFT Metadata:')
    console.log(colorize(JSON.stringify(newMetadata), COLORIZE_OPTIONS))
    return { metadata: newMetadata }
  }
}

async function getIdFromInput(targetNetwork: TargetNetwork, input: BytesLike) {
  const abi = getContractABI(targetNetwork, DEGEN_CONTRACT_NAME)
  const iface = new ethers.Interface(abi)
  const inputData = await iface.decodeFunctionData('changeName', input)
  const tokenId = inputData[0].toNumber()
  return tokenId
}

export async function handleNameChangeByInput(targetNetwork: TargetNetwork, input: BytesLike) {
  const tokenId = await getIdFromInput(targetNetwork, input)
  return handleNameChangeById(targetNetwork, tokenId)
}
