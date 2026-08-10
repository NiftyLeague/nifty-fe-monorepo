import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('next/image', () => ({
  default: (props: React.ComponentProps<'img'>) => <img {...props} />,
}))
mock.module('@nl/ui/custom/animated-wrapper', () => ({
  AnimatedWrapper: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))
mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: () => true,
}))

describe('ConsoleGame', () => {
  let ConsoleGame: typeof import('./index').ConsoleGame

  beforeEach(async () => {
    ConsoleGame = (await import('./index')).ConsoleGame
  })

  it('defers the backdrop image while the video remains viewport-aware', () => {
    const { container } = render(<ConsoleGame src="/video/example.mp4" />)
    const image = container.querySelector('img')
    const video = container.querySelector('video')

    expect(image?.getAttribute('loading')).toBe('lazy')
    expect(video?.getAttribute('preload')).toBe('metadata')
  })
})
