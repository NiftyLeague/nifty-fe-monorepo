'use client';

import { useEffect } from 'react';

export type ParallaxDirection = 'up' | 'down' | 'left' | 'right';
export type ParallaxIntensity = 'lite' | 'normal' | 'strong' | 'extreme';

// Function to apply the transform to the element or its child
const applyTransform = <T extends HTMLElement>(element: T, childClass: string, transform: string): void => {
  const child = element.getElementsByClassName(childClass)[0] as HTMLElement | undefined;
  if (child) {
    child.style.transform = transform;
  } else {
    element.style.transform = transform;
  }
};

const getTransitionMultiplier = (amount: ParallaxIntensity): number => {
  const multipliers = { lite: 0.5, normal: 1, strong: 2, extreme: 3 };
  return multipliers[amount] || multipliers.normal;
};

// Calculates the transform based on user provided direction & transition amount
const calculateTransform = <T extends HTMLElement>(
  element: T,
  direction: ParallaxDirection,
  intensity: ParallaxIntensity,
): string => {
  const rect = element.getBoundingClientRect();

  if (direction === 'down' || direction === 'up') {
    const translationY = (rect.top * 100) / window.innerHeight;
    const directionValue = direction === 'down' ? -1 : 1;
    const multiplier = getTransitionMultiplier(intensity);
    return `translateY(${translationY * directionValue * multiplier}px)`;
  }

  // Horizontal parallax (left/right)
  const translationX = (rect.top * 100) / window.innerHeight;
  const directionValue = direction === 'right' ? -1 : 1;
  const multiplier = getTransitionMultiplier(intensity);
  return `translateX(${translationX * directionValue * multiplier}px)`;
};

interface UseParallaxOptions {
  enabled: boolean;
  direction: ParallaxDirection;
  intensity: ParallaxIntensity;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  elementRef: React.RefObject<T | null>,
  options: UseParallaxOptions,
) {
  useEffect(() => {
    if (!elementRef.current || !options.enabled) return;

    const handleParallax = () => {
      const element = elementRef.current;
      if (!element) return;

      const transform = calculateTransform(element, options.direction, options.intensity);
      applyTransform(element, 'parallax-child', transform);
    };

    handleParallax();
    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleParallax);
    };
  }, [elementRef, options.enabled, options.direction, options.intensity]);
}

export default useParallax;
