'use client'

import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'
import { createMemo } from 'solid-js'
import type { DashboardDegen } from '@/types/degens'
import useNetworkContext from '@/hooks/useNetworkContext'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import { NFTL_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import { formatNumberToDisplay } from '@nl/ui/number-format'

interface ClaimDegenContentDialogProps {
  degen?: DashboardDegen
  onClose?: (event: MouseEvent & { currentTarget: HTMLButtonElement }) => void
}

const ClaimDegenContentDialog = ({ degen, onClose }: ClaimDegenContentDialogProps) => {
  const { tx, writeContracts } = useNetworkContext()
  const tokenId = degen?.id ?? ''
  const degenTokenIndices = createMemo(() => [parseInt(tokenId, 10)], [tokenId])
  const { balance, refetch } = useClaimableNFTL(degenTokenIndices)

  const handleClaimNFTL = (
    async (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
      if (DEBUG) console.log('Claim', degenTokenIndices, balance)
      await tx(writeContracts[NFTL_CONTRACT].claim(degenTokenIndices))
      setTimeout(() => refetch(), 5000)
      onClose?.(event)
    },
    [onClose, refetch, degenTokenIndices, balance, tx, writeContracts]
  )

  const handleClose = (
    (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
      onClose?.(event)
    },
    [onClose]
  )

  const amountParsed = formatNumberToDisplay(balance)

  return (
    <div class="flex flex-col gap-4 p-6">
      <Title level={4} class="text-center">
        {`${amountParsed} claimable for this DEGEN`}
      </Title>
      <div class="flex flex-col gap-2">
        <Button
          class="w-full"
          disabled={!(balance > 0.0 && writeContracts[NFTL_CONTRACT])}
          variant="default"
          onClick={handleClaimNFTL}
        >
          Claim
        </Button>
        <Button variant="ghost" class="w-full" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ClaimDegenContentDialog
