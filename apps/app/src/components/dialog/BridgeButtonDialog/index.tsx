'use client'

import { useState } from 'react'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import BridgeForm from './BridgeForm'
import BridgeSuccess from './BridgeSuccess'

type BridgeButtonDialogProps = { balance: number; loading: boolean }

const BridgeButtonDialog = ({ balance, loading }: BridgeButtonDialogProps) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const onCloseBridgeDialog = () => {} // handle actions if needed

  const onBridgeSuccess = () => setSuccessDialogOpen(true)

  return (
    <>
      <Dialog onClose={onCloseBridgeDialog}>
        <DialogTrigger>
          <Button variant="default" className="w-full" disabled={loading || balance < 0.5}>
            Bridge
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="bridge-nftl-dialog"
          dialogTitle={<span className="block w-full text-center">Bridge NFTL to Immutable</span>}
        >
          <div className="text-center">
            <BridgeForm balance={balance} onBridgeSuccess={onBridgeSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      <BridgeSuccess
        successDialogOpen={successDialogOpen}
        setSuccessDialogOpen={setSuccessDialogOpen}
      />
    </>
  )
}

export default BridgeButtonDialog
