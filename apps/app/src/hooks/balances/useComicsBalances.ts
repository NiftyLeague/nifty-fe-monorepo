import { useAccount, useReadContract } from '@/runtime/wagmi'
import type { AddressLike, BigNumberish } from 'ethers'
import type { Comic } from '@/types/marketplace'

import { getDeployedContract, MARKETPLACE_CONTRACT } from '@/constants/contracts'
import { COMICS } from '@/constants/marketplace'
import useAuth from '@/hooks/useAuth'
import useIMXContext from '@/hooks/useIMXContext'
import type { UseReadContractParams } from '@/types/web3'

/*
  ~ What it does? ~

  Gets your Comics NFTs balances from Immutable zkEVM

  ~ How can I use? ~

  const { balances, error, loading, refetch } = useComicsBalances();
*/

const COMICS_IDS = [1, 2, 3, 4, 5, 6]

type ComicsBalancesState = {
  readonly balances: Comic[]
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

type BalanceOfBatch = { args: [AddressLike[], BigNumberish[]]; result: bigint[] }

export default function useComicsBalances(): ComicsBalancesState {
  const auth = useAuth()
  const account = useAccount()
  const imx = useIMXContext()

  const marketplaceContract = () => getDeployedContract(imx.imxChainId, MARKETPLACE_CONTRACT)

  const contract = useReadContract(() => ({
    address: marketplaceContract()?.address as `0x${string}`,
    abi: marketplaceContract()?.abi as never,
    chainId: imx.imxChainId,
    functionName: 'balanceOfBatch',
    args: [Array(COMICS_IDS.length).fill(account.address) as AddressLike[], COMICS_IDS],
    query: { staleTime: 10_000, enabled: account.isConnected && auth.isLoggedIn },
  }))

  return {
    get balances() {
      const data = contract.data as UseReadContractParams<BalanceOfBatch>['result'] | undefined
      return data
        ? data.map((c: bigint, i: number) => ({ ...(COMICS[i] as Comic), balance: Number(c) }))
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
