import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const itemIds = [1, 2, 3, 4, 5, 6, 7]
const imageCard = 'apps/app/src/components/cards/ImageCard.tsx'
const burnerGrid =
  'apps/app/src/app/(private-routes)/dashboard/items/burner/_components/items-grid.tsx'

describe('app animated item media policy', () => {
  it('keeps every animated item paired with a smaller WebP source', () => {
    for (const id of itemIds) {
      expect(statSync(`assets/img/items/full/${id}.webp`).size).toBeLessThan(
        statSync(`assets/img/items/full/${id}.gif`).size
      )
    }
  })

  it('routes marketplace and burner consumers through the shared image primitive', () => {
    expect(readFileSync(imageCard, 'utf8')).toContain('@nl/ui/custom/animated-image')
    expect(readFileSync(burnerGrid, 'utf8')).toContain('@nl/ui/custom/animated-image')
  })
})
