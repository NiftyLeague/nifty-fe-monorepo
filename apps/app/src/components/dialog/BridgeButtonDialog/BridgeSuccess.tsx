import type { Dispatch, SetStateAction } from '@/types'
import { X } from 'lucide-solid'

import { Alert } from '@nl/ui/base/alert'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@nl/ui/base/dialog'

import useTokensBalances from '@/hooks/balances/useTokensBalances'
import useNetworkContext from '@/hooks/useNetworkContext'
import { AXELAR_TRANSACTIONS_URL } from '@/constants/url'
import type { JSX } from 'solid-js'

type BridgeSuccessProps = {
  successDialogOpen: boolean
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
}

const BridgeSuccess = (props: BridgeSuccessProps): JSX.Element => {
  const network = useNetworkContext()
  const { refreshNFTLBalance } = useTokensBalances()

  const handleClose = () => {
    refreshNFTLBalance()
    props.setSuccessDialogOpen(false)
  }

  return (
    <Dialog open={props.successDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false}>
        <DialogTitle class="relative text-center text-xl">
          Success!
          <Button
            aria-label="close"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            class="absolute top-0 right-0 cursor-pointer"
          >
            <X
              aria-hidden="true"
              absoluteStrokeWidth
              color="var(--color-muted-foreground)"
              size={24}
              strokeWidth={1.5}
            />
          </Button>
        </DialogTitle>
        <DialogDescription class="w-full">
          <span class="mb-2 block w-full text-center text-base text-foreground">
            NFTL has been sent to your <strong>Immutable zkEVM</strong> wallet!
          </span>
          <Alert class="border-blue/40 bg-blue/10 text-blue">
            Please Note: Axelar bridge transactions take 20 minutes to process.
            <br />
            You can check your bridge transactions here:{' '}
            <a
              href={AXELAR_TRANSACTIONS_URL(network.address as `0x${string}`)}
              target="_blank"
              rel="noopener noreferrer"
              class="font-extrabold text-blue"
            >
              Axelarscan
            </a>
          </Alert>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default BridgeSuccess
