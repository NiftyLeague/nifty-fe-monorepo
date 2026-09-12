import { afterEach, describe, expect, it } from 'bun:test'

import { GOOGLE_TAG_MANAGER_ID } from './constants'
import {
  GOOGLE_TAG_MANAGER_SCRIPT_ID,
  googleTagManagerScriptUrl,
  loadGoogleTagManager,
} from './loadGoogleTagManager'

const dataLayer = () => (window as Window & { dataLayer?: unknown[] }).dataLayer

/** happy-dom does not execute scripts; capture the append instead of loading it. */
const captureAppend = () => {
  const appendChild = document.head.appendChild
  const appended: HTMLScriptElement[] = []
  document.head.appendChild = ((node: Node) => {
    appended.push(node as HTMLScriptElement)
    return node
  }) as typeof document.head.appendChild
  return { appended, restore: () => (document.head.appendChild = appendChild) }
}

afterEach(() => {
  for (const script of document.querySelectorAll(`#${GOOGLE_TAG_MANAGER_SCRIPT_ID}`))
    script.remove()
  delete (window as Window & { dataLayer?: unknown[] }).dataLayer
})

describe('loadGoogleTagManager', () => {
  it('installs one async container script and starts the data layer', () => {
    const { appended, restore } = captureAppend()
    let installed: boolean

    try {
      installed = loadGoogleTagManager()
    } finally {
      restore()
    }

    expect(installed).toBe(true)
    expect(appended).toHaveLength(1)
    expect(appended[0]?.id).toBe(GOOGLE_TAG_MANAGER_SCRIPT_ID)
    expect(appended[0]?.async).toBe(true)
    expect(appended[0]?.getAttribute('src')).toBe(googleTagManagerScriptUrl())
    expect(googleTagManagerScriptUrl()).toContain(`id=${GOOGLE_TAG_MANAGER_ID}`)
    expect(dataLayer()).toContainEqual({ 'gtm.start': expect.any(Number), event: 'gtm.js' })
  })

  it('adopts a container another surface already installed', () => {
    const existing = document.createElement('script')
    existing.id = GOOGLE_TAG_MANAGER_SCRIPT_ID
    document.head.appendChild(existing)
    const { appended, restore } = captureAppend()

    let installed: boolean
    try {
      installed = loadGoogleTagManager()
    } finally {
      restore()
    }

    // No second container, and no start event for a container that already ran.
    expect(installed).toBe(false)
    expect(appended).toHaveLength(0)
    expect(dataLayer()).toBeUndefined()
  })
})
