export default {
  name: 'imtbl-zkevm-mainnet',
  chainId: '13371',
  contracts: {
    NFTL: {
      address: '0xB0d7e9Ff5fb8E739c4990f7920d8047AcfAe4884',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner_',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'rootToken_',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'name_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'symbol_',
              type: 'string',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'message',
              type: 'string',
            },
          ],
          name: 'InvalidInitialization',
          type: 'error',
        },
        {
          inputs: [],
          name: 'InvalidShortString',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'str',
              type: 'string',
            },
          ],
          name: 'StringTooLong',
          type: 'error',
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
              indexed: true,
              internalType: 'address',
              name: 'delegator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'fromDelegate',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'toDelegate',
              type: 'address',
            },
          ],
          name: 'DelegateChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'delegate',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'previousBalance',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newBalance',
              type: 'uint256',
            },
          ],
          name: 'DelegateVotesChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [],
          name: 'EIP712DomainChanged',
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
          inputs: [],
          name: 'BRIDGE_ROLE',
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
          name: 'CLOCK_MODE',
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
          name: 'DOMAIN_SEPARATOR',
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
              name: 'from',
              type: 'address',
            },
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
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint32',
              name: 'pos',
              type: 'uint32',
            },
          ],
          name: 'checkpoints',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint32',
                  name: 'fromBlock',
                  type: 'uint32',
                },
                {
                  internalType: 'uint224',
                  name: 'votes',
                  type: 'uint224',
                },
              ],
              internalType: 'struct ERC20Votes.Checkpoint',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'clock',
          outputs: [
            {
              internalType: 'uint48',
              name: '',
              type: 'uint48',
            },
          ],
          stateMutability: 'view',
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
          inputs: [
            {
              internalType: 'address',
              name: 'delegatee',
              type: 'address',
            },
          ],
          name: 'delegate',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'delegatee',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'nonce',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'expiry',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'v',
              type: 'uint8',
            },
            {
              internalType: 'bytes32',
              name: 'r',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 's',
              type: 'bytes32',
            },
          ],
          name: 'delegateBySig',
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
          ],
          name: 'delegates',
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
          name: 'eip712Domain',
          outputs: [
            {
              internalType: 'bytes1',
              name: 'fields',
              type: 'bytes1',
            },
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'version',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'chainId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'verifyingContract',
              type: 'address',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
            {
              internalType: 'uint256[]',
              name: 'extensions',
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
              name: 'timepoint',
              type: 'uint256',
            },
          ],
          name: 'getPastTotalSupply',
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
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'timepoint',
              type: 'uint256',
            },
          ],
          name: 'getPastVotes',
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
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'getVotes',
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
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'nonces',
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
              name: 'account',
              type: 'address',
            },
          ],
          name: 'numCheckpoints',
          outputs: [
            {
              internalType: 'uint32',
              name: '',
              type: 'uint32',
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
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'deadline',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'v',
              type: 'uint8',
            },
            {
              internalType: 'bytes32',
              name: 'r',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 's',
              type: 'bytes32',
            },
          ],
          name: 'permit',
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
          inputs: [],
          name: 'rootToken',
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
      ],
    },
    NiftyGovernor: {
      address: '0x1a5C9D66003803e5c29f93c1e42D807471647ca3',
      abi: [
        {
          inputs: [
            {
              internalType: 'contract IVotes',
              name: 'token_',
              type: 'address',
            },
            {
              internalType: 'contract TimelockController',
              name: 'timelock_',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'initialVotingDelay_',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'initialVotingPeriod_',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'initialProposalThreshold_',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'initialQuorumNumerator_',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [],
          name: 'Empty',
          type: 'error',
        },
        {
          inputs: [],
          name: 'InvalidShortString',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'str',
              type: 'string',
            },
          ],
          name: 'StringTooLong',
          type: 'error',
        },
        {
          anonymous: false,
          inputs: [],
          name: 'EIP712DomainChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'ProposalCanceled',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'proposer',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              indexed: false,
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              indexed: false,
              internalType: 'string[]',
              name: 'signatures',
              type: 'string[]',
            },
            {
              indexed: false,
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'voteStart',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'voteEnd',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'description',
              type: 'string',
            },
          ],
          name: 'ProposalCreated',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'ProposalExecuted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'eta',
              type: 'uint256',
            },
          ],
          name: 'ProposalQueued',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'oldProposalThreshold',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newProposalThreshold',
              type: 'uint256',
            },
          ],
          name: 'ProposalThresholdSet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'oldQuorumNumerator',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newQuorumNumerator',
              type: 'uint256',
            },
          ],
          name: 'QuorumNumeratorUpdated',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'oldTimelock',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newTimelock',
              type: 'address',
            },
          ],
          name: 'TimelockChange',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'voter',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'weight',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'reason',
              type: 'string',
            },
          ],
          name: 'VoteCast',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'voter',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'weight',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'string',
              name: 'reason',
              type: 'string',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'params',
              type: 'bytes',
            },
          ],
          name: 'VoteCastWithParams',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'oldVotingDelay',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newVotingDelay',
              type: 'uint256',
            },
          ],
          name: 'VotingDelaySet',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'oldVotingPeriod',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newVotingPeriod',
              type: 'uint256',
            },
          ],
          name: 'VotingPeriodSet',
          type: 'event',
        },
        {
          inputs: [],
          name: 'BALLOT_TYPEHASH',
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
          name: 'CLOCK_MODE',
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
          name: 'COUNTING_MODE',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [],
          name: 'EXTENDED_BALLOT_TYPEHASH',
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
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'descriptionHash',
              type: 'bytes32',
            },
          ],
          name: 'cancel',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
          ],
          name: 'castVote',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'v',
              type: 'uint8',
            },
            {
              internalType: 'bytes32',
              name: 'r',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 's',
              type: 'bytes32',
            },
          ],
          name: 'castVoteBySig',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              internalType: 'string',
              name: 'reason',
              type: 'string',
            },
          ],
          name: 'castVoteWithReason',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              internalType: 'string',
              name: 'reason',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: 'params',
              type: 'bytes',
            },
          ],
          name: 'castVoteWithReasonAndParams',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'support',
              type: 'uint8',
            },
            {
              internalType: 'string',
              name: 'reason',
              type: 'string',
            },
            {
              internalType: 'bytes',
              name: 'params',
              type: 'bytes',
            },
            {
              internalType: 'uint8',
              name: 'v',
              type: 'uint8',
            },
            {
              internalType: 'bytes32',
              name: 'r',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 's',
              type: 'bytes32',
            },
          ],
          name: 'castVoteWithReasonAndParamsBySig',
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
          name: 'clock',
          outputs: [
            {
              internalType: 'uint48',
              name: '',
              type: 'uint48',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'eip712Domain',
          outputs: [
            {
              internalType: 'bytes1',
              name: 'fields',
              type: 'bytes1',
            },
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'version',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'chainId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'verifyingContract',
              type: 'address',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
            {
              internalType: 'uint256[]',
              name: 'extensions',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'descriptionHash',
              type: 'bytes32',
            },
          ],
          name: 'execute',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'payable',
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
              name: 'timepoint',
              type: 'uint256',
            },
          ],
          name: 'getVotes',
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
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'timepoint',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'params',
              type: 'bytes',
            },
          ],
          name: 'getVotesWithParams',
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
              name: 'proposalId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'hasVoted',
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
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'descriptionHash',
              type: 'bytes32',
            },
          ],
          name: 'hashProposal',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'pure',
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
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC1155BatchReceived',
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
          name: 'onERC1155Received',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'proposalDeadline',
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
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'proposalEta',
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
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'proposalProposer',
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
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'proposalSnapshot',
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
          name: 'proposalThreshold',
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
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'proposalVotes',
          outputs: [
            {
              internalType: 'uint256',
              name: 'againstVotes',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'forVotes',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'abstainVotes',
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
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              internalType: 'string',
              name: 'description',
              type: 'string',
            },
          ],
          name: 'propose',
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
          inputs: [
            {
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'calldatas',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'descriptionHash',
              type: 'bytes32',
            },
          ],
          name: 'queue',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'timepoint',
              type: 'uint256',
            },
          ],
          name: 'quorum',
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
          name: 'quorumDenominator',
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
              name: 'timepoint',
              type: 'uint256',
            },
          ],
          name: 'quorumNumerator',
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
          name: 'quorumNumerator',
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
              name: 'target',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'relay',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'newProposalThreshold',
              type: 'uint256',
            },
          ],
          name: 'setProposalThreshold',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'newVotingDelay',
              type: 'uint256',
            },
          ],
          name: 'setVotingDelay',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'newVotingPeriod',
              type: 'uint256',
            },
          ],
          name: 'setVotingPeriod',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'proposalId',
              type: 'uint256',
            },
          ],
          name: 'state',
          outputs: [
            {
              internalType: 'enum IGovernor.ProposalState',
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
          name: 'timelock',
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
          name: 'token',
          outputs: [
            {
              internalType: 'contract IERC5805',
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
              name: 'newQuorumNumerator',
              type: 'uint256',
            },
          ],
          name: 'updateQuorumNumerator',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'contract TimelockController',
              name: 'newTimelock',
              type: 'address',
            },
          ],
          name: 'updateTimelock',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'version',
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
          name: 'votingDelay',
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
          name: 'votingPeriod',
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
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
    NiftyMarketplace: {
      address: '0x6B66D473907A715aa573E44031355b34e77BB6dE',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner_',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'name_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'symbol_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'baseURI_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'contractURI_',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'operatorAllowlist_',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'receiver_',
              type: 'address',
            },
            {
              internalType: 'uint96',
              name: 'feeNumerator_',
              type: 'uint96',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [],
          name: 'AllowlistDoesNotImplementIOperatorAllowlist',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'target',
              type: 'address',
            },
          ],
          name: 'ApproveTargetNotInAllowlist',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'approver',
              type: 'address',
            },
          ],
          name: 'ApproverNotInAllowlist',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'caller',
              type: 'address',
            },
          ],
          name: 'CallerNotInAllowlist',
          type: 'error',
        },
        {
          inputs: [],
          name: 'InvalidShortString',
          type: 'error',
        },
        {
          inputs: [],
          name: 'InvalidSignature',
          type: 'error',
        },
        {
          inputs: [],
          name: 'PermitExpired',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: 'str',
              type: 'string',
            },
          ],
          name: 'StringTooLong',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
          ],
          name: 'TransferFromNotInAllowlist',
          type: 'error',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
          ],
          name: 'TransferToNotInAllowlist',
          type: 'error',
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
          inputs: [],
          name: 'EIP712DomainChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'address',
              name: 'oldRegistry',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'newRegistry',
              type: 'address',
            },
          ],
          name: 'OperatorAllowlistRegistryUpdated',
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
          name: 'DOMAIN_SEPARATOR',
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
          inputs: [],
          name: 'baseURI',
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
          inputs: [],
          name: 'contractURI',
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
          name: 'eip712Domain',
          outputs: [
            {
              internalType: 'bytes1',
              name: 'fields',
              type: 'bytes1',
            },
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'version',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'chainId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'verifyingContract',
              type: 'address',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
            {
              internalType: 'uint256[]',
              name: 'extensions',
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
              name: 'id',
              type: 'uint256',
            },
          ],
          name: 'exists',
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
          name: 'getAdmins',
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
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
          ],
          name: 'grantMinterRole',
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
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'nonces',
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
          name: 'operatorAllowlist',
          outputs: [
            {
              internalType: 'contract IOperatorAllowlist',
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
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'approved',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'deadline',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'sig',
              type: 'bytes',
            },
          ],
          name: 'permit',
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
          name: 'renounceRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
          ],
          name: 'revokeMinterRole',
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
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'salePrice',
              type: 'uint256',
            },
          ],
          name: 'royaltyInfo',
          outputs: [
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
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'safeMint',
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
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'safeMintBatch',
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
              name: 'baseURI_',
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
              internalType: 'string',
              name: 'contractURI_',
              type: 'string',
            },
          ],
          name: 'setContractURI',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'receiver',
              type: 'address',
            },
            {
              internalType: 'uint96',
              name: 'feeNumerator',
              type: 'uint96',
            },
          ],
          name: 'setDefaultRoyaltyReceiver',
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
            {
              internalType: 'address',
              name: 'receiver',
              type: 'address',
            },
            {
              internalType: 'uint96',
              name: 'feeNumerator',
              type: 'uint96',
            },
          ],
          name: 'setNFTRoyaltyReceiver',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: 'tokenIds',
              type: 'uint256[]',
            },
            {
              internalType: 'address',
              name: 'receiver',
              type: 'address',
            },
            {
              internalType: 'uint96',
              name: 'feeNumerator',
              type: 'uint96',
            },
          ],
          name: 'setNFTRoyaltyReceiverBatch',
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
              name: 'id',
              type: 'uint256',
            },
          ],
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
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'uri',
          outputs: [
            {
              internalType: 'string',
              name: 'tokenURI',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
    Timelock: {
      address: '0xee7b4d3C69DE4883daE82EcDb3B629d24A5590d7',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'minDelay',
              type: 'uint256',
            },
            {
              internalType: 'address[]',
              name: 'proposers',
              type: 'address[]',
            },
            {
              internalType: 'address[]',
              name: 'executors',
              type: 'address[]',
            },
            {
              internalType: 'address',
              name: 'admin',
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
              internalType: 'bytes32',
              name: 'id',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'target',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          name: 'CallExecuted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'id',
              type: 'bytes32',
            },
            {
              indexed: false,
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
          ],
          name: 'CallSalt',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'id',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'index',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'target',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              indexed: false,
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'delay',
              type: 'uint256',
            },
          ],
          name: 'CallScheduled',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'Cancelled',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: 'uint256',
              name: 'oldDuration',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'newDuration',
              type: 'uint256',
            },
          ],
          name: 'MinDelayChange',
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
          inputs: [],
          name: 'CANCELLER_ROLE',
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
          name: 'EXECUTOR_ROLE',
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
          name: 'PROPOSER_ROLE',
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
          name: 'TIMELOCK_ADMIN_ROLE',
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
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'cancel',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'target',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'payload',
              type: 'bytes',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
          ],
          name: 'execute',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'payloads',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
          ],
          name: 'executeBatch',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getMinDelay',
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
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'getTimestamp',
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
              name: 'target',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
          ],
          name: 'hashOperation',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'payloads',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
          ],
          name: 'hashOperationBatch',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'isOperation',
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
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'isOperationDone',
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
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'isOperationPending',
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
              name: 'id',
              type: 'bytes32',
            },
          ],
          name: 'isOperationReady',
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
              name: '',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: '',
              type: 'bytes',
            },
          ],
          name: 'onERC1155BatchReceived',
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
          name: 'onERC1155Received',
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
              name: 'target',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'delay',
              type: 'uint256',
            },
          ],
          name: 'schedule',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: 'targets',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: 'values',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes[]',
              name: 'payloads',
              type: 'bytes[]',
            },
            {
              internalType: 'bytes32',
              name: 'predecessor',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'salt',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'delay',
              type: 'uint256',
            },
          ],
          name: 'scheduleBatch',
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
          inputs: [
            {
              internalType: 'uint256',
              name: 'newDelay',
              type: 'uint256',
            },
          ],
          name: 'updateDelay',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          stateMutability: 'payable',
          type: 'receive',
        },
      ],
    },
  },
} as const;