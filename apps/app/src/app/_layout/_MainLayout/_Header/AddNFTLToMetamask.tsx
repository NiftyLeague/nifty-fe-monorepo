import Image from 'next/image'
import { Button } from '@nl/ui/base/button'
import useNetworkContext from '@/hooks/useNetworkContext'
import useImportNFTLToWallet from '@/hooks/useImportNFTLToWallet'

const AddNFTLToMetamask = (): React.ReactNode | null => {
  const { isConnected } = useNetworkContext()
  const { handleImportNFTLToWallet } = useImportNFTLToWallet()

  return isConnected ? (
    <Button onClick={handleImportNFTLToWallet} variant="outline" className="cursor-pointer">
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/img/logos/NFTL/logo.webp" alt="NFTL logo" width={20} height={20} />
      </span>
      Add NFTL to MetaMask
    </Button>
  ) : null
}

export default AddNFTLToMetamask
