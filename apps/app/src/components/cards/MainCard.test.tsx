import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import MainCard from './MainCard'

describe('MainCard', () => {
  it('renders a titled card with custom presentation and forwarded ref', () => {
    let cardRef: HTMLDivElement | undefined

    const { container } = render(() => (
      <MainCard
        ref={(element) => {
          cardRef = element
        }}
        title={<span>Account</span>}
        darkTitle
        secondary={<button type="button">Manage</button>}
        boxShadow
        shadow="shadow-custom"
        contentClass="content-custom"
        className="card-custom"
      >
        <span>Account content</span>
      </MainCard>
    ))

    const card = container.querySelector('[data-slot="card"]') as HTMLDivElement

    expect(cardRef).toBe(card)
    expect(card.className).toContain('card-custom')
    expect(card.className).toContain('shadow-custom')
    expect(card.querySelector('[data-slot="card-header"]')).not.toBeNull()
    expect(card.querySelector('[data-slot="separator"]')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Account', level: 3 })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Manage' })).not.toBeNull()
    expect(card.querySelector('[data-slot="card-content"]')?.className).toContain('content-custom')
    expect(screen.getByText('Account content')).not.toBeNull()
  })

  it('uses the default title level and shadow when those options are not customized', () => {
    const { container } = render(() => (
      <MainCard title="Summary" boxShadow>
        Summary content
      </MainCard>
    ))

    const card = container.querySelector('[data-slot="card"]') as HTMLDivElement

    expect(screen.getByRole('heading', { name: 'Summary', level: 5 })).not.toBeNull()
    expect(card.className).toContain('shadow-(--card-shadow-blue)')
    expect(card.querySelector('[data-slot="card-content"]')).not.toBeNull()
  })

  it('renders children directly when content wrapping is disabled and omits the header', () => {
    const { container } = render(() => (
      <MainCard border={false} content={false}>
        Raw content
      </MainCard>
    ))

    const card = container.querySelector('[data-slot="card"]') as HTMLDivElement

    expect(card.querySelector('[data-slot="card-header"]')).toBeNull()
    expect(card.querySelector('[data-slot="separator"]')).toBeNull()
    expect(card.querySelector('[data-slot="card-content"]')).toBeNull()
    expect(card.textContent).toContain('Raw content')
  })
})
