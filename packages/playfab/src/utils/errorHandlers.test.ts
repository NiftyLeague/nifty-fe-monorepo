import { describe, expect, it } from 'bun:test'
import { errorMsgHandler, errorResHandler } from './errorHandlers'

describe('playfab errorHandlers', () => {
  describe('errorResHandler', () => {
    it('maps an Error to a 500 with its message', () => {
      expect(errorResHandler(new Error('kaboom'))).toEqual({ status: 500, message: 'kaboom' })
    })

    it('maps a PlayFabError-like object to its code/message', () => {
      const pfError = { code: 401, errorMessage: 'unauthorized' }
      expect(errorResHandler(pfError)).toEqual({ status: 401, message: 'unauthorized' })
    })

    it('defaults to 500 for an unknown shape', () => {
      expect(errorResHandler('weird')).toEqual({ status: 500, message: 'Unknown error' })
    })
  })

  describe('errorMsgHandler', () => {
    it('returns the message for an Error', () => {
      expect(errorMsgHandler(new Error('failed'))).toBe('failed')
    })

    it('returns the PlayFab errorMessage when present', () => {
      expect(errorMsgHandler({ errorMessage: 'bad request' })).toBe('bad request')
    })

    it('returns a nested message field', () => {
      expect(errorMsgHandler({ message: 'nested' })).toBe('nested')
    })

    it('returns a stringified unknown error', () => {
      expect(errorMsgHandler(123)).toContain('123')
    })
  })
})
