import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const device = vi.hoisted(() => ({ android: false, ios: false, mac: false, windows: true }));

vi.mock('react-device-detect', () => ({
  get isAndroid() {
    return device.android;
  },
  get isIOS() {
    return device.ios;
  },
  get isMacOs() {
    return device.mac;
  },
  get isWindows() {
    return device.windows;
  },
}));

import useUnityEventHandlers from './useUnityEventHandlers';
import useUnitySafeClose from './useUnitySafeClose';
import useVersion from './useVersion';

afterEach(() => {
  vi.restoreAllMocks();
  device.android = false;
  device.ios = false;
  device.mac = false;
  device.windows = true;
  document.body.innerHTML = '';
});

describe('useVersion', () => {
  it('fetches the Windows launcher version and creates its download URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('1.2.3-build\n', { status: 200 }));
    const { result } = renderHook(() => useVersion());

    await waitFor(() => expect(result.current.version).toBe('1.2.3-build\n'));
    expect(result.current.isWindows).toBe(true);
    expect(result.current.downloadURL).toContain('/launcher/stage/win/1.2.3-build');
    expect(result.current.message).toContain('Download Nifty Smashers Beta');
  });

  it('returns the platform message without fetching for Android', () => {
    device.windows = false;
    device.android = true;
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const { result } = renderHook(() => useVersion());

    expect(result.current.isWindows).toBe(false);
    expect(result.current.downloadURL).toBeNull();
    expect(result.current.message).toContain('Google Play');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['iOS', 'Download Nifty Smashers Beta on the App Store!', { ios: true, mac: false, linux: false }],
    ['macOS', 'Download Nifty Smashers Beta on mobile or PC! ', { ios: false, mac: true, linux: false }],
    ['Linux', 'Download Nifty Smashers Beta on mobile or PC! ', { ios: false, mac: false, linux: true }],
  ])('selects the %s platform message', (_platform, message, flags) => {
    device.windows = false;
    device.ios = flags.ios ?? false;
    device.mac = flags.mac ?? false;
    if (flags.linux) vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Linux');

    const { result } = renderHook(() => useVersion());
    expect(result.current.message).toBe(message);
    expect(result.current.downloadURL).toBeNull();
  });

  it('handles launcher version failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const { result } = renderHook(() => useVersion());

    await waitFor(() => expect(result.current.version).toBe(''), { timeout: 10_000 });
  });
});

describe('useUnityEventHandlers', () => {
  it('registers Unity callbacks, authenticates, configures, and cleans up', async () => {
    const listeners = new Map<string, (...parameters: unknown[]) => unknown>();
    const addEventListener = vi.fn((name: string, callback: (...parameters: unknown[]) => unknown) => {
      listeners.set(name, callback);
    });
    const removeEventListener = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ address, authToken }) => useUnityEventHandlers({ address, authToken, addEventListener, removeEventListener }),
      { initialProps: { address: '0xABC', authToken: 'token-1' } },
    );

    const authCallback = vi.fn();
    act(() => listeners.get('StartAuthentication')?.({ detail: { callback: authCallback } }));
    expect(authCallback).toHaveBeenCalledWith('true,0xABC,Vitalik,token-1');

    rerender({ address: '0xDEF', authToken: 'token-2' });
    expect(authCallback).toHaveBeenLastCalledWith('true,0xDEF,Vitalik,token-2');

    vi.useFakeTimers();
    const configuration = vi.fn();
    act(() => listeners.get('GetConfiguration')?.({ detail: { callback: configuration } }));
    act(() => vi.advanceTimersByTime(1_000));
    expect(configuration).toHaveBeenCalledWith(expect.stringMatching(/^sepolia,/));
    vi.useRealTimers();

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(4);
  });
});

describe('useUnitySafeClose', () => {
  it('unloads and closes only when the modal or close button is clicked', async () => {
    document.body.innerHTML = '<div id="unity-modal"><button id="unity-close-icon">Close</button></div>';
    const closeGame = vi.fn();
    const unload = vi.fn(async () => undefined);
    const { unmount } = renderHook(() => useUnitySafeClose({ closeGame, unload }));

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(unload).not.toHaveBeenCalled();
    document.getElementById('unity-close-icon')?.dispatchEvent(new MouseEvent('click'));
    await waitFor(() => expect(closeGame).toHaveBeenCalledTimes(1));
    expect(unload).toHaveBeenCalledTimes(1);

    unmount();
    document.getElementById('unity-close-icon')?.dispatchEvent(new MouseEvent('click'));
    expect(unload).toHaveBeenCalledTimes(1);
  });
});
