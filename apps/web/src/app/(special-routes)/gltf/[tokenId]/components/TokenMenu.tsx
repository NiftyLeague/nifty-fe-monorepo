'use client';

import useClaimableNFTL from '@/hooks/useClaimableNFTL';
import { formatNumberToDisplay } from '@/lib/numbers';

import styles from '../gltf.module.scss';

const TokenMenu = ({ tokenId }: { tokenId: string }) => {
  const { totalAccrued } = useClaimableNFTL(tokenId as string);
  return (
    <div className={styles.menu__nftlUnclaimed}>
      <strong>NFTL Unclaimed:</strong> {formatNumberToDisplay(totalAccrued)}
    </div>
  );
};

export default TokenMenu;
