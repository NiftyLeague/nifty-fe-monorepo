import { render, screen } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('./GameCard', () => ({
  default: ({
    autoHeight,
    description,
    href,
    hoverActionLabel,
    image,
    overlayContent,
    prefetch,
    title,
  }: {
    autoHeight?: boolean
    description?: string
    href?: string
    hoverActionLabel?: string
    image?: string
    overlayContent?: boolean
    prefetch?: boolean
    title?: string
  }) => (
    <div
      data-auto-height={String(autoHeight)}
      data-description={description}
      data-href={href}
      data-hover-action-label={hoverActionLabel}
      data-image={image}
      data-overlay-content={String(overlayContent)}
      data-prefetch={String(prefetch)}
    >
      {title}
    </div>
  ),
}))

describe('NiftyWorldCard', () => {
  let NiftyWorldCard: typeof import('./NiftyWorldCard').default

  beforeEach(async () => {
    NiftyWorldCard = (await import('./NiftyWorldCard')).default
  })

  it('provides one shared full-bleed card contract for worlds and mini games', () => {
    render(() => (
      <NiftyWorldCard
        title="Degen Dodge"
        description="Dodge danger"
        image="https://niftyworld.gg/assets/maps/degen-dodge.webp"
        href="/games/degen-dodge"
      />
    ))

    const card = screen.getByText('Degen Dodge')
    expect(card.getAttribute('data-auto-height')).toBe('true')
    expect(card.getAttribute('data-overlay-content')).toBe('true')
    expect(card.getAttribute('data-prefetch')).toBe('undefined')
    expect(card.getAttribute('data-href')).toBe('/games/degen-dodge')
    expect(card.getAttribute('data-hover-action-label')).toBe('Explore map')
  })
})
