import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/Link', () => ({
  default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@nl/ui/custom/external-icon', () => ({
  ExternalIcon: () => null,
}))

describe('NiftyWorldMintOMatic', () => {
  afterEach(() => {
    mock.restore()
  })

  it('embeds the hosted Nifty World mint experience', async () => {
    const { default: NiftyWorldMintOMatic } = await import('./NiftyWorldMintOMatic')

    render(<NiftyWorldMintOMatic />)

    const iframe = screen.getByTitle('Mint-o-Matic character creator')
    const src = iframe.getAttribute('src') ?? ''
    expect(new URL(src).pathname).toBe('/other/mint-o-matic')
    expect(new URL(src).searchParams.get('embed')).toBe('1')
    expect(new URL(src).searchParams.get('visit')).toBeTruthy()
    expect(screen.getByText('Nifty World')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Back to home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: /Open in new tab/ }).getAttribute('href')).toBe(
      'https://niftyworld.gg/other/mint-o-matic'
    )
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeTruthy()
  })
})
