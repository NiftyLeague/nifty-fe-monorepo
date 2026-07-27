import { describe, expect, it } from 'bun:test'
import { getErrorForName } from './name'

describe('getErrorForName', () => {
  it('requires a non-empty value', () => {
    expect(getErrorForName('')).toBe('Please input a name.')
  })

  it('enforces the 32-char max', () => {
    expect(getErrorForName('a'.repeat(33))).toBe('Max character length of 32.')
    expect(getErrorForName('a'.repeat(32))).toBe('')
  })

  it('rejects symbols outside the allowed set', () => {
    expect(getErrorForName('hello!')).toBe('Please only use numbers, letters, or spaces.')
  })

  it('rejects leading/trailing spaces', () => {
    expect(getErrorForName(' space')).toBe('No leading or trailing spaces.')
    expect(getErrorForName('space ')).toBe('No leading or trailing spaces.')
  })

  it('rejects double spaces', () => {
    expect(getErrorForName('a  b')).toBe('No double spaces allowed.')
  })

  it('accepts valid names', () => {
    expect(getErrorForName('Andrew')).toBe('')
    expect(getErrorForName('Player One')).toBe('')
    expect(getErrorForName('dev_42')).toBe('')
  })
})
