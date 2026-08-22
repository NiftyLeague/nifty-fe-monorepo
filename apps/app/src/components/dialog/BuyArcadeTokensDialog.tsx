'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import NativeImage from '@nl/ui/custom/native-image'
import { Minus, Plus, X } from 'lucide-react'

import { Dialog, DialogContent, DialogTitle } from '@nl/ui/base/dialog'
import { Separator } from '@nl/ui/base/separator'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Input } from '@nl/ui/base/input'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'

import type { DialogProps } from '@/types/dialog'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import { GET_PRODUCT, NFTL_PURCHASE_URL, PURCHASE_ARCADE_TOKEN_BALANCE_API } from '@/constants/url'
import useGameAccount from '@/hooks/useGameAccount'
import useAuth from '@/hooks/useAuth'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'

const PRODUCT_ID = 'arcade-token-four-pack'

interface BuyArcadeTokensDialogProps extends DialogProps {
  open: boolean
  onSuccess: () => void
  onClose: () => void
}

const BuyArcadeTokensDialog: FC<BuyArcadeTokensDialogProps> = ({ open, onSuccess, onClose }) => {
  const [agreement, setAgreement] = useState<boolean>(false)
  const [tokenCount, setTokenCount] = useState<number>(1)
  const { authToken } = useAuth()

  const { account, refetchAccount, loadingAccount } = useGameAccount()
  const accountBalance = account?.balance ?? 0

  const fetchArcadeTokenDetails = useCallback(async () => {
    const response = await fetch(GET_PRODUCT(PRODUCT_ID, 'nftl'), {
      method: 'GET',
      headers: { authorizationToken: authToken || '' },
    })
    const body = await response.json()
    return body
  }, [authToken])

  useEffect(() => {
    if (open) {
      gtm.sendEvent(GTM_EVENTS.ADD_TO_CART, {
        items: [{ item_id: PRODUCT_ID, item_name: 'Arcade Tokens' }],
      })
    }
  }, [open])

  const {
    data: details,
    isLoading: isDetailsPending,
    error,
  } = useQuery({
    queryKey: ['arcade-token-details'],
    queryFn: fetchArcadeTokenDetails,
    enabled: open,
  })

  const updateTokenCount = (v: number | string) => {
    const value = Number(v)
    if (!Number.isNaN(value) && value > 0) {
      setTokenCount(value)
    }
  }

  const purchaseArcadeToken = useCallback(async () => {
    const items = [{ item_id: PRODUCT_ID, item_name: 'Arcade Tokens', quantity: tokenCount }]
    gtm.sendEvent(GTM_EVENTS.BEGIN_CHECKOUT, { items })
    try {
      const response = await fetch(PURCHASE_ARCADE_TOKEN_BALANCE_API, {
        method: 'post',
        headers: { authorizationToken: authToken || '' },
        body: JSON.stringify({
          id: PRODUCT_ID,
          currency: details.currency,
          price: details.price,
          quantity: tokenCount,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      gtm.sendEvent(GTM_EVENTS.PURCHASE_COMPLETE, { items })
      gtm.sendEvent(GTM_EVENTS.SPEND_VIRTUAL_CURRENCY, {
        virtual_currency_name: `${details.currency}`.toUpperCase(),
        value: details.price,
        item_name: 'Arcade Tokens',
      })
      refetchAccount()
      onSuccess()
    } catch {
      toast.error('Something went wrong!')
    }
  }, [authToken, tokenCount, details, onSuccess, refetchAccount])

  return (
    <Dialog open={open} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[444px] md:max-w-[444px] lg:max-w-[444px]"
      >
        <div className="container">
          <>
            <div className="relative text-center">
              <DialogTitle className="text-center">Buy Arcade Token</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="close"
                className="absolute top-1/4 right-0 h-7 w-7 cursor-pointer p-0"
                onClick={onClose}
              >
                <X aria-hidden="true" absoluteStrokeWidth size={28} strokeWidth={1.5} />
              </Button>
            </div>
            <Separator className="opacity-60" />
            {(isDetailsPending || error) && (
              <div className="flex h-[300px] w-[390px] flex-row items-center justify-center">
                <>
                  {isDetailsPending && <CircularProgress />}
                  {error && <Title level={4}>Something went wrong!</Title>}
                </>
              </div>
            )}
            {!error && !isDetailsPending && details && (
              <>
                <span className="mx-auto mt-4 block max-w-[450px] text-center text-base">
                  To play an arcade game, you need at least 1 arcade token. Arcade tokens are sold
                  in packs containing {details.items['arcade-token']} tokens (i.e 1 pack ={' '}
                  {details.items['arcade-token']} tokens)
                </span>
                <span className="my-4 block text-center text-base font-bold text-warning">
                  {details.price} NFTL Each
                </span>
                <div className="mb-6 flex flex-row items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="subtract"
                    className="h-[50px] w-[50px] cursor-pointer p-0"
                    onClick={() => updateTokenCount(tokenCount - 1)}
                  >
                    <Minus
                      aria-hidden="true"
                      absoluteStrokeWidth
                      size={50}
                      color="var(--color-muted-foreground)"
                      strokeWidth={2.5}
                    />
                  </Button>
                  <div className="relative">
                    <Input
                      aria-label="Arcade token packs"
                      className="w-[100px] pr-12 text-center"
                      value={tokenCount}
                      onChange={(e) => updateTokenCount(e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                      PACK
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="add"
                    className="h-[50px] w-[50px] cursor-pointer p-0"
                    onClick={() => updateTokenCount(tokenCount + 1)}
                  >
                    <Plus
                      aria-hidden="true"
                      absoluteStrokeWidth
                      size={50}
                      color="var(--color-muted-foreground)"
                      strokeWidth={2.5}
                    />
                  </Button>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr auto' }}>
                  <span
                    className="text-base"
                    style={{
                      fontWeight: 500,
                      color:
                        accountBalance && accountBalance > tokenCount * details.price
                          ? 'var(--color-success)'
                          : 'var(--color-foreground)',
                    }}
                  >
                    Bal: {accountBalance ? formatNumberToDisplay(accountBalance) : '0.00'} NFTL
                  </span>
                  <span className="flex text-base" style={{ fontWeight: 500 }}>
                    Total:{' '}
                    <NativeImage
                      src="/icons/currencies/arcade-token.svg"
                      alt="Arcade Token"
                      width={16}
                      height={16}
                      style={{ margin: '0 4px' }}
                    />{' '}
                    {tokenCount * details.items['arcade-token']} Arcade Tokens
                  </span>
                  {accountBalance > 0 && accountBalance < tokenCount * details.price && (
                    <span className="my-1 text-xs text-warning">
                      Balance is too low.{' '}
                      <a href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                        Buy NFTL
                      </a>
                    </span>
                  )}
                  {!accountBalance && (
                    <span className="my-1 text-xs text-error">
                      You have zero balance.{' '}
                      <a href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                        Buy NFTL
                      </a>
                    </span>
                  )}
                </div>
                <label className="my-2 flex items-center gap-2">
                  <Checkbox
                    checked={agreement}
                    onCheckedChange={(checked) => setAgreement(checked === true)}
                  />
                  <span className="text-xs">
                    I understand all the information above about the arcade token purchase
                  </span>
                </label>
                <Button
                  variant="default"
                  className="mb-2 w-full"
                  onClick={purchaseArcadeToken}
                  disabled={
                    !agreement || !accountBalance || accountBalance < tokenCount * details.price
                  }
                >
                  {!agreement
                    ? 'Accept Terms to Continue'
                    : accountBalance < tokenCount * details.price
                      ? 'Insufficient Balance'
                      : 'Buy'}
                  {loadingAccount && <CircularProgress size="sm" />}
                </Button>
              </>
            )}
          </>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BuyArcadeTokensDialog
