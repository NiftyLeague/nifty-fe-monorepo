'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'
import { toast } from 'sonner'

import { DEGEN_CONTRACT } from '@/constants/contracts'
import { TRAIT_INDEXES } from '@/constants/traitIndexes'
import useNetworkContext from '@/hooks/useNetworkContext'
import { GET_DEGEN_DETAIL_URL } from '@/constants/url'
import type { CharacterType, DashboardDegen, GetDegenResponse } from '@/types/degens'
import { errorMsgHandler } from '@/utils/errorHandlers'
import useAuth from '@/hooks/useAuth'

import styles from './index.module.css'

const DialogContentLoading = () => (
  <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
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
  setIsRent?: React.Dispatch<React.SetStateAction<boolean>>
  isClaim?: boolean
  setIsClaim?: React.Dispatch<React.SetStateAction<boolean>>
  isEquip?: boolean
  setIsEquip?: React.Dispatch<React.SetStateAction<boolean>>
  onRent?: (degen: DashboardDegen) => void
  open?: boolean
  onClose?: (
    event: React.MouseEvent<HTMLButtonElement>,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  scroll?: 'body' | 'paper'
  fullScreen?: boolean
  className?: string
  children?: React.ReactNode
}

const DegenDialog = ({
  open,
  degen,
  isRent,
  setIsRent,
  isClaim,
  setIsClaim,
  // onRent,
  isEquip,
  // setIsEquip,
  onClose,
}: DegenDialogProps) => {
  const tokenId = degen?.id || 0
  const fullScreen = useMediaQuery('(max-width:768px)')
  const { readContracts } = useNetworkContext()
  const { authToken } = useAuth()
  const [degenDetail, setDegenDetail] = useState<GetDegenResponse>()
  const [character, setCharacter] = useState<CharacterType>({
    name: null,
    owner: null,
    traitList: [],
  })
  const { name, traitList } = character as unknown as {
    name: string
    owner: string
    traitList: number[]
  }
  const resetDialog = () => {
    setCharacter({ name: null, owner: null, traitList: [] })
  }

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchData = async () => {
      if (!open || !tokenId || !readContracts || !readContracts[DEGEN_CONTRACT] || !authToken) {
        return
      }

      try {
        // Fetch Degen details from API
        const degenDetailPromise = fetch(GET_DEGEN_DETAIL_URL(tokenId), {
          method: 'GET',
          headers: { authorizationToken: authToken },
          signal,
        })

        // Fetch character data from contract
        const contract = readContracts[DEGEN_CONTRACT]
        const characterDataPromise =
          contract &&
          Promise.all([
            contract.getName(tokenId),
            contract.ownerOf(tokenId),
            contract.getCharacterTraits(tokenId),
          ])

        const [degenRes, characterData] = await Promise.all([
          degenDetailPromise,
          characterDataPromise,
        ])

        // Process Degen details
        if (degenRes) {
          if (degenRes.status === 404) {
            throw new Error('Degen not found')
          }
          if (!degenRes.ok) {
            throw new Error('Failed to fetch Degen details')
          }
          const json: GetDegenResponse = await degenRes.json()
          if (!signal.aborted) {
            setDegenDetail(json)
          }
        }

        // Process character data
        if (characterData) {
          const [name, owner, traitList] = characterData
          if (!signal.aborted) {
            setCharacter({ name, owner, traitList })
          }
        }
      } catch (err) {
        if (!signal.aborted) {
          toast.error(errorMsgHandler(err))
        }
      }
    }

    // eslint-disable-next-line no-void
    void fetchData()

    return () => {
      controller.abort()
    }
  }, [tokenId, readContracts, open, authToken])

  const displayName = name || degen?.name || 'No Name DEGEN'
  const traits: { [traitType: string]: number } = traitList.reduce(
    (acc, trait, i) => ({ ...acc, [TRAIT_INDEXES[i] as string]: trait }),
    {}
  )

  const handleClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(event as React.MouseEvent<HTMLButtonElement>, 'backdropClick')
    setIsClaim?.(false)
    setIsRent?.(false)
    resetDialog()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          styles.customDialog,
          isRent && styles.customDialogRent,
          isEquip && styles.customDialogEquip,
          isClaim
            ? 'max-w-fit md:max-w-fit lg:max-w-fit'
            : isRent
              ? 'max-w-[444px] md:max-w-[444px] lg:max-w-[444px]'
              : 'max-w-[900px] md:max-w-[900px] lg:max-w-[900px]',
          fullScreen &&
            'top-0 left-0 h-screen w-screen max-h-screen max-w-none translate-x-0 translate-y-0 rounded-none'
        )}
      >
        {isClaim && <ClaimDegenContentDialog degen={degen} onClose={handleClose} />}
        {isEquip && <EquipDegenContentDialog degen={degen} name={name} />}
        {isRent && <RentDegenContentDialog degen={degen} onClose={handleClose} />}
        {!isRent && !isClaim && !isEquip && (setIsRent || setIsClaim) && (
          <ViewTraitsContentDialog
            degen={degen}
            degenDetail={degenDetail}
            traits={traits}
            displayName={displayName}
            onRent={setIsRent ? () => setIsRent(true) : undefined}
            onClaim={setIsClaim ? () => setIsClaim(true) : undefined}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DegenDialog
