import { describe, expect, it } from 'bun:test'

import { parseFeatureFlags } from '@nl/ui/lib/parse-feature-flags'

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
    expect(parseFeatureFlags('', DEFAULTS)).toEqual(DEFAULTS)
    expect(parseFeatureFlags('   ', DEFAULTS)).toEqual(DEFAULTS)
  })

  it('falls back to defaults when the variable is absent', () => {
    expect(parseFeatureFlags(undefined, DEFAULTS)).toEqual(DEFAULTS)
  })

  it('never throws on malformed input', () => {
    for (const value of ['not json', '{', 'undefined', 'NaN', '"a string"', '[]', 'null']) {
      expect(() => parseFeatureFlags(value, DEFAULTS)).not.toThrow()
      expect(parseFeatureFlags(value, DEFAULTS)).toEqual(DEFAULTS)
    }
  })

  it('applies configured flags over the defaults', () => {
    const flags = parseFeatureFlags(
      '{"enableInventory":true,"enableStats":true,"enableAccountCreation":true}',
      DEFAULTS
    )

    expect(flags.enableInventory).toBe(true)
    expect(flags.enableStats).toBe(true)
    expect(flags.enableAccountCreation).toBe(true)
    // Untouched defaults survive.
    expect(flags.enableLinkProviders).toBe(true)
    expect(flags.enableLinkWallet).toBe(true)
  })

  it('ignores non-boolean flag values', () => {
    const flags = parseFeatureFlags('{"enableInventory":"yes","enableStats":1,"enableAvatars":null}', DEFAULTS)

    expect(flags.enableInventory).toBe(false)
    expect(flags.enableStats).toBe(false)
    expect(flags.enableAvatars).toBe(false)
  })

  it('allows an override to turn a default-on flag off', () => {
    expect(parseFeatureFlags('{"enableLinkWallet":false}', DEFAULTS).enableLinkWallet).toBe(false)
  })

  it('does not mutate the defaults object', () => {
    const defaults = { enableInventory: false }
    parseFeatureFlags('{"enableInventory":true}', defaults)

    expect(defaults).toEqual({ enableInventory: false })
  })
})
