import useImageOnLoad from '@/hooks/useImageOnLoad'
import { AnimatedImage } from '@nl/ui/custom/animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { Show, type JSX } from 'solid-js'

interface ImageCardProps {
  thumbnail?: string
  image?: string
  imageWebp?: string
  title: string
  ratio: number
}

const styleImage: { imageWrapper: JSX.CSSProperties; imageCommon: JSX.CSSProperties } = {
  imageWrapper: { height: '0', width: '100%' },
  imageCommon: { position: 'absolute', width: '100%' },
}

const ImageCard = (props: ImageCardProps) => {
  const { handleImageOnLoad, css } = useImageOnLoad()
  return (
    <div
      class="relative"
      style={{ ...styleImage.imageWrapper, 'padding-bottom': `${props.ratio * 100}%` }}
    >
      <Show when={props.thumbnail}>
        <NativeImage
          onLoad={handleImageOnLoad}
          src={props.thumbnail!}
          alt={`thumbnail-${props.title}`}
          loading="lazy"
          decoding="async"
          style={{ ...styleImage.imageCommon, ...css.thumbnail }}
        />
      </Show>
      <Show when={props.image}>
        <Show
          when={props.imageWebp}
          fallback={
            <NativeImage
              onLoad={handleImageOnLoad}
              src={props.image!}
              alt={props.title}
              loading="lazy"
              decoding="async"
              style={{ height: '100%', ...styleImage.imageCommon, ...css.fullSize }}
            />
          }
        >
          <AnimatedImage
            onLoad={handleImageOnLoad}
            src={props.image!}
            animatedSrc={props.imageWebp!}
            animatedType="image/webp"
            alt={props.title}
            fill
            sizes="(max-width: 1023px) 100vw, 345px"
            loading="lazy"
            decoding="async"
            style={{ ...styleImage.imageCommon, ...css.fullSize }}
          />
        </Show>
      </Show>
    </div>
  )
}

export default ImageCard
