'use client'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import { toast } from 'sonner'
import { isAddress } from 'ethers'
import { AlertCircle, Info, X } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { RadioGroup, RadioGroupItem } from '@nl/ui/base/radio-group'
import { Tooltip, TooltipTrigger, TooltipContent } from '@nl/ui/base/tooltip'
import { Input } from '@nl/ui/base/input'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'
import type { DashboardDegen } from '@/types/degens'
import { errorMsgHandler } from '@/utils/errorHandlers'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import { COW_PROTOCOL_URL } from '@/constants/url'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import ConnectWrapper from '@/components/wrapper/ConnectWrapper'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import useGameAccount from '@/hooks/useGameAccount'
import useRent from '@/hooks/useRent'
import useRentalPassCount from '@/hooks/useRentalPassCount'
import { useAgreementAccepted } from '@/hooks/useAuthStorage'
import { setAgreementAccepted } from '@/state/auth-storage'

import TermsOfServiceDialog from '../TermsOfServiceDialog'
import RentStepper from './RentStepper'
import styles from './RentDegenContentDialog.module.css'

interface RentDegenContentDialogProps {
  degen?: DashboardDegen
  onClose?: (event: MouseEvent & { currentTarget: HTMLButtonElement }) => void
}

const handleBuyNFTL = () => {
  gtm.sendEvent(GTM_EVENTS.RENTAL_BUY_NFTL_CLICKED)
}

