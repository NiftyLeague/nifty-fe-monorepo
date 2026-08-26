'use client'

import useClaimableNFTL from '@/hooks/useClaimableNFTL'
import { formatNumberToDisplay } from '@nl/ui/number-format'

import styles from '../gltf.module.css'

export interface TokenMenuProps {
  tokenId: string
}

const TokenMenu = ({ tokenId }: TokenMenuProps) => {
  const { balance, loading } = useClaimableNFTL(tokenId as string)
  return (
    <div className={styles.menu__nftlUnclaimed} aria-busy={loading}>
      <strong>NFTL Unclaimed:</strong> {loading ? '…' : formatNumberToDisplay(balance)}
    </div>
  )
}

export default TokenMenu
