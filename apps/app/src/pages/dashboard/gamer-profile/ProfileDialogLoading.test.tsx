import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({ label }: { label: string }) => <div role="status">{label}</div>,
}))

describe('profile dialog loading boundaries', () => {
  it('keeps the profile name form out of the DOM until the edit trigger opens', async () => {
    const { default: ChangeProfileNameDialog } = await import('./_Stats/ChangeProfileNameDialog')

    render(<ChangeProfileNameDialog handleUpdateNewName={() => {}} />)

    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    expect(screen.getByRole('status').textContent).toBe('profile name form')
  })

  it('keeps the profile image picker out of the DOM until the edit trigger opens', async () => {
    const { default: ProfileImageDialog } = await import('./_ImageProfile/ProfileImageDialog')

    render(<ProfileImageDialog degens={[]} onChangeAvatar={() => {}} />)

    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    expect(screen.getByRole('status').textContent).toBe('profile image picker')
  })
})
