import useClaimableNFTL from '@/hooks/useClaimableNFTL'
import { formatNumberToDisplay } from '@nl/ui/number-format'

import styles from '../gltf.module.css'

export interface TokenMenuProps {
  tokenId: string
}

const TokenMenu = (props: TokenMenuProps) => {
  const { balance, loading } = useClaimableNFTL(props.tokenId)
  return (
    <div class={styles.menu__nftlUnclaimed} aria-busy={loading()}>
      <strong>NFTL Unclaimed:</strong> {loading() ? '…' : formatNumberToDisplay(balance())}
    </div>
  )
}

export default TokenMenu
