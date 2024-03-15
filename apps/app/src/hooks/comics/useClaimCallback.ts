import useNetworkContext from '@/hooks/useNetworkContext';
import { submitTxWithGasEstimate } from '@/utils/bnc-notify';
import useMerkleDistributorContract from './useMerkleDistributorContract';
import useUserClaimData from './useUserClaimData';

export default function useClaimCallback(): {
  claimCallback: () => Promise<void>;
} {
  const { address, tx, selectedNetworkId } = useNetworkContext();
  // get claim data for this account
  const claimData = useUserClaimData();
  const distributorContract = useMerkleDistributorContract();

  const claimCallback = async () => {
    if (!claimData || !address || !selectedNetworkId || !distributorContract) return;
    const args = [claimData.index, address, claimData.amount0, claimData.amount1, claimData.proof];
    await submitTxWithGasEstimate(tx, distributorContract, 'claim', args);
  };

  return { claimCallback };
}
