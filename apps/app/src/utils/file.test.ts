const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}
import { beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

const { saveAsMock } = { saveAsMock: mock() }

let downloadDegenAsZip: typeof import('./file').downloadDegenAsZip

beforeEach(async () => {
  mock.module('save-as', () => ({ saveAs: saveAsMock }))
  mock.module('@/constants/url', () => ({
    DEGEN_ASSETS_DOWNLOAD_URL: 'https://assets.example/degen',
  }))

  const fileModule = await import('./file')
  downloadDegenAsZip = fileModule.downloadDegenAsZip
})

beforeEach(() => {
  mock.clearAllMocks()
})

describe('downloadDegenAsZip', () => {
  it('downloads base64 data and saves it as a ZIP blob', async () => {
    const fetchMock = mock().mockResolvedValue({
      ok: true,
      text: mock().mockResolvedValue('UEs='),
    })
    stubGlobal('fetch', fetchMock)

    await downloadDegenAsZip('auth-token', 42)

    expect(fetchMock).toHaveBeenCalledWith('https://assets.example/degen?id=42', {
      headers: { authorizationToken: 'auth-token' },
    })
    const [blob, filename] = saveAsMock.mock.calls[0] as [Blob, string]
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/zip')
    expect(blob.size).toBe(2)
    expect(filename).toBe('degen_42.zip')
  })

  it('rejects when invoked without a browser window', async () => {
    const currentWindow = window
    stubGlobal('window', undefined)

    await expect(downloadDegenAsZip('token', 1)).rejects.toThrow('Window undefined')
    stubGlobal('window', currentWindow)
  })
})
