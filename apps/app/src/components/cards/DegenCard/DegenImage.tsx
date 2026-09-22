import DeferredAnimatedImage from '@nl/ui/custom/deferred-animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { cn } from '@nl/ui/utils'
import { CDN_BASE_URL } from '@/constants/api'
import { LEGGIES } from '@/constants/degens'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement | HTMLVideoElement
  const fallbackSrc =
    'https://cdn.niftyleague.com/mediahttps://cdn.niftyleague.com/media/img/degens/unavailable-image.webp'
  if (target.getAttribute('src') !== fallbackSrc) target.src = fallbackSrc
}

const DegenImage = (props: {
  tokenId: string | number
  /** Extra classes forwarded to the image element. */
  class?: string
  loading?: 'eager' | 'lazy'
  deferAnimation?: boolean
}) => {
  // All degen imagery is WebP on the CDN: static for most tokens, animated
  // for legendaries and Hydras. `sm` is the tiny pixel thumb, `md` the
  // card-size render, `lg` the full-resolution poster.
  const imageURL = () => `${CDN_BASE_URL}/degens/images/bg/md/${props.tokenId}.webp`
  const posterURL = () => `${CDN_BASE_URL}/degens/images/bg/sm/${props.tokenId}.webp`

  const isAnimated = () =>
    LEGGIES.includes(Number(props.tokenId)) ||
    (Number(props.tokenId) >= 9901 && Number(props.tokenId) <= 10000)

  const alt = () => `Degen #${props.tokenId}`
  const loading = () => props.loading ?? 'lazy'
  const classes = () => cn('pixelated object-cover h-80', props.class)

  if (isAnimated() && props.deferAnimation) {
    return (
      <DeferredAnimatedImage
        class={classes()}
        alt={alt()}
        width={584}
        height={640}
        loading={loading()}
        decoding="async"
        onError={handleImageError}
        src={posterURL()}
        animatedSrc={imageURL()}
        animatedType="image/webp"
        deferAnimation
        activationDelay={1000}
        containerClassName="block"
      />
    )
  }

  return (
    <NativeImage
      class={classes()}
      alt={alt()}
      width={584}
      height={640}
      loading={loading()}
      decoding="async"
      onError={handleImageError}
      src={imageURL()}
      unoptimized={isAnimated()}
    />
  )
}
export default DegenImage
