import { describe, expect, it } from 'bun:test';
import { areEqualArrays, getUniqueListBy } from './array';
import { capitalize } from './string';
import { safeJSONParse } from './json';
import callAll from './callAll';

describe('array utils', () => {
  it('areEqualArrays compares by JSON shape', () => {
    expect(areEqualArrays([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(areEqualArrays([1, 2], [1, 2, 3])).toBe(false);
    expect(areEqualArrays([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('getUniqueListBy dedupes by key', () => {
    const out = getUniqueListBy<{ id: number; name: string }>(
      [
        { id: 1, name: 'a' },
        { id: 1, name: 'b' },
        { id: 2, name: 'c' },
      ],
      'id',
    );
    expect(out).toHaveLength(2);
    // Map dedup keeps the last occurrence for a duplicate key
    expect(out[0].name).toBe('b');
  });
});

describe('string utils', () => {
  it('capitalize uppercases first letter and lowercases the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('')).toBe('');
  });
});

describe('json utils', () => {
  it('safeJSONParse returns parsed value for valid JSON', () => {
    expect(safeJSONParse('{"a":1}')).toEqual({ a: 1 });
    expect(safeJSONParse('[1,2]')).toEqual([1, 2]);
  });

  it('safeJSONParse returns the input unchanged for invalid JSON', () => {
    expect(safeJSONParse('not json')).toBe('not json');
  });
});

describe('callAll', () => {
  it('invokes every provided function with the same args', () => {
    const calls: number[][] = [];
    const fn = callAll(
      (...a: unknown[]) => calls.push(a as number[]),
      (...a: unknown[]) => calls.push(a as number[]),
    );
    fn(1, 2);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual([1, 2]);
  });

  it('skips falsy entries without throwing', () => {
    const seen: string[] = [];
    callAll(undefined as never, (...a: unknown[]) => seen.push(String(a[0])))('x');
    expect(seen).toEqual(['x']);
  });
});
