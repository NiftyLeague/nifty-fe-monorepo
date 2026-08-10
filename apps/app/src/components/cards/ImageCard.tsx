import useImageOnLoad from '@/hooks/useImageOnLoad'

interface ImageCardProps {
  thumbnail?: string
  image?: string
  title: string
  ratio: number
}

const styleImage: { imageWrapper: React.CSSProperties; imageCommon: React.CSSProperties } = {
  imageWrapper: { height: 0, width: '100%' },
  imageCommon: { position: 'absolute', width: '100%' },
}

const ImageCard = ({ image, thumbnail, title, ratio }: ImageCardProps) => {
  const { handleImageOnLoad, css } = useImageOnLoad()
  return (
    <div style={{ ...styleImage.imageWrapper, paddingBottom: `${ratio * 100}%` }}>
      {thumbnail && (
        <img
          onLoad={handleImageOnLoad}
          src={thumbnail}
          alt={`thumbnail-${title}`}
          loading="lazy"
          decoding="async"
          style={{ ...styleImage.imageCommon, ...css.thumbnail }}
        />
      )}
      {image && (
        <img
          onLoad={handleImageOnLoad}
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          style={{ height: '100%', ...styleImage.imageCommon, ...css.fullSize }}
        />
      )}
    </div>
  )
}

export default ImageCard
