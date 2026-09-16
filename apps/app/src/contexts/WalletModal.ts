type WalletModal = Awaited<ReturnType<typeof createWalletModal>>

const caipNetworkId = (network: { id: number }) => `eip155:${network.id}`

let walletModalPromise: Promise<WalletModal> | undefined

async function createWalletModal() {
  const [
    { createAppKit },
    {
      immutableZkEvm,
      immutableZkEvmTestnet,
      mainnet,
      metadata,
      networks,
      projectId,
      sepolia,
      wagmiAdapter,
    },
    { getContractAddress, NFTL_CONTRACT },
  ] = await Promise.all([
    import('@reown/appkit'),
    import('./Web3ModalConfig'),
    import('@/constants/contracts'),
  ])

  if (!projectId) throw new Error('Project ID is not defined')

  return createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: mainnet,
    metadata,
    features: { analytics: true },
    tokens: {
      [caipNetworkId(mainnet)]: {
        address: getContractAddress(mainnet.id, NFTL_CONTRACT),
        image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
      },
      [caipNetworkId(sepolia)]: {
        address: getContractAddress(sepolia.id, NFTL_CONTRACT),
        image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
      },
      [caipNetworkId(immutableZkEvm)]: {
        address: getContractAddress(immutableZkEvm.id, NFTL_CONTRACT),
        image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
      },
      [caipNetworkId(immutableZkEvmTestnet)]: {
        address: getContractAddress(immutableZkEvmTestnet.id, NFTL_CONTRACT),
        image: 'https://niftyleague.com/img/logos/NFTL/logo.webp',
      },
    },
    termsConditionsUrl: 'https://niftyleague.com/terms-of-service',
    privacyPolicyUrl: 'https://niftyleague.com/privacy-policy',
    themeMode: 'dark',
    enableEIP6963: true,
  })
}

function ensureWalletModal() {
  walletModalPromise ??= createWalletModal().catch((error) => {
    walletModalPromise = undefined
    throw error
  })
  return walletModalPromise
}

/**
 * Start loading the AppKit/wagmi chunk graph before the user clicks — wired
 * to pointerenter/focus on the connect triggers so the multi-MB modal code is
 * already in flight (or resolved) by the time `openWalletModal` runs.
 */
export function preloadWalletModal() {
  void ensureWalletModal().catch(() => undefined)
}

export async function openWalletModal() {
  const walletModal = await ensureWalletModal()
  return walletModal.open()
}
