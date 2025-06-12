'use client';

import { useEffect, useRef, useState } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { useParallax } from '../hooks/useParallax';
import type { ParallaxDirection, ParallaxIntensity } from '../types';

interface AnimatedWrapperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  /**
   * The content to animate
   */
  children: React.ReactNode;
  /**
   * Delay before starting the animation (in ms)
   * @default 0
   */
  delay?: number;
  /**
   * Whether to start the animation immediately
   * @default false
   */
  immediate?: boolean;
  /**
   * Whether to apply a parallax effect
   * @default false
   */
  parallax?: boolean;
  /**
   * Direction of parallax effect
   * @default 'left'
   */
  parallaxDirection?: ParallaxDirection;
  /**
   * Intensity of parallax effect
   * @default 'normal'
   */
  parallaxIntensity?: ParallaxIntensity;
  /**
   * The HTML element to render as the wrapper
   * @default 'div'
   */
  component?: React.ElementType;
}

// CSS selector to find any element with a class that ends with '-start'
const ANIMATION_START_SELECTOR = '[class*="-start"]';

// Function to remove the '-start' classes from elements to trigger the animation
const startAnimation = (element: HTMLElement | null): void => {
  if (!element) return;
  const animatedElements = element.querySelectorAll(ANIMATION_START_SELECTOR);
  Array.from(animatedElements).forEach(element => {
    const classList = Array.from(element.classList);
    const startClasses = classList.filter(className => className.endsWith('-start'));
    element.classList.remove(...startClasses);
  });
};

export function AnimatedWrapper({
  children,
  delay = 0,
  immediate = false,
  parallax = false,
  parallaxDirection = 'left',
  parallaxIntensity = 'normal',
  component: Wrapper = 'div',
  ...props
}: AnimatedWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const onScreen = useOnScreen(ref, immediate ? '0px' : '-100px');

  useEffect(() => {
    if (onScreen && ref.current) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          startAnimation(ref.current);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        startAnimation(ref.current);
      }
    }
  }, [onScreen, delay]);

  useParallax(ref, { enabled: parallax, direction: parallaxDirection, intensity: parallaxIntensity });

  return (
    <Wrapper ref={ref} {...props}>
      {children}
    </Wrapper>
  );
}

export default AnimatedWrapper;
