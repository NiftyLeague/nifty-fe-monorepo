'use client'

import NativeImage from '@nl/ui/custom/native-image'
import { useContext, createSignal } from 'solid-js'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { parseEther } from 'ethers'

import { Alert } from '@nl/ui/base/alert'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Label } from '@nl/ui/base/label'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'

import { bridgeNFTL, increaseBridgeAllowance } from '@/utils/interchainTokenService'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import { IMX_SQUID_BRIDGE_URL } from '@/constants/url'
import { INTERCHAIN_TOKEN_SERVICE_ADDRESS } from '@/constants/contracts'
import useIMXContext from '@/hooks/useIMXContext'
import { useAgreementAccepted } from '@/hooks/useAuthStorage'
import { setAgreementAccepted } from '@/state/auth-storage'
import useNetworkContext from '@/hooks/useNetworkContext'
import useNFTLAllowance from '@/hooks/useNFTLAllowance'

import { DialogContext } from '@/components/dialog'
import TermsOfServiceDialog from '@/components/dialog/TermsOfServiceDialog'

type BridgeFormProps = { balance: number; onBridgeSuccess: () => void }
type IFormInput = { amountSelected: number; amountInput: string; isCheckedTerm: boolean }

const AMOUNT_SELECTS: number[] = [25, 50, 75, 100]

const AmountInput = forwardRef<HTMLInputElement, JSX.ComponentProps<'input'>>((props, ref) => (
  <input
    ref={ref}
    {...props}
    class="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
  />
))
AmountInput.displayName = 'AmountInput'

