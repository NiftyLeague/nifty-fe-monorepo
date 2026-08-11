import { describe, expect, it } from 'bun:test'

import { createNonce, createUUID } from './auth'

const uuidSegment = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

describe('wallet auth randomness', () => {
  it('preserves the legacy eight-segment UUID token format', () => {
    expect(createUUID()).toMatch(new RegExp(`^${uuidSegment}(?:-${uuidSegment}){7}$`))
  })

  it('creates a secure eight-byte hexadecimal nonce', () => {
    expect(createNonce()).toMatch(/^0x[0-9a-f]{8}$/)
  })
})
