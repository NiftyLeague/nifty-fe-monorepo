'use client'

import { For, Show, createSignal, onMount, type Component } from 'solid-js'

import { buttonVariants } from '@nl/ui/base/button-variants'
import NativeImage from '@nl/ui/custom/native-image'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import styles from './index.module.css'

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null
type ModalType = Exclude<ActiveModal, 'unity' | null>
// The dialogs are controlled by this group: `open` plus `onOpenChange` is what
// makes Escape / overlay / close-button closes actually reach them.
type ModalComponent = Component<{
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

function DeferredModalAction(props: {
  action: ModalAction
  open: boolean
  onRequest: () => void
  setOpen: (open: boolean) => void
}) {
  const {
    Component: Modal,
    hasError,
    retry,
  } = useDeferredComponent(props.action.load, () => props.open)

  return (
    <Show
      when={Modal()}
      fallback={
        <button
          type="button"
          data-slot="button"
          class={buttonVariants()}
          aria-busy={props.open && !hasError()}
          aria-label={hasError() ? `Retry ${props.action.label}` : props.action.label}
          onClick={() => {
            props.onRequest()
            if (hasError()) retry()
          }}
        >
          <NativeImage src={props.action.image} alt={props.action.alt} width={22} height={22} />
          {props.action.label}
        </button>
      }
    >
      {(DeferredModal) => {
        const ModalComponent = DeferredModal()
        return (
          <ModalComponent
            open={props.open}
            // The dialogs are controlled; close requests (Escape, overlay click,
            // close button) must clear the group's requested modal or the dialog
            // can never close.
            onOpenChange={props.setOpen}
          />
        )
      }}
    </Show>
  )
}

const ActionButtonsGroup = () => {
  const [requestedModal, setRequestedModal] = createSignal<ModalType | null>(null)

  onMount(() => {
    // The home page is prerendered, so the referral deep link can only be read
    // here: an arriving ?referral link opens the Play dialog directly.
    if (new URLSearchParams(window.location.search).has('referral')) {
      setRequestedModal('play')
    }
  })

  return (
    <div class={styles.heroBtnGroup}>
      <For each={Object.keys(modalActions) as ModalType[]}>
        {(type) => {
          const action = modalActions[type]
          return (
            <DeferredModalAction
              action={action}
              open={requestedModal() === type}
              onRequest={() => setRequestedModal(type)}
              setOpen={(next) => setRequestedModal(next ? type : null)}
            />
          )
        }}
      </For>
    </div>
  )
}

export default ActionButtonsGroup
