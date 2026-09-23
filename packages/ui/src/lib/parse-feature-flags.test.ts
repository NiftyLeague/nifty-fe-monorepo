import { describe, expect, it } from 'bun:test'

import { parseFeatureFlags } from './parse-feature-flags'

describe('parseFeatureFlags', () => {
  const defaults = { displayMyItems: false, enableEquip: false }

  it('returns defaults when value is undefined', () => {
    expect(parseFeatureFlags(undefined, defaults)).toStrictEqual(defaults)
  })

  it('returns defaults when value is empty string', () => {
    expect(parseFeatureFlags('', defaults)).toStrictEqual(defaults)
  })

  it('parses boolean flags and merges with defaults', () => {
    expect(
      parseFeatureFlags(JSON.stringify({ displayMyItems: true, enableEquip: false }), defaults)
    ).toStrictEqual({ displayMyItems: true, enableEquip: false })
  })

  it('filters out non-boolean flag values', () => {
    expect(
      parseFeatureFlags(
        JSON.stringify({ displayMyItems: true, enableEquip: 'yes', extra: 42 }),
        defaults
      )
    ).toStrictEqual({ displayMyItems: true, enableEquip: false })
  })

  it('returns defaults on invalid JSON', () => {
    expect(parseFeatureFlags('{invalid json', defaults)).toStrictEqual(defaults)
  })

  it('returns defaults when parsed value is an array', () => {
    expect(parseFeatureFlags('[]', defaults)).toStrictEqual(defaults)
  })

  it('returns defaults when parsed value is null', () => {
    expect(parseFeatureFlags('null', defaults)).toStrictEqual(defaults)
  })

  it('does not mutate the defaults object', () => {
    const original = { ...defaults }
    parseFeatureFlags(JSON.stringify({ displayMyItems: true }), defaults)
    expect(defaults).toStrictEqual(original)
  })
})
