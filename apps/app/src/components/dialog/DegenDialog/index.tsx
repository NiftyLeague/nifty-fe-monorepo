import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js'
import dynamic from '@/runtime/dynamic'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'
import { toast } from 'solid-sonner'

import { DEGEN_CONTRACT } from '@/constants/contracts'
import { TRAIT_INDEXES } from '@/constants/traitIndexes'
import useNetworkContext from '@/hooks/useNetworkContext'
import type { CharacterType, DashboardDegen } from '@/types/degens'
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
  const tokenId = () => props.degen?.id || 0
  const fullScreen = useMediaQuery('(max-width:768px)')
  const network = useNetworkContext()
  const [character, setCharacter] = createSignal<CharacterType>({
    name: null,
    owner: null,
    traitList: [],
  })
  const name = () => character().name
  const traitList = () => character().traitList
  const resetDialog = () => {
    setCharacter({ name: null, owner: null, traitList: [] })
  }

  createEffect(() => {
    const open = props.open
    const id = tokenId()
    const readContracts = network.readContracts
    if (!open || !id || !readContracts || !readContracts[DEGEN_CONTRACT]) {
      return
    }

    let cancelled = false

    const fetchData = async () => {
      try {
        // Fetch character data from contract
        const contract = readContracts[DEGEN_CONTRACT]
        const characterDataPromise =
          contract &&
          Promise.all([contract.getName(id), contract.ownerOf(id), contract.getCharacterTraits(id)])

        const characterData = await characterDataPromise

        // Process character data
        if (characterData) {
          const [characterName, owner, rawTraits] = characterData
          if (!cancelled) {
            setCharacter({
              name: characterName,
              owner,
              traitList: normalizeCharacterTraits(rawTraits),
            })
          }
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(errorMsgHandler(err))
        }
      }
    }

    void fetchData()

    onCleanup(() => {
      cancelled = true
    })
  })

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
    resetDialog()
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
