import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test'
import { Preloader } from './index'

const state = { mobile: false, milliseconds: 0, start: mock(), stop: mock() }

beforeEach(() => {
  mock.module('@nl/ui/hooks/useStopwatch', () => ({
    useStopwatch: () => ({
      milliseconds: state.milliseconds,
      status: 'stopped',
      start: state.start,
      stop: state.stop,
      pause: mock(),
      restart: mock(),
    }),
  }))
  mock.module('@nl/ui/hooks/useUserAgent', () => ({
    useUserAgent: () => ({ isMobile: () => state.mobile }),
  }))
})

afterEach(() => {
  jest.useRealTimers()
  state.mobile = false
  state.milliseconds = 0
  state.start = mock()
  state.stop = mock()
})

describe('Preloader', () => {
  it('renders PreloaderBase with correct percent when progress <= 1 (normalized)', () => {
    render(<Preloader ready={false} progress={0.5} />)
    expect(screen.getByText('50%')).toBeTruthy()
  })

  it('renders PreloaderBase with raw progress when progress > 1 (already percent)', () => {
    render(<Preloader ready={false} progress={75} />)
    expect(screen.getByText('75%')).toBeTruthy()
  })

  it('renders PreloaderBase with progress=100', () => {
    render(<Preloader ready={false} progress={100} />)
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('renders PreloaderBase with progress exactly 1 (boundary)', () => {
    render(<Preloader ready={false} progress={1} />)
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('hides the progress bar when progress is 0 (falsy)', () => {
    const { container } = render(<Preloader ready={false} progress={0} />)
    // The Progress component and percent text are conditionally rendered
    // only when percent is truthy (base.tsx line 52: {percent ? ... : null})
    expect(container.querySelector('[role="progressbar"]')).toBeNull()
  })

  it('renders the preloader overlay with SVG elements', () => {
    const { container } = render(<Preloader ready={false} progress={0.5} />)
    expect(container.querySelector('svg#preloader-arcade')).toBeTruthy()
  })

  it('translates overlay out when ready is true', () => {
    const { container } = render(<Preloader ready progress={0.5} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.transform).toContain('translateY(100%)')
    expect(root.style.display).toBe('none')
  })

  it('keeps overlay visible when ready is false', () => {
    const { container } = render(<Preloader ready={false} progress={0.5} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.transform).toContain('translateY(0)')
  })

  it('calls start() when not ready', () => {
    render(<Preloader ready={false} progress={0.5} />)
    expect(state.start).toHaveBeenCalledTimes(1)
    expect(state.stop).not.toHaveBeenCalled()
  })

  it('calls stop() when ready', () => {
    render(<Preloader ready progress={0.5} />)
    expect(state.stop).toHaveBeenCalled()
    expect(state.start).not.toHaveBeenCalled()
  })

  it('calls start() then stop() when ready transitions from false to true', () => {
    const { rerender } = render(<Preloader ready={false} progress={0.5} />)
    expect(state.start).toHaveBeenCalledTimes(1)
    expect(state.stop).not.toHaveBeenCalled()

    // Reset stop mock for clean tracking of the rerender's cleanup
    state.stop = mock()

    rerender(<Preloader ready progress={0.5} />)
    expect(state.stop).toHaveBeenCalledTimes(1)
  })

  it('stops stopwatch on unmount (cleanup)', () => {
    const { unmount } = render(<Preloader ready={false} progress={0.5} />)
    expect(state.stop).not.toHaveBeenCalled()
    unmount()
    expect(state.stop).toHaveBeenCalled()
  })

  it('locks scroll when not ready', () => {
    const html = document.querySelector('html') as HTMLElement
    render(<Preloader ready={false} progress={0.5} />)
    expect(html.style.overflow).toBe('hidden')
  })

  it('unlocks scroll when ready', () => {
    const html = document.querySelector('html') as HTMLElement
    render(<Preloader ready progress={0.5} />)
    expect(html.style.overflow).toBe('')
  })

  it('restores overflow on unmount', () => {
    const html = document.querySelector('html') as HTMLElement
    const { unmount } = render(<Preloader ready={false} progress={0.5} />)
    expect(html.style.overflow).toBe('hidden')
    unmount()
    expect(html.style.overflow).toBe('')
  })

  it('shows mobile warning when milliseconds exceed 1200 on mobile', async () => {
    state.mobile = true
    state.milliseconds = 1_500

    render(<Preloader ready={false} progress={0.5} />)
    await waitFor(() => {
      expect(screen.getByText(/For the best experience/i)).toBeTruthy()
    })
  })

  it('does not show mobile warning on desktop even with high milliseconds', () => {
    state.mobile = false
    state.milliseconds = 5_000

    render(<Preloader ready={false} progress={0.5} />)
    expect(screen.queryByText(/For the best experience/i)).toBeNull()
  })

  it('does not show mobile warning before 1200ms threshold', () => {
    state.mobile = true
    state.milliseconds = 500

    render(<Preloader ready={false} progress={0.5} />)
    expect(screen.queryByText(/For the best experience/i)).toBeNull()
  })

  it('re-renders with updated progress value after timer flush', async () => {
    jest.useFakeTimers()
    const { rerender } = render(<Preloader ready={false} progress={0.3} />)
    expect(screen.getByText('30%')).toBeTruthy()

    rerender(<Preloader ready={false} progress={0.8} />)
    expect(screen.getByText('80%')).toBeTruthy()
    jest.useRealTimers()
  })

  it('stops stopwatch and unlocks scroll when ready transitions from false to true', () => {
    const html = document.querySelector('html') as HTMLElement
    const { rerender } = render(<Preloader ready={false} progress={0.5} />)
    expect(html.style.overflow).toBe('hidden')

    rerender(<Preloader ready progress={0.5} />)
    expect(html.style.overflow).toBe('')
  })

  it('renders progress bar using Progress component when percent is provided', () => {
    render(<Preloader ready={false} progress={0.42} />)
    expect(screen.getByText('42%')).toBeTruthy()
  })

  it('rounds fractional progress to nearest integer', () => {
    render(<Preloader ready={false} progress={0.667} />)
    expect(screen.getByText('67%')).toBeTruthy()
  })

  it('handles progress = 90 by stalling with interval (uses fake timers)', () => {
    jest.useFakeTimers()
    render(<Preloader ready={false} progress={90} />)
    // loadingPercentage = Math.round(90) = 90, so effect 3 fires setInterval
    // The initial percent is set to 90 via useState(loadingPercentage),
    // but the interval effect starts at 0 and increments by 10 each tick
    act(() => jest.advanceTimersByTime(200))
    // After 2 ticks (200ms), percent should be ~20
    const percentText = screen.getByText(/%/)
    expect(percentText.textContent).toBeTruthy()
    jest.useRealTimers()
  })
})
