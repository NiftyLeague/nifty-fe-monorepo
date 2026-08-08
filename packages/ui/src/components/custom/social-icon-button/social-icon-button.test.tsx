import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, jest, mock } from 'bun:test'

let SocialIconButton: typeof import('./index').SocialIconButton

beforeEach(async () => {
  const indexModule = await import('./index')
  SocialIconButton = indexModule.SocialIconButton
})

describe('SocialIconButton', () => {
  it('renders the provider icon and hidden label', () => {
    const { container, getByText } = render(<SocialIconButton provider="google" />)
    expect(container.querySelector('button')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
    expect(getByText('google')).toBeTruthy()
  })

  it('renders a visible label when provided', () => {
    const { getByText } = render(<SocialIconButton provider="discord" label="Sign in" />)
    expect(getByText('Sign in')).toBeTruthy()
  })

  it('fires onClick when clicked', () => {
    const onClick = mock()
    const { container } = render(<SocialIconButton provider="apple" onClick={onClick} />)
    fireEvent.click(container.querySelector('button')!)
    expect(onClick).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is set', () => {
    const { container } = render(<SocialIconButton provider="github" disabled />)
    expect(container.querySelector('button')?.hasAttribute('disabled')).toBe(true)
  })

  it('shows the loader icon while loading and applies color styles', () => {
    const { container } = render(<SocialIconButton provider="twitch" loading withColor />)
    expect(container.querySelector('svg.lucide-loader')).toBeTruthy()
  })
})
