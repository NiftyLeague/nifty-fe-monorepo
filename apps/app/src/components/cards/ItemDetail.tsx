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
      fallback={
        <div
          class="min-w-[345px] rounded-[5px] border border-[#363636]"
          style={{ height: '375px' }}
        />
      }
    >
      {(data) => (
        <div
          class="flex min-w-full flex-col items-center justify-center rounded-[5px] border-0 lg:min-w-[345px] lg:border lg:border-[#363636]"
          style={{ width: '345px', height: '375px' }}
        >
          <div class="relative" style={{ width: '225px', height: '226px' }}>
            <div class="relative overflow-hidden" style={{ 'border-radius': '10px 10px 0 0' }}>
              <ImageCard
                image={data.image}
                imageWebp={data.imageWebp}
                thumbnail={data.thumbnail}
                title={data.title}
                ratio={1}
              />
            </div>
            <Show when={data.multiplier && data.multiplier >= 2}>
              <div
                class="absolute flex items-center justify-center rounded-full"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'var(--color-purple)',
                  top: '-12px',
                  right: '-28px',
                }}
              >
                <span class="text-[20px] font-bold text-foreground">{`${data.multiplier}x`}</span>
              </div>
            </Show>
          </div>
          <Show when={enableEquip}>
            <div class="flex w-[225px] flex-col gap-3 rounded-b-[var(--radius-default)] border border-[#5D5F74] border-t-0 p-1 pb-3">
              <Button
                variant="default"
                class="w-full font-bold"
                style={{ height: '28px' }}
                onClick={handleEquip}
              >
                {data.equipped ? 'Unequip' : 'Equip on a DEGEN'}
              </Button>
              <div class="flex flex-row items-center justify-between">
                <span class="text-xs font-semibold" style={{ color: '#363636' }}>
                  Equipped:
                </span>
                <span
                  class="text-xs font-medium text-purple"
                  style={{ 'text-decoration-line': data.equipped ? 'underline' : 'none' }}
                >
                  {data.equipped ? 'DEGEN #1152' : '-'}
                </span>
              </div>
              <div class="flex flex-row items-center justify-between">
                <span class="text-xs font-semibold" style={{ color: '#363636' }}>
                  Rental:
                </span>
                <span
                  class="text-xs font-medium text-purple"
                  style={{ 'text-decoration-line': data.equipped ? 'underline' : 'none' }}
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
