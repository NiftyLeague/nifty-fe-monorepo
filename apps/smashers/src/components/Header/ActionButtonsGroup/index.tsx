'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'

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

const ActionButtonsGroup = ({ activeModal }: { activeModal: ActiveModal }) => {
  const [requestedModal, setRequestedModal] = useState<ModalType | null>(
    activeModal && activeModal !== 'unity' ? activeModal : null
  )
  const [loadedModals, setLoadedModals] = useState<Partial<Record<ModalType, ModalComponent>>>({})
  const [loadingModal, setLoadingModal] = useState<ModalType | null>(null)
  const [failedModal, setFailedModal] = useState<ModalType | null>(null)

  const loadModal = useCallback(
    (type: ModalType) => {
      setRequestedModal(type)
      setFailedModal(null)

      if (loadedModals[type] || loadingModal === type) return

      setLoadingModal(type)
      void modalActions[type]
        .load()
        .then(({ default: LoadedModal }) => {
          setLoadedModals((previous) => ({ ...previous, [type]: LoadedModal }))
          setLoadingModal((current) => (current === type ? null : current))
        })
        .catch(() => {
          setFailedModal(type)
          setLoadingModal((current) => (current === type ? null : current))
        })
    },
    [loadedModals, loadingModal]
  )

  useEffect(() => {
    if (activeModal && activeModal !== 'unity') loadModal(activeModal)
  }, [activeModal, loadModal])

  return (
    <div className={styles.heroBtnGroup}>
      {(Object.keys(modalActions) as ModalType[]).map((type) => {
        const action = modalActions[type]
        const Modal = loadedModals[type]

        if (Modal) return <Modal key={type} open={requestedModal === type} />

        const isLoading = loadingModal === type
        const label = failedModal === type ? `Retry ${action.label}` : action.label

        return (
          <Button
            key={type}
            type="button"
            aria-busy={isLoading}
            aria-label={label}
            onClick={() => loadModal(type)}
          >
            <Image src={action.image} alt={action.alt} width={22} height={22} />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

export default ActionButtonsGroup
