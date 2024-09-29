'use client';

import useClaimableNFTL from '@/hooks/useClaimableNFTL';
import { formatNumberToDisplay } from '@/lib/numbers';

import styles from '../gltf.module.scss';

const TokenMenu = ({ tokenId }: { tokenId: string }) => {
  const { balance } = useClaimableNFTL(tokenId as string);
  return (
    <div className={styles.menu__nftlUnclaimed}>
      <strong>NFTL Unclaimed:</strong> {formatNumberToDisplay(balance)}
    </div>
  );
};

export default TokenMenu;
