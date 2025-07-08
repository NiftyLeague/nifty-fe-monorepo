'use client';

import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import useNetworkContext from '@/hooks/useNetworkContext';
import { NFTL_CONTRACT } from '@/constants/contracts';

/*
  ~ What it does? ~

  Import NFTL Token to Wallet

  ~ How can I use? ~

  const {handleImportNFTLToWallet} = useTokenUSDPrice();
*/

interface ImportNFTLToWalletState {
  handleImportNFTLToWallet: () => void;
}

export default function useImportNFTLToWallet(): ImportNFTLToWalletState {
  const { data: walletClient } = useWalletClient();
  const { writeContracts } = useNetworkContext();

  const handleImportNFTLToWallet = useCallback(async () => {
    if (!walletClient || !writeContracts[NFTL_CONTRACT]) return;
    try {
      const success = await walletClient.watchAsset({
        type: 'ERC20',
        options: {
          address: await writeContracts[NFTL_CONTRACT].getAddress(),
          symbol: 'NFTL',
          decimals: 18,
          image: 'https://raw.githubusercontent.com/NiftyLeague/Nifty-League-Images/main/NFTL.webp',
        },
      });
      if (success) {
        console.log('Successfully added NFTL to MetaMask');
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
    }
  }, [writeContracts, walletClient]);

  return { handleImportNFTLToWallet };
}
