type AbiItem = {
  inputs?: readonly Record<string, unknown>[]
  name?: string
  outputs?: readonly Record<string, unknown>[]
  stateMutability?: string
  type: string
}

type ContractDefinition = {
  address: `0x${string}`
  abi: readonly AbiItem[]
}

const ALLOWED_COLORS_STORAGE_ABI: readonly AbiItem[] = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tribe', type: 'uint256' },
      { internalType: 'uint256', name: 'color', type: 'uint256' },
    ],
    name: 'isAllowedColor',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const BALANCE_MANAGER_ABI: readonly AbiItem[] = [
  {
    inputs: [],
    name: 'admin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'changeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'implementation',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newImplementation', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftl', type: 'address' },
      { internalType: 'address', name: '_maintainer', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maintainer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nftl',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    name: 'signatures',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_maintainer', type: 'address' }],
    name: 'updateMaintainer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_nonce', type: 'uint256' },
      { internalType: 'uint256', name: '_expireAt', type: 'uint256' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_beneficiary', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'withdrawByDAO',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const NFTL_TOKEN_ABI: readonly AbiItem[] = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenIndex', type: 'uint256' }],
    name: 'accumulated',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'tokenIndices', type: 'uint256[]' }],
    name: 'accumulatedMultiCheck',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'tokenIndices', type: 'uint256[]' }],
    name: 'claim',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const BURNING_COMICS_ABI: readonly AbiItem[] = [
  {
    inputs: [{ internalType: 'uint256[]', name: '_values', type: 'uint256[]' }],
    name: 'burnComics',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const DEGEN_ABI: readonly AbiItem[] = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'newName', type: 'string' },
    ],
    name: 'changeName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getCharacterTraits',
    outputs: [
      {
        components: [
          { internalType: 'uint16', name: 'tribe', type: 'uint16' },
          { internalType: 'uint16', name: 'skinColor', type: 'uint16' },
          { internalType: 'uint16', name: 'furColor', type: 'uint16' },
          { internalType: 'uint16', name: 'eyeColor', type: 'uint16' },
          { internalType: 'uint16', name: 'pupilColor', type: 'uint16' },
          { internalType: 'uint16', name: 'hair', type: 'uint16' },
          { internalType: 'uint16', name: 'mouth', type: 'uint16' },
          { internalType: 'uint16', name: 'beard', type: 'uint16' },
          { internalType: 'uint16', name: 'top', type: 'uint16' },
          { internalType: 'uint16', name: 'outerwear', type: 'uint16' },
          { internalType: 'uint16', name: 'print', type: 'uint16' },
          { internalType: 'uint16', name: 'bottom', type: 'uint16' },
          { internalType: 'uint16', name: 'footwear', type: 'uint16' },
          { internalType: 'uint16', name: 'belt', type: 'uint16' },
          { internalType: 'uint16', name: 'hat', type: 'uint16' },
          { internalType: 'uint16', name: 'eyewear', type: 'uint16' },
          { internalType: 'uint16', name: 'piercing', type: 'uint16' },
          { internalType: 'uint16', name: 'wrist', type: 'uint16' },
          { internalType: 'uint16', name: 'hands', type: 'uint16' },
          { internalType: 'uint16', name: 'neckwear', type: 'uint16' },
          { internalType: 'uint16', name: 'leftItem', type: 'uint16' },
          { internalType: 'uint16', name: 'rightItem', type: 'uint16' },
        ],
        internalType: 'struct NiftyLeagueCharacter.CharacterTraits',
        name: '_characterTraits',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNFTPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRemovedTraits',
    outputs: [{ internalType: 'uint16[]', name: '', type: 'uint16[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[5]', name: 'character', type: 'uint256[5]' },
      { internalType: 'uint256[3]', name: 'head', type: 'uint256[3]' },
      { internalType: 'uint256[6]', name: 'clothing', type: 'uint256[6]' },
      { internalType: 'uint256[6]', name: 'accessories', type: 'uint256[6]' },
      { internalType: 'uint256[2]', name: 'items', type: 'uint256[2]' },
    ],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

const contractSet = (
  allowedColorsStorage: `0x${string}`,
  balanceManager: `0x${string}`,
  nftlToken: `0x${string}`,
  burningComics: `0x${string}`,
  degen: `0x${string}`
): Record<string, ContractDefinition> => ({
  AllowedColorsStorage: { address: allowedColorsStorage, abi: ALLOWED_COLORS_STORAGE_ABI },
  BalanceManager: { address: balanceManager, abi: BALANCE_MANAGER_ABI },
  NFTLToken: { address: nftlToken, abi: NFTL_TOKEN_ABI },
  NiftyBurningComicsL2: { address: burningComics, abi: BURNING_COMICS_ABI },
  NiftyDegen: { address: degen, abi: DEGEN_ABI },
})

const CLIENT_DEPLOYMENTS: Record<number, Record<string, ContractDefinition>> = {
  31337: contractSet(
    '0x4cf79525c3447AA62B2dafFA876878BEA02e85EA',
    '0x5F8E75aC1F58aa14FE93F796509B8472F97692EE',
    '0x5803033a15F49dA0664ff8b0775a6E578422CAfD',
    '0xc69A84860462309cBbfA65733DDA58F631186388',
    '0x08d49340c8D3Bfe1CEad341d8597BD07B959eaab'
  ),
  11155111: contractSet(
    '0x04301173892453559083C92B62a12A23aD55E646',
    '0x08B4E56aECF404950378B238F59744d563C91a6e',
    '0x0d312E74ba71bff163A07DdD2b6847CefF49dD1e',
    '0xE44f7288A258F0aF729F0Ff464ce65D22E15fDB3',
    '0x6adFF2BB4A465A885425e3bd4304A78BB659B12e'
  ),
  1: contractSet(
    '0xee7b4d3c69de4883dae82ecdb3b629d24a5590d7',
    '0x20362c5B7Ea1beDc84d28deEcd47d6807beBB18a',
    '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
    '0x9ede1004559cD9A6162FEe0F0E5ACe11DB3888D4',
    '0x986aea67C7d6A15036e18678065eb663Fc5BE883'
  ),
}

export default CLIENT_DEPLOYMENTS
