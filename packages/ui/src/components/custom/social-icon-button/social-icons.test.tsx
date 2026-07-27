import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'bun:test'

let SocialIcons: typeof import('./social-icons')

beforeEach(async () => {
  SocialIcons = await import('./social-icons')
})

describe('social-icons', () => {
  it('exports icon render functions', () => {
    const iconNames = Object.keys(SocialIcons) as (keyof typeof SocialIcons)[]
    expect(iconNames.length).toBeGreaterThan(0)
    for (const name of iconNames) {
      expect(typeof SocialIcons[name]).toBe('function')
    }
  })

  it('renders every icon as an svg with a path', () => {
    const iconNames = Object.keys(SocialIcons) as (keyof typeof SocialIcons)[]
    for (const name of iconNames) {
      const IconFn = SocialIcons[name]
      const { container } = render(<IconFn />)
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
      expect(svg?.querySelector('path')).toBeTruthy()
    }
  })
})
