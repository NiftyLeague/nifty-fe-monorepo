import { describe, expect, it } from 'bun:test'
import all from './it-all'

async function* asyncGen<T>(items: T[]): AsyncGenerator<T> {
  for (const item of items) {
    yield item
  }
}

describe('it-all (all)', () => {
  it('collects all values from an async iterable in order', async () => {
    const result = await all(asyncGen([1, 2, 3]))
    expect(result).toEqual([1, 2, 3])
  })

  it('returns an empty array for an empty async iterable', async () => {
    const result = await all(asyncGen<number>([]))
    expect(result).toEqual([])
  })

  it('collects string values', async () => {
    const result = await all(asyncGen(['ye', 'west', 'vision']))
    expect(result).toEqual(['ye', 'west', 'vision'])
  })

  it('collects from a synchronous iterable as well', async () => {
    const result = await all([10, 20, 30])
    expect(result).toEqual([10, 20, 30])
  })

  it('preserves object references', async () => {
    const obj = { id: 1 }
    const result = await all(asyncGen([obj]))
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(obj)
  })
})
