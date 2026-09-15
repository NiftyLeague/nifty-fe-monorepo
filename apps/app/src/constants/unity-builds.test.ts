import { describe, expect, it } from 'bun:test'

import { UNITY_USE_COMPRESSED } from '@/runtime/env'

import { smashersBuild } from './unity-builds'

describe('Unity public build configuration', () => {
  it('keeps public Unity builds on the documented uncompressed asset contract', () => {
    const suffix = UNITY_USE_COMPRESSED ? '.br' : ''
    expect(smashersBuild.config.dataUrl.endsWith(`.data${suffix}`)).toBe(true)
    expect(smashersBuild.config.frameworkUrl.endsWith(`.framework.js${suffix}`)).toBe(true)
    expect(smashersBuild.config.codeUrl.endsWith(`.wasm${suffix}`)).toBe(true)
  })
})
