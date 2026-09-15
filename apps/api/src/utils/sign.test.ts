import { describe, expect, it } from 'bun:test'
import BN from 'bn.js'

import {
  deserializeSignature,
  importRecoveryParam,
  serializeEthSignature,
} from './sign'

describe('serializeEthSignature', () => {
  it('serializes a complete signature with recovery param', () => {
    const sig = {
      r: new BN('aabbccdd', 16),
      s: new BN('11223344', 16),
      recoveryParam: new BN(27),
    }
    const result = serializeEthSignature(sig)
    expect(result.startsWith('0x')).toBe(true)
    expect(result).toContain('aabbccdd'.padStart(64, '0'))
    expect(result).toContain('11223344'.padStart(64, '0'))
    expect(result).toContain('1b'.padStart(2, '0'))
  })

  it('serializes with null recoveryParam as empty', () => {
    const sig = {
      r: new BN('ff', 16),
      s: new BN('ee', 16),
      recoveryParam: null,
    }
    const result = serializeEthSignature(sig)
    expect(result.startsWith('0x')).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('serializes with undefined recoveryParam as empty', () => {
    const sig = {
      r: new BN('01', 16),
      s: new BN('02', 16),
      recoveryParam: undefined,
    }
    const result = serializeEthSignature(sig)
    expect(result.startsWith('0x')).toBe(true)
  })

  it('produces consistent output for identical input', () => {
    const sig = {
      r: new BN('deadbeef', 16),
      s: new BN('cafebabe', 16),
      recoveryParam: new BN(28),
    }
    expect(serializeEthSignature(sig)).toBe(serializeEthSignature(sig))
  })
})

describe('importRecoveryParam', () => {
  it('returns v - 27 for values >= 27', () => {
    expect(importRecoveryParam('1b')).toBe(0)
    expect(importRecoveryParam('1c')).toBe(1)
    expect(importRecoveryParam('1d')).toBe(2)
  })

  it('returns undefined for empty string', () => {
    expect(importRecoveryParam('')).toBeUndefined()
  })

  it('returns undefined for whitespace-only string', () => {
    expect(importRecoveryParam('  ')).toBeUndefined()
  })

  it('returns raw value for v < 27', () => {
    expect(importRecoveryParam('1a')).toBe(26)
  })

  it('handles large recovery param values', () => {
    expect(importRecoveryParam('3e')).toBe(35)
  })
})

describe('deserializeSignature', () => {
  it('deserializes a 130-char hex string (no recovery param)', () => {
    const rHex = 'a1'.repeat(32)
    const sHex = 'b2'.repeat(32)
    const sig = rHex + sHex
    const result = deserializeSignature(sig)
    expect(result.r.toString(16)).toBe(rHex)
    expect(result.s.toString(16)).toBe(sHex)
    expect(result.recoveryParam).toBeUndefined()
  })

  it('deserializes a 132-char hex string (with recovery param)', () => {
    const rHex = 'a1'.repeat(32)
    const sHex = 'b2'.repeat(32)
    const sig = rHex + sHex + '1c'
    const result = deserializeSignature(sig)
    expect(result.r.toString(16)).toBe(rHex)
    expect(result.s.toString(16)).toBe(sHex)
    expect(result.recoveryParam).toBe(1)
  })

  it('uses custom size parameter', () => {
    const shortHex = 'aa'.repeat(10)
    const sig = shortHex + 'bb'.repeat(10) + '1c'
    const result = deserializeSignature(sig, 20)
    expect(result.r.toString(16)).toBe(shortHex)
    expect(result.s.toString(16)).toBe('bb'.repeat(10))
  })
})

describe('generateIMXAuthorisationHeaders', () => {
  it('exported function exists', async () => {
    const mod = await import('./sign')
    expect(typeof mod.generateIMXAuthorisationHeaders).toBe('function')
  })

  it('rejects with invalid signer', async () => {
    const { generateIMXAuthorisationHeaders } = await import('./sign')
    await expect(generateIMXAuthorisationHeaders('invalid' as never)).rejects.toBeDefined()
  })
})
