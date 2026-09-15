'use client'

import dynamic from '@/runtime/dynamic'
import { createSignal } from 'solid-js'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import BridgeSuccess from './BridgeSuccess'

type BridgeButtonDialogProps = { balance: number; loading: boolean }

const BridgeFormLoading = () => (
  <div class="py-8 text-center" role="status" aria-live="polite" aria-busy="true">
    Loading bridge options
  </div>
)

const BridgeForm = dynamic(() => import('./BridgeForm'), {
  ssr: false,
  loading: BridgeFormLoading,
})

const onCloseBridgeDialog = () => {}

const BridgeButtonDialog = ({ balance, loading }: BridgeButtonDialogProps) => {
  const [successDialogOpen, setSuccessDialogOpen] = createSignal(false)

  const onBridgeSuccess = () => setSuccessDialogOpen(true)

  return (
    <>
      <Dialog onClose={onCloseBridgeDialog}>
        <DialogTrigger>
          <Button variant="default" class="w-full" disabled={loading || balance < 0.5}>
            Bridge
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="bridge-nftl-dialog"
          dialogTitle={<span class="block w-full text-center">Bridge NFTL to Immutable</span>}
        >
          <div class="text-center">
            <BridgeForm balance={balance} onBridgeSuccess={onBridgeSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      <BridgeSuccess
        successDialogOpen={successDialogOpen()}
        setSuccessDialogOpen={setSuccessDialogOpen}
      />
    </>
  )
}

export default BridgeButtonDialog
