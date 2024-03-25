export default {
  name: 'mainnet',
  chainId: '1',
  contracts: {
    AllowedColorsStorage: {
      address: '0xee7b4d3c69de4883dae82ecdb3b629d24a5590d7',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tribe',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'color',
              type: 'uint256',
            },
          ],
          name: 'isAllowedColor',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'tribe',
              type: 'uint256',
            },
            {
              internalType: 'uint256[]',
              name: 'colors',
              type: 'uint256[]',
            },
            {
              internalType: 'bool',
              name: 'allowed',
              type: 'bool',
            },
          ],
          name: 'setAllowedColorsOnTribe',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    BalanceManager: {
      address: '0x20362c5B7Ea1beDc84d28deEcd47d6807beBB18a',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'oldMaintainer',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newMaintainer',
              type: 'address',
            },
          ],
          name: 'MaintainerUpdated',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLDeposited',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLWithdrawn',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLWithdrawnByDAO',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'deposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_nftl',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_maintainer',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'maintainer',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'nftl',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'nonce',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
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
          inputs: [
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'signatures',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_maintainer',
              type: 'address',
            },
          ],
          name: 'updateMaintainer',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_nonce',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_signature',
              type: 'bytes',
            },
          ],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_beneficiary',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'withdrawByDAO',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
      ],
    },
    BalanceManager_Implementation: {
      address: '0x9a1EED0f2AaeB5C3B790FC6BdEcc1d045fa53Acd',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'oldMaintainer',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newMaintainer',
              type: 'address',
            },
          ],
          name: 'MaintainerUpdated',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLDeposited',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLWithdrawn',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'beneficiary',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'NFTLWithdrawnByDAO',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'deposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_nftl',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_maintainer',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'maintainer',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'nftl',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'nonce',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
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
          inputs: [
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'signatures',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_maintainer',
              type: 'address',
            },
          ],
          name: 'updateMaintainer',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_nonce',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_signature',
              type: 'bytes',
            },
          ],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_beneficiary',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'withdrawByDAO',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    BalanceManager_Proxy: {
      address: '0x20362c5B7Ea1beDc84d28deEcd47d6807beBB18a',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    DefaultProxyAdmin: {
      address: '0x9f7fc43410B708F21610418288488f0d703B229F',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'contract TransparentUpgradeableProxy',
              name: 'proxy',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeProxyAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'contract TransparentUpgradeableProxy',
              name: 'proxy',
              type: 'address',
            },
          ],
          name: 'getProxyAdmin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'contract TransparentUpgradeableProxy',
              name: 'proxy',
              type: 'address',
            },
          ],
          name: 'getProxyImplementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'contract TransparentUpgradeableProxy',
              name: 'proxy',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'upgrade',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'contract TransparentUpgradeableProxy',
              name: 'proxy',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
    },
    HydraDistributor: {
      address: '0x3410a1583fB26CDBF2a1439A2302B5Bc0464Fd39',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'beacon',
              type: 'address',
            },
          ],
          name: 'BeaconUpgraded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: 'implementation_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIdsBurned',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'hydraTokenId',
              type: 'uint256',
            },
          ],
          name: 'HydraClaimed',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint8',
              name: 'version',
              type: 'uint8',
            },
          ],
          name: 'Initialized',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'niftyDegen',
              type: 'address',
            },
          ],
          name: 'NiftyDegenSet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'niftyWallet',
              type: 'address',
            },
          ],
          name: 'NiftyWalletSet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_degenTokenIdList',
              type: 'uint256[]',
            },
          ],
          name: 'claimRandomHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_hydraTokenIdList',
              type: 'uint256[]',
            },
          ],
          name: 'depositHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getHydraCount',
          outputs: [
            {
              internalType: 'uint256',
              name: 'hydraCount',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getHydraTokenIds',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'hydraTokenIds',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyDegen',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_niftyWallet',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'niftyDegen',
          outputs: [
            {
              internalType: 'contract IERC721Upgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'niftyWallet',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC721Received',
          outputs: [
            {
              internalType: 'bytes4',
              name: '',
              type: 'bytes4',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyDegen',
              type: 'address',
            },
          ],
          name: 'updateNiftyDegen',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyWallet',
              type: 'address',
            },
          ],
          name: 'updateNiftyWallet',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
          ],
          name: 'withdrawAllHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_logic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
      ],
    },
    HydraDistributor_Implementation: {
      address: '0x280cBfdF2A43E57D61cD28C85145954f3095Ac37',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIdsBurned',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'hydraTokenId',
              type: 'uint256',
            },
          ],
          name: 'HydraClaimed',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint8',
              name: 'version',
              type: 'uint8',
            },
          ],
          name: 'Initialized',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'niftyDegen',
              type: 'address',
            },
          ],
          name: 'NiftyDegenSet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'niftyWallet',
              type: 'address',
            },
          ],
          name: 'NiftyWalletSet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_degenTokenIdList',
              type: 'uint256[]',
            },
          ],
          name: 'claimRandomHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_hydraTokenIdList',
              type: 'uint256[]',
            },
          ],
          name: 'depositHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getHydraCount',
          outputs: [
            {
              internalType: 'uint256',
              name: 'hydraCount',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getHydraTokenIds',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'hydraTokenIds',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyDegen',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_niftyWallet',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'niftyDegen',
          outputs: [
            {
              internalType: 'contract IERC721Upgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'niftyWallet',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC721Received',
          outputs: [
            {
              internalType: 'bytes4',
              name: '',
              type: 'bytes4',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyDegen',
              type: 'address',
            },
          ],
          name: 'updateNiftyDegen',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_niftyWallet',
              type: 'address',
            },
          ],
          name: 'updateNiftyWallet',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
          ],
          name: 'withdrawAllHydra',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    HydraDistributor_Proxy: {
      address: '0x3410a1583fB26CDBF2a1439A2302B5Bc0464Fd39',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_logic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'beacon',
              type: 'address',
            },
          ],
          name: 'BeaconUpgraded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: 'implementation_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    NFTLRaffle: {
      address: '0x33c84c36e79dd50F031dbDD103268cD6e895bAD9',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'beacon',
              type: 'address',
            },
          ],
          name: 'BeaconUpgraded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: 'implementation_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint8',
              name: 'version',
              type: 'uint8',
            },
          ],
          name: 'Initialized',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'randomWords',
              type: 'uint256[]',
            },
          ],
          name: 'RandomWordsReceived',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'randomCountToRequest',
              type: 'uint256',
            },
          ],
          name: 'RandomWordsRequested',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'ticketCount',
              type: 'uint256',
            },
          ],
          name: 'TicketDistributed',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'nftlAmount',
              type: 'uint256',
            },
          ],
          name: 'UserDeposited',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'winner',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'ticketId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'prizeTokenId',
              type: 'uint256',
            },
          ],
          name: 'WinnerSelected',
          type: 'event',
        },
        {
          inputs: [],
          name: 'NFTL_AMOUNT_FOR_TICKET',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'allowUserDeposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'assignTicketToUsers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'cancelSubscription',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'chargeLINK',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'currentWinnerTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'deposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_prizeNFTTokenIds',
              type: 'uint256[]',
            },
          ],
          name: 'depositPrizeNFT',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'disallowUserDeposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_holders',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_keyCount',
              type: 'uint256[]',
            },
          ],
          name: 'distributeTicketsToCitadelKeyHolders',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_users',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_ticketCount',
              type: 'uint256[]',
            },
          ],
          name: 'distributeTicketsToUsers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getRandomWordsList',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getUserCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getUserList',
          outputs: [
            {
              internalType: 'address[]',
              name: '',
              type: 'address[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getWinners',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'ticketId',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'winner',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'prizeTokenId',
                  type: 'uint256',
                },
              ],
              internalType: 'struct NFTLRaffle.WinnerInfo[]',
              name: '',
              type: 'tuple[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_nftl',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_pendingPeriod',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_totalWinnerTicketCount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_prizeNFT',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_vrfCoordinator',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'isTicketAssignedToUsers',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'isUserDepositAllowed',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'isWinnerTicketId',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_consumer',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: '_add',
              type: 'bool',
            },
          ],
          name: 'manageConsumers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'nftl',
          outputs: [
            {
              internalType: 'contract IERC20BurnableUpgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC721Received',
          outputs: [
            {
              internalType: 'bytes4',
              name: '',
              type: 'bytes4',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'prizeNFT',
          outputs: [
            {
              internalType: 'contract IERC721Upgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'prizeNFTTokenIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'prizeNFTokenIds',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'raffleStartAt',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'randomWordList',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_requestId',
              type: 'uint256',
            },
            {
              internalType: 'uint256[]',
              name: '_randomWords',
              type: 'uint256[]',
            },
          ],
          name: 'rawFulfillRandomWords',
          outputs: [],
          stateMutability: 'nonpayable',
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
          inputs: [],
          name: 'requestRandomWordsForWinnerSelection',
          outputs: [
            {
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 's_subscriptionId',
          outputs: [
            {
              internalType: 'uint64',
              name: '',
              type: 'uint64',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'ticketCountByUser',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'ticketIdList',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'ticketRangeByUser',
          outputs: [
            {
              internalType: 'uint256',
              name: 'startTicketId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'endTicketId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalWinnerTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_totalWinnerTicketCount',
              type: 'uint256',
            },
          ],
          name: 'updateTotalWinnerTicketCount',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'userByTicketId',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'userDeposits',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'winners',
          outputs: [
            {
              internalType: 'uint256',
              name: 'ticketId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'winner',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'prizeTokenId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
          ],
          name: 'withdrawLINK',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_logic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
      ],
    },
    NFTLRaffle_Implementation: {
      address: '0xdb705b5fc85F42b4Ee499927f1743f19DB946997',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint8',
              name: 'version',
              type: 'uint8',
            },
          ],
          name: 'Initialized',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'randomWords',
              type: 'uint256[]',
            },
          ],
          name: 'RandomWordsReceived',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'randomCountToRequest',
              type: 'uint256',
            },
          ],
          name: 'RandomWordsRequested',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'ticketCount',
              type: 'uint256',
            },
          ],
          name: 'TicketDistributed',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'nftlAmount',
              type: 'uint256',
            },
          ],
          name: 'UserDeposited',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'winner',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'ticketId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'prizeTokenId',
              type: 'uint256',
            },
          ],
          name: 'WinnerSelected',
          type: 'event',
        },
        {
          inputs: [],
          name: 'NFTL_AMOUNT_FOR_TICKET',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'allowUserDeposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'assignTicketToUsers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'cancelSubscription',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'chargeLINK',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'currentWinnerTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'deposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_prizeNFTTokenIds',
              type: 'uint256[]',
            },
          ],
          name: 'depositPrizeNFT',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'disallowUserDeposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_holders',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_keyCount',
              type: 'uint256[]',
            },
          ],
          name: 'distributeTicketsToCitadelKeyHolders',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_users',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_ticketCount',
              type: 'uint256[]',
            },
          ],
          name: 'distributeTicketsToUsers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getRandomWordsList',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getUserCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getUserList',
          outputs: [
            {
              internalType: 'address[]',
              name: '',
              type: 'address[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getWinners',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'ticketId',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'winner',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'prizeTokenId',
                  type: 'uint256',
                },
              ],
              internalType: 'struct NFTLRaffle.WinnerInfo[]',
              name: '',
              type: 'tuple[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_nftl',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_pendingPeriod',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_totalWinnerTicketCount',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_prizeNFT',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_vrfCoordinator',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'isTicketAssignedToUsers',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'isUserDepositAllowed',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'isWinnerTicketId',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_consumer',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: '_add',
              type: 'bool',
            },
          ],
          name: 'manageConsumers',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'nftl',
          outputs: [
            {
              internalType: 'contract IERC20BurnableUpgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC721Received',
          outputs: [
            {
              internalType: 'bytes4',
              name: '',
              type: 'bytes4',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'prizeNFT',
          outputs: [
            {
              internalType: 'contract IERC721Upgradeable',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'prizeNFTTokenIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'prizeNFTokenIds',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'raffleStartAt',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'randomWordList',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_requestId',
              type: 'uint256',
            },
            {
              internalType: 'uint256[]',
              name: '_randomWords',
              type: 'uint256[]',
            },
          ],
          name: 'rawFulfillRandomWords',
          outputs: [],
          stateMutability: 'nonpayable',
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
          inputs: [],
          name: 'requestRandomWordsForWinnerSelection',
          outputs: [
            {
              internalType: 'uint256',
              name: 'requestId',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 's_subscriptionId',
          outputs: [
            {
              internalType: 'uint64',
              name: '',
              type: 'uint64',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'ticketCountByUser',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'ticketIdList',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'ticketRangeByUser',
          outputs: [
            {
              internalType: 'uint256',
              name: 'startTicketId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'endTicketId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalWinnerTicketCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_totalWinnerTicketCount',
              type: 'uint256',
            },
          ],
          name: 'updateTotalWinnerTicketCount',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'userByTicketId',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'userDeposits',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'winners',
          outputs: [
            {
              internalType: 'uint256',
              name: 'ticketId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'winner',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'prizeTokenId',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
          ],
          name: 'withdrawLINK',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    NFTLRaffle_Proxy: {
      address: '0x33c84c36e79dd50F031dbDD103268cD6e895bAD9',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_logic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'beacon',
              type: 'address',
            },
          ],
          name: 'BeaconUpgraded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: 'admin_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: 'implementation_',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    NFTLToken: {
      address: '0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'emissionStartTimestamp',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'previousAdminRole',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'newAdminRole',
              type: 'bytes32',
            },
          ],
          name: 'RoleAdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleGranted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleRevoked',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [],
          name: 'DEFAULT_ADMIN_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'EMISSION_PER_DAY',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'MINTER_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'PAUSER_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenIndex',
              type: 'uint256',
            },
          ],
          name: 'accumulated',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: 'tokenIndices',
              type: 'uint256[]',
            },
          ],
          name: 'accumulatedMultiCheck',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
          ],
          name: 'allowance',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'burn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'burnFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: 'tokenIndices',
              type: 'uint256[]',
            },
          ],
          name: 'claim',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              internalType: 'uint8',
              name: '',
              type: 'uint8',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'subtractedValue',
              type: 'uint256',
            },
          ],
          name: 'decreaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'emissionEnd',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'emissionStart',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenIndex',
              type: 'uint256',
            },
          ],
          name: 'getLastClaim',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
          ],
          name: 'getRoleAdmin',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
          ],
          name: 'getRoleMember',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
          ],
          name: 'getRoleMemberCount',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'grantRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'hasRole',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'addedValue',
              type: 'uint256',
            },
          ],
          name: 'increaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'mint',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'renounceRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'revokeRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'nftAddress',
              type: 'address',
            },
          ],
          name: 'setNFTAddress',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transfer',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    NiftyBurningComicsL2: {
      address: '0x9ede1004559cD9A6162FEe0F0E5ACe11DB3888D4',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIds',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
          ],
          name: 'ComicsBurned',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIds',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'startIdForIMX',
              type: 'uint256[]',
            },
          ],
          name: 'ItemMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'startIdForIMX',
              type: 'uint256',
            },
          ],
          name: 'KeyMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_values',
              type: 'uint256[]',
            },
          ],
          name: 'burnComics',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'comics',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_comics',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'itemIdByTokenId',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'itemIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
      ],
    },
    NiftyBurningComicsL2_Implementation: {
      address: '0x32AF0c22a2ef057d5Af7B9ca27b01f436b8Fa9D5',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIds',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
          ],
          name: 'ComicsBurned',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'tokenIds',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'startIdForIMX',
              type: 'uint256[]',
            },
          ],
          name: 'ItemMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'by',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'startIdForIMX',
              type: 'uint256',
            },
          ],
          name: 'KeyMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: '_values',
              type: 'uint256[]',
            },
          ],
          name: 'burnComics',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'comics',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_comics',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'itemIdByTokenId',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'itemIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    NiftyBurningComicsL2_Proxy: {
      address: '0x9ede1004559cD9A6162FEe0F0E5ACe11DB3888D4',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    NiftyDegen: {
      address: '0x986aea67C7d6A15036e18678065eb663Fc5BE883',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'nftlAddress',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'storageAddress',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'approved',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'ApprovalForAll',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'previousName',
              type: 'string',
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'newName',
              type: 'string',
            },
          ],
          name: 'NameUpdated',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [],
          name: 'MAX_SUPPLY',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'NAME_CHANGE_PRICE',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'SPECIAL_CHARACTERS',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'string',
              name: 'newName',
              type: 'string',
            },
          ],
          name: 'changeName',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getApproved',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getCharacterTraits',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint16',
                  name: 'tribe',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'skinColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'furColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'eyeColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'pupilColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hair',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'mouth',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'beard',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'top',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'outerwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'print',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'bottom',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'footwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'belt',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hat',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'eyewear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'piercing',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'wrist',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hands',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'neckwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'leftItem',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'rightItem',
                  type: 'uint16',
                },
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
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getName',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getRemovedTraits',
          outputs: [
            {
              internalType: 'uint16[]',
              name: '',
              type: 'uint16[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'initPoolSizes',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tribe',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'trait',
              type: 'uint256',
            },
          ],
          name: 'isAvailableAndAllowedTrait',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'trait',
              type: 'uint256',
            },
          ],
          name: 'isAvailableTrait',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'nameString',
              type: 'string',
            },
          ],
          name: 'isNameReserved',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'traitCombo',
              type: 'uint256',
            },
          ],
          name: 'isUnique',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'uint16',
                  name: 'tribe',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'skinColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'furColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'eyeColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'pupilColor',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hair',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'mouth',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'beard',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'top',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'outerwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'print',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'bottom',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'footwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'belt',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hat',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'eyewear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'piercing',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'wrist',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'hands',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'neckwear',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'leftItem',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'rightItem',
                  type: 'uint16',
                },
              ],
              internalType: 'struct NiftyLeagueCharacter.CharacterTraits',
              name: '_characterTraits',
              type: 'tuple',
            },
          ],
          name: 'mintDegenWithCharacterTraits',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'newPrice',
              type: 'uint256',
            },
          ],
          name: 'overrideMintPrice',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ownerOf',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pauseMinting',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[5]',
              name: 'character',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[3]',
              name: 'head',
              type: 'uint256[3]',
            },
            {
              internalType: 'uint256[6]',
              name: 'clothing',
              type: 'uint256[6]',
            },
            {
              internalType: 'uint256[6]',
              name: 'accessories',
              type: 'uint256[6]',
            },
            {
              internalType: 'uint256[2]',
              name: 'items',
              type: 'uint256[2]',
            },
          ],
          name: 'purchase',
          outputs: [],
          stateMutability: 'payable',
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
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'baseURI',
              type: 'string',
            },
          ],
          name: 'setBaseURI',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'tokenURI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '_value',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpauseMinting',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'newName',
              type: 'string',
            },
          ],
          name: 'validateName',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
    NiftyItemL2: {
      address: '0xc21909b7E596000C01318668293A7DFB4B37A578',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'approved',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'ApprovalForAll',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'blueprint',
              type: 'bytes',
            },
          ],
          name: 'AssetMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256',
            },
          ],
          name: 'burn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getApproved',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'imx',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_imx',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'itemIdByTokenId',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_quantity',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_mintingBlob',
              type: 'bytes',
            },
          ],
          name: 'mintFor',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ownerOf',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_uri',
              type: 'string',
            },
          ],
          name: 'setURI',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
          ],
          name: 'tokenByIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
          ],
          name: 'tokenOfOwnerByIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'tokenURI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'uri',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
      ],
    },
    NiftyItemL2_Implementation: {
      address: '0x677c1291f01DA024B0e4E665FCF3BBcC8cF3EFd0',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'approved',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'ApprovalForAll',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'blueprint',
              type: 'bytes',
            },
          ],
          name: 'AssetMinted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256',
            },
          ],
          name: 'burn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'getApproved',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'imx',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_imx',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'itemIdByTokenId',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_quantity',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_mintingBlob',
              type: 'bytes',
            },
          ],
          name: 'mintFor',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'ownerOf',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
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
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_uri',
              type: 'string',
            },
          ],
          name: 'setURI',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
          ],
          name: 'tokenByIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
          ],
          name: 'tokenOfOwnerByIndex',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'tokenURI',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpause',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'uri',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
    NiftyItemL2_Proxy: {
      address: '0xc21909b7E596000C01318668293A7DFB4B37A578',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'initialLogic',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'initialAdmin',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
            },
          ],
          stateMutability: 'payable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'previousAdmin',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'AdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'implementation',
              type: 'address',
            },
          ],
          name: 'Upgraded',
          type: 'event',
        },
        {
          stateMutability: 'payable',
          type: 'fallback',
        },
        {
          inputs: [],
          name: 'admin',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newAdmin',
              type: 'address',
            },
          ],
          name: 'changeAdmin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'implementation',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
          ],
          name: 'upgradeTo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'newImplementation',
              type: 'address',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'upgradeToAndCall',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    NiftyLaunchComics: {
      address: '0xBc8542e65ab801f7c9e3edd23238d37a2e3972d6',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: 'uri',
              type: 'string',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'ApprovalForAll',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Paused',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'previousAdminRole',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'newAdminRole',
              type: 'bytes32',
            },
          ],
          name: 'RoleAdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleGranted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleRevoked',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'ids',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
          ],
          name: 'TransferBatch',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'TransferSingle',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'string',
              name: 'value',
              type: 'string',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
          ],
          name: 'URI',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'Unpaused',
          type: 'event',
        },
        {
          inputs: [],
          name: 'DEFAULT_ADMIN_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'MINTER_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'PAUSER_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: 'accounts',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'ids',
              type: 'uint256[]',
            },
          ],
          name: 'balanceOfBatch',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'burn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256[]',
              name: 'ids',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
          ],
          name: 'burnBatch',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
          ],
          name: 'getRoleAdmin',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'grantRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'hasRole',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'isApprovedForAll',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'mint',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256[]',
              name: 'ids',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: 'amounts',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'mintBatch',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'pauseBurn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'paused',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'renounceRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'revokeRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256[]',
              name: 'ids',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: 'amounts',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'safeBatchTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'safeTransferFrom',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
          ],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'newuri',
              type: 'string',
            },
          ],
          name: 'setURI',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'unpauseBurn',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'uri',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
  },
} as const;
