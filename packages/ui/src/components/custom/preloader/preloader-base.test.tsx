import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import { PreloaderBase } from './base'

describe('PreloaderBase', () => {
  it('renders the preloader overlay with SVG elements', () => {
    const { container } = render(<PreloaderBase />)
    // Root element exists (the overlay div)
    expect(container.firstChild).toBeTruthy()
    // The arcade SVG icon is present
    expect(container.querySelector('svg#preloader-arcade')).toBeTruthy()
  })

  it('shows no progress bar when percent is omitted', () => {
    const { container } = render(<PreloaderBase />)
    // No progress bar when percent is undefined — the Progress component
    // renders with role="progressbar"
    expect(container.querySelector('[role="progressbar"]')).toBeNull()
  })

  it('renders a progress bar and percentage when percent is provided', () => {
    render(<PreloaderBase percent={42} />)
    expect(screen.getByText('42%')).toBeTruthy()
  })

  it('rounds the displayed percentage to the nearest integer', () => {
    render(<PreloaderBase percent={66.7} />)
    expect(screen.getByText('67%')).toBeTruthy()
  })

  it('does not show the mobile warning text when showWarning is false', () => {
    render(<PreloaderBase percent={50} showWarning={false} />)
    expect(screen.queryByText(/For the best experience/i)).toBeNull()
  })

  it('shows the mobile warning text when showWarning is true', () => {
    render(<PreloaderBase percent={50} showWarning />)
    expect(screen.getByText(/For the best experience try us out on desktop/i)).toBeTruthy()
  })

  it('applies translateY(100%) and display:none when ready is true', () => {
    const { container } = render(<PreloaderBase ready />)
    // The root element should have the ready inline styles
    const root = container.firstChild as HTMLElement
    expect(root).toBeTruthy()
    expect(root.style.transform).toContain('translateY(100%)')
    expect(root.style.display).toBe('none')
  })

  it('uses default CSS transform when not ready', () => {
    const { container } = render(<PreloaderBase />)
    const root = container.firstChild as HTMLElement
    expect(root.style.transform).toBe('')
  })

  it('renders the preloader inner with SVG via role="img"', () => {
    const { container } = render(<PreloaderBase />)
    expect(container.querySelector('svg[role="img"]')).toBeTruthy()
    expect(container.querySelector('#preloader-arcade')).toBeTruthy()
  })

  it('shows warning only when percent is present', () => {
    // Without percent, the conditional block is null so warning class doesn't exist
    const { container, rerender } = render(<PreloaderBase showWarning />)
    expect(container.querySelector('.text-warning')).toBeNull()

    // With percent, warning block renders
    rerender(<PreloaderBase percent={30} showWarning />)
    expect(screen.getByText(/For the best experience/i)).toBeTruthy()
  })

  it('renders multiple SVG circle and path elements', () => {
    const { container } = render(<PreloaderBase />)
    const svg = container.querySelector('#preloader-arcade')
    expect(svg).toBeTruthy()
    // SVG should contain at least circle and path elements (the arcade machine design)
    expect(svg?.querySelectorAll('circle').length).toBeGreaterThanOrEqual(8)
    expect(svg?.querySelectorAll('path').length).toBeGreaterThanOrEqual(6)
  })
})
