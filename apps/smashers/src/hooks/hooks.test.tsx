import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, spyOn, jest, mock } from 'bun:test';

import useUnityEventHandlers from './useUnityEventHandlers';
import useUnitySafeClose from './useUnitySafeClose';

afterEach(() => {
  mock.restore();
  document.body.innerHTML = '';
});

describe('useUnityEventHandlers', () => {
  it('registers Unity callbacks, authenticates, configures, and cleans up', async () => {
    const listeners = new Map<string, (...parameters: unknown[]) => unknown>();
    const addEventListener = mock((name: string, callback: (...parameters: unknown[]) => unknown) => {
      listeners.set(name, callback);
    });
    const removeEventListener = mock();
    const { rerender, unmount } = renderHook(
      ({ address, authToken }) => useUnityEventHandlers({ address, authToken, addEventListener, removeEventListener }),
      { initialProps: { address: '0xABC', authToken: 'token-1' } },
    );

    const authCallback = mock();
    act(() => listeners.get('StartAuthentication')?.({ detail: { callback: authCallback } }));
    expect(authCallback).toHaveBeenCalledWith('true,0xABC,Vitalik,token-1');

    rerender({ address: '0xDEF', authToken: 'token-2' });
    expect(authCallback).toHaveBeenLastCalledWith('true,0xDEF,Vitalik,token-2');

    jest.useFakeTimers();
    const configuration = mock();
    act(() => listeners.get('GetConfiguration')?.({ detail: { callback: configuration } }));
    act(() => jest.advanceTimersByTime(1_000));
    expect(configuration).toHaveBeenCalledWith(expect.stringMatching(/^sepolia,/));
    jest.useRealTimers();

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(4);
  });
});

describe('useUnitySafeClose', () => {
  it('unloads and closes only when the modal or close button is clicked', async () => {
    document.body.innerHTML = '<div id="unity-modal"><button id="unity-close-icon">Close</button></div>';
    const closeGame = mock();
    const unload = mock(async () => undefined);
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
