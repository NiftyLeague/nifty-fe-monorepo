import type { SxProps, Theme } from '@/types'
import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'
import useComicDimension from '@/hooks/useComicDimension'

interface ComicCardProps {
  data: Comic
  sx?: SxProps<Theme>
  isSelected?: boolean
  onViewComic?: () => void
}

interface ComicCardPaneProps {
  data: Comic
  sx?: SxProps<Theme>
  width: number
  height: number
}

const ComicCardPane: React.FC<ComicCardPaneProps> = ({ width, height, data, sx }) => {
  const { image, title, thumbnail } = data
  return (
    <div style={sx as React.CSSProperties | undefined}>
      <div className="relative overflow-hidden rounded-[5px]" style={{ width, height }}>
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </div>
    </div>
  )
}

const ComicCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<ComicCardProps>>> = ({
  data,
  onViewComic,
  sx,
  isSelected = false,
}) => {
  const { balance } = data
  const { width: comicCardWidth, height: comicCardHeight } = useComicDimension()

  const handleViewComic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!onViewComic) return
    onViewComic()
  }

  if (!balance)
    return (
      <div
        className="rounded-[5px] border border-[#363636]"
        style={{ width: comicCardWidth, height: comicCardHeight }}
      />
    )

  return (
    <div
      onClick={handleViewComic}
      className="relative cursor-pointer"
      style={{
        borderRadius: 'var(--radius-default)',
        outline: isSelected ? '3px solid var(--color-purple)' : 'none',
      }}
    >
      {balance === 1 ? (
        <ComicCardPane data={data} width={comicCardWidth} height={comicCardHeight} />
      ) : (
        <div
          className="relative"
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
            className="absolute bottom-0 left-0 flex items-center justify-center"
            style={{
              width: 38,
              height: 35,
              background: '#8F4BF4',
              borderRadius: 'var(--radius-default)',
              zIndex: 3,
            }}
          >
            <span className="text-[20px] font-bold text-foreground">{balance}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComicCard
