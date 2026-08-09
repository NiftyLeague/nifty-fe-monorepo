import { Contract, type BaseContract } from 'ethers'
import { config } from 'node-config-ts'
import type { TargetNetwork } from '@/types'
import { COMICS_BURNER_CONTRACT_NAME } from '@/constants/contracts'
import { getDeployedContract } from '@/contracts'
import { getProvider } from './wallet'

type BurnerContract = BaseContract & {
  itemIdByTokenId(tokenId: string | number): Promise<bigint>
  itemIndex(): Promise<bigint>
}

const network = config.eth.network as TargetNetwork

function getBurnerContract() {
  const provider = getProvider()
  const { address, abi } = getDeployedContract(network, COMICS_BURNER_CONTRACT_NAME)
  return new Contract(address, abi, provider) as unknown as BurnerContract
}

async function getItemIdByTokenId(tokenId: string): Promise<bigint> {
  const contract = getBurnerContract()
  const itemId = await contract.itemIdByTokenId(tokenId)
  return itemId
}

export async function getItemIdByTokenId_SAFE(tokenId: string): Promise<bigint> {
  const contract = getBurnerContract()
  const itemIndex = await contract.itemIndex()
  if (BigInt(tokenId) > itemIndex) throw new Error(`Item ID not found for token ID: ${tokenId}`)

  const itemId: bigint = await getItemIdByTokenId(tokenId)

  // fix if itemId is zero
  if (itemId === 0n) {
    // find the non-zero itemId in the previous tokenids and replace zero with it
    let prevTokenId = Number(tokenId)
    let prevItemId: bigint
    let attempts = 0
    const MAX_ATTEMPTS = 10000

    while (attempts < MAX_ATTEMPTS) {
      prevTokenId -= 1
      if (prevTokenId < 1) break
      prevItemId = await contract.itemIdByTokenId(prevTokenId)
      if (prevItemId !== 0n) {
        return prevItemId
      }
      attempts++
    }
    throw new Error(`Could not find a non-zero itemId for token ID: ${tokenId}`)
  }
  return itemId
}
