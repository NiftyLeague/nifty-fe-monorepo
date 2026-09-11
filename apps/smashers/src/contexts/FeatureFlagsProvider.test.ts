import { describe, expect, it } from 'bun:test'

import { parseFlags } from './FeatureFlagsProvider'

/**
 * Regression cover for a crash that blanked the login and profile pages.
 *
 * The flags variable is inlined at build time, and when it is unset the define
 * yields an EMPTY STRING rather than `undefined`. The previous guard only
 * checked for `undefined`, so `JSON.parse('')` threw during render and took the
 * whole island down — every page that mounts these providers rendered nothing.
 */
const DEFAULTS = {
  enableAccountCreation: false,
  enableAvatars: false,
  enableInventory: false,
  enableLinkProviders: true,
  enableLinkWallet: true,
  enableProviderSignOn: false,
  enableStats: false,
  enableWebGL: false,
}

describe('feature flag parsing', () => {
  it('falls back to defaults for an empty inlined value', () => {
    expect(parseFlags('')).toEqual(DEFAULTS)
    expect(parseFlags('   ')).toEqual(DEFAULTS)
  })

  it('falls back to defaults when the variable is absent', () => {
    expect(parseFlags(undefined)).toEqual(DEFAULTS)
  })

  it('never throws on malformed input', () => {
    for (const value of ['not json', '{', 'undefined', 'NaN', '"a string"', '[]', 'null']) {
      expect(() => parseFlags(value)).not.toThrow()
      expect(parseFlags(value)).toEqual(DEFAULTS)
    }
  })

  it('applies configured flags over the defaults', () => {
    const flags = parseFlags(
      '{"enableInventory":true,"enableStats":true,"enableAccountCreation":true}'
    )

    expect(flags.enableInventory).toBe(true)
    expect(flags.enableStats).toBe(true)
    expect(flags.enableAccountCreation).toBe(true)
    // Untouched defaults survive.
    expect(flags.enableLinkProviders).toBe(true)
    expect(flags.enableLinkWallet).toBe(true)
  })

  it('ignores non-boolean flag values', () => {
    const flags = parseFlags('{"enableInventory":"yes","enableStats":1,"enableAvatars":null}')

    expect(flags.enableInventory).toBe(false)
    expect(flags.enableStats).toBe(false)
    expect(flags.enableAvatars).toBe(false)
  })

  it('allows an override to turn a default-on flag off', () => {
    expect(parseFlags('{"enableLinkWallet":false}').enableLinkWallet).toBe(false)
  })

  it('does not mutate the defaults object', () => {
    const defaults = { enableInventory: false }
    parseFlags('{"enableInventory":true}', defaults)

    expect(defaults).toEqual({ enableInventory: false })
  })
})
