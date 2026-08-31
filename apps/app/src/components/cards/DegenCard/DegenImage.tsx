import { memo } from 'react'
import DeferredAnimatedImage from '@nl/ui/custom/deferred-animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { LEGGIES } from '@/constants/degens'
const IMAGE_HEIGHT = 320

const DegenImage = memo(
  ({
    tokenId,
    sx,
    loading = 'lazy',
    deferAnimation = false,
  }: {
    tokenId: string | number
    sx?: React.CSSProperties
    loading?: 'eager' | 'lazy'
    deferAnimation?: boolean
  }) => {
    const imageURL = `/img/degens/nfts/${tokenId}`

    const sxHeight =
      sx && typeof sx === 'object' && 'height' in sx ? (sx.height as string | number) : undefined
    const imageHeight = sxHeight ?? IMAGE_HEIGHT
    const isAnimated = LEGGIES.includes(Number(tokenId))
    const poster = `${imageURL}.webp`
    const image = isAnimated ? `${imageURL}.gif` : poster

    const handleImageError = (
      e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>
    ) => {
      const target = e.target as HTMLImageElement | HTMLVideoElement
      target.onerror = null
      target.src = '/img/degens/unavailable-image.webp'
    }

    const imageProps = {
      className: 'pixelated',
      alt: `Degen #${tokenId}`,
      width: 584,
      height: 640,
      loading,
      decoding: 'async' as const,
      style: { objectFit: 'cover' as const, height: imageHeight, ...sx },
      onError: handleImageError,
    }

    if (isAnimated && deferAnimation) {
      return (
        <DeferredAnimatedImage
          {...imageProps}
          src={poster}
          animatedSrc={image}
          animatedType="image/gif"
          deferAnimation
          activationDelay={1000}
          containerClassName="block"
        />
      )
    }

    return <NativeImage {...imageProps} src={image} unoptimized={isAnimated} />
  }
)

DegenImage.displayName = 'DegenImage'
export default DegenImage
