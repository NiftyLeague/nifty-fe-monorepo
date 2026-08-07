import type { Dispatch, SetStateAction } from 'react'

import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@nl/ui/base/dialog'
import { Icon } from '@nl/ui/base/icon'

import useTokensBalances from '@/hooks/balances/useTokensBalances'

type WithdrawSuccessProps = {
  successDialogOpen: boolean
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
}

const WithdrawSuccess = ({
  successDialogOpen,
  setSuccessDialogOpen,
}: WithdrawSuccessProps): React.ReactNode => {
  const { refreshNFTLBalance } = useTokensBalances()

  const handleClose = () => {
    refreshNFTLBalance()
    setSuccessDialogOpen(false)
  }

  return (
    <Dialog open={successDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false}>
        <DialogTitle className="relative text-center text-xl">
          Success!
          <Button
            aria-label="close"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-0 right-0 cursor-pointer"
          >
            <Icon name="x" size="lg" color="dim" />
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
