import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts';
import useIMXContext from '@/hooks/useIMXContext';
import useNetworkContext from '@/hooks/useNetworkContext';
import { submitTxWithGasEstimate } from '@/utils/bnc-notify';
import useUserClaimData from './useUserClaimData';

export default function useClaimCallback(): {
  claimCallback: () => Promise<void>;
} {
  const { address, tx, selectedNetworkId } = useNetworkContext();
  const { imxContracts, passportProvider } = useIMXContext();
  // get claim data for this account
  const claimData = useUserClaimData();
  const distributorContract = imxContracts[BALANCE_MANAGER_CONTRACT];

  const claimCallback = async () => {
    const imxNetworkId = await passportProvider?.provider?.getNetwork().then(network => network.chainId);
    if (!claimData || !address || !distributorContract || selectedNetworkId !== imxNetworkId) return;
    const args = [claimData.index, address, claimData.amount, claimData.proof];
    await submitTxWithGasEstimate(tx, distributorContract, 'claim', args);
  };

  return { claimCallback };
}
