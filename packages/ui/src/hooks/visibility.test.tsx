const stubGlobal = (name, value) => { Object.defineProperty(globalThis, name, { value, configurable: true, writable: true }); };
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
;
import { useOnScreen } from './useOnScreen';
import { useParallax } from './useParallax';

describe('useOnScreen', () => {
  let intersectionCallback: IntersectionObserverCallback;
  const observe = mock();
  const unobserve = mock();

  beforeEach(() => {
    observe.mockReset();
    unobserve.mockReset();
    stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback;
        }
        observe = observe;
        unobserve = unobserve;
      },
    );
  });

  it('observes the referenced element, updates visibility, and cleans up', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { result, unmount } = renderHook(() => useOnScreen(ref, '20px'));

    expect(observe).toHaveBeenCalledWith(element);
    act(() => intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as never));
    expect(result.current).toBe(true);
    unmount();
    expect(unobserve).toHaveBeenCalledWith(element);
  });

  it('stays false when no element is mounted', () => {
    expect(renderHook(() => useOnScreen({ current: null })).result.current).toBe(false);
    expect(observe).not.toHaveBeenCalled();
  });
});

describe('useParallax', () => {
  function elementWithTop(top: number, withChild = true) {
    const element = document.createElement('div');
    if (withChild) {
      const child = document.createElement('span');
      child.className = 'parallax-child';
      element.append(child);
    }
    spyOn(element, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect);
    return element;
  }

  it('applies vertical movement to the child and removes its scroll listener', () => {
    spyOn(window, 'addEventListener');
    spyOn(window, 'removeEventListener');
    const element = elementWithTop(100);
    const { unmount } = renderHook(() =>
      useParallax({ current: element }, { enabled: true, direction: 'down', intensity: 'strong' }),
    );

    expect((element.firstElementChild as HTMLElement).style.transform).toBe(
      `translateY(${(-100 * 100 * 2) / window.innerHeight}px)`,
    );
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('supports horizontal movement and falls back to the element itself', () => {
    const element = elementWithTop(50, false);
    renderHook(() => useParallax({ current: element }, { enabled: true, direction: 'right', intensity: 'lite' }));

    expect(element.style.transform).toBe(`translateX(${(-50 * 100 * 0.5) / window.innerHeight}px)`);
  });

  it('does nothing while disabled or before the ref is mounted', () => {
    const addEventListener = spyOn(window, 'addEventListener');
    renderHook(() => useParallax({ current: null }, { enabled: true, direction: 'up', intensity: 'normal' }));
    renderHook(() =>
      useParallax({ current: elementWithTop(10) }, { enabled: false, direction: 'left', intensity: 'extreme' }),
    );

    expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });
});
