'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'
import NativeImage from '@nl/ui/custom/native-image'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import styles from './index.module.css'

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null
type ModalType = Exclude<ActiveModal, 'unity' | null>
type ModalComponent = ComponentType<{ open?: boolean }>

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
}: {
  action: ModalAction
  open: boolean
  onRequest: () => void
}) {
  const { Component: Modal, hasError, retry } = useDeferredComponent(action.load, open)

  if (Modal) return <Modal open={open} />

  const isLoading = open && !hasError
  const label = hasError ? `Retry ${action.label}` : action.label

  return (
    <Button
      type="button"
      aria-busy={isLoading}
      aria-label={label}
      onClick={() => {
        onRequest()
        if (hasError) retry()
      }}
    >
      <NativeImage src={action.image} alt={action.alt} width={22} height={22} />
      {action.label}
    </Button>
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
          />
        )
      })}
    </div>
  )
}

export default ActionButtonsGroup
