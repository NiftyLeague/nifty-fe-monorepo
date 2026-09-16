import DeferredAnimatedImage from '@nl/ui/custom/deferred-animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { cn } from '@nl/ui/utils'
import { LEGGIES } from '@/constants/degens'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement | HTMLVideoElement
  const fallbackSrc = '/img/degens/unavailable-image.webp'
  if (target.getAttribute('src') !== fallbackSrc) target.src = fallbackSrc
}

const DegenImage = (props: {
  tokenId: string | number
  /** Extra classes forwarded to the image element. */
  class?: string
  loading?: 'eager' | 'lazy'
  deferAnimation?: boolean
}) => {
  const imageURL = () => `/img/degens/nfts/${props.tokenId}`

  const isAnimated = () => LEGGIES.includes(Number(props.tokenId))
  const poster = () => `${imageURL()}.webp`
  const image = () => (isAnimated() ? `${imageURL()}.gif` : poster())

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
      class={classes()}
      alt={alt()}
      width={584}
      height={640}
      loading={loading()}
      decoding="async"
      onError={handleImageError}
      src={image()}
      unoptimized={isAnimated()}
    />
  )
}
export default DegenImage
