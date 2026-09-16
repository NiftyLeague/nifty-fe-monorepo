import { Show, type JSX } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import { Button } from '@nl/ui/base/button'
import useFlags from '@/hooks/useFlags'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface ItemDetailProps {
  data: Item | null
  subIndex: number
}

const ItemDetail = (props: ItemDetailProps): JSX.Element => {
  const router = useRouter()
  const { enableEquip } = useFlags()

  const handleEquip = () => {
    router.push('/dashboard/degens')
  }

  return (
    <Show
      when={
        props.data && !(props.data.balance && props.data.balance > 1 && props.subIndex < 0)
          ? props.data
          : null
      }
      keyed
      fallback={<div class="min-w-86.25 h-93.75 rounded-sm border border-(--card-border)" />}
    >
      {(data) => (
        <div class="flex min-w-full w-86.25 h-93.75 flex-col items-center justify-center rounded-sm border-0 lg:min-w-86.25 lg:border lg:border-(--card-border)">
          <div class="relative w-56.25 h-56.5">
            <div class="relative overflow-hidden rounded-t-lg">
              <ImageCard
                image={data.image}
                imageWebp={data.imageWebp}
                thumbnail={data.thumbnail}
                title={data.title}
                ratio={1}
              />
            </div>
            <Show when={data.multiplier && data.multiplier >= 2}>
              <div class="absolute flex w-12.5 h-12.5 items-center justify-center rounded-full bg-purple -top-3 -right-7">
                <span class="text-xl font-bold text-foreground">{`${data.multiplier}x`}</span>
              </div>
            </Show>
          </div>
          <Show when={enableEquip}>
            <div class="flex w-56.25 flex-col gap-3 rounded-b-(--radius-default) border border-(--thumb-border) border-t-0 p-1 pb-3">
              <Button variant="default" class="w-full h-7 font-bold" onClick={handleEquip}>
                {data.equipped ? 'Unequip' : 'Equip on a DEGEN'}
              </Button>
              <div class="flex flex-row items-center justify-between">
                <span class="text-xs font-semibold text-(--ink-muted)">Equipped:</span>
                <span
                  class={`text-xs font-medium text-purple ${data.equipped ? 'underline' : 'no-underline'}`}
                >
                  {data.equipped ? 'DEGEN #1152' : '-'}
                </span>
              </div>
              <div class="flex flex-row items-center justify-between">
                <span class="text-xs font-semibold text-(--ink-muted)">Rental:</span>
                <span
                  class={`text-xs font-medium text-purple ${data.equipped ? 'underline' : 'no-underline'}`}
                >
                  {data.equipped ? '28 days left' : '-'}
                </span>
              </div>
            </div>
          </Show>
        </div>
      )}
    </Show>
  )
}

export default ItemDetail
