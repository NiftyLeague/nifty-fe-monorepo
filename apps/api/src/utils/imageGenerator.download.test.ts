import { describe, expect, it, mock } from 'bun:test'

const mockFetch = mock<() => Promise<any>>()

mock.module('node-config-ts', () => ({
  config: {
    imageGenerator: {
      baseURL: 'https://images.example/generate',
      secret: 'test-secret',
      version: 'v2',
    },
  },
}))

mock.module('node-fetch', () => ({
  default: mockFetch,
}))

// `downloadImage` uses fs.createWriteStream and pipes res.body into it.
const fs = await import('fs')
const writeStreamMock = {
  on: mock(function (this: any, _e: string, cb: () => void) {
    if (_e === 'finish') cb()
    return this
  }),
}
const fsSpy = mock(function () {
  return writeStreamMock
}) as never
mock.module('fs', () => ({
  default: fs,
  createWriteStream: fsSpy,
}))

const { downloadImage } = await import('./imageGenerator')

describe('imageGenerator.downloadImage', () => {
  it('pipes the upstream body into a write stream at the destination', async () => {
    const body = {
      pipe: mock(function (this: any) {
        return this
      }),
      on: mock(),
    }
    mockFetch.mockResolvedValue({ body })

    await downloadImage('https://images.example/x.png', '/tmp/out.png')

    expect(mockFetch).toHaveBeenCalledWith('https://images.example/x.png')
    expect(fsSpy).toHaveBeenCalledWith('/tmp/out.png')
    expect(body.pipe).toHaveBeenCalledWith(writeStreamMock)
  })

  it('rejects when the upstream body emits an error', async () => {
    const body = {
      pipe: mock(function (this: any) {
        return this
      }),
      on: mock(function (this: any, _e: string, cb: (err: Error) => void) {
        if (_e === 'error') cb(new Error('stream failed'))
        return this
      }),
    }
    mockFetch.mockResolvedValue({ body })

    await expect(downloadImage('https://images.example/x.png', '/tmp/out.png')).rejects.toThrow(
      'stream failed'
    )
  })
})
