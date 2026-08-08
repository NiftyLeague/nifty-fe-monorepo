'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { isAddress } from 'ethers'

import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { RadioGroup, RadioGroupItem } from '@nl/ui/base/radio-group'
import { Tooltip, TooltipTrigger, TooltipContent } from '@nl/ui/base/tooltip'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Input } from '@nl/ui/custom/input'
import { Title } from '@nl/ui/custom/typography'
import { cn } from '@nl/ui/utils'
import { Icon } from '@nl/ui/base/icon'
import type { Degen } from '@/types/degens'
import { errorMsgHandler } from '@/utils/errorHandlers'
import { formatNumberToDisplay } from '@nl/ui/utils'
import { gtm, GTM_EVENTS } from '@nl/ui/gtm'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import ConnectWrapper from '@/components/wrapper/ConnectWrapper'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import useGameAccount from '@/hooks/useGameAccount'
import useRent from '@/hooks/useRent'
import useRentalPassCount from '@/hooks/useRentalPassCount'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

import TermsOfServiceDialog from '../TermsOfServiceDialog'
import RentStepper from './RentStepper'
import styles from './RentDegenContentDialog.module.css'

export interface RentDegenContentDialogProps {
  degen?: Degen
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const RentDegenContentDialog = ({ degen, onClose }: RentDegenContentDialogProps) => {
  const router = useRouter()
  const { account, refetchAccount } = useGameAccount()
  const { agreementAccepted, setAgreementAccepted } = useLocalStorageContext()
  const agreement = agreementAccepted === 'ACCEPTED'
  const [rentForUserSelection, setRentForUserSelection] = useState<string>('myself')
  const [ethAddress, setEthAddress] = useState<string>('')
  const [isUseRentalPass, setIsUseRentalPass] = useState<boolean>(false)
  const [addressError, setAddressError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [checkBalance, setCheckBalance] = useState<boolean>(false)
  const [rentSuccess, setRentSuccess] = useState<boolean>(false)
  const [openTOS, setOpenTOS] = useState<boolean>(false)
  const [purchasingNFTL, setPurchasingNFTL] = useState<boolean>(false)
  const { isDegenOwner } = useNFTsBalances()

  const disabledRentFor = useMemo(() => {
    if (!degen || degen?.background === 'common') return false
    return !isDegenOwner
  }, [degen, isDegenOwner])

  const rentFor = disabledRentFor ? 'myself' : rentForUserSelection

  const accountBalance = account?.balance ?? 0
  const sufficientBalance = useMemo(
    () => accountBalance >= (degen?.price || 0),
    [accountBalance, degen?.price]
  )

  const [, , rentalPassCount] = useRentalPassCount(degen?.id)
  const rent = useRent(
    degen?.id,
    degen?.rental_count || 0,
    degen?.price || 0,
    ethAddress,
    isUseRentalPass
  )

  const handleChangeRentingFor = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'recruit') {
      gtm.sendEvent(GTM_EVENTS.RENTAL_RECRUIT_CLICKED)
    }
    setRentForUserSelection(value)
  }

