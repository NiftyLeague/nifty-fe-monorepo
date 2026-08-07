import { memo } from 'react'
import { LEGGIES } from '@/constants/degens'
const IMAGE_HEIGHT = 320

const DegenImage = memo(
  ({ tokenId, sx }: { tokenId: string | number; sx?: React.CSSProperties }) => {
    const imageURL = `/img/degens/nfts/${tokenId}`

    const sxHeight =
      sx && typeof sx === 'object' && 'height' in sx ? (sx.height as string | number) : undefined
    const imageHeight = sxHeight ?? IMAGE_HEIGHT
    let image = `${imageURL}.webp`

    if (LEGGIES.includes(Number(tokenId))) {
      image = `${imageURL}.gif`
    }

    const handleImageError = (
      e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>
    ) => {
      const target = e.target as HTMLImageElement | HTMLVideoElement
      target.onerror = null
      target.src = '/img/degens/unavailable-image.webp'
    }

    return (
      <img
        className="pixelated"
        src={image}
        alt=""
        style={{ objectFit: 'cover', height: imageHeight, ...sx }}
        onError={handleImageError}
      />
    )
  }
)

DegenImage.displayName = 'DegenImage'
export default DegenImage
