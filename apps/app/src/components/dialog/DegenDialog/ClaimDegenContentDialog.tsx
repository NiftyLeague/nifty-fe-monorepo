import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'
import { createMemo, onCleanup } from 'solid-js'
import type { DashboardDegen } from '@/types/degens'
import useNetworkContext from '@/hooks/useNetworkContext'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import { NFTL_CONTRACT, getContractABI, getContractAddress } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import { DEBUG } from '@/constants/index'
import { formatNumberToDisplay } from '@nl/ui/number-format'

interface ClaimDegenContentDialogProps {
  degen?: DashboardDegen
  onClose?: (event: MouseEvent & { currentTarget: HTMLButtonElement }) => void
}

const ClaimDegenContentDialog = (props: ClaimDegenContentDialogProps) => {
  const network = useNetworkContext()
  const tokenId = () => props.degen?.id ?? ''
  const degenTokenIndices = createMemo(() => [parseInt(tokenId(), 10)])
  const claimable = useClaimableNFTL(degenTokenIndices)
  let refetchTimer: ReturnType<typeof setTimeout> | undefined
  onCleanup(() => clearTimeout(refetchTimer))

  const handleClaimNFTL = async (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    if (DEBUG) console.log('Claim', degenTokenIndices(), claimable.balance)
    await network.write({
      address: getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT) as `0x${string}`,
      abi: getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT),
      functionName: 'claim',
      args: [degenTokenIndices()],
    })
    refetchTimer = setTimeout(() => claimable.refetch(), 5000)
    props.onClose?.(event)
  }

  const handleClose = (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    props.onClose?.(event)
  }

  const amountParsed = () => formatNumberToDisplay(claimable.balance)

  return (
    <div class="flex flex-col gap-4 p-6">
      <Title level={4} class="text-center">
        {`${amountParsed()} claimable for this DEGEN`}
      </Title>
      <div class="flex flex-col gap-2">
        <Button
          class="w-full"
          disabled={!(claimable.balance > 0.0 && network.writeContracts[NFTL_CONTRACT])}
          variant="default"
          onClick={(e: MouseEvent & { currentTarget: HTMLButtonElement }) =>
            void handleClaimNFTL(e)
          }
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
