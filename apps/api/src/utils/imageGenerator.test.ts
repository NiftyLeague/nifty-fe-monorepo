import { describe, expect, it, mock } from 'bun:test'

// --- mocks must be set before source imports ---

mock.module('node-config-ts', () => ({
  config: {
    imageGenerator: {
      baseURL: 'https://example.com/generate',
      version: 'v1',
      secret: 'test-secret',
    },
  },
}))

const fetchSpy = mock(async (_url: string) => ({
  body: {
    pipe: mock(() => {}),
    on: mock((_event: string, cb: () => void) => {
      if (_event === 'finish') cb()
    }),
  },
}))

mock.module('node-fetch', () => ({ default: fetchSpy }))

const fsOnMock = mock((_event: string, cb: () => void) => {
  if (_event === 'finish') cb()
})
mock.module('fs', () => ({
  default: { createWriteStream: mock(() => ({ on: fsOnMock })) },
  createWriteStream: mock(() => ({ on: fsOnMock })),
}))

// --- now safe to import source ---

import { generateImageURL, downloadImage } from './imageGenerator'

describe('generateImageURL', () => {
  it('builds the correct image URL with params', () => {
    const traits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    const url = generateImageURL(traits, 2, 42)
    expect(url).toContain('https://example.com/generate')
    expect(url).toContain('rarity=2')
    expect(url).toContain('token=42')
    expect(url).toContain('secret=test-secret')
    expect(url).toContain('version=v1')
    expect(url).toContain('traits=')
  })
})

describe('downloadImage', () => {
  it('calls fetch with the correct URL', async () => {
    const url = 'https://example.com/image.png'
    const dest = '/tmp/dest.png'

    await downloadImage(url, dest)

    expect(fetchSpy).toHaveBeenCalledWith(url)
  })
})
