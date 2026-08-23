import useImageOnLoad from '@/hooks/useImageOnLoad'
import { AnimatedImage } from '@nl/ui/custom/animated-image'
import NativeImage from '@nl/ui/custom/native-image'

interface ImageCardProps {
  thumbnail?: string
  image?: string
  imageWebp?: string
  title: string
  ratio: number
}

const styleImage: { imageWrapper: React.CSSProperties; imageCommon: React.CSSProperties } = {
  imageWrapper: { height: 0, width: '100%' },
  imageCommon: { position: 'absolute', width: '100%' },
}

const ImageCard = ({ image, imageWebp, thumbnail, title, ratio }: ImageCardProps) => {
  const { handleImageOnLoad, css } = useImageOnLoad()
  return (
    <div
      className="relative"
      style={{ ...styleImage.imageWrapper, paddingBottom: `${ratio * 100}%` }}
    >
      {thumbnail && (
        <NativeImage
          onLoad={handleImageOnLoad}
          src={thumbnail}
          alt={`thumbnail-${title}`}
          loading="lazy"
          decoding="async"
          style={{ ...styleImage.imageCommon, ...css.thumbnail }}
        />
      )}
      {image &&
        (imageWebp ? (
          <AnimatedImage
            onLoad={handleImageOnLoad}
            src={image}
            webpSrc={imageWebp}
            alt={title}
            fill
            sizes="(max-width: 1023px) 100vw, 345px"
            loading="lazy"
            decoding="async"
            style={{ ...styleImage.imageCommon, ...css.fullSize }}
          />
        ) : (
          <NativeImage
            onLoad={handleImageOnLoad}
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{ height: '100%', ...styleImage.imageCommon, ...css.fullSize }}
          />
        ))}
    </div>
  )
}

export default ImageCard
