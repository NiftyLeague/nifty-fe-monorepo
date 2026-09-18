import NativeImage from '@nl/ui/custom/native-image'
import { useContext, createSignal, onCleanup, For, Show, type JSX } from 'solid-js'
import { parseEther } from 'ethers'

import { Alert } from '@nl/ui/base/alert'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Label } from '@nl/ui/base/label'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'

import { bridgeNFTL, increaseBridgeAllowance } from '@/utils/interchainTokenService'
import { useWagmiConfig } from '@/runtime/wagmi'
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

const AMOUNT_SELECTS: number[] = [25, 50, 75, 100]

const AmountInput = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    class="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
  />
)

const formatWithSeparators = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 18 })

const BridgeForm = (props: BridgeFormProps): JSX.Element => {
  const config = useWagmiConfig()
  const agreementAccepted = useAgreementAccepted()
  const network = useNetworkContext()
  const imx = useIMXContext()
  const [, setIsOpen] = useContext(DialogContext)

  const [amountSelected, setAmountSelected] = createSignal<number>(0)
  const [amountInput, setAmountInput] = createSignal<string>('')
  const [isCheckedTerm, setIsCheckedTerm] = createSignal<boolean>(
    agreementAccepted() === 'ACCEPTED'
  )
  const [amountError, setAmountError] = createSignal<string>('')
  const [bridgeAmount, setBridgeAmount] = createSignal<number>(0)
  const [openTOS, setOpenTOS] = createSignal<boolean>(false)
  const [allowPending, setAllowPending] = createSignal<boolean>(false)
  let pendingTimer: ReturnType<typeof setTimeout> | undefined
  onCleanup(() => clearTimeout(pendingTimer))
  const [bridgePending, setBridgePending] = createSignal<boolean>(false)
  const nftlAllowance = useNFTLAllowance(INTERCHAIN_TOKEN_SERVICE_ADDRESS)

  const resetForm = () => {
    setAllowPending(false)
    setBridgePending(false)
    setAmountSelected(0)
    setAmountInput('')
    setAmountError('')
    setBridgeAmount(0)
    setIsOpen(false)
  }

  const handleIncreaseAllowance = async () => {
    if (!network.address) return
    const destinationChainId = imx.imxChainId
    const bn = parseEther(bridgeAmount().toString())
    await increaseBridgeAllowance(config, network.address, destinationChainId, bn)
    nftlAllowance.refetch()
    return
  }

  const handleBridgeNFTL = async () => {
    if (!network.address) return null
    const destinationChainId = imx.imxChainId
    let safeBridgeAmount = bridgeAmount() // Ensure precision issues don't occur
    if (bridgeAmount() > props.balance) safeBridgeAmount = props.balance
    const bn = parseEther(safeBridgeAmount.toString())
    const txReceipt = await bridgeNFTL(config, network.address, destinationChainId, bn)
    return txReceipt
  }

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault()
    if (bridgeAmount() === 0) {
      setAmountError('Please enter the amount you like to withdraw.')
      return
    }
    // Handle increase allowance if needed
    if (nftlAllowance.allowance < bridgeAmount()) {
      setAllowPending(true)
      await handleIncreaseAllowance()
      pendingTimer = setTimeout(() => setAllowPending(false), 500)
      return
    }
    // Handle bridge NFTL to Immutable
    setBridgePending(true)
    const txReceipt = await handleBridgeNFTL()
    if (!txReceipt || txReceipt.status === 'reverted') {
      setAmountError('Failed to bridge NFTL. Please try again.')
      setBridgePending(false)
      return
    }
    props.onBridgeSuccess()
    resetForm()
  }

  const openTOSDialog: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    event.preventDefault()
    setOpenTOS(true)
  }

  const handleTOSDialogClose = (
    _event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => {
    if (reason === 'accepted') {
      setIsCheckedTerm(true)
      setAgreementAccepted('ACCEPTED')
    }
    setOpenTOS(false)
  }

  const handleSelectAmount = (value: string | string[] | null) => {
    if (value == null || Array.isArray(value)) return
    const num = Number(value)
    setAmountError('')
    setAmountSelected(num)
    const calculatedAmount = num * (props.balance / 100)
    setAmountInput(formatWithSeparators(calculatedAmount))
    setBridgeAmount(calculatedAmount)
  }

  const handleAmountInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const raw = event.currentTarget.value.replaceAll(',', '')
    if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return
    const numberValue = Number(raw)
    if (Number.isNaN(numberValue) || numberValue < 0 || numberValue > Number(props.balance)) {
      return
    }
    setAmountError('')
    const selected = amountSelected()
    if (selected !== 0) {
      if (
        (selected === 25 && numberValue / props.balance !== 0.25) ||
        (selected === 50 && numberValue / props.balance !== 0.5) ||
        (selected === 75 && numberValue / props.balance !== 0.75) ||
        (selected === 100 && numberValue !== props.balance)
      ) {
        setAmountSelected(0)
      }
    }
    setAmountInput(event.currentTarget.value)
    setBridgeAmount(numberValue)
  }

  return (
    <form onSubmit={onSubmit}>
      <div class="flex flex-col items-center gap-4">
        <Title level={4} class="opacity-70">
          Powered by:{'  '}
          <NativeImage src="/icons/axelar.svg" alt="Axelar" width={126} height={30} />
        </Title>
        <Alert variant="default" class="border-blue/40 bg-blue/10 text-blue">
          <strong>Note:</strong> The Axelar bridge minimizes fees but takes 20 minutes to process.{' '}
          <br />
          If you need your funds immediately use the{' '}
          <a href={IMX_SQUID_BRIDGE_URL} target="_blank" rel="noreferrer" class="font-extrabold">
            Squid Bridge
          </a>{' '}
          instead.
        </Alert>
        <Title level={2} class="opacity-70">
          {formatNumberToDisplay(props.balance)} NFTL
          <span class="block text-base">Balance on Ethereum available to bridge</span>
        </Title>
        <Title level={4}>How much would you like to bridge?</Title>
        <ToggleGroup
          size="lg"
          value={String(amountSelected())}
          class="bg-blue"
          onValueChange={handleSelectAmount}
        >
          <For each={AMOUNT_SELECTS}>
            {(amount) => (
              <ToggleGroupItem value={String(amount)} class="sm:px-4 sm:py-1">
                {amount !== 100 ? `${amount}%` : 'ALL'}
              </ToggleGroupItem>
            )}
          </For>
        </ToggleGroup>

        <Title level={4}>OR - Enter Amount Manually</Title>

        <div class="w-full">
          <div class="mx-auto w-4/5">
            <Label>Amount of NFTL</Label>
            <AmountInput
              name="amountInput"
              value={amountInput()}
              inputMode="decimal"
              onInput={handleAmountInput}
            />
          </div>
        </div>
        <div class="flex w-full flex-col items-center">
          <label class="flex items-center justify-center">
            <Checkbox
              checked={isCheckedTerm()}
              onCheckedChange={(checked) => {
                setIsCheckedTerm(checked === true)
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
        <TermsOfServiceDialog open={openTOS()} onClose={handleTOSDialogClose} />
        <Show when={amountError()}>
          <Alert variant="destructive">{amountError()}</Alert>
        </Show>
        <Title level={4} class="w-full text-center">
          Step 1:
        </Title>
        <Button
          size="lg"
          type="submit"
          variant="default"
          class="w-full normal-case"
          disabled={
            !isCheckedTerm() || bridgeAmount() === 0 || nftlAllowance.allowance >= bridgeAmount()
          }
        >
          Increase allowance to allow the bridge to transfer your NFTL
          <Show when={nftlAllowance.loading || allowPending()}>
            <CircularProgress size="sm" />
          </Show>
        </Button>
        <Title level={4} class="w-full text-center">
          Step 2:
        </Title>
        <Button
          size="lg"
          type="submit"
          variant="default"
          class="w-full normal-case"
          disabled={
            !isCheckedTerm() || bridgeAmount() === 0 || nftlAllowance.allowance < bridgeAmount()
          }
        >
          Bridge {bridgeAmount() !== 0 ? formatNumberToDisplay(Number(bridgeAmount())) : ''} NFTL to
          Immutable zkEVM
          <Show when={bridgePending()}>
            <CircularProgress size="sm" />
          </Show>
        </Button>
      </div>
    </form>
  )
}

export default BridgeForm
