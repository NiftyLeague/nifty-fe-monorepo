import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
;
import CharacterCreatorContainer from './index';

const unity = ({
  handlers: new Map<string, (...args: any[]) => void>(),
  removeAll: mock(),
  send: mock(),
});

mock.module('react-device-detect', () => ({
  isMobileOnly: false,
  withOrientationChange: (Component: React.ComponentType<any>) => Component,
}));
mock.module('react-unity-webgl', () => {
  const Unity = ({ className, style }: { className: string; style: React.CSSProperties }) => (
    <canvas aria-label="character creator" className={className} style={style} />
  );
  return {
  default: Unity,
  Unity,
  UnityContext: class UnityContext {
    send = unity.send;
    SendMessage = unity.send;
    on(name: string, handler: (...args: any[]) => void) {
      unity.handlers.set(name, handler);
    }
    addEventListener(name: string, handler: (...args: any[]) => void) {
      unity.handlers.set(name, handler);
    }
    removeAllEventListeners() {
      unity.removeAll();
      unity.handlers.clear();
    }
  },
  useUnityContext: (options: any) => {
    return {
      sendMessage: unity.send,
      addEventListener: (name: string, handler: (...args: any[]) => void) => {
        unity.handlers.set(name, handler);
      },
      removeEventListener: (name: string) => {
        unity.handlers.delete(name);
      },
      removeAllEventListeners: () => {
        unity.removeAll();
        unity.handlers.clear();
      },
      unityProvider: {},
      isLoaded: true,
      progression: 1,
    };
  },
  };
});
mock.module('@/hooks/useRemovedTraits', () => ({ default: () => [3, 7] }));
mock.module('@/constants/networks', async importOriginal => {
  const actual = await importOriginal<typeof import('@/constants/networks')>();
  return { ...actual, TARGET_NETWORK: actual.NETWORKS.mainnet };
});
mock.module('@/hooks/useNetworkContext', () => ({
  default: () => ({
    address: '0xabc',
    readContracts: {},
    tx: mock(),
    writeContracts: { Degen: { getNFTPrice: mock().mockResolvedValue(1n) } },
  }),
}));
mock.module('@/utils/bnc-notify', () => ({ submitTxWithGasEstimate: mock() }));

beforeEach(() => {
  jest.useFakeTimers();
  unity.handlers.clear();
  unity.removeAll.mockClear();
  unity.send.mockClear();
  Reflect.deleteProperty(window, 'unityInstance');
});

afterEach(() => jest.useRealTimers());

describe('CharacterCreatorContainer', () => {
  it('bridges Unity lifecycle and browser events while the sold-out mint is locked', async () => {
    const setLoaded = mock();
    const setProgress = mock();
    const { rerender, unmount } = render(
      <CharacterCreatorContainer isLoaded={false} isPortrait={false} setLoaded={setLoaded} setProgress={setProgress} />,
    );

    rerender(
      <CharacterCreatorContainer isLoaded={true} isPortrait={false} setLoaded={setLoaded} setProgress={setProgress} />,
    );
    expect(screen.getByLabelText('character creator')).toBeVisible();

    act(() => unity.handlers.get('loaded')?.());
    act(() => unity.handlers.get('progress')?.(0.42));
    expect(setLoaded).toHaveBeenCalledWith(true);
    expect(setProgress).toHaveBeenCalledWith(42);

    act(() => unity.handlers.get('canvas')?.());
    act(() => jest.advanceTimersByTime(2_000));

    const configuration = mock();
    act(() => window.dispatchEvent(new CustomEvent('GetConfiguration', { detail: { callback: configuration } })));
    act(() => jest.advanceTimersByTime(1_000));
    expect(configuration).toHaveBeenCalledWith(expect.stringContaining(','));

    const removedTraits = mock();
    act(() => window.dispatchEvent(new CustomEvent('GetRemovedTraits', { detail: { callback: removedTraits } })));
    expect(removedTraits).toHaveBeenCalledWith('[3,7]');

    act(() => window.dispatchEvent(new CustomEvent('OnMintEffectToggle', { detail: true })));
    const mintCallback = mock();
    act(() =>
      window.dispatchEvent(new CustomEvent('SubmitTraits', { detail: { callback: mintCallback, traits: [] } })),
    );
    act(() => jest.advanceTimersByTime(1_000));
    expect(mintCallback).toHaveBeenCalledWith('false');

    const canvas = screen.getByLabelText('character creator');
    act(() => document.dispatchEvent(new WheelEvent('wheel')));
    expect(canvas).toHaveStyle({ pointerEvents: 'none' });
    act(() => document.dispatchEvent(new MouseEvent('mousemove')));
    expect(canvas).toHaveStyle({ pointerEvents: 'auto', cursor: 'pointer' });
    act(() => window.dispatchEvent(new Event('resize')));

    unmount();
    // Cleanup effect calls removeEventListener for each handler (not removeAllEventListeners)
    expect(unity.handlers.size).toBe(0);
  });
});
