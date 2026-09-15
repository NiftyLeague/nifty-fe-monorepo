'use client'

import { createEffect, createMemo, createSignal } from 'solid-js'
import { X } from 'lucide-react'

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

const EquipDegenContentDialog = ({ degen, name }: EquipDegenContentDialogProps) => {
  const openSnackbar = useOpenSnackbar()
  const { comicsBalances, loadingComics } = useNFTsBalances()
  const filteredComics = createMemo(
    () => comicsBalances.filter((comic) => comic.balance && comic.balance > 0),
    [comicsBalances]
  )
  const [animationType, setAnimationType] = createSignal<string>('pose')
  const [equipped, setEquipped] = createSignal<boolean[]>(initEquipped)
  const [pendingEquipped, setPendingEquipped] = createSignal<boolean[]>(initEquipped)
  const { animTypeActiveButton, animTypeButton, label, tag, title } = styles

  createEffect(() => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_CLICKED)
  }, [])

  const handleEquip = (
    (index: number) => {
      const item = INVENTORIES[index]
      if (item) {
        const newEquipped = [...pendingEquipped]
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
    },
    [pendingEquipped]
  )

  const handleUnequip = (
    (index: number) => {
      const slot = SLOTS[index]
      if (slot) {
        const newEquipped = [...pendingEquipped]
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
    },
    [pendingEquipped]
  )

  const stateChanged = createMemo(
    () => !areValuesEqual(equipped, pendingEquipped),
    [equipped, pendingEquipped]
  )

  const handleSave = (() => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_STARTED)
    // Should call proper api here
    setEquipped(pendingEquipped)
    openSnackbar({
      open: true,
      message: 'Settings saved successfuly...',
      variant: 'alert',
      alert: { color: 'success' },
      close: false,
    })
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_SUCCESS)
  }, [openSnackbar, pendingEquipped])

  const getSlotImage = (
    (index: number) => {
      const slot = SLOTS[index]
      if (slot) {
        if (index < 3) {
          return pendingEquipped[index] ? slot.filled : slot.empty
        }
        const slicedArr = pendingEquipped.slice(3)
        const equippedBatIndex = slicedArr.findIndex((item) => !!item)
        const filledArr = slot.filledArr
        if (equippedBatIndex >= 0 && filledArr) {
          return filledArr[equippedBatIndex]
        } else {
          return slot.empty
        }
      }
    },
    [pendingEquipped]
  )

  const isEquippedSlot = (
    (index: number) => {
      if (index < 3) {
        return pendingEquipped[index]
      }
      const slicedArr = pendingEquipped.slice(3)
      const equippedBatIndex = slicedArr.findIndex((item) => !!item)
      return equippedBatIndex >= 0
    },
    [pendingEquipped]
  )

  const totalMultiplierApplied = createMemo(() => {
    let totalMultipliers = 0
    pendingEquipped.forEach((status, index) => {
      if (status) totalMultipliers += multipliers[index] ?? 0
    })
    if (totalMultipliers > 0) {
      return `${totalMultipliers}X Earnings Multiplier`
    }
    return 'No Multiplier Applied'
  }, [pendingEquipped])

  const handleSetPose = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_POSE_CLICKED)
    setAnimationType('pose')
  }

  const handleSetRotate = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_ROTATE_CLICKED)
    setAnimationType('rotate')
  }

  if (filteredComics.length === 0) {
    if (loadingComics) {
      return (
        <div class="flex flex-row items-center justify-center h-[200px] mx-auto">
          <CircularProgress size="xl" />
        </div>
      )
    }
    return (
      <div class="flex flex-wrap items-center justify-center h-[200px]">
        <a href={COMICS_PURCHASE_URL} target="_blank" rel="noreferrer">
          <EmptyState message="You don't own any Comics yet." buttonText="Buy a Comic" noBorder />
        </a>
      </div>
    )
  }

  return (
    <div class="flex flex-col py-2 max-w-[330px] mx-auto gap-2">
      <div
        class="flex flex-row items-center justify-center p-2.5 mx-2.5"
        style={{ 'background-color': '#262930' }}
      >
        <Title level={5} class={title}>
          {name || `DEGEN #${degen?.id}`}
        </Title>
      </div>
      <div class="flex flex-row mt-[18px]">
        <div class="flex flex-col items-center">
          <span class={cn(label, 'text-base mb-4')}>SLOTS</span>
          <div class="flex flex-col gap-6">
            {SLOTS.map((slot, index) => (
              <div class="relative" style={{ width: 40, height: 40 }}>
                {getSlotImage(index)}
                {isEquippedSlot(index) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Unequip ${slot.name}`}
                    class={cn(
                      tag,
                      'flex h-3 w-3 items-center justify-center border-0 p-0 cursor-pointer'
                    )}
                    onClick={() => handleUnequip(index)}
                  >
                    <X
                      aria-hidden="true"
                      absoluteStrokeWidth
                      size={12}
                      stroke-width={1.5}
                      class="cursor-pointer"
                    />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div class="flex flex-col mt-[22px] ml-[30px] mr-[12px]">
          {degen?.id && (
            <DegenImage
              sx={{ 'object-fit': 'cover', width: 183, height: 244, 'border-radius': '10px' }}
              tokenId={degen.id}
            />
          )}
          <div class="flex flex-row mt-[10px] gap-[12px]">
            <Button
              variant="default"
              class={cn(
                'w-full',
                animationType === 'pose' ? animTypeActiveButton : animTypeButton
              )}
              onClick={handleSetPose}
            >
              POSE
            </Button>
            <Button
              variant="default"
              class={cn(
                'w-full',
                animationType === 'rotate' ? animTypeActiveButton : animTypeButton
              )}
              onClick={handleSetRotate}
            >
              ROTATE
            </Button>
          </div>
          <span
            class={cn(label, 'text-base mx-auto font-bold')}
            style={{ 'margin-top': 18, 'margin-bottom': 18 }}
          >
            {totalMultiplierApplied}
          </span>
          <Button
            variant="default"
            disabled={!stateChanged}
            class="mx-auto w-[116px]"
            onClick={handleSave}
          >
            SAVE
          </Button>
        </div>
        <div class="flex flex-col items-center">
          <span class={cn(label, 'text-base mb-4 text-center')}>INVENTORY</span>
          <div class="flex flex-col gap-[10px]">
            {INVENTORIES.map((inventory, index) => (
              <div                
                onClick={() => handleEquip(index)}
                class="relative"
                style={{
                  width: 30,
                  height: 30,
                  cursor: pendingEquipped[index] ? 'inherit' : 'pointer',
                }}
              >
                {pendingEquipped[index] ? inventory.empty : inventory.filled}
                {!pendingEquipped[index] && (multipliers[index] ?? 0) >= 2 && (
                  <div
                    class={cn(tag, 'flex items-center justify-center')}
                    style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'center' }}
                  >{`${multipliers[index]}x`}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipDegenContentDialog
