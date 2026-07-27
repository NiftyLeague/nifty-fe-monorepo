const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}

import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { mock } from 'bun:test'

let errorMsgHandler: typeof import('./errorHandlers').errorMsgHandler
let errorResHandler: typeof import('./errorHandlers').errorResHandler
let FetchError: typeof import('./fetchJson').FetchError
let fetchJson: typeof import('./fetchJson').fetchJson
let getRandomKey: typeof import('./getRandomKey').getRandomKey
let parseLinkedWalletResult: typeof import('./parseData').parseLinkedWalletResult
let safeJSONParse: typeof import('./parseData').safeJSONParse
let isEthereumSignatureValid: typeof import('./wallet').isEthereumSignatureValid

beforeEach(async () => {
  const errorHandlers = await import('./errorHandlers')
  const fetchJsonModule = await import('./fetchJson')
  const getRandomKeyModule = await import('./getRandomKey')
  const parseData = await import('./parseData')
  const wallet = await import('./wallet')

  errorMsgHandler = errorHandlers.errorMsgHandler
  errorResHandler = errorHandlers.errorResHandler
  FetchError = fetchJsonModule.FetchError
  fetchJson = fetchJsonModule.fetchJson
  getRandomKey = getRandomKeyModule.getRandomKey
  parseLinkedWalletResult = parseData.parseLinkedWalletResult
  safeJSONParse = parseData.safeJSONParse
  isEthereumSignatureValid = wallet.isEthereumSignatureValid
})

describe('fetchJson', () => {
  beforeEach(() => undefined)

  it('returns JSON from successful responses', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
    stubGlobal('fetch', mock().mockResolvedValue(response))

    await expect(fetchJson('/profile')).resolves.toEqual({ ok: true })
  })

  it('throws a FetchError containing response data', async () => {
    const response = new Response(JSON.stringify({ message: 'Denied' }), {
      status: 403,
      statusText: 'Forbidden',
      headers: { 'content-type': 'application/json' },
    })
    stubGlobal('fetch', mock().mockResolvedValue(response))

    await expect(fetchJson('/profile')).rejects.toMatchObject({
      name: 'FetchError',
      message: 'Forbidden',
      data: { message: 'Denied' },
    })
  })
})

describe('PlayFab utility helpers', () => {
  it('normalizes response and message errors', () => {
    const response = new Response(null, { status: 500 })
    const fetchError = new FetchError({
      message: 'Request failed',
      response,
      data: { message: 'Try again' },
    })

    expect(errorMsgHandler(fetchError)).toBe('Try again')
    expect(errorMsgHandler({ errorMessage: 'PlayFab failed' })).toBe('PlayFab failed')
    expect(errorMsgHandler({ message: 'Plain failed' })).toBe('Plain failed')
    expect(errorResHandler(new Error('Unexpected'))).toEqual({ status: 500, message: 'Unexpected' })
    expect(errorResHandler({ code: 429, errorMessage: 'Slow down' })).toEqual({
      status: 429,
      message: 'Slow down',
    })
  })

  it('parses stored wallet data and safely handles invalid JSON', () => {
    expect(safeJSONParse('["ethereum:0xabc"]')).toEqual(['ethereum:0xabc'])
    spyOn(console, 'error').mockImplementation(() => undefined)
    expect(safeJSONParse('invalid')).toEqual([])
    expect(
      parseLinkedWalletResult({
        LinkedWallets: { LastUpdated: 'now', Value: '["ethereum:0xdef"]' },
      })
    ).toEqual(['ethereum:0xdef'])
    expect(parseLinkedWalletResult()).toEqual([])
  })

  it('creates browser-safe random identifiers', () => {
    expect(getRandomKey(32)).toMatch(/^[A-Za-z0-9]{32}$/)
  })

  it('rejects incomplete signatures and accepts complete inputs', async () => {
    await expect(isEthereumSignatureValid('', 'sig', 'nonce')).resolves.toBe(false)
    await expect(isEthereumSignatureValid('0xabc', 'sig', 'nonce')).resolves.toBe(true)
  })
})
