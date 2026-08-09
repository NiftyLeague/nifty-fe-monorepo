import { config } from 'node-config-ts'
import fetch from 'node-fetch'

import { CHAIN_ID, NFTL_ADDRESS, NFTL_CONTRACT_NAME } from '@/constants/contracts'
import { getContractFactory } from '@/contracts'
import type { TargetNetwork } from '@/types'
import { getBurnedDegens } from './degensBurned'
import { withCache } from './api'

const SUPPLY_TTL_MS = 60_000

type NFTLContract = {
  totalSupply(): Promise<{ toString(): string }>
  accumulatedMultiCheck(tokenIds: number[]): Promise<{ toString(): string }>
}

async function fetchTotalSupply(targetNetwork: TargetNetwork): Promise<string | null> {
  const nftlContract = await getContractFactory<NFTLContract>(targetNetwork, NFTL_CONTRACT_NAME)
  if (nftlContract) {
    const totalSupply = await nftlContract.totalSupply()
    return totalSupply.toString()
  }
  return null
}

export async function resolveCirculatingSupplyImpl(): Promise<string | null> {
  try {
    const targetNetwork = config.eth.network as TargetNetwork
    const secret = config.eth.etherscan
    const chainId = CHAIN_ID[targetNetwork]
    const contractaddress = NFTL_ADDRESS[targetNetwork]

    // Etherscan API V2 unified endpoint
    if (secret) {
      const supplyURI = `https://api.etherscan.io/v2/api?module=stats&action=tokensupply&contractaddress=${contractaddress}&chainId=${chainId}&apikey=${secret}`
      try {
        const supplyRes = await fetch(supplyURI, {})
        if (supplyRes.status < 400) {
          const response = (await supplyRes.json()) as {
            result?: string
            status?: string
            message?: string
          }
          if (response.result && /^\d+$/.test(response.result)) {
            return response.result
          }
          console.warn(
            'Etherscan v2 returned unexpected result, falling back to contract totalSupply:',
            response
          )
        } else {
          const text = await supplyRes.text()
          console.warn(
            'Etherscan v2 returned non-OK status, falling back to contract:',
            supplyRes.status,
            text
          )
        }
      } catch (e) {
        console.warn(
          'Etherscan v2 request failed, falling back to contract totalSupply:',
          (e as Error).message
        )
      }
    } else {
      console.warn('No Etherscan API key configured; skipping Etherscan request.')
    }
    // Fallback: get totalSupply directly from the contract
    return await fetchTotalSupply(targetNetwork)
  } catch {
    // One retry: transient provider failures are common, so give the contract
    // call a second chance before giving up on this request.
    try {
      return await fetchTotalSupply(config.eth.network as TargetNetwork)
    } catch {
      return null
    }
  }
}

export async function resolveUnclaimedSupplyImpl(): Promise<string | null> {
  try {
    const targetNetwork = config.eth.network as TargetNetwork
    const nftlContract = await getContractFactory<NFTLContract>(targetNetwork, NFTL_CONTRACT_NAME)
    if (nftlContract) {
      const burnedDegens = await getBurnedDegens()
      const burnedSet = new Set(burnedDegens ?? [])
      const activeDegens = Array.from({ length: 10000 }, (_, i) => i + 1).filter(
        (num) => !burnedSet.has(num)
      )
      const unclaimed = await nftlContract.accumulatedMultiCheck(activeDegens)
      return unclaimed.toString()
    }
    return null
  } catch {
    return null
  }
}

export async function resolveTotalSupplyImpl(): Promise<string | null> {
  try {
    const circulatingSupply = await resolveCirculatingSupplyImpl()
    const unclaimedSupply = await resolveUnclaimedSupplyImpl()
    if (!circulatingSupply || !unclaimedSupply) return null
    return (BigInt(circulatingSupply) + BigInt(unclaimedSupply)).toString()
  } catch {
    return null
  }
}

export const calculateRemainingEmissions = (): string => {
  // Emissions period ended 2024-09-14; no remaining emissions.
  return '0'
}

export async function resolveMaxSupplyImpl(): Promise<string | null> {
  try {
    const totalSupply = await resolveTotalSupplyImpl()
    if (!totalSupply) return null
    const remainingEmissions = calculateRemainingEmissions()
    return (BigInt(totalSupply) + BigInt(remainingEmissions)).toString()
  } catch {
    return null
  }
}

// Memoized exports (60s TTL). Routine traffic shouldn't hit Etherscan/Alchemy
// or the NFTL contract on every request — that's rate-limit prone and risks the
// function's 30s ceiling. The cache returns the last-good value on transient
// upstream failure.
export const resolveCirculatingSupply = withCache(SUPPLY_TTL_MS, resolveCirculatingSupplyImpl)
export const resolveUnclaimedSupply = withCache(SUPPLY_TTL_MS, resolveUnclaimedSupplyImpl)
export const resolveTotalSupply = withCache(SUPPLY_TTL_MS, resolveTotalSupplyImpl)
export const resolveMaxSupply = withCache(SUPPLY_TTL_MS, resolveMaxSupplyImpl)
