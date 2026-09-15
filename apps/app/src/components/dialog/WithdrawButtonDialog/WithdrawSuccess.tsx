import type { Dispatch, SetStateAction } from '@/types'
import { X } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@nl/ui/base/dialog'

import useTokensBalances from '@/hooks/balances/useTokensBalances'
import type { JSX } from 'solid-js'

type WithdrawSuccessProps = {
  successDialogOpen: boolean
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
}

const WithdrawSuccess = ({
  successDialogOpen,
  setSuccessDialogOpen,
}: WithdrawSuccessProps): JSX.Element => {
  const { refreshNFTLBalance } = useTokensBalances()

  const handleClose = () => {
    refreshNFTLBalance()
    setSuccessDialogOpen(false)
  }

  return (
    <Dialog open={successDialogOpen} onOpenChange={(open) => !open && handleClose()}>
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
        <DialogDescription>
          NFTL has been sent to your <strong>Immutable zkEVM</strong> wallet!
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawSuccess
