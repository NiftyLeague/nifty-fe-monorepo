import { describe, expect, it } from 'bun:test'
import { GAME_CARD_IMAGE_SIZES } from './image-sizes'

describe('shared image sizes', () => {
  it('keeps game-card artwork within the app content width on larger viewports', () => {
    expect(GAME_CARD_IMAGE_SIZES).toBe('(min-width: 768px) 410px, 100vw')
  })
})
