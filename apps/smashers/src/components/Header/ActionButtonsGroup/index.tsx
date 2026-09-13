'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { buttonVariants } from '@nl/ui/base/button-variants'
import NativeImage from '@nl/ui/custom/native-image'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import styles from './index.module.css'

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null
type ModalType = Exclude<ActiveModal, 'unity' | null>
// The dialogs are controlled by this group: `open` plus `onOpenChange` is what
// makes Escape / overlay / close-button closes actually reach them.
type ModalComponent = ComponentType<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

interface ModalAction {
  alt: string
  image: string
  label: string
  load: () => Promise<{ default: ModalComponent }>
}

const modalActions: Record<ModalType, ModalAction> = {
  play: {
    alt: 'Game Icon',
    image: '/icons/controller.svg',
    label: 'Play',
    load: () => import('@/components/PlayDialog'),
  },
  trailer: {
    alt: 'YouTube Logo',
    image: '/icons/socials/youtube.svg',
    label: 'Trailer',
    load: () => import('@/components/TrailerDialog'),
  },
  credits: {
    alt: 'Credits Icon',
    image: '/icons/credits.svg',
    label: 'Credits',
    load: () => import('@/components/CreditsDialog'),
  },
}

function DeferredModalAction({
  action,
  open,
  onRequest,
  setOpen,
}: {
  action: ModalAction
  open: boolean
  onRequest: () => void
  setOpen: (open: boolean) => void
}) {
  const { Component: Modal, hasError, retry } = useDeferredComponent(action.load, open)

  if (Modal)
    return (
      <Modal
        open={open}
        // The dialogs are controlled; close requests (Escape, overlay click,
        // close button) must clear the group's requested modal or the dialog
        // can never close (M5.6 audit #1883).
        onOpenChange={setOpen}
      />
    )

  const isLoading = open && !hasError
  const label = hasError ? `Retry ${action.label}` : action.label

  return (
    <button
      type="button"
      data-slot="button"
      className={buttonVariants()}
      aria-busy={isLoading}
      aria-label={label}
      onClick={() => {
        onRequest()
        if (hasError) retry()
      }}
    >
      <NativeImage src={action.image} alt={action.alt} width={22} height={22} />
      {action.label}
    </button>
  )
}

const ActionButtonsGroup = ({ activeModal }: { activeModal: ActiveModal }) => {
  const [requestedModal, setRequestedModal] = useState<ModalType | null>(
    activeModal && activeModal !== 'unity' ? activeModal : null
  )

  useEffect(() => {
    if (activeModal && activeModal !== 'unity') setRequestedModal(activeModal)
  }, [activeModal])

  return (
    <div className={styles.heroBtnGroup}>
      {(Object.keys(modalActions) as ModalType[]).map((type) => {
        const action = modalActions[type]
        return (
          <DeferredModalAction
            key={type}
            action={action}
            open={requestedModal === type}
            onRequest={() => setRequestedModal(type)}
            setOpen={(next) => setRequestedModal(next ? type : null)}
          />
        )
      })}
    </div>
  )
}

export default ActionButtonsGroup
