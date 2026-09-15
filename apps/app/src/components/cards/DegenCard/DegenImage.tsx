import DeferredAnimatedImage from '@nl/ui/custom/deferred-animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { LEGGIES } from '@/constants/degens'
import type { JSX } from 'solid-js'

const IMAGE_HEIGHT = 320

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement | HTMLVideoElement
  const fallbackSrc = '/img/degens/unavailable-image.webp'
  if (target.getAttribute('src') !== fallbackSrc) target.src = fallbackSrc
}

const DegenImage = (props: {
  tokenId: string | number
  sx?: JSX.CSSProperties
  loading?: 'eager' | 'lazy'
  deferAnimation?: boolean
}) => {
  const imageURL = () => `/img/degens/nfts/${props.tokenId}`

  const sxHeight = () =>
    props.sx && typeof props.sx === 'object' && 'height' in props.sx
      ? (props.sx.height as string | number)
      : undefined
  const imageHeight = () => sxHeight() ?? `${IMAGE_HEIGHT}px`
  const isAnimated = () => LEGGIES.includes(Number(props.tokenId))
  const poster = () => `${imageURL()}.webp`
  const image = () => (isAnimated() ? `${imageURL()}.gif` : poster())

  const style = () => ({
    'object-fit': 'cover' as const,
    height: imageHeight(),
    ...(props.sx as JSX.CSSProperties),
  })
  const alt = () => `Degen #${props.tokenId}`
  const loading = () => props.loading ?? 'lazy'

  if (isAnimated() && props.deferAnimation) {
    return (
      <DeferredAnimatedImage
        class="pixelated"
        alt={alt()}
        width={584}
        height={640}
        loading={loading()}
        decoding="async"
        style={style() as JSX.CSSProperties}
        onError={handleImageError}
        src={poster()}
        animatedSrc={image()}
        animatedType="image/gif"
        deferAnimation
        activationDelay={1000}
        containerClassName="block"
      />
    )
  }

  return (
    <NativeImage
      class="pixelated"
      alt={alt()}
      width={584}
      height={640}
      loading={loading()}
      decoding="async"
      style={style() as JSX.CSSProperties}
      onError={handleImageError}
      src={image()}
      unoptimized={isAnimated()}
    />
  )
}
export default DegenImage
