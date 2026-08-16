import type { CSSProperties } from 'react'

export type NativeImageProps = Omit<React.ComponentProps<'img'>, 'loading'> & {
  fill?: boolean
  loading?: 'eager' | 'lazy'
  priority?: boolean
  unoptimized?: boolean
}

/**
 * Lightweight image primitive for client components and external media.
 * It preserves the sizing contract used by next/image without importing its
 * stateful client runtime into the bundle.
 */
export function NativeImage({
  fill,
  loading,
  priority,
  style,
  unoptimized: _unoptimized,
  ...props
}: NativeImageProps) {
  const imageStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
    : style

  return (
    <img
      {...props}
      decoding={props.decoding ?? 'async'}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      style={imageStyle}
    />
  )
}

export default NativeImage
