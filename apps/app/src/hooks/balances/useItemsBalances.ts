import { useAccount, useReadContract } from '@/runtime/wagmi'
import type { AddressLike, BigNumberish } from 'ethers'
import type { Item } from '@/types/marketplace'

import { getDeployedContract, MARKETPLACE_CONTRACT } from '@/constants/contracts'
import { ITEMS } from '@/constants/marketplace'
import useAuth from '@/hooks/useAuth'
import useIMXContext from '@/hooks/useIMXContext'
import type { UseReadContractParams } from '@/types/web3'

/*
  ~ What it does? ~

  Gets your Items NFTs balances from Immutable zkEVM

  ~ How can I use? ~

  const { balances, error, loading, refetch } = useItemsBalance();
*/

const ITEM_IDS = [101, 102, 103, 104, 105, 106, 107]

type ItemsBalancesState = {
  readonly balances: Item[]
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

type BalanceOfBatch = { args: [AddressLike[], BigNumberish[]]; result: bigint[] }

export default function useItemssBalances(): ItemsBalancesState {
  const auth = useAuth()
  const account = useAccount()
  const imx = useIMXContext()

  const marketplaceContract = () => getDeployedContract(imx.imxChainId, MARKETPLACE_CONTRACT)

  const contract = useReadContract(() => ({
    address: marketplaceContract()?.address as `0x${string}`,
    abi: marketplaceContract()?.abi as never,
    chainId: imx.imxChainId,
    functionName: 'balanceOfBatch',
    args: [Array(ITEM_IDS.length).fill(account.address) as AddressLike[], ITEM_IDS],
    query: { staleTime: 10_000, enabled: account.isConnected && auth.isLoggedIn },
  }))

  return {
    get balances() {
      const data = contract.data as UseReadContractParams<BalanceOfBatch>['result'] | undefined
      return data
        ? data.map((c: bigint, i: number) => ({ ...(ITEMS[i] as Item), balance: Number(c) }))
        : []
    },
    get error() {
      return contract.error
    },
    get loading() {
      return contract.isLoading
    },
    refetch: () => void contract.refetch(),
  }
}
