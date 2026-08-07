'use client'

import { useState } from 'react'
import { Badge } from '@nl/ui/base/badge'
import { Button } from '@nl/ui/base/button'
import { useSwitchChain } from 'wagmi'

import { TARGET_NETWORK } from '@/constants/networks'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import WithdrawForm from './WithdrawForm'
import WithdrawSuccess from './WithdrawSuccess'

type WithdrawButtonDialogProps = { balance: number; loading: boolean }

const WithdrawButtonDialog = ({ balance, loading }: WithdrawButtonDialogProps) => {
  const { switchChain } = useSwitchChain()
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const onCloseWithdrawDialog = () => {
    switchChain?.({ chainId: TARGET_NETWORK.chainId })
  }

  const onWithdrawSuccess = () => setSuccessDialogOpen(true)

  return (
    <>
      <Dialog onClose={onCloseWithdrawDialog}>
        <DialogTrigger>
          <div className="relative w-full">
            <Button variant="default" className="w-full" disabled={loading || balance === 0}>
              Withdraw
            </Button>
            {!loading && balance !== 0 && (
              <Badge
                variant="destructive"
                aria-hidden="true"
                className="absolute top-0 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border-0 p-0"
              />
            )}
          </div>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="withdraw-earnings-dialog"
          dialogTitle={<span className="block w-full text-center">Withdraw Earnings</span>}
        >
          <div className="text-center">
            <WithdrawForm balance={balance} onWithdrawSuccess={onWithdrawSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      <WithdrawSuccess
        successDialogOpen={successDialogOpen}
        setSuccessDialogOpen={setSuccessDialogOpen}
      />
    </>
  )
}

export default WithdrawButtonDialog
