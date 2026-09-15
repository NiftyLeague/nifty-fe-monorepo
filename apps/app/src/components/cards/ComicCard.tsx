import type { SxProps } from '@/types'
import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'
import useComicDimension from '@/hooks/useComicDimension'

interface ComicCardProps {
  data: Comic
  sx?: SxProps
  isSelected?: boolean
  onViewComic?: () => void
}

interface ComicCardPaneProps {
  data: Comic
  sx?: SxProps
  width: number
  height: number
}

const ComicCardPane = (props: ComicCardPaneProps) => {
  const { width, height, data, sx } = props
  const { image, title, thumbnail } = data
  return (
    <div style={sx as JSX.CSSProperties | undefined}>
      <div class="relative overflow-hidden rounded-[5px]" style={{ width, height }}>
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </div>
    </div>
  )
}

const ComicCard = (props: ComicCardProps) => ({
  data,
  onViewComic,
  isSelected = false,
}) => {
  const { balance } = data
  const { width: comicCardWidth, height: comicCardHeight } = useComicDimension()

  const handleViewComic = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    e.stopPropagation()
    if (!onViewComic) return
    onViewComic()
  }

  if (!balance)
    return (
      <div
        class="rounded-[5px] border border-[#363636]"
        style={{ width: comicCardWidth, height: comicCardHeight }}
      />
    )

  return (
    <div
      onClick={handleViewComic}
      class="relative cursor-pointer"
      style={{
        borderRadius: 'var(--radius-default)',
        outline: isSelected ? '3px solid var(--color-purple)' : 'none',
      }}
    >
      {balance === 1 ? (
        <ComicCardPane data={data} width={comicCardWidth} height={comicCardHeight} />
      ) : (
        <div
          class="relative"
          style={{ width: comicCardWidth + 24, height: comicCardHeight + 16 }}
        >
          {[0, 1, 2].map((item) => (
            <ComicCardPane
              data={data}
              width={comicCardWidth}
              height={comicCardHeight}
              key={`ComicCardPane-${item}`}
              sx={{ position: 'absolute', zIndex: 2 - item, top: item * 8, left: (item + 1) * 8 }}
            />
          ))}
          <div
            class="absolute bottom-0 left-0 flex items-center justify-center"
            style={{
              width: 38,
              height: 35,
              background: '#8F4BF4',
              borderRadius: 'var(--radius-default)',
              zIndex: 3,
            }}
          >
            <span class="text-[20px] font-bold text-foreground">{balance}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComicCard
