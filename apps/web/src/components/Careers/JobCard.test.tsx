import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import JobCard from './JobCard'

const details = {
  id: 'sr-unity-developer',
  link: 'https://example.com/apply',
  title: 'Sr. Unity Developer',
  location: 'United States (Remote)',
  aboutTheRole: 'Build great games with the team.',
  requirements: ['Unity experience'],
  benefits: ['Flexible work'],
}

describe('JobCard', () => {
  it('keeps the apply link outside the accordion trigger', () => {
    render(() => <JobCard details={details} />)

    const trigger = screen.getByRole('button')
    const applyLink = screen.getByRole('link', { name: /apply/i })

    expect(trigger.contains(applyLink)).toBe(false)
    expect(applyLink.closest('[data-slot="accordion-item"]')).toBeTruthy()
  })
})
