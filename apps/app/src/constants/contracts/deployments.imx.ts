import type { InterfaceAbi } from 'ethers'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'

type ContractDefinition = { address: `0x${string}`; abi: InterfaceAbi }

const BALANCE_MANAGER_DISTRIBUTOR_ABI: InterfaceAbi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'index', type: 'uint256' },
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes32[]', name: 'merkleProof', type: 'bytes32[]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'isClaimed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const NFTL_ABI: InterfaceAbi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const MARKETPLACE_ABI: InterfaceAbi = [
  {
    inputs: [
      { internalType: 'address[]', name: 'accounts', type: 'address[]' },
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const contractSet = (
  balanceManagerDistributor: `0x${string}`,
  nftl: `0x${string}`,
  niftyMarketplace: `0x${string}`
): Record<string, ContractDefinition> => ({
  BalanceManagerDistributor: {
    address: balanceManagerDistributor,
    abi: BALANCE_MANAGER_DISTRIBUTOR_ABI,
  },
  NFTL: { address: nftl, abi: NFTL_ABI },
  NiftyMarketplace: { address: niftyMarketplace, abi: MARKETPLACE_ABI },
})

const IMX_CONTRACTS: {
  [chainId: number]: Record<string, ContractDefinition>
} = {
  [immutableZkEvmTestnet.id]: contractSet(
    '0x8289Fa1AE7116cE9EaAaDeaf8c70d283F691E056',
    '0xebFFB58f0286cd49b2C0687f06Edf612BC803198',
    '0x7c2118cC07E5Bbc4C368Ea29374B1f98D819E475'
  ),
  [immutableZkEvm.id]: contractSet(
    '0x643F5Ba946A4910A7EaBB7243B80744B954E74B0',
    '0xB0d7e9Ff5fb8E739c4990f7920d8047AcfAe4884',
    '0x6B66D473907A715aa573E44031355b34e77BB6dE'
  ),
}

export default IMX_CONTRACTS
