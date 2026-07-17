import { describe, expect, it } from 'bun:test';
import {
  appDrawerWidth,
  appHeaderHeight,
  borderRadius,
  breakpoints,
  cardSpacing,
  gridSpacing,
  sectionSpacing,
} from './index';

describe('theme constants', () => {
  it('exposes layout dimensions', () => {
    expect(appDrawerWidth).toBe(260);
    expect(appHeaderHeight).toBe(60);
    expect(borderRadius).toBe(8);
  });

  it('exposes spacing tokens', () => {
    expect(cardSpacing).toBe(2);
    expect(gridSpacing).toBe(3);
    expect(sectionSpacing).toBe(2);
  });

  it('defines a 5-point breakpoint scale', () => {
    expect(breakpoints.values).toEqual({ xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 });
  });
});
