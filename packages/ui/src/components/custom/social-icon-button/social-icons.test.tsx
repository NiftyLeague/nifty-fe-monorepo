import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import * as SocialIcons from './social-icons';

const iconNames = Object.keys(SocialIcons) as (keyof typeof SocialIcons)[];

describe('social-icons', () => {
  it('exports icon render functions', () => {
    expect(iconNames.length).toBeGreaterThan(0);
    for (const name of iconNames) {
      expect(typeof SocialIcons[name]).toBe('function');
    }
  });

  it('renders every icon as an svg with a path', () => {
    for (const name of iconNames) {
      const IconFn = SocialIcons[name];
      const { container } = render(<IconFn />);
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.querySelector('path')).toBeTruthy();
    }
  });
});
