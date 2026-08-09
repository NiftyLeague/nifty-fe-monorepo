import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'
import alignOutput from './alignOutput'

// alignOutput only communicates via console.log — spy on it to assert real behavior.
const logSpy = spyOn(console, 'log').mockImplementation(() => undefined)

afterEach(() => {
  logSpy.mockClear()
})

describe('alignOutput', () => {
  it('prints each label padded to the longest label width', () => {
    alignOutput([
      ['name', 'ye'],
      ['description', 'visionary'],
      ['x', '1'],
    ])

    // Longest label is "description" (11 chars) -> padEnd(12)
    expect(logSpy).toHaveBeenCalledTimes(3)
    expect(logSpy.mock.calls[0][0]).toBe('name'.padEnd(12))
    expect(logSpy.mock.calls[0][1]).toBe('ye')
    expect(logSpy.mock.calls[1][0]).toBe('description'.padEnd(12))
    expect(logSpy.mock.calls[1][1]).toBe('visionary')
    expect(logSpy.mock.calls[2][0]).toBe('x'.padEnd(12))
    expect(logSpy.mock.calls[2][1]).toBe('1')
  })

  it('handles a single pair without throwing', () => {
    alignOutput([['only', 'one']])
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy.mock.calls[0][0]).toBe('only'.padEnd(5))
    expect(logSpy.mock.calls[0][1]).toBe('one')
  })

  it('pads to the max label length even when a later label is shorter', () => {
    alignOutput([
      ['a', '1'],
      ['longlabel', '2'],
    ])
    // max label length is 9 ("longlabel") -> padEnd(10)
    expect(logSpy.mock.calls[0][0]).toBe('a'.padEnd(10))
    expect(logSpy.mock.calls[1][0]).toBe('longlabel'.padEnd(10))
  })
})
