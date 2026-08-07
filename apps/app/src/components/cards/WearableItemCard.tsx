import Image from 'next/image'
import type { SxProps, Theme } from '@/types'
import type { Item } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

export interface WearableItemCardProps {
  data: Item
  sx?: SxProps<Theme>
  isSelected?: boolean
  onViewItem?: () => void
}

interface WearableItemCardPaneProps {
  data: Item
  sx?: SxProps<Theme>
  width: number
  height: number
}

const WearableItemCardPane: React.FC<WearableItemCardPaneProps> = ({ width, height, data, sx }) => {
  const { image, title, thumbnail } = data
  return (
    <div
      className="relative overflow-hidden rounded-[10px]"
      style={{ width, height, ...(sx as React.CSSProperties | undefined) }}
    >
      <div className="relative">
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </div>
    </div>
  )
}

const CARD_WIDTH = 106
const CARD_HEIGHT = 106

const WearableItemCard: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<WearableItemCardProps>>
> = ({ data, onViewItem, sx, isSelected = false }) => {
  const { balance, empty, isNew, title } = data

  const handleViewItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!onViewItem) return
    onViewItem()
  }

  if (!balance)
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: CARD_WIDTH + 24, height: CARD_HEIGHT + 24 }}
      >
        <div
          className="flex items-center justify-center rounded-[10px] border border-[#363636]"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <Image
            src={empty as string}
            alt={title}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            unoptimized
          />
        </div>
      </div>
    )

  return (
    <div className="relative">
      {isNew && (
        <span className="absolute w-full text-center" style={{ color: '#E3B210', top: -16 }}>
          New!
        </span>
      )}
      <div
        onClick={handleViewItem}
        className="relative flex cursor-pointer items-center justify-center rounded-[10px]"
        style={{ width: CARD_WIDTH + 24, height: CARD_HEIGHT + 24 }}
      >
        {balance === 1 ? (
          <WearableItemCardPane
            data={data}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            sx={{ outline: isSelected ? '3px solid var(--color-purple)' : 'none' }}
          />
        ) : (
          <>
            {[0, 1, 2].map((item) => (
              <WearableItemCardPane
                data={data}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                key={`WearableItemCard-${item}`}
                sx={{
                  position: 'absolute',
                  zIndex: 2 - item,
                  top: item * 8,
                  left: (item + 1) * 8,
                  border: 'var(--border-default)',
                }}
              />
            ))}
            <div
              className="absolute bottom-0 left-0 flex items-center justify-center rounded-[10px]"
              style={{
                width: 38,
                height: 35,
                background: '#8F4BF4',
                zIndex: 3,
              }}
            >
              <span className="text-[20px] font-bold text-foreground">{balance}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WearableItemCard
