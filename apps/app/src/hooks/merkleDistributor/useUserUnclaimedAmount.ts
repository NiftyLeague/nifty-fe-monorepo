import { useEffect } from 'react';
import { formatEther } from 'ethers6';
import { BALANCE_MANAGER_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import useIMXContext from '@/hooks/useIMXContext';
import useSingleCallResult from '@/hooks/useSingleCallResult';
import useUserClaimData from './useUserClaimData';

interface UserClaimData {
  index: number;
  amount: string;
  proof: string[];
}

// Check if user is in the blob and has not yet claimed NFTL
function useUserHasAvailableClaim(userClaimData: UserClaimData | null | undefined): boolean {
  const { imxContracts } = useIMXContext();

  // Skip call if userClaimData or index is not defined
  const skipIf = !userClaimData || userClaimData?.index === undefined;

  const isClaimedResult = useSingleCallResult(
    imxContracts,
    BALANCE_MANAGER_CONTRACT,
    'isClaimed',
    [userClaimData?.index],
    null,
    skipIf,
  );

  // user is in blob and contract marks as unclaimed
  return Boolean(userClaimData && isClaimedResult === false);
}

export type ClaimResult = { nftlUnclaimed: number; loading: boolean };

export default function useUserUnclaimedAmount(): ClaimResult {
  const { claimData, loading } = useUserClaimData();
  const canClaim = useUserHasAvailableClaim(claimData);

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (DEBUG && !loading) console.log('claimStats:', { claimData, canClaim });
  }, [claimData, canClaim, loading]);

  // Return 0 if the user already claimed or there is no claim data
  if (!canClaim || !claimData) return { nftlUnclaimed: 0, loading };
  // Convert the claim amount from wei to Ether and ensure accurate number precision
  return { nftlUnclaimed: Number(formatEther(claimData.amount)), loading };
}
