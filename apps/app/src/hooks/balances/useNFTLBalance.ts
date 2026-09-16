import { useAccount, useReadContract } from '@/runtime/wagmi'
import { formatUnits } from 'viem'
import {
  getContractAddress,
  NFTL_CONTRACT,
  NFTL_IMX_CONTRACT,
  getContractABI,
} from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import useAuth from '@/hooks/useAuth'
import useIMXContext from '@/hooks/useIMXContext'

/*
  ~ What it does? ~

  Gets NFTL wallet balances for user address via user provider.

  ~ How can I use? ~

  For Ethereum balance only:
  const { balance, error, loading, refetch } = useEthereumNFTLBalance();

  For Immutable balance only:
  const { balance, error, loading, refetch } = useImmutableNFTLBalance();

  For both Ethereum and Immutable balances:
  const { balances, error, loading, refetch } = useNFTLBalance();
*/

interface NFTLBalanceState {
  readonly balance: number
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}

const toBalance = (data: unknown) =>
  data !== undefined ? Number(formatUnits(data as bigint, 18)) : 0

/** Fetch users NFTL balance on Ethereum */
function useEthereumNFTLBalance(): NFTLBalanceState {
  const auth = useAuth()
  const account = useAccount()
  const tokenAddress = getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT)

  const contract = useReadContract(() => ({
    address: tokenAddress as `0x${string}`,
    abi: getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT),
    functionName: 'balanceOf',
    args: account.address ? [account.address] : undefined,
    chainId: TARGET_NETWORK.chainId,
    query: {
      staleTime: 10_000,
      enabled: account.isConnected && auth.isLoggedIn && !!account.address,
    },
  }))

  return {
    get balance() {
      return toBalance(contract.data)
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

/** Fetch users NFTL balance on Immutable zkEVM */
function useImmutableNFTLBalance(): NFTLBalanceState {
  const auth = useAuth()
  const account = useAccount()
  const imx = useIMXContext()
  const tokenAddress = getContractAddress(imx.imxChainId, NFTL_IMX_CONTRACT)

  const contract = useReadContract(() => ({
    address: tokenAddress as `0x${string}`,
    abi: getContractABI(imx.imxChainId, NFTL_IMX_CONTRACT),
    functionName: 'balanceOf',
    args: account.address ? [account.address] : undefined,
    chainId: imx.imxChainId,
    query: {
      staleTime: 10_000,
      enabled: account.isConnected && auth.isLoggedIn && !!account.address,
    },
  }))

  return {
    get balance() {
      return toBalance(contract.data)
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

interface NFTLBalancesState {
  readonly balances: { eth: number; imx: number }
  readonly error: Error | null
  readonly loading: boolean
  refetch: () => void
}
/** Fetch users NFTL balance on both Ethereum & Immutable zkEVM */
export default function useNFTLBalance(): NFTLBalancesState {
  const eth = useEthereumNFTLBalance()
  const imx = useImmutableNFTLBalance()

  return {
    get balances() {
      return { eth: eth.balance, imx: imx.balance }
    },
    get error() {
      return eth.error ?? imx.error
    },
    get loading() {
      return eth.loading || imx.loading
    },
    refetch: () => {
      eth.refetch()
      imx.refetch()
    },
  }
}
