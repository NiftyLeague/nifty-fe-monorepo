import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'
import useNetworkContext from '@/hooks/useNetworkContext'
import useImportNFTLToWallet from '@/hooks/useImportNFTLToWallet'

const AddNFTLToMetamask = (): JSX.Element | null => {
  const { isConnected } = useNetworkContext()
  const { handleImportNFTLToWallet } = useImportNFTLToWallet()

  return isConnected ? (
    <Button onClick={handleImportNFTLToWallet} variant="outline" class="cursor-pointer">
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <NativeImage src="/img/logos/NFTL/logo.webp" alt="NFTL logo" width={20} height={20} />
      </span>
      Add NFTL to MetaMask
    </Button>
  ) : null
}

export default AddNFTLToMetamask
