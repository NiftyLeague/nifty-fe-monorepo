'use client'

import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'
import { useCallback, useMemo } from 'react'
import type { DashboardDegen } from '@/types/degens'
import useNetworkContext from '@/hooks/useNetworkContext'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import { NFTL_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import { formatNumberToDisplay } from '@nl/ui/number-format'

export interface ClaimDegenContentDialogProps {
  degen?: DashboardDegen
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const ClaimDegenContentDialog = ({ degen, onClose }: ClaimDegenContentDialogProps) => {
  const { tx, writeContracts } = useNetworkContext()
  const tokenId = degen?.id ?? ''
  const degenTokenIndices = useMemo(() => [parseInt(tokenId, 10)], [tokenId])
  const { balance, refetch } = useClaimableNFTL(degenTokenIndices)

  const handleClaimNFTL = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // eslint-disable-next-line no-console
      if (DEBUG) console.log('Claim', degenTokenIndices, balance)
      await tx(writeContracts[NFTL_CONTRACT].claim(degenTokenIndices))
      setTimeout(() => refetch(), 5000)
      onClose?.(event)
    },
    [onClose, refetch, degenTokenIndices, balance, tx, writeContracts]
  )

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClose?.(event)
    },
    [onClose]
  )

  const amountParsed = formatNumberToDisplay(balance)

  return (
    <div className="flex flex-col gap-4 p-6">
      <Title level={4} className="text-center">
        {`${amountParsed} claimable for this DEGEN`}
      </Title>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={!(balance > 0.0 && writeContracts[NFTL_CONTRACT])}
          variant="default"
          onClick={handleClaimNFTL}
        >
          Claim
        </Button>
        <Button variant="ghost" className="w-full" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ClaimDegenContentDialog
