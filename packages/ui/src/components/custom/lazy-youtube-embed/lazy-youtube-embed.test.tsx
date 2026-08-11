import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { LazyYouTubeEmbed } from './index'

describe('LazyYouTubeEmbed', () => {
  it('renders an accessible, natively lazy YouTube iframe', () => {
    const { container } = render(
      <LazyYouTubeEmbed src="about:blank" title="Example game trailer" className="aspect-video" />
    )
    const iframe = container.querySelector('iframe')

    expect(iframe).toBeTruthy()
    expect(iframe?.getAttribute('src')).toBe('about:blank')
    expect(iframe?.getAttribute('title')).toBe('Example game trailer')
    expect(iframe?.getAttribute('loading')).toBe('lazy')
    expect(iframe?.getAttribute('allow')).toContain('autoplay')
    expect(iframe?.getAttribute('frameborder')).toBe('0')
    expect(iframe?.className).toBe('aspect-video')
  })
})
