import type { Contract } from 'ethers6';
import type { Contracts } from '@/types/web3';
import { DEBUG } from '@/constants/index';
import useSingleCallResult from '@/hooks/useSingleCallResult';
import useMerkleDistributorContract from './useMerkleDistributorContract';
import useUserClaimData from './useUserClaimData';

interface UserClaimData {
  index: number;
  amount0: string;
  amount1: string;
  proof: string[];
}

// check if user is in blob and has not yet claimed comics
export function useUserHasAvailableClaim(userClaimData: UserClaimData | null | undefined): boolean {
  const distributorContract = useMerkleDistributorContract();
  const skipIf = userClaimData?.index === undefined;
  const isClaimedResult = useSingleCallResult(
    { MerkleDistributor: distributorContract as Contract } as Contracts,
    'MerkleDistributor',
    'isClaimed',
    [userClaimData?.index],
    null,
    skipIf,
  );
  // user is in blob and contract marks as unclaimed
  return Boolean(userClaimData && isClaimedResult === false);
}

export type ClaimResult = { p5: number; p6: number };

export default function useUserUnclaimedAmount(): ClaimResult {
  const userClaimData = useUserClaimData();
  const canClaim = useUserHasAvailableClaim(userClaimData);
  // eslint-disable-next-line no-console
  if (DEBUG) console.log('claimStats:', { canClaim, userClaimData });
  if (!canClaim || !userClaimData) return { p5: 0, p6: 0 };
  return {
    p5: Number(BigInt(userClaimData.amount0)),
    p6: Number(BigInt(userClaimData.amount1)),
  };
}
