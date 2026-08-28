import { memo } from 'react'
import NativeImage from '@nl/ui/custom/native-image'
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
      <NativeImage
        className="pixelated"
        src={image}
        alt={`Degen #${tokenId}`}
        width={584}
        height={640}
        loading="lazy"
        decoding="async"
        unoptimized={image.endsWith('.gif')}
        style={{ width: '100%', maxWidth: '100%', objectFit: 'cover', height: imageHeight, ...sx }}
        onError={handleImageError}
      />
    )
  }
)

DegenImage.displayName = 'DegenImage'
export default DegenImage
