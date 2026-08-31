import { describe, expect, it } from 'bun:test'

import { requestJson } from './request-json'

describe('requestJson', () => {
  it('serializes JSON requests and parses JSON responses', async () => {
    let capturedUrl = ''
    let capturedInit: RequestInit | undefined
    const fetcher: typeof fetch = async (input, init) => {
      capturedUrl = input.toString()
      capturedInit = init
      return new Response(JSON.stringify({ id: 1 }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      })
    }

    await expect(
      requestJson<{ id: number }>(
        'https://example.test/users',
        { body: { name: 'Nifty' }, method: 'POST' },
        fetcher
      )
    ).resolves.toEqual({ id: 1 })

    expect(capturedUrl).toBe('https://example.test/users')
    expect(capturedInit?.body).toBe(JSON.stringify({ name: 'Nifty' }))
    expect(new Headers(capturedInit?.headers).get('accept')).toBe('application/json')
    expect(new Headers(capturedInit?.headers).get('content-type')).toBe('application/json')
  })

  it('preserves parsed error response data for failed requests', async () => {
    const fetcher: typeof fetch = async () =>
      new Response(JSON.stringify({ message: 'not found' }), {
        status: 404,
        statusText: 'Not Found',
      })

    await expect(requestJson('https://example.test/missing', {}, fetcher)).rejects.toMatchObject({
      response: {
        data: { message: 'not found' },
        status: 404,
        statusText: 'Not Found',
      },
    })
  })
})
