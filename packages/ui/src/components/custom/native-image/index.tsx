import { splitProps, type ComponentProps, type JSX } from 'solid-js'

export type NativeImageProps = Omit<ComponentProps<'img'>, 'loading'> & {
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
export function NativeImage(props: NativeImageProps) {
  const [local, others] = splitProps(props, [
    'fill',
    'fetchpriority',
    'loading',
    'priority',
    'style',
    'unoptimized',
    'decoding',
  ])
  const resolvedLoading = () => (local.priority ? 'eager' : (local.loading ?? 'lazy'))

  const fillStyle = (): JSX.CSSProperties => ({
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    ...(typeof local.style === 'object' ? local.style : {}),
  })

  return (
    <img
      {...others}
      decoding={local.decoding ?? 'async'}
      fetchpriority={local.fetchpriority ?? (resolvedLoading() === 'lazy' ? 'low' : undefined)}
      loading={resolvedLoading()}
      style={local.fill ? fillStyle() : local.style}
    />
  )
}

export default NativeImage
