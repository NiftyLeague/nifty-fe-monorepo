import { useRef, useState, useEffect } from 'react';

/**
 * A custom React hook that utilizes the IntersectionObserver API to detect when a
 * DOM element enters or exits the viewport (or another element).
 *
 * This hook is highly performant and an excellent alternative to using scroll event listeners,
 * which can cause jank on the main thread, especially on mobile devices.
 *
 * @param {IntersectionObserverInit} [options] - Optional configuration for the IntersectionObserver.
 * - `root`: The element that is used as the viewport for checking intersection. Defaults to the browser viewport.
 * - `rootMargin`: A margin around the root. This value can grow or shrink the root's bounding box.
 * - `threshold`: A number or an array of numbers representing the percentage of the target's
 *                visibility at which the observer's callback should be executed.
 * @returns {{ ref: React.RefObject<any>, isIntersecting: boolean }} An object containing:
 * - `ref`: A React ref object that should be attached to the DOM element you want to observe.
 * - `isIntersecting`: True when the element is intersecting the root, and false otherwise.
 */
export function useScrollDetection(
  options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0 },
) {
  const ref = useRef<any>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    // Capture the current value of the ref to prevent stale closures in the cleanup function.
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      // The callback is triggered when the intersection state changes.
      // We update our state based on the `isIntersecting` property of the entry.
      if (entry) setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [options]);

  return { ref, isIntersecting };
}

export default useScrollDetection;
