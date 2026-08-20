'use client'

import useClaimableNFTL from '@/hooks/useClaimableNFTL'
import { formatNumberToDisplay } from '@nl/ui/number-format'

import styles from '../gltf.module.css'

export interface TokenMenuProps {
  tokenId: string
}

const TokenMenu = ({ tokenId }: TokenMenuProps) => {
  const { balance } = useClaimableNFTL(tokenId as string)
  return (
    <div className={styles.menu__nftlUnclaimed}>
      <strong>NFTL Unclaimed:</strong> {formatNumberToDisplay(balance)}
    </div>
  )
}

export default TokenMenu
