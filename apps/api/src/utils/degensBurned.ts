import { config } from 'node-config-ts'

import { getContractAddress } from '@/contracts'
import { DEGEN_CONTRACT_NAME } from '@/constants/contracts'
import type { TargetNetwork } from '@/types'
import { sleep, fetchWithTimeout, withCache } from './api'

const BURN_ADDY1 = '0x000000000000000000000000000000000000dEaD'
const BURN_ADDY2 = '0x0000000000000000000000000000000000000001'

const BURN_LIST_TTL_MS = 60_000

type NftOwned = {
  contractAddress: string
  tokenId: string
  balance: string
}

export async function fetchBurnedDegens(): Promise<number[]> {
  try {
    const targetNetwork = config.eth.network as TargetNetwork
    const apiKey = config.eth.alchemy[targetNetwork]
    const degenAddress = getContractAddress(targetNetwork, DEGEN_CONTRACT_NAME)
    const baseURI = `https://eth-${targetNetwork}.g.alchemy.com/nft/v3/${apiKey}`
    const endpoint = `${baseURI}/getNFTsForOwner?contractAddresses[]=${degenAddress}&withMetadata=false&pageSize=100`

    // BURN_ADDY1 and BURN_ADDY2 are independent Alchemy queries (different
    // owner filters) with no inter-call dependency, so fetch both in parallel
    // to halve the worst-case burn-list latency.
    const inventoryURI1 = `${endpoint}&owner=${BURN_ADDY1}`
    const inventoryURI2 = `${endpoint}&owner=${BURN_ADDY2}`
    const [burned1, burned2] = await Promise.all([
      fetchAndProcess(inventoryURI1, []),
      fetchAndProcess(inventoryURI2, []),
    ])

    return [...burned1, ...burned2].sort((a, b) => a - b)
  } catch {
    return []
  }
}

// Memoized for 60s so routine traffic doesn't hit Alchemy on every call. The
// cache falls back to the last-good value on transient upstream failure.
export const getBurnedDegens = withCache(BURN_LIST_TTL_MS, fetchBurnedDegens)

interface FetchResponse {
  ownedNfts: NftOwned[]
  pageKey?: string
}

async function fetchAndProcess(inventoryURI: string, inventoryRes: number[]) {
  const options = { method: 'GET', headers: { accept: 'application/json' } }
  let pageKey: FetchResponse['pageKey'] = undefined

  do {
    const paginatedURI: string = pageKey ? `${inventoryURI}&pageKey=${pageKey}` : inventoryURI
    const response = await fetchWithTimeout(paginatedURI, options)

    const { ownedNfts, pageKey: nextPageKey } = (await response.json()) as FetchResponse
    if (ownedNfts) inventoryRes.push(...ownedNfts.map((nft: NftOwned) => parseInt(nft.tokenId, 10)))

    pageKey = nextPageKey
    await sleep(300) // Padding between Alchemy NFT API paged calls
  } while (pageKey)

  return inventoryRes
}
