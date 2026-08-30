import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'bun:test'

import { GOOGLE_TAG_MANAGER_ID } from '../constants'
import GoogleTagManager from './index'

const scriptId = '_next-gtm'

afterEach(() => {
  document.getElementById(scriptId)?.remove()
  delete (window as Window & { dataLayer?: unknown[] }).dataLayer
})

describe('GoogleTagManager', () => {
  it('initializes the data layer and appends one async script after mount', () => {
    const appendChild = document.head.appendChild
    let appendedScript: HTMLScriptElement | null = null
    document.head.appendChild = ((node: Node) => {
      appendedScript = node as HTMLScriptElement
      return node
    }) as typeof document.head.appendChild

    try {
      render(<GoogleTagManager />)
    } finally {
      document.head.appendChild = appendChild
    }

    expect(appendedScript?.id).toBe(scriptId)
    expect(appendedScript?.getAttribute('src')).toBe(
      `https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`
    )
    expect(appendedScript?.async).toBe(true)
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toContainEqual({
      'gtm.start': expect.any(Number),
      event: 'gtm.js',
    })
  })

  it('does not duplicate a script already installed by another app boundary', () => {
    const existing = document.createElement('script')
    existing.id = scriptId
    document.head.appendChild(existing)

    render(<GoogleTagManager />)

    expect(document.querySelectorAll(`#${scriptId}`)).toHaveLength(1)
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toBeUndefined()
  })
})
