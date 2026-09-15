'use client'

import { useContext, createSignal } from 'solid-js'
import { SubmitHandler, useForm } from 'react-hook-form'
import type { TransactionResponse } from 'ethers'
import { useSwitchChain } from '@/runtime/wagmi'

import { Alert } from '@nl/ui/base/alert'
import { Button } from '@nl/ui/base/button'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'
import { formatNumberToDisplay } from '@nl/ui/number-format'

import { formatDateTime } from '@/utils/dateTime'
import { useConnectedToIMXCheck } from '@/hooks/useImxProvider'
import useClaimCallback from '@/hooks/merkleDistributor/useClaimCallback'
import useIMXContext from '@/hooks/useIMXContext'

import { DialogContext } from '@/components/dialog'

type WithdrawFormProps = { balance: number; onWithdrawSuccess: () => void }
type IFormInput = { withdrawal: string }

const WithdrawForm = ({ balance, onWithdrawSuccess }: WithdrawFormProps): JSX.Element => {
  const { imxChainId } = useIMXContext()
  const isConnectedToIMX = useConnectedToIMXCheck()
  const { switchChain } = useSwitchChain()
  const { claimCallback } = useClaimCallback()

  const [, setIsOpen] = useContext(DialogContext)
  const [loading, setLoading] = createSignal(false)

  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>()

  const resetForm = () => {
    setLoading(false)
    reset()
    setIsOpen(false)
  }

  const handleWithdrawNFTL = (async (): Promise<{
    txRes: TransactionResponse | null
  }> => {
    const txRes = await claimCallback()
    return { txRes }
  }, [claimCallback])

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    if (!isConnectedToIMX) {
      switchChain?.({ chainId: imxChainId })
      return
    }
    if (balance === 0) {
      setError('withdrawal', { type: 'custom', message: 'No NFTL available to withdraw.' })
      return
    }
    setLoading(true)
    const { txRes } = await handleWithdrawNFTL()
    if (txRes === null) {
      setError('withdrawal', {
        type: 'custom',
        message: 'Failed to withdraw NFTL. Please try again.',
      })
      setLoading(false)
      return
    }
    onWithdrawSuccess()
    resetForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div class="flex flex-col items-center gap-4">
        <Title level={4}>Game &amp; Rental Balance</Title>
        <Title level={2} class="opacity-70">
          {formatNumberToDisplay(balance)} NFTL
          <span class="block text-base">Available to Withdraw</span>
        </Title>

        <p class="text-base">
          You have until{' '}
          <span style={{ 'font-weight': 600, opacity: 0.7 }}>{formatDateTime(1767240000)}</span> to
          withdraw.
        </p>

        <Alert class="border-blue/40 bg-blue/10 text-blue">
          NFTL will be sent to your Immutable zkEVM wallet!
        </Alert>

        {errors.withdrawal && <Alert variant="destructive">{errors.withdrawal.message}</Alert>}

        <Button
          size="lg"
          type="submit"
          variant="default"
          class="w-full"
          disabled={loading || (isConnectedToIMX && balance === 0)}
        >
          {loading && <CircularProgress size="sm" />}
          {!isConnectedToIMX ? 'Switch Network to IMX' : 'Withdraw NFTL'}
        </Button>
      </div>
    </form>
  )
}
export default WithdrawForm
