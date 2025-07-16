'use client';

import useClaimableNFTL from '@/hooks/useClaimableNFTL';
import { formatNumberToDisplay } from '@nl/ui/utils';

import styles from '../gltf.module.css';

const TokenMenu = ({ tokenId }: { tokenId: string }) => {
  const { balance } = useClaimableNFTL(tokenId as string);
  return (
    <div className={styles.menu__nftlUnclaimed}>
      <strong>NFTL Unclaimed:</strong> {formatNumberToDisplay(balance)}
    </div>
  );
};

export default TokenMenu;