const RentDegenContentDialog = ({ degen, onClose }: RentDegenContentDialogProps) => {
  const router = useRouter()
  const { account, refetchAccount } = useGameAccount()
  const agreementAccepted = useAgreementAccepted()
  const agreement = agreementAccepted === 'ACCEPTED'
  const [rentForUserSelection, setRentForUserSelection] = createSignal<string>('myself')
  const [ethAddress, setEthAddress] = createSignal<string>('')
  const [isUseRentalPass, setIsUseRentalPass] = createSignal<boolean>(false)
  const [addressError, setAddressError] = createSignal<string>('')
  const [checkBalance, setCheckBalance] = createSignal<boolean>(false)
  const [rentSuccess, setRentSuccess] = createSignal<boolean>(false)
  const [openTOS, setOpenTOS] = createSignal<boolean>(false)
  const { isDegenOwner } = useNFTsBalances()

  const disabledRentFor = createMemo(() => {
    if (!degen || degen?.background === 'common') return false
    return !isDegenOwner
  }, [degen, isDegenOwner])

  const rentFor = disabledRentFor ? 'myself' : rentForUserSelection

  const accountBalance = account?.balance ?? 0
  const sufficientBalance = createMemo(
    () => accountBalance >= (degen?.price || 0),
    [accountBalance, degen?.price]
  )

  const [, , rentalPassCount] = useRentalPassCount(degen?.id)
  const { rent, isPending: loading } = useRent(
    degen?.id,
    degen?.rental_count || 0,
    degen?.price || 0,
    ethAddress,
    isUseRentalPass
  )

  const handleChangeRentingFor = (_: Event & { currentTarget: HTMLInputElement }, value: string) => {
    if (value === 'recruit') {
      gtm.sendEvent(GTM_EVENTS.RENTAL_RECRUIT_CLICKED)
    }
    setRentForUserSelection(value)
  }

  const handleChangeUseRentalPass = (event: Event & { currentTarget: HTMLInputElement }) => {
    if (event.target.checked) {
      gtm.sendEvent(GTM_EVENTS.RENTAL_PASS_CLICKED)
    }
    setIsUseRentalPass(event.target.checked)
  }

  const validateAddress = (value: string) => {
    setEthAddress(value)
    if (!isAddress(value)) {
      setAddressError('Address is invalid!')
    } else if (!value) {
      setAddressError('Please input an address')
    } else {
      setAddressError('')
    }
  }

  const handleRent = (async () => {
    const items = [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }]
    gtm.sendEvent(GTM_EVENTS.BEGIN_CHECKOUT, { items })
    try {
      await rent()
      setRentSuccess(true)

      gtm.sendEvent(GTM_EVENTS.PURCHASE_COMPLETE, { items })
      gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
        virtual_currency_name: 'NFTL',
        value: degen?.price || 0,
        item_name: 'DEGEN Rental',
      })
    } catch (err: unknown) {
      toast.error(errorMsgHandler(err))
    }
  }, [degen, rent])

  const isShowRentalPassOption = () => rentalPassCount > 0 && !degen?.rental_count

  createEffect(() => {
    gtm.sendEvent(GTM_EVENTS.ADD_TO_CART, {
      items: [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }],
    })
  }, [degen?.id])

  const openTOSDialog: JSX.EventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    setOpenTOS(true)
  }

  const handleTOSDialogClose = (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => {
    if (reason === 'accepted') {
      setAgreementAccepted('ACCEPTED')
    }
    setOpenTOS(false)
  }

  const handleRefreshBalance = () => {
    gtm.sendEvent(GTM_EVENTS.RENTAL_REFRESH_BALANCE_CLICKED)
    refetchAccount()
  }

  const handleGoCheckBalance = () => {
    if (rentFor === 'recruit' && !ethAddress) {
      setAddressError('Please input an address.')
      return
    }

    if (rentFor === 'recruit' && Boolean(addressError)) {
      return
    }

    if (rentFor === 'myself') {
      setEthAddress('')
    }

    setCheckBalance(true)
    refetchAccount()
  }

  const handleClickPlay = (() => {
    router.push('/games/smashers')
  }, [router])

  return (
    <div>
      <div
        class={cn(styles.root, 'flex flex-col max-w-[430px] mx-1 sm:mx-auto gap-12 sm:gap-10')}
      >
        <Button
          variant="ghost"
          size="icon"
          class="cursor-pointer absolute right-[12px] top-[6px] z-1 w-[20px] h-[20px] rounded-full border"
          style={{ border: 'var(--border-purple)' }}
          onClick={onClose}
          aria-label="close"
        >
          <X
            aria-hidden="true"
            absoluteStrokeWidth
            color="var(--color-purple)"
            size={18}
            stroke-width={1.5}
          />
        </Button>

        <RentStepper rentSuccess={rentSuccess} checkBalance={checkBalance} />
        <div
          class="flex flex-row items-center justify-center w-full p-2"
          style={{ 'background-color': '#262930' }}
        >
          <Title level={5}>Rental Overview</Title>
        </div>
        <div class="flex flex-row mt-1 gap-3 sm:gap-7">
          <div class="flex flex-col">
            <div class="flex justify-center">
              {degen?.id && (
                <DegenImage
                  sx={{
                    'object-fit': 'contain',
                    width: 132,
                    height: 146,
                    'border-radius': '10px',
                    border: 'var(--border-default)',
                  }}
                  tokenId={degen.id}
                />
              )}
            </div>
            <div class="flex flex-col items-center mt-1">
              <span
                class="text-xs"
                style={{ 'line-height': 2, color: '#535659' }}
              >{`Owned by ${degen?.owner?.substring(0, 5)}`}</span>
            </div>
          </div>
          <div class="flex flex-col w-full">
            {rentSuccess ? (
              <div
                class="flex flex-col w-full items-center justify-between"
                style={{ height: 146 }}
              >
                <Title level={6} class={cn(styles.successInfo, 'mt-4')}>
                  Congratulations!
                </Title>
                <Title level={6} class={styles.successInfo}>
                  Your rental is active.
                </Title>
                <Button variant="default" class="w-full" onClick={handleClickPlay}>
                  Play Nifty Smashers Now
                </Button>
              </div>
            ) : (
              <div class="flex flex-col w-full justify-between" style={{ height: 146 }}>
                <div class="flex flex-col" style={{ display: checkBalance ? 'none' : 'flex' }}>
                  <span class="text-xs" style={{ 'line-height': 2 }}>
                    Who are you renting for?
                  </span>
                  <RadioGroup
                    class="flex flex-row gap-4 items-center"
                    value={rentFor}
                    onValueChange={(value) =>
                      handleChangeRentingFor({} as Event & { currentTarget: HTMLInputElement }, value)
                    }
                  >
                    <div class="flex items-center gap-1">
                      <RadioGroupItem value="myself" id="rent-myself" />
                      <span>Myself</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <RadioGroupItem
                        value="recruit"
                        id="rent-recruit"
                        disabled={disabledRentFor}
                      />
                      <div class="flex items-center">
                        <span>Recruit</span>
                        {disabledRentFor && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info
                                aria-hidden="true"
                                absoluteStrokeWidth
                                size={18}
                                stroke-width={1.5}
                                class="-mt-1"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              DEGEN ownership is required to sponsor Recruits on this DEGEN.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                  {rentFor === 'recruit' && (
                    <div class="flex flex-col items-center my-1">
                      <div class="flex flex-col gap-1">
                        <div class="relative">
                          <Input
                            id="rent-recruit-address"
                            placeholder="Paste your recruit's eth address"
                            name="address"
                            class={cn(styles.input, addressError && 'pr-10')}
                            value={ethAddress}
                            aria-invalid={addressError !== ''}
                            aria-describedby={
                              addressError ? 'rent-recruit-address-error' : undefined
                            }
                            onChange={(event) => validateAddress(event.target.value)}
                          />
                          {addressError && (
                            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
                              <AlertCircle aria-hidden="true" size={18} />
                            </span>
                          )}
                        </div>
                        {addressError && (
                          <span
                            id="rent-recruit-address-error"
                            class={cn(styles.formHelper, 'text-xs text-error')}
                          >
                            {addressError}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div class="flex flex-col">
                  <div class="flex justify-between">
                    <span class="text-base">Rental Cost:</span>
                    <span
                      class="text-base"
                      style={{
                        textDecoration: isUseRentalPass ? 'line-through' : 'none',
                      }}
                    >{`${formatNumberToDisplay(degen?.price || 0)} NFTL`}</span>
                  </div>
                  {checkBalance && (
                    <div class="flex flex-col">
                      <div class="flex justify-between">
                        <span class="text-base">Balance:</span>
                        <span
                          class="text-base"
                          style={{
                            color: sufficientBalance ? '#007B60' : '#B51424',
                          }}
                        >{`${accountBalance ? formatNumberToDisplay(accountBalance) : '0.00'} NFTL`}</span>
                      </div>
                      {!sufficientBalance && (
                        <span class="mt-1 ml-auto text-xs text-warning">
                          Balance low.{' '}
                          <a
                            href={COW_PROTOCOL_URL}
                            target="_blank"
                            rel="noreferrer"
                            class="font-bold text-purple underline cursor-pointer"
                            style={{ color: 'var(--color-purple)' }}
                            onClick={handleBuyNFTL}
                          >
                            Buy NFTL now
                          </a>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div class="flex flex-col">
                  {checkBalance && isShowRentalPassOption() && (
                    <div class="flex justify-between items-center">
                      <div class={styles.inputCheckFormControl}>
                        <div class="flex items-center gap-1">
                          <Checkbox
                            checked={isUseRentalPass}
                            onCheckedChange={(checked) =>
                              handleChangeUseRentalPass({
                                target: { checked: !!checked },
                              } as Event & { currentTarget: HTMLInputElement })
                            }
                            class={styles.inputCheck}
                          />
                          <span class="text-xs text-muted-foreground">Rental Pass</span>
                        </div>
                      </div>
                      {isUseRentalPass && (
                        <div class="flex justify-between items-center w-[100px]">
                          <span class="text-base">Balance:</span>
                          <span class="text-base" style={{ color: 'var(--color-purple)' }}>
                            {rentalPassCount}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <ConnectWrapper fullWidth>
                    {!checkBalance ? (
                      <Button variant="default" class="w-full" onClick={handleGoCheckBalance}>
                        Next
                      </Button>
                    ) : sufficientBalance || isUseRentalPass ? (
                      <div class="flex flex-col gap-2">
                        <Button
                          variant="default"
                          class="w-full"
                          onClick={handleRent}
                          disabled={!agreement || loading}
                        >
                          {loading && <CircularProgress size="sm" />}
                          Rent
                        </Button>
                        <div class="flex items-center gap-1 justify-center">
                          <Checkbox
                            checked={agreement}
                            onChange={() => setAgreementAccepted(!agreement ? 'ACCEPTED' : 'FALSE')}
                            class={styles.inputCheck}
                          />
                          <span class="text-xs text-muted-foreground">
                            I have read the{' '}
                            <span
                              class="mx-1 no-underline font-bold text-purple cursor-pointer hover:underline"
                              onClick={openTOSDialog}
                            >
                              terms &amp; conditions
                            </span>{' '}
                            regarding rentals
                          </span>
                        </div>
                        <TermsOfServiceDialog open={openTOS} onClose={handleTOSDialogClose} />
                      </div>
                    ) : (
                      <Button variant="default" class="w-full" onClick={handleRefreshBalance}>
                        Refresh Balance
                      </Button>
                    )}
                  </ConnectWrapper>
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="flex flex-col mb-6">
          <Title level={5} class="mt-4 mb-[6px]">
            Stats
          </Title>
          <div class="grid grid-cols-12 gap-12">
            <div class="col-span-12 lg:col-span-6">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <span class="text-base">Multipliers</span>
                  <span class={styles.greyText}>{degen?.multiplier}x</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base">Queue</span>
                  <span class={styles.greyText}>{degen?.rental_count}</span>
                </div>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-6">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <span class="text-base">Rental period</span>
                  <span class={styles.greyText}>1 week</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base">Renewal Cost</span>
                  <span class={styles.greyText}>{degen?.price_daily}/Day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentDegenContentDialog
