import { afterEach, describe, expect, it } from 'bun:test'

import { setCanvasInteraction } from './canvas-interaction'

afterEach(() => {
  document.body.replaceChildren()
})

describe('setCanvasInteraction', () => {
  it('reports when the canvas is not mounted yet', () => {
    expect(setCanvasInteraction('game-canvas', true)).toBe(false)
  })

  it('shares pointer behavior for enabling and temporarily disabling a canvas', () => {
    const canvas = document.createElement('canvas')
    canvas.className = 'character-canvas'
    document.body.append(canvas)

    expect(setCanvasInteraction('character-canvas', true)).toBe(true)
    expect(canvas.style.pointerEvents).toBe('auto')
    expect(canvas.style.cursor).toBe('pointer')

    expect(setCanvasInteraction('character-canvas', false)).toBe(true)
    expect(canvas.style.pointerEvents).toBe('none')
    expect(canvas.style.cursor).toBe('pointer')
  })
})
