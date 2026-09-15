'use client'

import { useAccount, useReadContract } from '@/runtime/wagmi'
import { formatEther } from 'ethers'
import type { AddressLike } from 'ethers'
import type { Abi } from 'viem'

import useAuth from '@/hooks/useAuth'
import { TARGET_NETWORK } from '@/constants/networks'
import { getDeployedContract, NFTL_CONTRACT as NFTL_CONTRACT_NAME } from '@/constants/contracts'
import type { UseReadContractParams } from '@/types/web3'

const NFTL_CONTRACT = getDeployedContract(TARGET_NETWORK.chainId, NFTL_CONTRACT_NAME)

type Allowance = { args: [AddressLike, AddressLike]; result: bigint }

type NFTLAllowanceState = {
  readonly allowance: number
  readonly loading: boolean
  refetch: () => void
}

export default function useNFTLAllowance(contractAddress: `0x${string}`): NFTLAllowanceState {
  const auth = useAuth()
  const account = useAccount()

  const contract = useReadContract(() => ({
    address: NFTL_CONTRACT?.address as `0x${string}`,
    abi: NFTL_CONTRACT?.abi as Abi,
    chainId: TARGET_NETWORK.chainId,
    functionName: 'allowance',
    args: [account.address, contractAddress],
    query: {
      staleTime: 10_000,
      enabled: auth.isLoggedIn && account.isConnected && contractAddress.length > 0,
    },
  }))

  return {
    // Convert the allowance from wei bigint to ether number
    get allowance() {
      const data = contract.data as UseReadContractParams<Allowance>['result'] | undefined
      return data ? parseFloat(formatEther(data)) : 0
    },
    get loading() {
      return contract.isLoading
    },
    refetch: () => void contract.refetch(),
  }
}
