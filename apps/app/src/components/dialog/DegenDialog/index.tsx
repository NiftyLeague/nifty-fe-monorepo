import { createEffect, Show, type JSX } from 'solid-js'
import { useQuery } from '@tanstack/solid-query'
import { readContract } from '@wagmi/core'
import type { Abi } from 'viem'
import dynamic from '@/runtime/dynamic'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'
import { toast } from 'solid-sonner'

import { DEGEN_CONTRACT, getContractABI, getContractAddress } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import { TRAIT_INDEXES } from '@/constants/traitIndexes'
import { useWagmiConfig } from '@/runtime/wagmi'
import type { DashboardDegen } from '@/types/degens'
import { errorMsgHandler } from '@/utils/errorHandlers'
import { normalizeCharacterTraits } from '@/utils/character-traits'

import styles from './index.module.css'

const DialogContentLoading = () => (
  <div class="sr-only" role="status" aria-live="polite" aria-busy="true">
    Loading degen dialog content
  </div>
)

const ClaimDegenContentDialog = dynamic(() => import('./ClaimDegenContentDialog'), {
  ssr: false,
  loading: DialogContentLoading,
})
const EquipDegenContentDialog = dynamic(() => import('./EquipDegenContentDialog'), {
  ssr: false,
  loading: DialogContentLoading,
})
const RentDegenContentDialog = dynamic(() => import('./RentDegenContentDialog'), {
  ssr: false,
  loading: DialogContentLoading,
})
const ViewTraitsContentDialog = dynamic(() => import('./ViewTraitsContentDialog'), {
  ssr: false,
  loading: DialogContentLoading,
})

export interface DegenDialogProps {
  degen?: DashboardDegen
  isRent?: boolean
  setIsRent?: (v: boolean) => void
  isClaim?: boolean
  setIsClaim?: (v: boolean) => void
  isEquip?: boolean
  setIsEquip?: (v: boolean) => void
  onRent?: (degen: DashboardDegen) => void
  open?: boolean
  onClose?: (reason?: 'backdropClick' | 'escapeKeyDown') => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  scroll?: 'body' | 'paper'
  fullScreen?: boolean
  className?: string
  children?: JSX.Element
}

const DegenDialog = (props: DegenDialogProps) => {
  const tokenId = () => Number(props.degen?.id ?? 0)
  const fullScreen = useMediaQuery('(max-width:768px)')
  const degenAddress = getContractAddress(TARGET_NETWORK.chainId, DEGEN_CONTRACT) as `0x${string}`
  const degenAbi = getContractABI(TARGET_NETWORK.chainId, DEGEN_CONTRACT) as Abi

  // One cached query per (chain, token id): reopening the same degen resolves
  // from the shared cache instead of re-firing the three contract reads, and
  // the query's lifecycle replaces the hand-rolled cancellation flag.
  const characterQuery = useQuery(() => ({
    queryKey: ['degen-character', TARGET_NETWORK.chainId, degenAddress, tokenId()],
    queryFn: async () => {
      // Resolved at fetch time: the wallet chunk registers the config by the
      // time an open dialog can fetch.
      const config = useWagmiConfig()
      const id = BigInt(tokenId())
      const [name, owner, rawTraits] = await Promise.all([
        readContract(config, {
          address: degenAddress,
          abi: degenAbi,
          functionName: 'getName',
          args: [id],
        }),
        readContract(config, {
          address: degenAddress,
          abi: degenAbi,
          functionName: 'ownerOf',
          args: [id],
        }),
        readContract(config, {
          address: degenAddress,
          abi: degenAbi,
          functionName: 'getCharacterTraits',
          args: [id],
        }),
      ])
      return {
        name: (name ?? null) as string | null,
        owner: owner as string,
        traitList: normalizeCharacterTraits(rawTraits),
      }
    },
    enabled: props.open === true && tokenId() > 0,
    staleTime: 60_000,
    retry: false,
  }))

  createEffect(() => {
    const error = characterQuery.error
    if (error) toast.error(errorMsgHandler(error))
  })

  const name = () => characterQuery.data?.name ?? null
  const traitList = () => characterQuery.data?.traitList ?? []

  const displayName = () => name() || props.degen?.name || 'No Name DEGEN'
  const traits = () =>
    traitList().length
      ? traitList().reduce<Record<string, bigint>>((acc, trait, index) => {
          const traitType = TRAIT_INDEXES[index]
          if (traitType) acc[traitType] = trait
          return acc
        }, {})
      : (props.degen?.traits_string ?? '')

  const handleClose = () => {
    props.onClose?.('backdropClick')
    props.setIsClaim?.(false)
    props.setIsRent?.(false)
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        class={cn(
          styles.customDialog,
          props.isRent && styles.customDialogRent,
          props.isEquip && styles.customDialogEquip,
          props.isClaim ? '!max-w-fit' : props.isRent ? '!max-w-111' : '!max-w-225',
          fullScreen() &&
            'top-0 left-0 h-screen w-screen max-h-screen !max-w-none translate-x-0 translate-y-0 rounded-none'
        )}
      >
        <Show when={props.isClaim}>
          <ClaimDegenContentDialog degen={props.degen} onClose={handleClose} />
        </Show>
        <Show when={props.isEquip}>
          <EquipDegenContentDialog degen={props.degen} name={name() ?? undefined} />
        </Show>
        <Show when={props.isRent}>
          <RentDegenContentDialog degen={props.degen} onClose={handleClose} />
        </Show>
        <Show
          when={
            !props.isRent &&
            !props.isClaim &&
            !props.isEquip &&
            (props.setIsRent || props.setIsClaim)
          }
        >
          <ViewTraitsContentDialog
            degen={props.degen}
            traits={traits()}
            displayName={displayName()}
            onClose={handleClose}
          />
        </Show>
      </DialogContent>
    </Dialog>
  )
}

export default DegenDialog
