import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { mock } from 'bun:test'
import { areEqualArrays, getUniqueListBy } from './array'
import callAll from './callAll'
import { formatDateTime, formatTime, secondsToHours } from './dateTime'
import { errorMsgHandler } from './errorHandlers'
import { safeJSONParse } from './json'
import { getErrorForName } from './name'

let calculateGasMargin: typeof import('./gas').calculateGasMargin
let loadGasPrice: typeof import('./gas').loadGasPrice

beforeEach(async () => {
  const gas = await import('./gas')
  calculateGasMargin = gas.calculateGasMargin
  loadGasPrice = gas.loadGasPrice
})

describe('array helpers', () => {
  it('compares values and preserves the last object for each unique key', () => {
    expect(areEqualArrays([1, { value: 2 }], [1, { value: 2 }])).toBe(true)
    expect(areEqualArrays([1, 2], [2, 1])).toBe(false)
    expect(
      getUniqueListBy<{ id: number; name: string }>(
        [
          { id: 1, name: 'first' },
          { id: 1, name: 'updated' },
          { id: 2, name: 'second' },
        ],
        'id'
      )
    ).toEqual([
      { id: 1, name: 'updated' },
      { id: 2, name: 'second' },
    ])
  })
})

describe('callAll', () => {
  it('forwards arguments to each callback in order', () => {
    const first = mock()
    const second = mock()

    callAll(first, second)('value', 7)

    expect(first).toHaveBeenCalledWith('value', 7)
    expect(second).toHaveBeenCalledWith('value', 7)
    expect(first.mock.invocationCallOrder[0]).toBeLessThan(
      second.mock.invocationCallOrder[0] as number
    )
  })
})

describe('date and JSON helpers', () => {
  it('formats timestamps and converts elapsed seconds', () => {
    expect(formatDateTime('1577880000')).toMatch(/2020/)
    expect(formatTime(0)).toBe('00:00:00')
    expect(secondsToHours(7_500)).toBe(2)
  })

  it('returns parsed JSON and leaves invalid inputs untouched', () => {
    expect(safeJSONParse('{"ok":true}')).toEqual({ ok: true })
    expect(safeJSONParse('not-json')).toBe('not-json')
  })
})

describe('name and password validation', () => {
  it.each<[string, string]>([
    ['', 'Please input a name.'],
    ['x'.repeat(33), 'Max character length of 32.'],
    ['bad!', 'Please only use numbers, letters, or spaces.'],
    [' leading', 'No leading or trailing spaces.'],
    ['two  spaces', 'No double spaces allowed.'],
    ['Valid Name 42', ''],
  ])('validates %j', (value, message) => {
    expect(getErrorForName(value)).toBe(message)
  })
})

describe('error and gas helpers', () => {
  it('normalizes error-shaped values', () => {
    expect(errorMsgHandler(new Error('broken'))).toBe('broken')
    expect(errorMsgHandler({ message: 'plain' })).toBe('plain')
    spyOn(console, 'error').mockImplementation(() => undefined)
    expect(errorMsgHandler('unknown')).toBe('Unknown error: unknown')
  })

  it('uses configured gas prices before consulting the network', async () => {
    const configured = 25_000_000_000n
    const fetchMock = spyOn(globalThis, 'fetch')
    expect(await loadGasPrice({ gasPrice: configured } as never)).toBe(configured)
    expect(fetchMock).not.toHaveBeenCalled()
    fetchMock.mockRestore()
  })

  it('applies the existing margin and minimum rules', () => {
    expect(calculateGasMargin(100_000n)).toBe(101n)
    expect(calculateGasMargin(100_000n, 20_000n)).toBe(20_000n)
    expect(calculateGasMargin(300_000n, 20_000n)).toBe(30_000n)
  })
})
