'use client'

import { useEffect, useState } from 'react'

const NFTL_CONTRACT_ADDRESS = '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638'
const ACCUMULATED_SELECTOR = '0xc607cde7'
const NFTL_DECIMALS = 10n ** 18n

type RpcResponse = {
  result?: string
  error?: { message?: string }
}

const infuraProjectId =
  process.env.NEXT_PUBLIC_INFURA_ID ?? process.env.NEXT_PUBLIC_INFURA_PROJECT_ID

const RPC_URLS = [
  ...(infuraProjectId ? [`https://mainnet.infura.io/v3/${infuraProjectId}`] : []),
  'https://ethereum-rpc.publicnode.com',
]

const encodeUint256 = (value: number) => value.toString(16).padStart(64, '0')

const formatNFTL = (value: bigint) => {
  const whole = value / NFTL_DECIMALS
  const fractional = (value % NFTL_DECIMALS).toString().padStart(18, '0').replace(/0+$/, '')
  return fractional ? `${whole}.${fractional}` : whole.toString()
}

export async function readAccumulatedNFTL(
  tokenIndex: number,
  signal?: AbortSignal
): Promise<bigint> {
  if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
    throw new RangeError('NFTL token index must be a non-negative safe integer')

  const data = `${ACCUMULATED_SELECTOR}${encodeUint256(tokenIndex)}`
  let lastError: unknown

  for (const url of RPC_URLS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{ to: NFTL_CONTRACT_ADDRESS, data }, 'latest'],
        }),
        signal,
      })

      if (!response.ok) throw new Error(`NFTL RPC request failed (${response.status})`)

      const payload = (await response.json()) as RpcResponse
      if (payload.error) throw new Error(payload.error.message ?? 'NFTL RPC request failed')
      if (typeof payload.result !== 'string') throw new Error('NFTL RPC returned no balance')

      return BigInt(payload.result)
    } catch (error) {
      if (signal?.aborted) throw error
      lastError = error
    }
  }

  throw lastError ?? new Error('No NFTL RPC endpoint is configured')
}

interface NFTLClaimableState {
  balance: number
  loading: boolean
}

export default function useClaimableNFTL(tokenId: number | string): NFTLClaimableState {
  const tokenNumber = typeof tokenId === 'number' ? tokenId : Number(tokenId)
  const invalidToken = !Number.isSafeInteger(tokenNumber) || tokenNumber < 0

  const [balance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(!invalidToken)

  useEffect(() => {
    if (invalidToken) return

    let cancelled = false
    const controller = new AbortController()

    const readContract = async () => {
      try {
        const data = await readAccumulatedNFTL(tokenNumber, controller.signal)
        if (!cancelled) setTotalBalance(Number(formatNFTL(data)))
      } catch (error) {
        if (!cancelled) console.error(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    readContract()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [invalidToken, tokenNumber])

  return { balance, loading }
}
