import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Request, Response } from 'express'

const mockFetch = mock<() => Promise<any>>()
const mockHttpsGet = mock()

mock.module('node-fetch', () => ({
  default: mockFetch,
}))

mock.module('https', () => ({
  default: { get: mockHttpsGet },
  get: mockHttpsGet,
}))

const { fetchMetadata, resolveDegenMetadata, pipeRequest } = await import('./api')

beforeEach(() => {
  mockFetch.mockClear()
  mockHttpsGet.mockClear()
})

describe('api.fetchMetadata', () => {
  it('returns parsed JSON when the response is OK', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ name: 'Degen', id: 1 }),
    })

    const meta = await fetchMetadata('https://nifty-league.s3.amazonaws.com/1.json')
    expect(meta).toEqual({ name: 'Degen', id: 1 })
  })

  it('returns null when the response status is >= 400', async () => {
    mockFetch.mockResolvedValue({ status: 500, json: async () => ({}) })
    expect(await fetchMetadata('https://nifty-league.s3.amazonaws.com/1.json')).toBeNull()
  })

  it('returns null when the fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('network down'))
    expect(await fetchMetadata('https://nifty-league.s3.amazonaws.com/1.json')).toBeNull()
  })

  it('fails closed for an unsupported upstream host', async () => {
    expect(await fetchMetadata('https://example.com/internal')).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('api.resolveDegenMetadata', () => {
  it('builds the S3 metadata URL from route params', async () => {
    mockFetch.mockResolvedValue({ status: 200, json: async () => ({ token_id: 7 }) })
    const req = { params: { network: 'mainnet', token_id: '7' } } as unknown as Request

    const meta = await resolveDegenMetadata(req)
    expect(meta).toEqual({ token_id: 7 })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    expect((mockFetch.mock.calls[0] as [URL])[0].href).toBe(
      'https://nifty-league.s3.amazonaws.com/degens/mainnet/metadata/7.json'
    )
  })

  it('fails closed for an invalid route parameter', async () => {
    const req = { params: { network: '../mainnet', token_id: '7' } } as unknown as Request

    expect(await resolveDegenMetadata(req)).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('api.pipeRequest', () => {
  it('pipes a 200 upstream body to the client and sets cache headers', async () => {
    const res = {
      headersSent: false,
      setHeader: mock(),
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
      end: mock(),
    } as unknown as Response

    const fakeStream = {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      // Node's Readable.pipe() ends the destination writable when the source
      // stream ends; simulate that here instead of relying on an explicit
      // 'end' listener in pipeRequest.
      pipe: mock(function (this: any, dest: any) {
        dest.end()
        return dest
      }),
      on: mock(function (this: any) {
        return this
      }),
    }
    mockHttpsGet.mockImplementation((_url: string, cb: (s: any) => void) => {
      cb(fakeStream)
      return { setTimeout: mock(), on: mock(), destroy: mock() }
    })

    pipeRequest('https://nifty-league.s3.amazonaws.com/x', res)
    await new Promise((r) => setTimeout(r, 5))

    expect((res as any).setHeader).toHaveBeenCalledWith('content-type', 'application/json')
    expect((res as any).setHeader).toHaveBeenCalledWith(
      'cache-control',
      'public, max-age=86400, immutable'
    )
    expect((res as any).end).toHaveBeenCalled()
  })

  it('returns a 502 JSON error when upstream status >= 400', async () => {
    const res = {
      headersSent: false,
      setHeader: mock(),
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
      end: mock(),
    } as unknown as Response

    const fakeStream = {
      statusCode: 404,
      headers: {},
      resume: mock(),
      pipe: mock(),
      on: mock(function (this: any) {
        return this
      }),
    }
    mockHttpsGet.mockImplementation((_url: string, cb: (s: any) => void) => {
      cb(fakeStream)
      return { setTimeout: mock(), on: mock(), destroy: mock() }
    })

    pipeRequest('https://nifty-league.s3.amazonaws.com/missing', res)
    await new Promise((r) => setTimeout(r, 5))

    expect((res as any).status).toHaveBeenCalledWith(404)
    expect((res as any).json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    )
  })

  it('returns a 502 when the request errors before headers are sent', async () => {
    const res = {
      headersSent: false,
      setHeader: mock(),
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
      end: mock(),
    } as unknown as Response

    const fakeReq = {
      setTimeout: mock(),
      on: mock(function (this: any, evt: string, cb: (e?: Error) => void) {
        if (evt === 'error') cb(new Error('boom'))
        return this
      }),
      destroy: mock(),
    }
    mockHttpsGet.mockReturnValue(fakeReq as never)

    pipeRequest('https://nifty-league.s3.amazonaws.com/x', res)
    await new Promise((r) => setTimeout(r, 5))

    expect((res as any).status).toHaveBeenCalledWith(502)
    expect((res as any).json).toHaveBeenCalled()
  })

  it('returns a 502 when the upstream request times out', async () => {
    const res = {
      headersSent: false,
      setHeader: mock(),
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
      end: mock(),
    } as unknown as Response

    mockHttpsGet.mockImplementation((_url: string, cb: (s: any) => void) => {
      const req = {
        setTimeout: mock(function (this: any, _ms: number, timeoutCb: () => void) {
          setImmediate(timeoutCb)
          return this
        }),
        on: mock(function (this: any, evt: string, handler: (e?: Error) => void) {
          if (evt === 'error') {
            ;(this as any).errorHandler = handler
          }
          return this
        }),
        destroy: mock(function (this: any, err?: Error) {
          const handler = (this as any).errorHandler
          if (handler) handler(err)
          return this
        }),
      }
      cb({ statusCode: 200, headers: {}, pipe: mock(), on: mock() })
      return req
    })

    pipeRequest('https://nifty-league.s3.amazonaws.com/x', res)
    await new Promise((r) => setTimeout(r, 20))

    expect((res as any).status).toHaveBeenCalledWith(502)
    expect((res as any).json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    )
  })

  it('ends the response when the request errors after headers are sent', async () => {
    const res = {
      headersSent: true,
      setHeader: mock(),
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
      end: mock(),
    } as unknown as Response

    const fakeReq = {
      setTimeout: mock(),
      on: mock(function (this: any, evt: string, cb: (e?: Error) => void) {
        if (evt === 'error') cb(new Error('boom'))
        return this
      }),
      destroy: mock(),
    }
    mockHttpsGet.mockReturnValue(fakeReq as never)

    pipeRequest('https://nifty-league.s3.amazonaws.com/x', res)
    await new Promise((r) => setTimeout(r, 5))

    expect((res as any).end).toHaveBeenCalled()
    expect((res as any).status).not.toHaveBeenCalled()
    expect((res as any).json).not.toHaveBeenCalled()
  })

  it('rejects upstream URLs outside the S3 allowlist', () => {
    const res = {
      status: mock(function (this: any) {
        return this
      }),
      json: mock(),
    } as unknown as Response

    pipeRequest('https://example.com/internal', res)

    expect((res as any).status).toHaveBeenCalledWith(400)
    expect((res as any).json).toHaveBeenCalledWith({
      errors: [{ message: 'Unsupported upstream URL' }],
    })
    expect(mockHttpsGet).not.toHaveBeenCalled()
  })
})
