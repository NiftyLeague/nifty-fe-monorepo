import { render, screen } from '@nl/ui/test-utils'
import { afterEach, describe, expect, it, mock } from 'bun:test'

import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'
import type { JSX } from 'solid-js'

mock.module('@/runtime/Link', () => ({
  default: ({ children, href, ...props }: { href: string } & { children?: JSX.Element }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@nl/ui/custom/external-icon', () => ({
  ExternalIcon: () => null,
}))

describe('NiftyWorldScene', () => {
  afterEach(() => {
    mock.restore()
  })

  it('reuses the game screen flow with world-specific copy and scene URL', async () => {
    const { default: NiftyWorldScene } = await import('./NiftyWorldScene')
    const scene = NIFTY_WORLD_SCENES[0]

    render(() => <NiftyWorldScene scene={scene} />)

    const iframe = screen.getByTitle(`${scene.title} world map`)
    expect(iframe.classList.contains('rounded-md')).toBe(true)
    expect(new URL(iframe.getAttribute('src') ?? '').pathname).toBe('/scenes/isla-azul')
    expect(screen.getByText('Nifty World')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Back to maps' }).getAttribute('href')).toBe('/world')
    expect(screen.queryByText('Nifty League mini game')).toBeNull()
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeTruthy()
  })
})

mock.module('@/runtime/Link', () => ({
  default: ({ children, href, ...props }: { href: string } & { children?: JSX.Element }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@nl/ui/custom/external-icon', () => ({
  ExternalIcon: () => null,
}))
