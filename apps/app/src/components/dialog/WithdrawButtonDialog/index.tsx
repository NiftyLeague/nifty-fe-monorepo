import { createSignal } from 'solid-js'
import { Badge } from '@nl/ui/base/badge'
import { Button } from '@nl/ui/base/button'
import { useSwitchChain } from '@/runtime/wagmi'

import { TARGET_NETWORK } from '@/constants/networks'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import WithdrawForm from './WithdrawForm'
import WithdrawSuccess from './WithdrawSuccess'

type WithdrawButtonDialogProps = { balance: number; loading: boolean }

const WithdrawButtonDialog = ({ balance, loading }: WithdrawButtonDialogProps) => {
  const { switchChain } = useSwitchChain()
  const [successDialogOpen, setSuccessDialogOpen] = createSignal(false)

  const onCloseWithdrawDialog = () => {
    switchChain?.({ chainId: TARGET_NETWORK.chainId })
  }

  const onWithdrawSuccess = () => setSuccessDialogOpen(true)

  return (
    <>
      <Dialog onClose={onCloseWithdrawDialog}>
        <DialogTrigger>
          <div class="relative w-full">
            <Button variant="default" class="w-full" disabled={loading || balance === 0}>
              Withdraw
            </Button>
            {!loading && balance !== 0 && (
              <Badge
                variant="destructive"
                aria-hidden="true"
                class="absolute top-0 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border-0 p-0"
              />
            )}
          </div>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="withdraw-earnings-dialog"
          dialogTitle={<span class="block w-full text-center">Withdraw Earnings</span>}
        >
          <div class="text-center">
            <WithdrawForm balance={balance} onWithdrawSuccess={onWithdrawSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      <WithdrawSuccess
        successDialogOpen={successDialogOpen()}
        setSuccessDialogOpen={setSuccessDialogOpen}
      />
    </>
  )
}

export default WithdrawButtonDialog
