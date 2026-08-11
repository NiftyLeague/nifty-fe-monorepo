type WalletModal = Awaited<ReturnType<typeof createWalletModal>>

let walletModalPromise: Promise<WalletModal> | undefined

async function createWalletModal() {
  const [
    { createAppKit },
    { metadata, networks, projectId, wagmiAdapter },
    { immutableZkEvm, immutableZkEvmTestnet, mainnet, sepolia },
    { getContractAddress, NFTL_CONTRACT },
  ] = await Promise.all([
    import('@reown/appkit/react'),
    import('./Web3ModalConfig'),
    import('@reown/appkit/networks'),
    import('@/constants/contracts'),
  ])

  if (!projectId) throw new Error('Project ID is not defined')

  const caipNetworkId = (network: { id: number }) => `eip155:${network.id}`

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

export async function openWalletModal() {
  walletModalPromise ??= createWalletModal().catch((error) => {
    walletModalPromise = undefined
    throw error
  })

  const walletModal = await walletModalPromise
  return walletModal.open()
}
