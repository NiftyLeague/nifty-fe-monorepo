import { describe, expect, it } from 'bun:test'

import { shouldLoadPrivateRoutesWallet } from './PrivateRoutesAuthGate'

describe('private route wallet gate', () => {
  it('keeps the wallet runtime out of signed-out private routes', () => {
    expect(shouldLoadPrivateRoutesWallet(false, false)).toBe(false)
  })

  it('loads the wallet runtime for authenticated sessions', () => {
    expect(shouldLoadPrivateRoutesWallet(true, false)).toBe(true)
  })

  it('keeps audit fixtures available without persisted auth', () => {
    expect(shouldLoadPrivateRoutesWallet(false, true)).toBe(true)
  })
})