  const handleChangeUseRentalPass = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRent = useCallback(async () => {
    const items = [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }]
    gtm.sendEvent(GTM_EVENTS.BEGIN_CHECKOUT, { items })
    setLoading(true)
    try {
      await rent()
      setLoading(false)
      setRentSuccess(true)

      gtm.sendEvent(GTM_EVENTS.PURCHASE_COMPLETE, { items })
      gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
        virtual_currency_name: 'NFTL',
        value: degen?.price || 0,
        item_name: 'DEGEN Rental',
      })
    } catch (err: unknown) {
      setLoading(false)
      toast.error(errorMsgHandler(err))
    }
  }, [degen, rent])

  const isShowRentalPassOption = () => rentalPassCount > 0 && !degen?.rental_count

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.ADD_TO_CART, {
      items: [{ item_id: `${degen?.id}`, item_name: 'DEGEN Rental' }],
    })
  }, [degen?.id])

  const openTOSDialog: React.MouseEventHandler<HTMLButtonElement> = (event) => {
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

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setAgreementAccepted('ACCEPTED')
    } else {
      setAgreementAccepted('FALSE')
    }
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

  const handleClickPlay = useCallback(() => {
    router.push('/games/smashers')
  }, [router])

  const handleBuyNFTL = () => {
    gtm.sendEvent(GTM_EVENTS.RENTAL_BUY_NFTL_CLICKED)
    setPurchasingNFTL(true)
  }

  return (
    <div>
      <div
        className={cn(styles.root, 'flex flex-col max-w-[430px] mx-1 sm:mx-auto gap-12 sm:gap-10')}
      >
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer absolute right-[12px] top-[6px] z-1 w-[20px] h-[20px] rounded-full border"
          style={{ border: 'var(--border-purple)' }}
          onClick={onClose}
          aria-label="close"
        >
          <Icon name="x" size="sm" color="purple" />
        </Button>

        <RentStepper rentSuccess={rentSuccess} checkBalance={checkBalance} />
        <div
          className="flex flex-row items-center justify-center w-full p-2"
          style={{ backgroundColor: '#262930' }}
        >
          <Title level={5}>Rental Overview</Title>
        </div>
        <div className="flex flex-row mt-1 gap-3 sm:gap-7">
          <div className="flex flex-col">
            <div className="flex justify-center">
              {degen?.id && (
                <DegenImage
                  sx={{
                    objectFit: 'contain',
                    width: 132,
                    height: 146,
                    borderRadius: '10px',
                    border: 'var(--border-default)',
                  }}
                  tokenId={degen.id}
                />
              )}
            </div>
            <div className="flex flex-col items-center mt-1">
              <span
                className="text-xs"
                style={{ lineHeight: 2, color: '#535659' }}
              >{`Owned by ${degen?.owner?.substring(0, 5)}`}</span>
            </div>
          </div>
          <div className="flex flex-col w-full">
            {rentSuccess ? (
              <div
                className="flex flex-col w-full items-center justify-between"
                style={{ height: 146 }}
              >
                <Title level={6} className={cn(styles.successInfo, 'mt-4')}>
                  Congratulations!
                </Title>
                <Title level={6} className={styles.successInfo}>
                  Your rental is active.
                </Title>
                <Button variant="default" className="w-full" onClick={handleClickPlay}>
                  Play Nifty Smashers Now
                </Button>
              </div>
            ) : (
              <div className="flex flex-col w-full justify-between" style={{ height: 146 }}>
                <div className="flex flex-col" style={{ display: checkBalance ? 'none' : 'flex' }}>
                  <span className="text-xs" style={{ lineHeight: 2 }}>
                    Who are you renting for?
                  </span>
                  <RadioGroup
                    className="flex flex-row gap-4 items-center"
                    value={rentFor}
                    onValueChange={(value) =>
                      handleChangeRentingFor({} as React.ChangeEvent<HTMLInputElement>, value)
                    }
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="myself" id="rent-myself" />
                      <span>Myself</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="recruit"
                        id="rent-recruit"
                        disabled={disabledRentFor}
                      />
                      <div className="flex items-center">
                        <span>Recruit</span>
                        {disabledRentFor && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Icon name="info" size="sm" className="-mt-1" />
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
                    <div className="flex flex-col items-center my-1">
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="Paste your recruit's eth address"
                          name="address"
                          className={styles.input}
                          value={ethAddress}
                          error={addressError !== ''}
                          onChange={(event) => validateAddress(event.target.value)}
                        />
                        {addressError && (
                          <span className={cn(styles.formHelper, 'text-xs text-error')}>
                            {addressError}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-base">Rental Cost:</span>
                    <span
                      className="text-base"
                      style={{
                        textDecoration: isUseRentalPass ? 'line-through' : 'none',
                      }}
                    >{`${formatNumberToDisplay(degen?.price || 0)} NFTL`}</span>
                  </div>
                  {checkBalance && (
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="text-base">Balance:</span>
                        <span
                          className="text-base"
                          style={{
                            color: sufficientBalance ? '#007B60' : '#B51424',
                          }}
                        >{`${accountBalance ? formatNumberToDisplay(accountBalance) : '0.00'} NFTL`}</span>
                      </div>
                      {!sufficientBalance && (
                        <span className="mt-1 ml-auto text-xs text-warning">
                          Balance low.{' '}
                          <button
                            type="button"
                            className="font-bold text-purple underline cursor-pointer"
                            style={{ color: 'var(--color-purple)' }}
                            onClick={handleBuyNFTL}
                          >
                            Buy NFTL now
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  {checkBalance && isShowRentalPassOption() && (
                    <div className="flex justify-between items-center">
                      <div className={styles.inputCheckFormControl}>
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={isUseRentalPass}
                            onCheckedChange={(checked) =>
                              handleChangeUseRentalPass({
                                target: { checked: !!checked },
                              } as React.ChangeEvent<HTMLInputElement>)
                            }
                            className={styles.inputCheck}
                          />
                          <span className="text-xs text-muted-foreground">Rental Pass</span>
                        </div>
                      </div>
                      {isUseRentalPass && (
                        <div className="flex justify-between items-center w-[100px]">
                          <span className="text-base">Balance:</span>
                          <span className="text-base" style={{ color: 'var(--color-purple)' }}>
                            {rentalPassCount}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <ConnectWrapper fullWidth>
                    {!checkBalance ? (
                      <Button variant="default" className="w-full" onClick={handleGoCheckBalance}>
                        Next
                      </Button>
                    ) : sufficientBalance || isUseRentalPass ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={handleRent}
                          disabled={!agreement || loading}
                        >
                          {loading && <CircularProgress size="sm" />}
                          Rent
                        </Button>
                        <div className="flex items-center gap-1 justify-center">
                          <Checkbox
                            checked={agreement}
                            onChange={() => setAgreementAccepted(!agreement ? 'ACCEPTED' : 'FALSE')}
                            className={styles.inputCheck}
                          />
                          <span className="text-xs text-muted-foreground">
                            I have read the{' '}
                            <span
                              className="mx-1 no-underline font-bold text-purple cursor-pointer hover:underline"
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
                      <Button variant="default" className="w-full" onClick={handleRefreshBalance}>
                        Refresh Balance
                      </Button>
                    )}
                  </ConnectWrapper>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-6">
          {/* {purchasingNFTL && <CowSwapWidget refreshBalance={refetchAccount} />} */}
          <Title level={5} className="mt-4 mb-[6px]">
            Stats
          </Title>
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-base">Multipliers</span>
                  <span className={styles.greyText}>{degen?.multiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base">Queue</span>
                  <span className={styles.greyText}>{degen?.rental_count}</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-base">Rental period</span>
                  <span className={styles.greyText}>1 week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base">Renewal Cost</span>
                  <span className={styles.greyText}>{degen?.price_daily}/Day</span>
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
