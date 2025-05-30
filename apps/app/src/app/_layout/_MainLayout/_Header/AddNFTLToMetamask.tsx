import Image from 'next/image';
import Button from '@mui/material/Button';
import useNetworkContext from '@/hooks/useNetworkContext';
import useImportNFTLToWallet from '@/hooks/useImportNFTLToWallet';

const AddNFTLToMetamask = (): React.ReactNode | null => {
  const { isConnected } = useNetworkContext();
  const { handleImportNFTLToWallet } = useImportNFTLToWallet();

  return isConnected ? (
    <Button
      onClick={handleImportNFTLToWallet}
      variant="outlined"
      startIcon={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/img/logos/NFTL/logo.webp" alt="NFTL logo" width={20} height={20} />
        </div>
      }
    >
      Add NFTL to MetaMask
    </Button>
  ) : null;
};

export default AddNFTLToMetamask;
