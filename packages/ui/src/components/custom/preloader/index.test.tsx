import { act, render, screen, waitFor } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test'
import { Preloader } from './index'

const state = { mobile: false, milliseconds: 0, start: mock(), stop: mock() }

beforeEach(() => {
  mock.module('@nl/ui/hooks/useStopwatch', () => ({
    useStopwatch: () => ({
      milliseconds: () => state.milliseconds,
      status: () => 'stopped',
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
    render(() => <Preloader ready={false} progress={0.5} />)
    expect(screen.getByText('50%')).toBeTruthy()
  })

  it('renders PreloaderBase with raw progress when progress > 1 (already percent)', () => {
    render(() => <Preloader ready={false} progress={75} />)
    expect(screen.getByText('75%')).toBeTruthy()
  })

  it('renders PreloaderBase with progress=100', () => {
    render(() => <Preloader ready={false} progress={100} />)
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('renders PreloaderBase with progress exactly 1 (boundary)', () => {
    render(() => <Preloader ready={false} progress={1} />)
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('hides the progress bar when progress is 0 (falsy)', () => {
    const { container } = render(() => <Preloader ready={false} progress={0} />)
    // The Progress component and percent text are conditionally rendered
    // only when percent is truthy (base.tsx line 52: {percent ? ... : null})
    expect(container.querySelector('[role="progressbar"]')).toBeNull()
  })

  it('renders the preloader overlay with SVG elements', () => {
    const { container } = render(() => <Preloader ready={false} progress={0.5} />)
    expect(container.querySelector('svg#preloader-arcade')).toBeTruthy()
  })

  it('translates overlay out when ready is true', () => {
    const { container } = render(() => <Preloader ready progress={0.5} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.transform).toContain('translateY(100%)')
    expect(root.style.display).toBe('none')
  })

  it('keeps overlay visible when ready is false', () => {
    const { container } = render(() => <Preloader ready={false} progress={0.5} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.transform).toBe('')
  })

  it('calls start() when not ready', () => {
    render(() => <Preloader ready={false} progress={0.5} />)
    expect(state.start).toHaveBeenCalledTimes(1)
    expect(state.stop).not.toHaveBeenCalled()
  })

  it('calls stop() when ready', () => {
    render(() => <Preloader ready progress={0.5} />)
    expect(state.stop).toHaveBeenCalled()
    expect(state.start).not.toHaveBeenCalled()
  })

  it('calls start() then stop() when ready transitions from false to true', () => {
    const { rerender } = render(() => <Preloader ready={false} progress={0.5} />)
    expect(state.start).toHaveBeenCalledTimes(1)
    expect(state.stop).not.toHaveBeenCalled()

    // Reset stop mock for clean tracking of the rerender's cleanup
    state.stop = mock()

    rerender(<Preloader ready progress={0.5} />)
    expect(state.stop).toHaveBeenCalledTimes(1)
  })

  it('stops stopwatch on unmount (cleanup)', () => {
    const { unmount } = render(() => <Preloader ready={false} progress={0.5} />)
    expect(state.stop).not.toHaveBeenCalled()
    unmount()
    expect(state.stop).toHaveBeenCalled()
  })

  it('does not lock document scroll while loading', () => {
    const html = document.querySelector('html') as HTMLElement
    render(() => <Preloader ready={false} progress={0.5} />)
    expect(html.style.overflow).toBe('')
  })

  it('keeps document scroll unchanged when ready', () => {
    const html = document.querySelector('html') as HTMLElement
    render(() => <Preloader ready progress={0.5} />)
    expect(html.style.overflow).toBe('')
  })

  it('does not change document scroll on unmount', () => {
    const html = document.querySelector('html') as HTMLElement
    const { unmount } = render(() => <Preloader ready={false} progress={0.5} />)
    unmount()
    expect(html.style.overflow).toBe('')
  })

  it('uses the caller label for the loading status', () => {
    render(() => <Preloader ready={false} progress={0} label="Loading maps" />)
    expect(screen.getByText('Loading maps')).toBeTruthy()
    expect(screen.getByRole('status', { name: 'Loading maps' })).toBeTruthy()
  })

  it('shows mobile warning when milliseconds exceed 1200 on mobile', async () => {
    state.mobile = true
    state.milliseconds = 1_500

    render(() => <Preloader ready={false} progress={0.5} />)
    await waitFor(() => {
      expect(screen.getByText(/For the best experience/i)).toBeTruthy()
    })
  })

  it('does not show mobile warning on desktop even with high milliseconds', () => {
    state.mobile = false
    state.milliseconds = 5_000

    render(() => <Preloader ready={false} progress={0.5} />)
    expect(screen.queryByText(/For the best experience/i)).toBeNull()
  })

  it('does not show mobile warning before 1200ms threshold', () => {
    state.mobile = true
    state.milliseconds = 500

    render(() => <Preloader ready={false} progress={0.5} />)
    expect(screen.queryByText(/For the best experience/i)).toBeNull()
  })

  it('re-renders with updated progress value after timer flush', async () => {
    jest.useFakeTimers()
    const { rerender } = render(() => <Preloader ready={false} progress={0.3} />)
    expect(screen.getByText('30%')).toBeTruthy()

    rerender(<Preloader ready={false} progress={0.8} />)
    expect(screen.getByText('80%')).toBeTruthy()
    jest.useRealTimers()
  })

  it('stops stopwatch without changing document scroll when ready transitions', () => {
    const html = document.querySelector('html') as HTMLElement
    const { rerender } = render(() => <Preloader ready={false} progress={0.5} />)
    expect(html.style.overflow).toBe('')

    rerender(<Preloader ready progress={0.5} />)
    expect(html.style.overflow).toBe('')
  })

  it('renders progress bar using Progress component when percent is provided', () => {
    render(() => <Preloader ready={false} progress={0.42} />)
    expect(screen.getByText('42%')).toBeTruthy()
  })

  it('rounds fractional progress to nearest integer', () => {
    render(() => <Preloader ready={false} progress={0.667} />)
    expect(screen.getByText('67%')).toBeTruthy()
  })

  it('renders progress = 90 as a derived percent (uses fake timers)', () => {
    jest.useFakeTimers()
    render(() => <Preloader ready={false} progress={90} />)
    act(() => jest.advanceTimersByTime(200))
    expect(screen.getByText('90%')).toBeTruthy()
    jest.useRealTimers()
  })
})
