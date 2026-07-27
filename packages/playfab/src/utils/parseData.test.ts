import { describe, expect, it } from 'bun:test'
import { parseLinkedWalletResult, safeJSONParse } from './parseData'

describe('parseData', () => {
  describe('safeJSONParse', () => {
    it('parses a valid JSON array string', () => {
      expect(safeJSONParse('[1,2,3]')).toEqual([1, 2, 3])
    })

    it('returns an empty array for invalid JSON', () => {
      expect(safeJSONParse('not json')).toEqual([])
    })

    it('returns an empty array for non-string input', () => {
      expect(safeJSONParse(42)).toEqual([])
      expect(safeJSONParse(undefined)).toEqual([])
    })
  })

  describe('parseLinkedWalletResult', () => {
    it('extracts the LinkedWallets array from user data', () => {
      const data = { LinkedWallets: { Value: '["0xABC","0xDEF"]' } }
      expect(parseLinkedWalletResult(data)).toEqual(['0xABC', '0xDEF'])
    })

    it('returns an empty array when no data is provided', () => {
      expect(parseLinkedWalletResult(undefined)).toEqual([])
    })

    it('returns an empty array when the value is missing', () => {
      expect(parseLinkedWalletResult({})).toEqual([])
    })
  })
})
