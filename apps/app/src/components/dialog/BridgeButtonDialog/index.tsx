'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import BridgeSuccess from './BridgeSuccess'

type BridgeButtonDialogProps = { balance: number; loading: boolean }

const BridgeFormLoading = () => (
  <div className="py-8 text-center" role="status" aria-live="polite" aria-busy="true">
    Loading bridge options
  </div>
)

const BridgeForm = dynamic(() => import('./BridgeForm'), {
  ssr: false,
  loading: BridgeFormLoading,
})

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
