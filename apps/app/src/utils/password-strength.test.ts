import { describe, expect, it } from 'bun:test';
import { strengthColor, strengthIndicator } from './password-strength';

describe('password-strength', () => {
  describe('strengthIndicator', () => {
    it('scores length tiers', () => {
      expect(strengthIndicator('abc')).toBe(0); // too short
      expect(strengthIndicator('abcdef')).toBeGreaterThanOrEqual(1); // >5
      expect(strengthIndicator('abcdefgh')).toBeGreaterThanOrEqual(2); // >7
    });

    it('adds points for number, special, and mixed case', () => {
      const score = strengthIndicator('Abcdef1!');
      // length>7 (+1) + number (+1) + special (+1) + mixed (+1) = 5
      expect(score).toBe(5);
    });

    it('returns 0 for an empty password', () => {
      expect(strengthIndicator('')).toBe(0);
    });
  });

  describe('strengthColor', () => {
    it('maps low counts to Poor', () => {
      expect(strengthColor(1, 'dark').label).toBe('Poor');
    });

    it('maps mid counts to Weak/Normal/Good', () => {
      expect(strengthColor(2, 'dark').label).toBe('Weak');
      expect(strengthColor(3, 'dark').label).toBe('Normal');
      expect(strengthColor(4, 'dark').label).toBe('Good');
    });

    it('maps high counts to Strong', () => {
      expect(strengthColor(5, 'dark').label).toBe('Strong');
    });

    it('always returns a color string', () => {
      expect(typeof strengthColor(3, 'dark').color).toBe('string');
    });
  });
});
