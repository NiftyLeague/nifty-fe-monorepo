import '@testing-library/jest-dom/vitest';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CharacterCreatorContainer from './index';

const unity = vi.hoisted(() => ({
  handlers: new Map<string, (...args: any[]) => void>(),
  removeAll: vi.fn(),
  send: vi.fn(),
}));

vi.mock('react-device-detect', () => ({
  isMobileOnly: false,
  withOrientationChange: (Component: React.ComponentType<any>) => Component,
}));
vi.mock('react-unity-webgl', () => ({
  default: ({ className, style }: { className: string; style: React.CSSProperties }) => (
    <canvas aria-label="character creator" className={className} style={style} />
  ),
  UnityContext: class UnityContext {
    send = unity.send;
    SendMessage = unity.send;
    on(name: string, handler: (...args: any[]) => void) {
      unity.handlers.set(name, handler);
    }
    removeAllEventListeners() {
      unity.removeAll();
      unity.handlers.clear();
    }
  },
}));
vi.mock('@/hooks/useRemovedTraits', () => ({ default: () => [3, 7] }));
vi.mock('@/constants/networks', async importOriginal => {
  const actual = await importOriginal<typeof import('@/constants/networks')>();
  return { ...actual, TARGET_NETWORK: actual.NETWORKS.mainnet };
});
vi.mock('@/hooks/useNetworkContext', () => ({
  default: () => ({
    address: '0xabc',
    readContracts: {},
    tx: vi.fn(),
    writeContracts: { Degen: { getNFTPrice: vi.fn().mockResolvedValue(1n) } },
  }),
}));
vi.mock('@/utils/bnc-notify', () => ({ submitTxWithGasEstimate: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers();
  unity.handlers.clear();
  unity.removeAll.mockClear();
  unity.send.mockClear();
  Reflect.deleteProperty(window, 'unityInstance');
});

afterEach(() => vi.useRealTimers());

describe('CharacterCreatorContainer', () => {
  it('bridges Unity lifecycle and browser events while the sold-out mint is locked', async () => {
    const setLoaded = vi.fn();
    const setProgress = vi.fn();
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
    act(() => vi.advanceTimersByTime(2_000));

    const configuration = vi.fn();
    act(() => window.dispatchEvent(new CustomEvent('GetConfiguration', { detail: { callback: configuration } })));
    act(() => vi.advanceTimersByTime(1_000));
    expect(configuration).toHaveBeenCalledWith(expect.stringContaining(','));

    const removedTraits = vi.fn();
    act(() => window.dispatchEvent(new CustomEvent('GetRemovedTraits', { detail: { callback: removedTraits } })));
    expect(removedTraits).toHaveBeenCalledWith('[3,7]');

    act(() => window.dispatchEvent(new CustomEvent('OnMintEffectToggle', { detail: true })));
    const mintCallback = vi.fn();
    act(() =>
      window.dispatchEvent(new CustomEvent('SubmitTraits', { detail: { callback: mintCallback, traits: [] } })),
    );
    act(() => vi.advanceTimersByTime(1_000));
    expect(mintCallback).toHaveBeenCalledWith('false');

    const canvas = screen.getByLabelText('character creator');
    act(() => document.dispatchEvent(new WheelEvent('wheel')));
    expect(canvas).toHaveStyle({ pointerEvents: 'none' });
    act(() => document.dispatchEvent(new MouseEvent('mousemove')));
    expect(canvas).toHaveStyle({ pointerEvents: 'auto', cursor: 'pointer' });
    act(() => window.dispatchEvent(new Event('resize')));

    unmount();
    expect(unity.removeAll).toHaveBeenCalled();
  });
});
