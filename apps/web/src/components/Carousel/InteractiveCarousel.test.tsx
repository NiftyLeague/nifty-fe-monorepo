import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import InteractiveCarousel from './InteractiveCarousel'

const scrollTo = mock()

beforeEach(() => {
  scrollTo.mockReset()

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 400,
  })
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
    }),
  })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 100,
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return this.querySelector('[data-carousel-slide]') ? 300 : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: scrollTo,
  })
})

describe('InteractiveCarousel', () => {
  it('provides labeled slides and keyboard controls on mobile', async () => {
    render(
      <InteractiveCarousel isMobileViewOnly ariaLabel="Featured DEGENs">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </InteractiveCarousel>
    )

    expect(screen.getByRole('region', { name: 'Featured DEGENs' })).toBeDefined()
    expect(screen.getAllByRole('group', { name: /of 3/ })).toHaveLength(3)

    const overlay = document.querySelector('.dark-gradient-overlay')
    expect(overlay?.className).toContain('!top-0')
    expect(overlay?.className).toContain('!h-full')

    const nextButton = await screen.findByRole('button', { name: 'Go to next slide' })
    expect(nextButton.getAttribute('aria-controls')).toBeTruthy()

    const viewport = screen.getByLabelText('Featured DEGENs slides')
    fireEvent.keyDown(viewport, { key: 'ArrowRight' })

    expect(scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' })
  })
})
