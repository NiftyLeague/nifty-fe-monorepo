'use client'

import { useEffect, useState } from 'react'
import type { Abi, GetBlockNumberErrorType } from 'viem'
import { formatEther } from 'viem'
import CONTRACTS from '@/constants/contracts'
import { publicClient } from '@/lib/viemClient'

const NFTL_CONTRACT = CONTRACTS.NFTLToken

interface NFTLClaimableState {
  balance: number
  loading: boolean
}

export default function useClaimableNFTL(tokenId: number | string): NFTLClaimableState {
  const [balance, setTotalBalance] = useState(0)

  useEffect(() => {
    const tokenNumber = typeof tokenId === 'number' ? tokenId : Number(tokenId)
    if (!Number.isSafeInteger(tokenNumber) || tokenNumber < 0) return

    let cancelled = false

    const readContract = async () => {
      try {
        const data = await publicClient.readContract({
          address: NFTL_CONTRACT?.address as `0x${string}`,
          abi: NFTL_CONTRACT?.abi as Abi,
          functionName: 'accumulated',
          args: [BigInt(tokenNumber)],
        })
        if (!cancelled) setTotalBalance(data ? parseFloat(formatEther(data as bigint)) : 0)
      } catch (e) {
        const error = e as GetBlockNumberErrorType
        console.error(error)
      }
    }

    readContract()

    return () => {
      cancelled = true
    }
  }, [tokenId])

  return { balance, loading: false }
}
