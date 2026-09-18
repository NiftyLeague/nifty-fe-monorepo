import { describe, expect, it } from 'bun:test'

import { NIFTY_WORLD_SCENES, getNiftyWorldSceneUrl } from './niftyworld-scenes'

describe('Nifty World scene catalog', () => {
  it('includes every playable scene except Gas Station', () => {
    expect(NIFTY_WORLD_SCENES.map((scene) => scene.id)).toEqual([
      'isla-azul',
      'dungeon',
      'party-cove',
      'little-tokyo',
      'mansion',
      'exchange',
      'marina',
      'downtown',
      'rugmans-peak',
      'arcade',
    ])
    expect(NIFTY_WORLD_SCENES.some((scene) => scene.id === 'gas-station')).toBe(false)
  })

  it('keeps scene routing and embed parameters intact', () => {
    const dungeon = NIFTY_WORLD_SCENES.find((scene) => scene.id === 'dungeon')

    expect(dungeon).toBeTruthy()
    expect(getNiftyWorldSceneUrl(dungeon!, true, 2, 'visit-1')).toBe(
      'https://niftyworld.gg/scenes/isla-azul?zone=dungeon&embed=1&visit=visit-1&attempt=2'
    )
  })

  it('points the relocated arcade scene at its /other home', () => {
    const arcade = NIFTY_WORLD_SCENES.find((scene) => scene.id === 'arcade')

    expect(arcade).toBeTruthy()
    expect(getNiftyWorldSceneUrl(arcade!)).toBe('https://niftyworld.gg/other/arcade')
  })

  it('keeps map descriptions compact enough for one-line cards', () => {
    expect(NIFTY_WORLD_SCENES.every(({ description }) => description.length <= 42)).toBe(true)
    expect(NIFTY_WORLD_SCENES.every(({ description }) => !description.includes('\n'))).toBe(true)
  })
})
