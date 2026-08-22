import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { DashboardDegen } from '@/types/degens'

mock.module('@nl/ui/custom/viewport-video', () => ({
  ViewportVideo: (props: ComponentProps<'video'>) => (
    <video data-testid="viewport-video" {...props} />
  ),
}))

let DegenInternalImage: typeof import('./DegenInternalImage').default

beforeEach(async () => {
  DegenInternalImage = (await import('./DegenInternalImage')).default
})

const baseDegen = {
  id: '1',
  name: 'Nifty Andy',
  owner: '0x0000000000000000000000000000000000000000',
  background: 'blue',
  tribe: 'nifty',
  traits_string: '',
  price: 0,
  price_daily: 0,
  multiplier: 1,
  rental_count: 0,
} satisfies DashboardDegen

describe('DegenInternalImage', () => {
  it('uses the shared viewport video for animated legendary avatars', () => {
    render(
      <DegenInternalImage
        degen={{ ...baseDegen, background: 'legendary', url: '/media/legendary.mp4' }}
      />
    )

    const video = screen.getByTestId('viewport-video')
    expect(video.getAttribute('src')).toBe('/media/legendary.mp4')
    expect(video.getAttribute('muted')).toBe('')
    expect(video.getAttribute('loop')).toBe('')
    expect(video.getAttribute('aria-label')).toBe('Nifty Andy')
  })

  it('keeps non-animated profile media lazy', () => {
    render(<DegenInternalImage degen={{ ...baseDegen, url: '/media/avatar.webp' }} />)

    const image = screen.getByRole('img', { name: 'Nifty Andy' })
    expect(image.getAttribute('src')).toBe('/media/avatar.webp')
    expect(image.getAttribute('loading')).toBe('lazy')
  })
})
