import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import OptimizedImage, { getOptimizedImageProps, trimFixedWidthSrcSet } from './index'

describe('getOptimizedImageProps', () => {
  const baseProps = {
    alt: 'Artwork',
    height: 200,
    src: 'https://example.com/img/artwork.webp',
    unoptimized: true,
    width: 300,
  } as const

  it('defaults unspecified artwork to lazy low-priority loading', () => {
    const props = getOptimizedImageProps(baseProps)

    expect(props.loading).toBe('lazy')
    expect(props.fetchPriority).toBe('low')
    expect(props.decoding).toBe('async')
  })

  it('gives lazy artwork a low network priority', () => {
    const props = getOptimizedImageProps({ ...baseProps, loading: 'lazy' })

    expect(props.loading).toBe('lazy')
    expect(props.fetchPriority).toBe('low')
    expect(props.decoding).toBe('async')
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

  it('preserves an explicit decoding mode', () => {
    const props = getOptimizedImageProps({ ...baseProps, decoding: 'sync' })

    expect(props.decoding).toBe('sync')
  })

  it('keeps only 1x and 2x candidates for fixed-width artwork', () => {
    const srcSet = [32, 64, 128, 256, 384, 480, 750].map(
      (width) => `/img/artwork.webp?w=${width} ${width}w`
    )

    const trimmed = trimFixedWidthSrcSet(srcSet.join(', '), '200px')

    expect(trimmed?.split(', ')).toHaveLength(2)
    expect(trimmed).toContain('/img/artwork.webp?w=256 256w')
    expect(trimmed).toContain('/img/artwork.webp?w=480 480w')
  })

  it('keeps the complete candidate ladder for fluid artwork', () => {
    const srcSet = [32, 64, 128, 256, 384, 480, 750].map(
      (width) => `/img/artwork.webp?w=${width} ${width}w`
    )

    expect(trimFixedWidthSrcSet(srcSet.join(', '), '100vw')).toBe(srcSet.join(', '))
  })

  it('translates Next priority metadata to native image loading hints', () => {
    const prioritized = getOptimizedImageProps({ ...baseProps, priority: true })
    const preloaded = getOptimizedImageProps({ ...baseProps, preload: true })

    expect(prioritized.loading).toBe('eager')
    expect(prioritized.fetchPriority).toBe('high')
    expect(preloaded.loading).toBe('eager')
    expect(preloaded.fetchPriority).toBe('high')
  })

  it('preloads the same responsive image variant used by the native renderer', () => {
    render(<OptimizedImage {...baseProps} priority />)

    const preloadLink = document.head.querySelector('link[rel="preload"][as="image"]')

    expect(preloadLink?.getAttribute('href')).toBe(baseProps.src)
    expect(preloadLink?.getAttribute('fetchpriority')).toBe('high')
  })
})
