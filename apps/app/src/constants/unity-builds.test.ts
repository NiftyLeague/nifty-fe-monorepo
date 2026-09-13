import { describe, expect, it } from 'bun:test'

import { UNITY_USE_COMPRESSED } from '@/runtime/env'

import { characterCreatorBuild, smashersBuild } from './unity-builds'

describe('Unity public build configuration', () => {
  it('keeps the character creator loader usable without a local env file', () => {
    const loaderUrl = characterCreatorBuild(false).config.loaderUrl
    expect(new URL(loaderUrl).protocol).toBe('https:')
    expect(loaderUrl).not.toContain('/Build/.loader.js')
  })

  it('keeps public Unity builds on the documented uncompressed asset contract', () => {
    const suffix = UNITY_USE_COMPRESSED ? '.br' : ''
    expect(smashersBuild.config.dataUrl.endsWith(`.data${suffix}`)).toBe(true)
    expect(smashersBuild.config.frameworkUrl.endsWith(`.framework.js${suffix}`)).toBe(true)
    expect(smashersBuild.config.codeUrl.endsWith(`.wasm${suffix}`)).toBe(true)
  })
})
