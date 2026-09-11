import { describe, expect, it } from 'bun:test'

import { sealFlowState, statesMatch, unsealFlowState } from './flow'

const PASSWORD = 'test-session-password-0123456789ab'

describe('oauth flow state', () => {
  it('round-trips a sealed flow for the provider it was started with', async () => {
    const seal = await sealFlowState(
      {
        provider: 'google',
        state: 'state-value',
        verifier: 'verifier-value',
        callbackUrl: '/profile#li-google',
      },
      PASSWORD
    )

    expect(await unsealFlowState(seal, PASSWORD, 'google')).toEqual({
      provider: 'google',
      state: 'state-value',
      verifier: 'verifier-value',
      callbackUrl: '/profile#li-google',
    })
  })

  it('rejects a flow presented for a different provider', async () => {
    const seal = await sealFlowState(
      { provider: 'google', state: 'state-value', callbackUrl: '/profile' },
      PASSWORD
    )

    expect(await unsealFlowState(seal, PASSWORD, 'facebook')).toBeUndefined()
  })

  it('rejects a seal encrypted with another secret', async () => {
    const seal = await sealFlowState(
      { provider: 'google', state: 'state-value', callbackUrl: '/profile' },
      PASSWORD
    )

    expect(
      await unsealFlowState(seal, 'a-different-password-0123456789abc', 'google')
    ).toBeUndefined()
  })

  it('rejects missing, malformed and expired seals', async () => {
    expect(await unsealFlowState(undefined, PASSWORD, 'google')).toBeUndefined()
    expect(await unsealFlowState('not-a-seal', PASSWORD, 'google')).toBeUndefined()
  })

  it('rejects an off-site callback url', async () => {
    const flow = { provider: 'google' as const, state: 'state-value', callbackUrl: '/profile' }

    for (const callbackUrl of ['https://evil.example', '//evil.example', 'evil']) {
      const seal = await sealFlowState({ ...flow, callbackUrl }, PASSWORD)
      expect(await unsealFlowState(seal, PASSWORD, 'google')).toBeUndefined()
    }
  })
})

describe('state comparison', () => {
  it('accepts an identical state and rejects everything else', () => {
    expect(statesMatch('state-value', 'state-value')).toBe(true)
    expect(statesMatch('state-value', 'state-valuf')).toBe(false)
    expect(statesMatch('state-value', 'state-value-longer')).toBe(false)
    expect(statesMatch('state-value', '')).toBe(false)
    expect(statesMatch('state-value', null)).toBe(false)
  })
})
