import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import FilterAccordion from './FilterAccordion'

describe('FilterAccordion', () => {
  it('keeps expanded filter options aligned with the accordion heading gutter', () => {
    const { container } = render(
      <FilterAccordion summary={<span>Tribe</span>}>
        <span>Filter option</span>
      </FilterAccordion>
    )

    const content = container.querySelector('[data-slot="accordion-content"] > div')
    expect(content?.className).toContain('px-3.5')
  })
})
