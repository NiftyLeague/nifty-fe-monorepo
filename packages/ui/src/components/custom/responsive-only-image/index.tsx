import { getOptimizedImageProps } from '@nl/ui/custom/optimized-image'

const RESPONSIVE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

export interface ResponsiveOnlyImageProps {
  alt: string
  className?: string
  height: number
  loading?: 'eager' | 'lazy'
  media: string
  sizes: string
  src: string
  style?: React.CSSProperties
  width: number
}

/**
 * Keeps art-directed images out of the non-matching breakpoint's request path.
 * The matching source retains Next's responsive URL generation and dimensions.
 */
export function ResponsiveOnlyImage({
  alt,
  className,
  height,
  loading = 'lazy',
  media,
  sizes,
  src,
  style,
  width,
}: ResponsiveOnlyImageProps) {
  const props = getOptimizedImageProps({ alt, height, loading, sizes, src, width })
  const { src: _src, srcSet: _srcSet, sizes: _sizes, ...fallbackProps } = props

  return (
    <picture className="block">
      <source media={media} sizes={sizes} srcSet={props.srcSet} />
      <img
        {...fallbackProps}
        alt={alt}
        className={className}
        height={height}
        src={RESPONSIVE_PLACEHOLDER}
        style={style}
        width={width}
      />
    </picture>
  )
}

export function DesktopOnlyImage(props: Omit<ResponsiveOnlyImageProps, 'media'>) {
  return <ResponsiveOnlyImage media="(min-width: 769px)" {...props} />
}

export function MobileOnlyImage(props: Omit<ResponsiveOnlyImageProps, 'media'>) {
  return <ResponsiveOnlyImage media="(max-width: 768px)" {...props} />
}

export default DesktopOnlyImage
