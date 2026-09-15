'use client'

import { createSignal, Show, type JSX } from 'solid-js'
import { parseEther } from 'ethers'
import { AlertCircle } from 'lucide-solid'
import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'
import { DialogContent } from '@nl/ui/base/dialog'
import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import { Title } from '@nl/ui/custom/typography'
import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import useNetworkContext from '@/hooks/useNetworkContext'
import useNFTLAllowance from '@/hooks/useNFTLAllowance'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import { getErrorForName } from '@/utils/name'
import { submitTxWithGasEstimate } from '@/utils/bnc-notify'
import { getDeployedContract, NFTL_CONTRACT, DEGEN_CONTRACT } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import { DEBUG } from '@/constants/index'
import type { DashboardDegen } from '@/types/degens'
import RenameStepper from './RenameStepper'

const { address: DEGEN_CONTRACT_ADDRESS } = getDeployedContract(
  TARGET_NETWORK.chainId,
  DEGEN_CONTRACT
) as {
  address: `0x${string}`
}

interface Props {
  degen?: DashboardDegen
  onSuccess?: () => void
}

const RenameDegenDialogContent = (props: Props): JSX.Element => {
  const network = useNetworkContext()
  const tokens = useTokensBalances()
  const [input, setInput] = createSignal('')
  const [error, setError] = createSignal('')
  const nftlAllowance = useNFTLAllowance(DEGEN_CONTRACT_ADDRESS)
  const [isLoadingRename, setLoadingRename] = createSignal(false)
  const [renameSuccess, setRenameSuccess] = createSignal(false)
  const insufficientAllowance = () => nftlAllowance.allowance < 1000
  const insufficientBalance = () => tokens.tokensBalances.NFTL.eth < 1000

  const validateName = (value: string) => {
    setInput(value)
    const errorMsg = getErrorForName(value)
    setError(errorMsg)
  }

  const handleChange = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    validateName(event.currentTarget.value)
  }

  const handleRename = async () => {
    setLoadingRename(true)
    const writeContracts = network.writeContracts
    if (insufficientBalance()) {
      setError('Failed to charge the rental rename fee')
    } else if (
      !error() &&
      writeContracts &&
      writeContracts[DEGEN_CONTRACT] &&
      writeContracts[NFTL_CONTRACT]
    ) {
      if (DEBUG) console.log('Rename NFT to:', input())
      const degenContract = writeContracts[DEGEN_CONTRACT]
      const nftl = writeContracts[NFTL_CONTRACT]
      if (insufficientAllowance()) {
        if (DEBUG) console.log('Current allowance too low')
        const DEGENAddress = await degenContract.getAddress()
        await network.tx(nftl.increaseAllowance(DEGENAddress, parseEther('100000')))
        nftlAllowance.refetch()
      }
      const args = [parseInt(props.degen?.id || '', 10), input()]
      const result = await submitTxWithGasEstimate(network.tx, degenContract, 'changeName', args)
      if (result) {
        setRenameSuccess(true)
        gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
          virtual_currency_name: 'NFTL',
          value: 1000,
          item_name: 'DEGEN Rename Fee',
        })
        props.onSuccess?.()
      }
    }
    setLoadingRename(false)
  }

  return (
    <DialogContent
      showCloseButton={false}
      class="max-w-[500px] md:max-w-[500px] lg:max-w-[500px]"
    >
      <div class="flex flex-col gap-4">
        <Title level={4} class="text-center">
          Rename DEGEN
        </Title>
        <div class="flex flex-col items-center gap-1">
          <NativeImage
            src={`/img/degens/nfts/${props.degen?.id}.${props.degen?.background === 'Legendary' ? 'gif' : 'webp'}`}
            alt="degen"
            width={240}
            height={240}
            unoptimized={props.degen?.background === 'Legendary'}
            style={{
              'aspect-ratio': '1/1',
              width: '240px',
              margin: '0 auto',
              'object-fit': 'cover',
              display: 'block',
            }}
          />
          <p class="text-center text-xs text-muted-foreground">
            Owned by {props.degen?.owner}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="new-degen-name" class={error() ? 'text-destructive' : undefined}>
            Enter new degen name
          </Label>
          <div class="relative">
            <Input
              id="new-degen-name"
              name="new-degen-name"
              value={input()}
              aria-invalid={!!error()}
              class={error() ? 'pr-10' : undefined}
              disabled={isLoadingRename()}
              onInput={handleChange}
            />
            <Show when={error()}>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
                <AlertCircle aria-hidden="true" size={18} />
              </span>
            </Show>
          </div>
        </div>
        <Show when={error()}>
          <span class="text-xs text-error">{error()}</span>
        </Show>
        <RenameStepper
          insufficientAllowance={insufficientAllowance()}
          renameSuccess={renameSuccess()}
          insufficientBalance={insufficientBalance()}
        />
        <div class="flex justify-between">
          <Title level={4}>Renaming Fee</Title>
          <span>1,000 NFTL</span>
        </div>
        <Button
          variant="default"
          class="w-full"
          disabled={
            !input() || Boolean(error()) || insufficientBalance() || isLoadingRename()
          }
          onClick={() => void handleRename()}
        >
          {!input()
            ? 'Please enter a name above!'
            : insufficientBalance()
              ? 'You need 1,000 NFTL on Ethereum to rename'
              : insufficientAllowance()
                ? 'Approve contract to spend NFTL'
                : 'Rename'}
          <Show when={isLoadingRename()}>
            <CircularProgress size="sm" />
          </Show>
        </Button>
      </div>
    </DialogContent>
  )
}

export default RenameDegenDialogContent
