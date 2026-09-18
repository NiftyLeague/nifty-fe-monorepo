import { watchAsset } from '@wagmi/core'
import { useWagmiConfig } from '@/runtime/wagmi'
import { NFTL_CONTRACT, getContractAddress } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'

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

  const handleImportNFTLToWallet = async () => {
    try {
      const success = await watchAsset(config, {
        type: 'ERC20',
        options: {
          address: getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT),
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
