const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}
import { beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

let downloadDegenAsZip: typeof import('./file').downloadDegenAsZip

const createObjectURLMock = mock<(blob: Blob) => string>(() => 'blob:degen-zip')
const revokeObjectURLMock = mock<(url: string) => void>(() => {})

beforeEach(async () => {
  mock.module('@/constants/url', () => ({
    DEGEN_ASSETS_DOWNLOAD_URL: 'https://assets.example/degen',
  }))
  stubGlobal('URL', {
    ...URL,
    createObjectURL: createObjectURLMock,
    revokeObjectURL: revokeObjectURLMock,
  })

  const fileModule = await import('./file')
  downloadDegenAsZip = fileModule.downloadDegenAsZip
})

beforeEach(() => {
  mock.clearAllMocks()
})

describe('downloadDegenAsZip', () => {
  it('downloads base64 data and saves it as a ZIP object-URL download', async () => {
    const fetchMock = mock().mockResolvedValue({
      ok: true,
      text: mock().mockResolvedValue('UEs='),
    })
    stubGlobal('fetch', fetchMock)

    const clicks: string[] = []
    const anchors: { href: string; download: string }[] = []
    const originalCreateElement = document.createElement.bind(document)
    stubGlobal('document', {
      ...document,
      createElement: (tag: string) => {
        if (tag !== 'a') return originalCreateElement(tag)
        const anchor = originalCreateElement('a')
        anchors.push(anchor)
        Object.defineProperty(anchor, 'click', { value: () => clicks.push(tag) })
        return anchor
      },
    })

    await downloadDegenAsZip('auth-token', 42)

    expect(fetchMock).toHaveBeenCalledWith('https://assets.example/degen?id=42', {
      headers: { authorizationToken: 'auth-token' },
    })
    expect(anchors).toHaveLength(1)
    expect(anchors[0]?.download).toBe('degen_42.zip')
    expect(anchors[0]?.href).toBe('blob:degen-zip')
    expect(clicks).toEqual(['a'])
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:degen-zip')
    const blob = createObjectURLMock.mock.calls[0]?.[0] as Blob
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/zip')
    expect(blob.size).toBe(2)
  })

  it('rejects when invoked without a browser window', async () => {
    const currentWindow = window
    stubGlobal('window', undefined)

    await expect(downloadDegenAsZip('token', 1)).rejects.toThrow('Window undefined')
    stubGlobal('window', currentWindow)
  })
})
