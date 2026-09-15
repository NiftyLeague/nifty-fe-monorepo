import { memo } from 'react'
import DeferredAnimatedImage from '@nl/ui/custom/deferred-animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { CDN_BASE_URL } from '@/constants/api'
import { LEGGIES } from '@/constants/degens'
const IMAGE_HEIGHT = 320

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
  const target = e.target as HTMLImageElement | HTMLVideoElement
  const fallbackSrc = '/img/degens/unavailable-image.webp'
  if (target.getAttribute('src') !== fallbackSrc) target.src = fallbackSrc
}

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
    // All degen imagery is WebP on the CDN: static for most tokens, animated
    // for legendaries and Hydras. `sm` is the tiny pixel thumb, `md` the
    // card-size render, `lg` the full-resolution poster.
    const imageURL = `${CDN_BASE_URL}/degens/images/bg/md/${tokenId}.webp`
    const posterURL = `${CDN_BASE_URL}/degens/images/bg/sm/${tokenId}.webp`

    const sxHeight =
      sx && typeof sx === 'object' && 'height' in sx ? (sx.height as string | number) : undefined
    const imageHeight = sxHeight ?? IMAGE_HEIGHT
    const isAnimated =
      LEGGIES.includes(Number(tokenId)) || (Number(tokenId) >= 9901 && Number(tokenId) <= 9998)

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
          src={posterURL}
          animatedSrc={imageURL}
          animatedType="image/webp"
          deferAnimation
          activationDelay={1000}
          containerClassName="block"
        />
      )
    }

    return <NativeImage {...imageProps} src={imageURL} unoptimized={isAnimated} />
  }
)

DegenImage.displayName = 'DegenImage'
export default DegenImage
