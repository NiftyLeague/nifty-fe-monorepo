import { describe, expect, it } from 'bun:test'

import { areValuesEqual } from './value-equality'

describe('areValuesEqual', () => {
  it('compares primitive, nested, and array values', () => {
    expect(areValuesEqual(1n, 1n)).toBe(true)
    expect(areValuesEqual({ balances: [1n, 2n] }, { balances: [1n, 2n] })).toBe(true)
    expect(areValuesEqual({ balances: [1n] }, { balances: [2n] })).toBe(false)
    expect(areValuesEqual({ first: 1, second: 2 }, { second: 2, first: 1 })).toBe(true)
  })

  it('handles dates and cyclic values without depending on lodash', () => {
    expect(areValuesEqual(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(true)
    expect(areValuesEqual(new Date('2026-01-01'), new Date('2026-01-02'))).toBe(false)

    const first: { self?: unknown } = {}
    const second: { self?: unknown } = {}
    first.self = first
    second.self = second
    expect(areValuesEqual(first, second)).toBe(true)

    const firstArray: unknown[] = []
    const secondArray: unknown[] = []
    firstArray.push(firstArray)
    secondArray.push(secondArray)
    expect(areValuesEqual(firstArray, secondArray)).toBe(true)
  })

  it('does not treat different prototypes as equal', () => {
    class Value {
      constructor(public value: number) {}
    }

    expect(areValuesEqual(new Value(1), { value: 1 })).toBe(false)
  })
})
