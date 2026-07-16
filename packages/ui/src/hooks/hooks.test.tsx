import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from './useCopyToClipboard';
import { useMediaQuery } from './useMediaQuery';
import { STATUS, useStopwatch } from './useStopwatch';
import { useUserAgent } from './useUserAgent';

describe('useCopyToClipboard', () => {
  it('copies text and exposes the last successful value', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => expect(await result.current[1]('nifty')).toBe(true));

    expect(writeText).toHaveBeenCalledWith('nifty');
    expect(result.current[0]).toBe('nifty');
  });

  it('reports clipboard failures without retaining stale text', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => expect(await result.current[1]('blocked')).toBe(false));
    expect(result.current[0]).toBeNull();
  });
});

describe('useMediaQuery', () => {
  it('subscribes to media changes and updates the result', () => {
    let listener: (() => void) | undefined;
    let matches = false;
    const media = {
      get matches() {
        return matches;
      },
      addListener: vi.fn((callback: () => void) => {
        listener = callback;
      }),
      removeListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(media as never);
    const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 900px)'));

    expect(result.current).toBe(false);
    matches = true;
    act(() => listener?.());
    expect(result.current).toBe(true);
    unmount();
    expect(media.removeListener).toHaveBeenCalled();
  });
});

describe('useStopwatch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('moves through start, pause, restart, and stop states', () => {
    const onStart = vi.fn();
    const onPause = vi.fn();
    const onRestart = vi.fn();
    const onStop = vi.fn();
    const { result } = renderHook(() => useStopwatch({ interval: 10, onStart, onPause, onRestart, onStop }));

    act(() => result.current.start());
    expect(result.current.status).toBe(STATUS.RUNNING);
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.milliseconds).toBe(10);

    act(() => result.current.pause());
    expect(result.current.status).toBe(STATUS.PAUSED);
    act(() => result.current.restart());
    expect(result.current.status).toBe(STATUS.RUNNING);
    act(() => result.current.stop());
    expect(result.current).toMatchObject({ status: STATUS.STOPPED, milliseconds: 0 });
    expect([onStart, onPause, onRestart, onStop].every(callback => callback.mock.calls.length === 1)).toBe(true);
  });
});

describe('useUserAgent', () => {
  it('classifies mobile and desktop agents', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPhone)');
    const mobile = renderHook(() => useUserAgent()).result.current;
    expect(mobile.isIos()).toBe(true);
    expect(mobile.isMobile()).toBe(true);
    expect(mobile.isDesktop()).toBe(false);
  });
});
