import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

export interface ComicDetailProps {
  data: Comic | null
}

const ComicDetail: React.FC<React.PropsWithChildren<React.PropsWithChildren<ComicDetailProps>>> = ({
  data,
}) => {
  if (!data)
    return (
      <div
        className="min-w-[345px] rounded-[5px] border border-[#363636]"
        style={{ height: 375 }}
      />
    )

  const { image, title, thumbnail } = data

  return (
    <div
      className="relative mx-auto min-w-[345px] overflow-hidden rounded-[5px]"
      style={{ height: 350 }}
    >
      <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
    </div>
  )
}

export default ComicDetail
