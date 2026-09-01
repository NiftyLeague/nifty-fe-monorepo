import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('./roadmapCard', () => ({
  default: ({ side, title }: { side: string; title: string }) => (
    <article data-side={side} data-testid="roadmap-card">
      {title}
    </article>
  ),
  getRoadmapCardSide: (index: number) => (index % 2 === 0 ? 'left' : 'right'),
}))

describe('RoadmapTimelineCards', () => {
  it('renders the deferred catalog directly with alternating sides', async () => {
    const RoadmapTimelineCards = (await import('./RoadmapTimelineCards')).default

    render(<RoadmapTimelineCards />)

    const cards = screen.getAllByTestId('roadmap-card')
    expect(cards.length).toBeGreaterThan(1)
    expect(cards[0]?.getAttribute('data-side')).toBe('right')
    expect(cards[1]?.getAttribute('data-side')).toBe('left')
  })
})
