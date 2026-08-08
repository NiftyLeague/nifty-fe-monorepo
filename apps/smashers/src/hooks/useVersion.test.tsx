import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, spyOn, mock } from 'bun:test'

const device = { android: false, ios: false, mac: false, windows: true, linux: false }

let useVersion: typeof import('./useVersion').default

const mockUserAgent = () => ({
  isAndroid: () => device.android,
  isIos: () => device.ios,
  isMacOs: () => device.mac,
  isWindows: () => device.windows,
  isLinux: () => device.linux,
  isMobile: () => device.android || device.ios,
  isTablet: () => false,
  isMobileOnly: () => device.android || device.ios,
  isDesktop: () => !device.android && !device.ios,
  isOpera: () => false,
  isSSR: () => false,
  browserName: 'Chrome',
})

afterEach(() => {
  mock.restore()
  device.android = false
  device.ios = false
  device.mac = false
  device.windows = true
  device.linux = false
  document.body.innerHTML = ''
})

describe('useVersion', () => {
  it('fetches the Windows launcher version and creates its download URL', async () => {
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    spyOn(globalThis, 'fetch').mockResolvedValue(new Response('1.2.3-build\n', { status: 200 }))
    const { result } = renderHook(() => useVersion())
    await waitFor(() => expect(result.current.version).toBe('1.2.3-build\n'))
    expect(result.current.isWindows).toBe(true)
    expect(result.current.downloadURL).toContain('/launcher/stage/win/1.2.3-build')
    expect(result.current.message).toContain('Download Nifty Smashers Beta')
  })

  it('returns the platform message without fetching for Android', async () => {
    device.windows = false
    device.android = true
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    const fetchMock = spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useVersion())
    expect(result.current.isWindows).toBe(false)
    expect(result.current.downloadURL).toBeNull()
    expect(result.current.message).toContain('Google Play')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    [
      'iOS',
      'Download Nifty Smashers Beta on the App Store!',
      { ios: true, mac: false, linux: false },
    ],
    [
      'macOS',
      'Download Nifty Smashers Beta on mobile or PC! ',
      { ios: false, mac: true, linux: false },
    ],
    [
      'Linux',
      'Download Nifty Smashers Beta on mobile or PC! ',
      { ios: false, mac: false, linux: true },
    ],
  ])('selects the %s platform message', async (_platform, message, flags) => {
    device.windows = false
    device.ios = flags.ios ?? false
    device.mac = flags.mac ?? false
    device.linux = flags.linux ?? false
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    const { result } = renderHook(() => useVersion())
    expect(result.current.message).toBe(message)
    expect(result.current.downloadURL).toBeNull()
  })

  it('handles launcher version failures', async () => {
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useVersion())
    await waitFor(() => expect(result.current.version).toBe(''), { timeout: 10_000 })
  })
})
