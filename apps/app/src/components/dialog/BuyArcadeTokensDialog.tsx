'use client'

import { createEffect, createSignal, Show, type Component } from 'solid-js'
import { useQuery } from '@tanstack/solid-query'
import { toast } from 'solid-sonner'
import NativeImage from '@nl/ui/custom/native-image'
import { Minus, Plus, X } from 'lucide-solid'

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
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const PRODUCT_ID = 'arcade-token-four-pack'

interface BuyArcadeTokensDialogProps extends DialogProps {
  open: boolean
  onSuccess: () => void
  onClose: () => void
}

type ArcadeTokenDetails = {
  currency: string
  price: number
  items: Record<string, number>
}

const BuyArcadeTokensDialog: Component<BuyArcadeTokensDialogProps> = (props) => {
  const [agreement, setAgreement] = createSignal<boolean>(false)
  const [tokenCount, setTokenCount] = createSignal<number>(1)
  const auth = useAuth()

  const gameAccount = useGameAccount()
  const accountBalance = () => gameAccount.account?.balance ?? 0

  createEffect(() => {
    if (props.open) {
      gtm.sendEvent(GTM_EVENTS.ADD_TO_CART, {
        items: [{ item_id: PRODUCT_ID, item_name: 'Arcade Tokens' }],
      })
    }
  })

  const detailsQuery = useQuery(() => ({
    queryKey: queryKeys.product(PRODUCT_ID, 'nftl', getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<ArcadeTokenDetails>(GET_PRODUCT(PRODUCT_ID, 'nftl'), {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: props.open,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  const updateTokenCount = (v: number | string) => {
    const value = Number(v)
    if (!Number.isNaN(value) && value > 0) {
      setTokenCount(value)
    }
  }

  const purchaseArcadeToken = async () => {
    const details = detailsQuery.data
    if (!details) return
    const items = [
      { item_id: PRODUCT_ID, item_name: 'Arcade Tokens', quantity: tokenCount() },
    ]
    gtm.sendEvent(GTM_EVENTS.BEGIN_CHECKOUT, { items })
    try {
      const response = await fetch(PURCHASE_ARCADE_TOKEN_BALANCE_API, {
        method: 'post',
        headers: { authorizationToken: auth.authToken || '' },
        body: JSON.stringify({
          id: PRODUCT_ID,
          currency: details.currency,
          price: details.price,
          quantity: tokenCount(),
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
      gameAccount.refetchAccount()
      props.onSuccess()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={(openState) => !openState && props.onClose()}>
      <DialogContent
        showCloseButton={false}
        class="max-w-[444px] md:max-w-[444px] lg:max-w-[444px]"
      >
        <div class="container">
          <div class="relative text-center">
            <DialogTitle class="text-center">Buy Arcade Token</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="close"
              class="absolute top-1/4 right-0 h-7 w-7 cursor-pointer p-0"
              onClick={props.onClose}
            >
              <X aria-hidden="true" size={28} stroke-width={1.5} />
            </Button>
          </div>
          <Separator class="opacity-60" />
          <Show when={detailsQuery.isLoading || detailsQuery.error}>
            <div class="flex h-[300px] w-[390px] flex-row items-center justify-center">
              <Show when={detailsQuery.isLoading}>
                <CircularProgress />
              </Show>
              <Show when={detailsQuery.error}>
                <Title level={4}>Something went wrong!</Title>
              </Show>
            </div>
          </Show>
          <Show when={!detailsQuery.error && !detailsQuery.isLoading && detailsQuery.data} keyed>
            {(details) => (
              <>
                <span class="mx-auto mt-4 block max-w-[450px] text-center text-base">
                  To play an arcade game, you need at least 1 arcade token. Arcade tokens are
                  sold in packs containing {details.items['arcade-token'] ?? 0} tokens (i.e 1
                  pack = {details.items['arcade-token'] ?? 0} tokens)
                </span>
                <span class="my-4 block text-center text-base font-bold text-warning">
                  {details.price} NFTL Each
                </span>
                <div class="mb-6 flex flex-row items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="subtract"
                    class="h-[50px] w-[50px] cursor-pointer p-0"
                    onClick={() => updateTokenCount(tokenCount() - 1)}
                  >
                    <Minus
                      aria-hidden="true"
                      size={50}
                      color="var(--color-muted-foreground)"
                      stroke-width={2.5}
                    />
                  </Button>
                  <div class="relative">
                    <Input
                      aria-label="Arcade token packs"
                      class="w-[100px] pr-12 text-center"
                      value={tokenCount()}
                      onInput={(e) => updateTokenCount(e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                      PACK
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="add"
                    class="h-[50px] w-[50px] cursor-pointer p-0"
                    onClick={() => updateTokenCount(tokenCount() + 1)}
                  >
                    <Plus
                      aria-hidden="true"
                      size={50}
                      color="var(--color-muted-foreground)"
                      stroke-width={2.5}
                    />
                  </Button>
                </div>
                <div class="grid" style={{ 'grid-template-columns': '1fr auto' }}>
                  <span
                    class="text-base"
                    style={{
                      'font-weight': '500',
                      color:
                        accountBalance() && accountBalance() > tokenCount() * details.price
                          ? 'var(--color-success)'
                          : 'var(--color-foreground)',
                    }}
                  >
                    Bal:{' '}
                    {accountBalance() ? formatNumberToDisplay(accountBalance()) : '0.00'} NFTL
                  </span>
                  <span class="flex text-base" style={{ 'font-weight': '500' }}>
                    Total:{' '}
                    <NativeImage
                      src="/icons/currencies/arcade-token.svg"
                      alt="Arcade Token"
                      width={16}
                      height={16}
                      style={{ margin: '0 4px' }}
                    />{' '}
                    {tokenCount() * (details.items['arcade-token'] ?? 0)} Arcade Tokens
                  </span>
                  <Show
                    when={
                      accountBalance() > 0 && accountBalance() < tokenCount() * details.price
                    }
                  >
                    <span class="my-1 text-xs text-warning">
                      Balance is too low.{' '}
                      <a href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                        Buy NFTL
                      </a>
                    </span>
                  </Show>
                  <Show when={!accountBalance()}>
                    <span class="my-1 text-xs text-error">
                      You have zero balance.{' '}
                      <a href={NFTL_PURCHASE_URL} target="_blank" rel="noreferrer">
                        Buy NFTL
                      </a>
                    </span>
                  </Show>
                </div>
                <label class="my-2 flex items-center gap-2">
                  <Checkbox
                    checked={agreement()}
                    onCheckedChange={(checked) => setAgreement(checked === true)}
                  />
                  <span class="text-xs">
                    I understand all the information above about the arcade token purchase
                  </span>
                </label>
                <Button
                  variant="default"
                  class="mb-2 w-full"
                  onClick={() => void purchaseArcadeToken()}
                  disabled={
                    !agreement() ||
                    !accountBalance() ||
                    accountBalance() < tokenCount() * details.price
                  }
                >
                  {!agreement()
                    ? 'Accept Terms to Continue'
                    : accountBalance() < tokenCount() * details.price
                      ? 'Insufficient Balance'
                      : 'Buy'}
                  <Show when={gameAccount.loadingAccount}>
                    <CircularProgress size="sm" />
                  </Show>
                </Button>
              </>
            )}
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BuyArcadeTokensDialog
