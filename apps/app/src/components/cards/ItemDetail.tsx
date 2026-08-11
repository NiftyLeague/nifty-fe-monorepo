import { useRouter } from 'next/navigation'
import { Button } from '@nl/ui/base/button'
import useFlags from '@/hooks/useFlags'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

export interface ItemDetailProps {
  data: Item | null
  subIndex: number
}

const ItemDetail: React.FC<React.PropsWithChildren<React.PropsWithChildren<ItemDetailProps>>> = ({
  data,
  subIndex,
}) => {
  const router = useRouter()
  const { enableEquip } = useFlags()

  if (!data || (data?.balance && data?.balance > 1 && subIndex < 0)) {
    return (
      <div
        className="min-w-[345px] rounded-[5px] border border-[#363636]"
        style={{ height: 375 }}
      />
    )
  }

  const { equipped, image, imageWebp, multiplier, title, thumbnail } = data

  const handleEquip = () => {
    router.push('/dashboard/degens')
  }

  return (
    <div
      className="flex min-w-full flex-col items-center justify-center rounded-[5px] border-0 lg:min-w-[345px] lg:border lg:border-[#363636]"
      style={{ width: 345, height: 375 }}
    >
      <div className="relative" style={{ width: 225, height: 226 }}>
        <div className="relative overflow-hidden" style={{ borderRadius: '10px 10px 0 0' }}>
          <ImageCard
            image={image}
            imageWebp={imageWebp}
            thumbnail={thumbnail}
            title={title}
            ratio={1}
          />
        </div>
        {multiplier && multiplier >= 2 && (
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: 50,
              height: 50,
              background: 'var(--color-purple)',
              top: -12,
              right: -28,
            }}
          >
            <span className="text-[20px] font-bold text-foreground">{`${multiplier}x`}</span>
          </div>
        )}
      </div>
      {enableEquip ? (
        <div className="flex w-[225px] flex-col gap-3 rounded-b-[var(--radius-default)] border border-[#5D5F74] border-t-0 p-1 pb-3">
          <Button
            variant="default"
            className="w-full font-bold"
            style={{ height: 28 }}
            onClick={handleEquip}
          >
            {equipped ? 'Unequip' : 'Equip on a DEGEN'}
          </Button>
          <div className="flex flex-row items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: '#363636' }}>
              Equipped:
            </span>
            <span
              className="text-xs font-medium text-purple"
              style={{ textDecorationLine: equipped ? 'underline' : 'none' }}
            >
              {equipped ? 'DEGEN #1152' : '-'}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: '#363636' }}>
              Rental:
            </span>
            <span
              className="text-xs font-medium text-purple"
              style={{ textDecorationLine: equipped ? 'underline' : 'none' }}
            >
              {equipped ? '28 days left' : '-'}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ItemDetail
