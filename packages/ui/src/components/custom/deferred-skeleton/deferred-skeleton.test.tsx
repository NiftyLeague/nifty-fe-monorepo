import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import DeferredSkeleton from './index'

describe('DeferredSkeleton', () => {
  it('keeps the shared skeleton tokens while honoring radius overrides', () => {
    const { container } = render(<DeferredSkeleton className="h-8 rounded-none" />)
    const skeleton = container.firstElementChild

    expect(skeleton?.className).toContain('bg-accent')
    expect(skeleton?.className).toContain('animate-pulse')
    expect(skeleton?.className).toContain('rounded-none')
    expect(skeleton?.className).not.toContain('rounded-md')
  })
})
