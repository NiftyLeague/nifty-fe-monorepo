'use client';

import { formatEther, parseEther, type TransactionResponse } from 'ethers';
import { handleError } from '@/utils/bnc-notify';
import useIMXContext from '@/hooks/useIMXContext';
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider';
import type { MetamaskError } from '@/types/notify';
import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants';
import useUserClaimData from './useUserClaimData';

export default function useClaimCallback(): { claimCallback: () => Promise<TransactionResponse | null> } {
  const { imxContracts, imxSigner } = useIMXContext();
  const isConnectedToIMX = useConnectedToIMXCheck();
  const distributorContract = imxContracts[BALANCE_MANAGER_CONTRACT];
  // get claim data for this account
  const { claimData } = useUserClaimData();

  const claimCallback = async () => {
    try {
      if (!claimData || !imxSigner?.address || !distributorContract || !isConnectedToIMX) return null;

      const contractWithSigner = distributorContract.connect(imxSigner);

      const nftlAmount = parseEther(formatEther(claimData.amount)); // Convert hex string to bigint
      if (DEBUG) console.log('Withdrawing NFTL', [claimData.index, imxSigner.address, nftlAmount, claimData.proof]);
      const txRes = await contractWithSigner.claim(claimData.index, imxSigner.address, nftlAmount, claimData.proof);

      return txRes ? txRes : null;
    } catch (error) {
      handleError(error as MetamaskError);
      return null;
    }
  };

  return { claimCallback };
}
