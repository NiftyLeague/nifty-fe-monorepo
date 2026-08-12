import Link from 'next/link'
import type { Dispatch, SetStateAction } from 'react'
import { X } from 'lucide-react'

import { Alert } from '@nl/ui/base/alert'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@nl/ui/base/dialog'

import useTokensBalances from '@/hooks/balances/useTokensBalances'
import useNetworkContext from '@/hooks/useNetworkContext'
import { AXELAR_TRANSACTIONS_URL } from '@/constants/url'

type BridgeSuccessProps = {
  successDialogOpen: boolean
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
}

const BridgeSuccess = ({
  successDialogOpen,
  setSuccessDialogOpen,
}: BridgeSuccessProps): React.ReactNode => {
  const { address } = useNetworkContext()
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
            <X
              aria-hidden="true"
              absoluteStrokeWidth
              color="var(--color-muted-foreground)"
              size={24}
              strokeWidth={1.5}
            />
          </Button>
        </DialogTitle>
        <DialogDescription className="w-full">
          <span className="mb-2 block w-full text-center text-base text-foreground">
            NFTL has been sent to your <strong>Immutable zkEVM</strong> wallet!
          </span>
          <Alert className="border-blue/40 bg-blue/10 text-blue">
            Please Note: Axelar bridge transactions take 20 minutes to process.
            <br />
            You can check your bridge transactions here:{' '}
            <Link
              href={AXELAR_TRANSACTIONS_URL(address as `0x${string}`)}
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-blue"
            >
              Axelarscan
            </Link>
          </Alert>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default BridgeSuccess
