import { createMemo, createSignal, For, Show } from 'solid-js'
import { onMount } from 'solid-js'
import { X } from 'lucide-solid'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import { Button } from '@nl/ui/base/button'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import { useOpenSnackbar } from '@/contexts/NotificationContext'
import { COMICS_PURCHASE_URL } from '@/constants/url'
import type { DashboardDegen } from '@/types/degens'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import EmptyState from '@/components/EmptyState'
import { areValuesEqual } from '@/utils/value-equality'

import {
  getInventoryAnalyticsEventName,
  getSlotAnalyticsEventName,
  INVENTORIES,
  SLOTS,
} from './equips'

import styles from './index.module.css'

interface EquipDegenContentDialogProps {
  degen?: DashboardDegen
  name?: string
}

// Hardcoded multipliers by INVENTORIES order
// Should be given from BE later
// each multiplier will be larger than 2
const multipliers: number[] = [2, 3, 2, 3, 4, 2]

// Hardcoded DEGEN equipped status by INVENTORIES order
// Should be given from BE later
const initEquipped: boolean[] = Array.from({ length: 6 }, () => false)

const EquipDegenContentDialog = (props: EquipDegenContentDialogProps) => {
  const openSnackbar = useOpenSnackbar()
  const nfts = useNFTsBalances()
  const filteredComics = () =>
    nfts.comicsBalances.filter((comic) => comic.balance && comic.balance > 0)
  const [animationType, setAnimationType] = createSignal<string>('pose')
  const [equipped, setEquipped] = createSignal<boolean[]>(initEquipped)
  const [pendingEquipped, setPendingEquipped] = createSignal<boolean[]>(initEquipped)
  const { animTypeActiveButton, animTypeButton, label, tag, title } = styles

  onMount(() => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_CLICKED)
  })

  const handleEquip = (index: number) => {
    const item = INVENTORIES[index]
    if (item) {
      const newEquipped = [...pendingEquipped()]
      // If bat, unequip existing bat.
      if (index >= 3) {
        for (let i = 3; i < 6; i++) {
          newEquipped[i] = false
        }
      }
      newEquipped[index] = true
      setPendingEquipped(newEquipped)
      const eventName = getInventoryAnalyticsEventName(item.name)
      if (eventName) {
        gtm.sendEvent(eventName)
      }
    }
  }

  const handleUnequip = (index: number) => {
    const slot = SLOTS[index]
    if (slot) {
      const newEquipped = [...pendingEquipped()]
      if (index >= 3) {
        for (let i = 3; i < 6; i++) {
          newEquipped[i] = false
        }
      } else {
        newEquipped[index] = false
      }
      setPendingEquipped(newEquipped)
      const eventName = getSlotAnalyticsEventName(slot.name)
      if (eventName) {
        gtm.sendEvent(eventName)
      }
    }
  }

  const stateChanged = () => !areValuesEqual(equipped(), pendingEquipped())

  const handleSave = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_STARTED)
    // Should call proper api here
    setEquipped(pendingEquipped())
    openSnackbar({
      open: true,
      message: 'Settings saved successfuly...',
      variant: 'alert',
      alert: { color: 'success' },
      close: false,
    })
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_SUCCESS)
  }

  const getSlotImage = (index: number) => {
    const slot = SLOTS[index]
    if (slot) {
      if (index < 3) {
        return pendingEquipped()[index] ? slot.filled : slot.empty
      }
      const slicedArr = pendingEquipped().slice(3)
      const equippedBatIndex = slicedArr.findIndex((item) => !!item)
      const filledArr = slot.filledArr
      if (equippedBatIndex >= 0 && filledArr) {
        return filledArr[equippedBatIndex]
      } else {
        return slot.empty
      }
    }
  }

  const isEquippedSlot = (index: number) => {
    if (index < 3) {
      return pendingEquipped()[index]
    }
    const slicedArr = pendingEquipped().slice(3)
    const equippedBatIndex = slicedArr.findIndex((item) => !!item)
    return equippedBatIndex >= 0
  }

  const totalMultiplierApplied = createMemo(() => {
    let totalMultipliers = 0
    pendingEquipped().forEach((status, index) => {
      if (status) totalMultipliers += multipliers[index] ?? 0
    })
    if (totalMultipliers > 0) {
      return `${totalMultipliers}X Earnings Multiplier`
    }
    return 'No Multiplier Applied'
  })

  const handleSetPose = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_POSE_CLICKED)
    setAnimationType('pose')
  }

  const handleSetRotate = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_ROTATE_CLICKED)
    setAnimationType('rotate')
  }

  return (
    <Show
      when={filteredComics().length > 0}
      fallback={
        <Show
          when={!nfts.loadingComics}
          fallback={
            <div class="flex flex-row items-center justify-center h-50 mx-auto">
              <CircularProgress size="xl" />
            </div>
          }
        >
          <div class="flex flex-wrap items-center justify-center h-50">
            <a href={COMICS_PURCHASE_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="You don't own any Comics yet."
                buttonText="Buy a Comic"
                noBorder
              />
            </a>
          </div>
        </Show>
      }
    >
      <div class="flex flex-col py-2 max-w-82.5 mx-auto gap-2">
        <div class="flex flex-row items-center justify-center p-2.5 mx-2.5 bg-(--panel)">
          <Title level={5} class={title}>
            {props.name || `DEGEN #${props.degen?.id}`}
          </Title>
        </div>
        <div class="flex flex-row mt-4.5">
          <div class="flex flex-col items-center">
            <span class={cn(label, 'text-base mb-4')}>SLOTS</span>
            <div class="flex flex-col gap-6">
              <For each={SLOTS}>
                {(slot, index) => (
                  <div class="relative w-10 h-10">
                    {getSlotImage(index())}
                    <Show when={isEquippedSlot(index())}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Unequip ${slot.name}`}
                        class={cn(
                          tag,
                          'flex h-3 w-3 items-center justify-center border-0 p-0 cursor-pointer'
                        )}
                        onClick={() => handleUnequip(index())}
                      >
                        <X aria-hidden="true" size={12} stroke-width={1.5} class="cursor-pointer" />
                      </Button>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div class="flex flex-col mt-5.5 ml-7.5 mr-3">
            <Show when={props.degen?.id}>
              {(id) => <DegenImage class="w-45.75 h-61 rounded-lg" tokenId={id()} />}
            </Show>
            <div class="flex flex-row mt-2.5 gap-3">
              <Button
                variant="default"
                class={cn(
                  'w-full',
                  animationType() === 'pose' ? animTypeActiveButton : animTypeButton
                )}
                onClick={handleSetPose}
              >
                POSE
              </Button>
              <Button
                variant="default"
                class={cn(
                  'w-full',
                  animationType() === 'rotate' ? animTypeActiveButton : animTypeButton
                )}
                onClick={handleSetRotate}
              >
                ROTATE
              </Button>
            </div>
            <span class={cn(label, 'text-base mx-auto font-bold my-4.5')}>
              {totalMultiplierApplied()}
            </span>
            <Button
              variant="default"
              disabled={!stateChanged()}
              class="mx-auto w-29"
              onClick={handleSave}
            >
              SAVE
            </Button>
          </div>
          <div class="flex flex-col items-center">
            <span class={cn(label, 'text-base mb-4 text-center')}>INVENTORY</span>
            <div class="flex flex-col gap-2.5">
              <For each={INVENTORIES}>
                {(inventory, index) => (
                  <div
                    onClick={() => handleEquip(index())}
                    class={`relative w-7.5 h-7.5 ${pendingEquipped()[index()] ? '' : 'cursor-pointer'}`}
                  >
                    {pendingEquipped()[index()] ? inventory.empty : inventory.filled}
                    <Show when={!pendingEquipped()[index()] && (multipliers[index()] ?? 0) >= 2}>
                      <div
                        class={cn(tag, 'flex items-center justify-center')}
                      >{`${multipliers[index()]}x`}</div>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default EquipDegenContentDialog
