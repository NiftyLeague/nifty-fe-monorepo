import { beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

beforeEach(() => {
  mock.module('@next/third-parties/google', () => ({ sendGTMEvent: mock() }))
})

let sendGTMEvent: ReturnType<typeof mock>
let sendEvent: typeof import('./events').sendEvent
let sendGameReferral: typeof import('./events').sendGameReferral
let sendWebVitals: typeof import('./events').sendWebVitals
let sendUserId: typeof import('./events').sendUserId
let removeUserId: typeof import('./events').removeUserId
let EVENTS: typeof import('./constants').EVENTS

beforeEach(async () => {
  const googleModule = await import('@next/third-parties/google')
  const eventsModule = await import('./events')
  const constantsModule = await import('./constants')
  sendGTMEvent = googleModule.sendGTMEvent as ReturnType<typeof mock>
  sendEvent = eventsModule.sendEvent
  sendGameReferral = eventsModule.sendGameReferral
  sendWebVitals = eventsModule.sendWebVitals
  sendUserId = eventsModule.sendUserId
  removeUserId = eventsModule.removeUserId
  EVENTS = constantsModule.EVENTS
})

describe('Google Tag Manager events', () => {
  beforeEach(() => window.localStorage.clear())

  it('adds the stored user and inferred category to custom events', () => {
    window.localStorage.setItem('user_id', 'player-7')
    sendEvent(EVENTS.LOGIN, { method: 'email' })

    expect(sendGTMEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: EVENTS.LOGIN, user_id: 'player-7', method: 'email' })
    )
  })

  it('stores and removes user identity while emitting auth events', () => {
    sendUserId('player-8')
    expect(window.localStorage.getItem('user_id')).toBe('player-8')

    removeUserId()
    expect(window.localStorage.getItem('user_id')).toBeNull()
    expect(sendGTMEvent).toHaveBeenLastCalledWith(expect.objectContaining({ event: EVENTS.LOGOUT }))
  })

  it('forwards referral dimensions and normalizes web-vital values', () => {
    sendGameReferral({
      game_name: 'Smashers',
      invite_method: 'link',
      invitee_agent: 'browser',
      redirect_route: '/play',
      referrer_id: 'player-9',
    })
    sendWebVitals({ id: 'metric-1', name: 'CLS', value: 0.123 } as never)

    expect(sendGTMEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: EVENTS.GAME_REFERRAL, game_name: 'Smashers' })
    )
    expect(sendGTMEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: EVENTS.WEB_VITALS, metric_name: 'CLS', metric_value: 123 })
    )
  })
})
