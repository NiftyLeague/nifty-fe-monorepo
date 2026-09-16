import useImageOnLoad from '@/hooks/useImageOnLoad'
import { AnimatedImage } from '@nl/ui/custom/animated-image'
import NativeImage from '@nl/ui/custom/native-image'
import { cn } from '@nl/ui/utils'
import { Show } from 'solid-js'

interface ImageCardProps {
  thumbnail?: string
  image?: string
  imageWebp?: string
  title: string
  ratio: number
}

const ImageCard = (props: ImageCardProps) => {
  const { handleImageOnLoad, classes } = useImageOnLoad()
  return (
    <div
      class="relative h-0 w-full pb-(--ratio-pad)"
      style={{ '--ratio-pad': `${props.ratio * 100}%` }}
    >
      <Show when={props.thumbnail}>
        <div class={cn('absolute inset-0', classes.thumbnail)}>
          <NativeImage
            onLoad={handleImageOnLoad}
            src={props.thumbnail!}
            alt={`thumbnail-${props.title}`}
            loading="lazy"
            decoding="async"
            class="w-full"
          />
        </div>
      </Show>
      <Show when={props.image}>
        <Show
          when={props.imageWebp}
          fallback={
            <div class={cn('absolute inset-0', classes.fullSize)}>
              <NativeImage
                onLoad={handleImageOnLoad}
                src={props.image!}
                alt={props.title}
                loading="lazy"
                decoding="async"
                class="w-full h-full"
              />
            </div>
          }
        >
          <div class={cn('absolute inset-0', classes.fullSize)}>
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
            />
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ImageCard
