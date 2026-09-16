import { watchAsset } from '@wagmi/core'
import useNetworkContext from '@/hooks/useNetworkContext'
import { useWagmiConfig } from '@/runtime/wagmi'
import { NFTL_CONTRACT } from '@/constants/contracts'

/*
  ~ What it does? ~

  Import NFTL Token to Wallet

  ~ How can I use? ~

  const {handleImportNFTLToWallet} = useImportNFTLToWallet();
*/

interface ImportNFTLToWalletState {
  handleImportNFTLToWallet: () => void
}

export default function useImportNFTLToWallet(): ImportNFTLToWalletState {
  const config = useWagmiConfig()
  const network = useNetworkContext()

  const handleImportNFTLToWallet = async () => {
    const nftlContract = network.writeContracts[NFTL_CONTRACT]
    if (!nftlContract) return
    try {
      const success = await watchAsset(config, {
        type: 'ERC20',
        options: {
          address: await nftlContract.getAddress(),
          symbol: 'NFTL',
          decimals: 18,
          image: 'https://raw.githubusercontent.com/NiftyLeague/Nifty-League-Images/main/NFTL.webp',
        },
      })
      if (!success) throw new Error('Something went wrong.')
    } catch (err) {
      console.error(err)
    }
  }

  return { handleImportNFTLToWallet }
}
