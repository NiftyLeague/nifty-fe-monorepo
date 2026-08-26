import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-section', () => ({
  DeferredSection: ({
    label,
    minHeightClassName,
    rootMargin,
  }: {
    label: string
    minHeightClassName?: string
    rootMargin?: string
  }) => (
    <div
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
      role="status"
      aria-label={`Loading ${label}`}
    />
  ),
}))

import {
  DeferredHomeCommunity,
  DeferredHomeCompete,
  DeferredHomeDashboard,
  DeferredHomeDegens,
  DeferredHomeNiftyWorld,
  DeferredHomeSponsors,
  DeferredHomeToken,
} from './DeferredHomeSections'

describe('DeferredHomeSections', () => {
  it('keeps every homepage section close to the viewport without preloading it on mobile', () => {
    render(
      <>
        <DeferredHomeDegens />
        <DeferredHomeCompete />
        <DeferredHomeNiftyWorld />
        <DeferredHomeDashboard />
        <DeferredHomeToken />
        <DeferredHomeCommunity />
        <DeferredHomeSponsors />
      </>
    )

    const boundaries = screen.getAllByRole('status')
    expect(boundaries).toHaveLength(7)
    expect(boundaries.every((boundary) => boundary.dataset.rootMargin === '240px 0px')).toBe(true)
    expect(boundaries.map((boundary) => boundary.dataset.minHeight)).toEqual([
      'min-h-[32rem]',
      'min-h-[36rem]',
      'min-h-[32rem]',
      'min-h-[40rem] md:min-h-[56rem]',
      'min-h-[32rem]',
      'min-h-[36rem]',
      'min-h-[32rem]',
    ])
  })
})
