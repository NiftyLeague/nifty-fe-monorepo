import { describe, expect, it } from 'bun:test'

import { parseFeatureFlags } from './FeatureFlagsContext'

describe('parseFeatureFlags', () => {
  it('merges boolean flags and ignores unsupported values', () => {
    expect(
      parseFeatureFlags('{"displayMyItems":true,"enableEquip":"yes","newFlag":false}', {
        displayMyItems: false,
        enableEquip: false,
      })
    ).toEqual({ displayMyItems: true, enableEquip: false, newFlag: false })
  })

  it('falls back to defaults for malformed or non-object values', () => {
    const defaults = { displayMyItems: false, enableEquip: false }

    expect(parseFeatureFlags('{displayMyItems:true}', defaults)).toEqual(defaults)
    expect(parseFeatureFlags('[]', defaults)).toEqual(defaults)
    expect(parseFeatureFlags(undefined, defaults)).toEqual(defaults)
  })

  it('does not mutate the defaults object', () => {
    const defaults = { displayMyItems: false }

    parseFeatureFlags('{"displayMyItems":true}', defaults)

    expect(defaults).toEqual({ displayMyItems: false })
  })
})
