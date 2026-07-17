import { describe, expect, it } from 'bun:test';
import { errorMsgHandler } from './errorHandlers';

describe('errorMsgHandler', () => {
  it('returns the message for an Error instance', () => {
    expect(errorMsgHandler(new Error('boom'))).toBe('boom');
  });

  it('returns the message for a plain object with a message field', () => {
    expect(errorMsgHandler({ message: 'nope' })).toBe('nope');
  });

  it('returns the message for an object with a nested message', () => {
    expect(errorMsgHandler({ code: 1, message: 'failed' })).toBe('failed');
  });

  it('falls back to a stringified unknown error', () => {
    expect(errorMsgHandler('plain string')).toContain('plain string');
  });

  it('handles null/undefined without throwing', () => {
    expect(typeof errorMsgHandler(null)).toBe('string');
    expect(typeof errorMsgHandler(undefined)).toBe('string');
  });
});
