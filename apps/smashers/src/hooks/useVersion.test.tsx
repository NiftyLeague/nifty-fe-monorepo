import { renderHook } from '@nl/ui/test-utils'
import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

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
  it('returns the desktop message for Windows without any network fetch', async () => {
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    const fetchMock = spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useVersion())
    expect(result.current.message).toContain('Download Nifty Smashers Beta')
    expect(result.current.os).toBe('win')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns the platform message without fetching for Android', async () => {
    device.windows = false
    device.android = true
    mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: mockUserAgent }))
    useVersion = (await import('./useVersion')).default
    const fetchMock = spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useVersion())
    expect(result.current.os).toBe('android')
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
      'Download Nifty Smashers Beta on mobile or PC!',
      { ios: false, mac: true, linux: false },
    ],
    [
      'Linux',
      'Download Nifty Smashers Beta on mobile or PC!',
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
  })
})
