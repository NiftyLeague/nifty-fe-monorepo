'use client'

import { useCallback, useState } from 'react'
import { parseEther } from 'ethers'
import { AlertCircle } from 'lucide-react'
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
import type { Degen } from '@/types/degens'
import RenameStepper from './RenameStepper'

const { address: DEGEN_CONTRACT_ADDRESS } = getDeployedContract(
  TARGET_NETWORK.chainId,
  DEGEN_CONTRACT
) as {
  address: `0x${string}`
}

interface Props {
  degen?: Degen
  onSuccess?: () => void
}

const RenameDegenDialogContent = ({ degen, onSuccess }: Props): React.ReactNode => {
  const { tx, writeContracts } = useNetworkContext()
  const { tokensBalances } = useTokensBalances()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const { allowance, refetch: refetchAllowance } = useNFTLAllowance(DEGEN_CONTRACT_ADDRESS)
  const [isLoadingRename, setLoadingRename] = useState(false)
  const [renameSuccess, setRenameSuccess] = useState(false)
  const insufficientAllowance = allowance < 1000
  const insufficientBalance = tokensBalances.NFTL.eth < 1000

  const validateName = (value: string) => {
    setInput(value)
    const errorMsg = getErrorForName(value)
    setError(errorMsg)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    validateName(value)
  }

  const handleRename = useCallback(async () => {
    setLoadingRename(true)
    if (insufficientBalance) {
      setError('Failed to charge the rental rename fee')
    } else if (
      !error &&
      writeContracts &&
      writeContracts[DEGEN_CONTRACT] &&
      writeContracts[NFTL_CONTRACT]
    ) {
      // eslint-disable-next-line no-console
      if (DEBUG) console.log('Rename NFT to:', input)
      const degenContract = writeContracts[DEGEN_CONTRACT]
      const nftl = writeContracts[NFTL_CONTRACT]
      if (insufficientAllowance) {
        // eslint-disable-next-line no-console
        if (DEBUG) console.log('Current allowance too low')
        const DEGENAddress = await degenContract.getAddress()
        await tx(nftl.increaseAllowance(DEGENAddress, parseEther('100000')))
        refetchAllowance()
      }
      const args = [parseInt(degen?.id || '', 10), input]
      const result = await submitTxWithGasEstimate(tx, degenContract, 'changeName', args)
      if (result) {
        setRenameSuccess(true)
        gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
          virtual_currency_name: 'NFTL',
          value: 1000,
          item_name: 'DEGEN Rename Fee',
        })
        onSuccess?.()
      }
    }
    setLoadingRename(false)
  }, [
    degen,
    error,
    input,
    insufficientAllowance,
    insufficientBalance,
    onSuccess,
    refetchAllowance,
    tx,
    writeContracts,
  ])

  return (
    <DialogContent
      showCloseButton={false}
      className="max-w-[500px] md:max-w-[500px] lg:max-w-[500px]"
    >
      <div className="flex flex-col gap-4">
        <Title level={4} className="text-center">
          Rename DEGEN
        </Title>
        <div className="flex flex-col items-center gap-1">
          <NativeImage
            src={`/img/degens/nfts/${degen?.id}.${degen?.background === 'Legendary' ? 'gif' : 'webp'}`}
            alt="degen"
            width={240}
            height={240}
            unoptimized={degen?.background === 'Legendary'}
            style={{
              aspectRatio: '1/1',
              width: '240px',
              margin: '0 auto',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <p className="text-center text-xs text-muted-foreground">Owned by {degen?.owner}</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-degen-name" className={error ? 'text-destructive' : undefined}>
            Enter new degen name
          </Label>
          <div className="relative">
            <Input
              id="new-degen-name"
              name="new-degen-name"
              value={input}
              aria-invalid={!!error}
              className={error ? 'pr-10' : undefined}
              disabled={isLoadingRename}
              onChange={handleChange}
            />
            {error && (
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
                <AlertCircle aria-hidden="true" size={18} />
              </span>
            )}
          </div>
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
        <RenameStepper
          insufficientAllowance={insufficientAllowance}
          renameSuccess={renameSuccess}
          insufficientBalance={insufficientBalance}
        />
        <div className="flex justify-between">
          <Title level={4}>Renaming Fee</Title>
          <span>1,000 NFTL</span>
        </div>
        <Button
          variant="default"
          className="w-full"
          disabled={!input || Boolean(error) || insufficientBalance || isLoadingRename}
          onClick={handleRename}
        >
          {!input
            ? 'Please enter a name above!'
            : insufficientBalance
              ? 'You need 1,000 NFTL on Ethereum to rename'
              : insufficientAllowance
                ? 'Approve contract to spend NFTL'
                : 'Rename'}
          {isLoadingRename && <CircularProgress size="sm" />}
        </Button>
      </div>
    </DialogContent>
  )
}

export default RenameDegenDialogContent
