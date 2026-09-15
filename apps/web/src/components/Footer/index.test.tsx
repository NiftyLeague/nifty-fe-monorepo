import { render, screen } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('website footer links', () => {
  let Footer: typeof import('./index').default

  beforeEach(async () => {
    mock.module('@nl/ui/custom/socials-footer', () => ({
      SocialsFooter: ({ children }) => <footer>{children}</footer>,
      animateClass: '',
      linkClass: '',
    }))
    mock.module('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => null }))

    Footer = (await import('./index')).default
  })

  it('keeps footer navigation on accessible regular anchors', () => {
    render(() => <Footer />)

    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('data-next-link')).toBeNull()
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('data-next-link')).toBeNull()
    expect(screen.getByRole('link', { name: 'NiftyDAO' }).getAttribute('data-next-link')).toBeNull()
    expect(screen.getByRole('link', { name: 'NiftyDAO' }).getAttribute('target')).toBe('_blank')
  })
})
