import { describe, expect, it } from 'bun:test'

import { getOptimizedImageProps } from './index'

describe('getOptimizedImageProps', () => {
  const baseProps = {
    alt: 'Artwork',
    height: 200,
    src: 'https://example.com/img/artwork.webp',
    unoptimized: true,
    width: 300,
  } as const

  it('gives lazy artwork a low network priority', () => {
    const props = getOptimizedImageProps({ ...baseProps, loading: 'lazy' })

    expect(props.loading).toBe('lazy')
    expect(props.fetchPriority).toBe('low')
  })

  it('preserves explicit priority and eager image behavior', () => {
    const highPriority = getOptimizedImageProps({
      ...baseProps,
      fetchPriority: 'high',
      loading: 'lazy',
    })
    const eager = getOptimizedImageProps({ ...baseProps, loading: 'eager' })

    expect(highPriority.fetchPriority).toBe('high')
    expect(eager.fetchPriority).toBeUndefined()
  })
})