const BridgeForm = ({ balance, onBridgeSuccess }: BridgeFormProps): JSX.Element => {
  const agreementAccepted = useAgreementAccepted()
  const { address, writeContracts } = useNetworkContext()
  const { imxChainId } = useIMXContext()
  const [, setIsOpen] = useContext(DialogContext)

  const [bridgeAmount, setBridgeAmount] = createSignal<number>(0)
  const [openTOS, setOpenTOS] = createSignal<boolean>(false)
  const [allowPending, setAllowPending] = createSignal<boolean>(false)
  const [bridgePending, setBridgePending] = createSignal<boolean>(false)
  const {
    allowance,
    loading: loadingAllowance,
    refetch: refetchAllowance,
  } = useNFTLAllowance(INTERCHAIN_TOKEN_SERVICE_ADDRESS)

  const {
    handleSubmit,
    control,
    resetField,
    getValues,
    setError,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      amountSelected: 0,
      amountInput: '',
      isCheckedTerm: agreementAccepted === 'ACCEPTED',
    },
  })

  const resetForm = () => {
    setAllowPending(false)
    setBridgePending(false)
    reset()
    setBridgeAmount(0)
    setIsOpen(false)
  }

  const handleIncreaseAllowance = async () => {
    if (!address) return
    const destinationChainId = imxChainId
    const bn = parseEther(bridgeAmount.toString())
    await increaseBridgeAllowance(writeContracts, address, destinationChainId, bn)
    refetchAllowance()
    return
  }

  const handleBridgeNFTL = async () => {
    if (!address) return null
    const destinationChainId = imxChainId
    let safeBridgeAmount = bridgeAmount // Ensure precision issues don't occur
    if (bridgeAmount > balance) safeBridgeAmount = balance
    const bn = parseEther(safeBridgeAmount.toString())
    const txReceipt = await bridgeNFTL(writeContracts, address, destinationChainId, bn)
    return txReceipt
  }

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    if (bridgeAmount === 0) {
      setError('amountInput', {
        type: 'custom',
        message: 'Please enter the amount you like to withdraw.',
      })
      return
    }
    // Handle increase allowance if needed
    if (allowance < bridgeAmount) {
      setAllowPending(true)
      await handleIncreaseAllowance()
      setTimeout(() => setAllowPending(false), 500)
      return
    }
    // Handle bridge NFTL to Immutable
    setBridgePending(true)
    const txReceipt = await handleBridgeNFTL()
    if (!txReceipt || txReceipt.status === 0) {
      setError('amountInput', {
        type: 'custom',
        message: 'Failed to bridge NFTL. Please try again.',
      })
      setBridgePending(false)
      return
    }
    onBridgeSuccess()
    resetForm()
  }

  const openTOSDialog: JSX.EventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    setOpenTOS(true)
  }

  const handleTOSDialogClose = (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => {
    if (reason === 'accepted') {
      setValue('isCheckedTerm', true)
      setAgreementAccepted('ACCEPTED')
    }
    setOpenTOS(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div class="flex flex-col items-center gap-4">
        <Title level={4} class="opacity-70">
          Powered by:{'  '}
          <NativeImage src="/icons/axelar.svg" alt="Axelar" width={126} height={30} />
        </Title>
        <Alert variant="default" class="border-blue/40 bg-blue/10 text-blue">
          <strong>Note:</strong> The Axelar bridge minimizes fees but takes 20 minutes to process.{' '}
          <br />
          If you need your funds immediately use the{' '}
          <a
            href={IMX_SQUID_BRIDGE_URL}
            target="_blank"
            rel="noreferrer"
            style={{ 'font-weight': 800 }}
          >
            Squid Bridge
          </a>{' '}
          instead.
        </Alert>
        <Title level={2} class="opacity-70">
          {formatNumberToDisplay(balance)} NFTL
          <span class="block text-base">Balance on Ethereum available to bridge</span>
        </Title>
        <Title level={4}>How much would you like to bridge?</Title>
        <Controller
          name="amountSelected"
          control={control}
          render={({ field }) => (
            <ToggleGroup
              type="single"
              size="lg"
              value={String(field.value)}
              class="bg-[var(--color-blue)]"
              onValueChange={(value) => {
                if (value == null) return
                const num = Number(value)
                clearErrors()
                field.onChange(num)
                const calculatedAmount = num * (balance / 100)
                setValue('amountInput', calculatedAmount.toString())
                setBridgeAmount(calculatedAmount)
              }}
            >
              {AMOUNT_SELECTS.map((amount) => (
                <ToggleGroupItem value={String(amount)} class="sm:px-4 sm:py-1">
                  {amount !== 100 ? `${amount}%` : 'ALL'}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />

        <Title level={4}>OR - Enter Amount Manually</Title>

        <div class="w-full">
          <div class="mx-auto w-4/5">
            <Controller
              name="amountInput"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Amount of NFTL</Label>
                  <NumericFormat
                    disabled={field.disabled}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value}
                    allowNegative={false}
                    isAllowed={({ value }) => Number(value) <= Number(balance)}
                    thousandSeparator
                    customInput={
                      AmountInput as Component<
                        JSX.InputHTMLAttributes<HTMLInputElement>
                      >
                    }
                    onValueChange={(e) => {
                      clearErrors()
                      const numberValue = Number(e.value)
                      if (getValues('amountSelected') !== 0) {
                        if (getValues('amountSelected') === 25 && numberValue / balance != 0.25)
                          resetField('amountSelected')
                        if (getValues('amountSelected') === 50 && numberValue / balance != 0.5)
                          resetField('amountSelected')
                        if (getValues('amountSelected') === 75 && numberValue / balance != 0.75)
                          resetField('amountSelected')
                        if (getValues('amountSelected') === 100 && numberValue !== balance)
                          resetField('amountSelected')
                      }
                      field.onChange(e.value)
                      setBridgeAmount(numberValue)
                    }}
                  />
                </>
              )}
            />
          </div>
        </div>
        <Controller
          name="isCheckedTerm"
          control={control}
          render={({ field }) => (
            <div class="flex w-full flex-col items-center">
              <label class="flex items-center justify-center">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true)
                    setAgreementAccepted(checked === true ? 'ACCEPTED' : 'FALSE')
                  }}
                />
                <span class="w-full text-left text-base opacity-70">
                  I have read the
                  <button
                    type="button"
                    class="mx-1 cursor-pointer font-bold text-foreground underline"
                    onClick={openTOSDialog}
                  >
                    terms &amp; conditions
                  </button>
                  regarding bridge transactions.
                </span>
              </label>
            </div>
          )}
        />
        <TermsOfServiceDialog open={openTOS} onClose={handleTOSDialogClose} />
        {errors.amountInput && <Alert variant="destructive">{errors.amountInput.message}</Alert>}
        <Title level={4} class="w-full text-center">
          Step 1:
        </Title>
        <Button
          size="lg"
          type="submit"
          variant="default"
          class="w-full"
          disabled={!getValues('isCheckedTerm') || bridgeAmount === 0 || allowance >= bridgeAmount}
          style={{ textTransform: 'none' }}
        >
          Increase allowance to allow the bridge to transfer your NFTL
          {(loadingAllowance || allowPending) && <CircularProgress size="sm" />}
        </Button>
        <Title level={4} class="w-full text-center">
          Step 2:
        </Title>
        <Button
          size="lg"
          type="submit"
          variant="default"
          class="w-full"
          disabled={!getValues('isCheckedTerm') || bridgeAmount === 0 || allowance < bridgeAmount}
          style={{ textTransform: 'none' }}
        >
          Bridge {bridgeAmount !== 0 ? formatNumberToDisplay(Number(bridgeAmount)) : ''} NFTL to
          Immutable zkEVM
          {bridgePending && <CircularProgress size="sm" />}
        </Button>
      </div>
    </form>
  )
}

export default BridgeForm
