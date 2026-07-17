import { describe, expect, it } from 'bun:test';
import { formatDateTime, formatTime, secondsToHours } from './dateTime';

describe('dateTime utils', () => {
  describe('formatDateTime', () => {
    it('formats a numeric (seconds) timestamp', () => {
      // 2024-01-15T10:30:00Z -> en-US date + short time
      const out = formatDateTime(1705314600);
      expect(out).toContain('2024');
      expect(out).toContain('10:30');
    });

    it('formats a string timestamp by parsing it', () => {
      const out = formatDateTime('1705314600');
      expect(out).toContain('2024');
    });
  });

  describe('formatTime', () => {
    it('formats a valid time string as HH:MM:SS in local time', () => {
      // Intl.DateTimeFormat('default') honors the local timezone, so assert shape not literal.
      const out = formatTime('2024-01-15T09:05:03Z');
      expect(out).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('returns a zero placeholder for falsy input', () => {
      expect(formatTime('')).toBe('00:00:00');
      expect(formatTime(0)).toBe('00:00:00');
    });
  });

  describe('secondsToHours', () => {
    it('truncates fractional hours', () => {
      expect(secondsToHours(3600)).toBe(1);
      expect(secondsToHours(5400)).toBe(1);
      expect(secondsToHours(7200)).toBe(2);
    });

    it('returns 0 for sub-hour durations', () => {
      expect(secondsToHours(59)).toBe(0);
    });
  });
});
