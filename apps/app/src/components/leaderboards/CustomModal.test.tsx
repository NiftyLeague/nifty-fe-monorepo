import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import CustomModal from './CustomModal'

describe('leaderboard rank dialog', () => {
  it('keeps the closed dialog out of the document', () => {
    render(<CustomModal open={false} onOpenChange={mock()} child={<span>Leaderboard rows</span>} />)

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('exposes an accessible title and description when controlled open', () => {
    const onOpenChange = mock()

    render(
      <CustomModal
        open
        onOpenChange={onOpenChange}
        child={<span>Leaderboard rows</span>}
        flag="score"
      />
    )

    expect(screen.getByRole('dialog', { name: 'Your leaderboard rank' })).toBeTruthy()
    expect(screen.getByText('Your rank and nearby leaderboard scores.')).toBeTruthy()
    const closeButton = screen.getByRole('button', { name: 'Close leaderboard rank' })
    expect(closeButton).toBeTruthy()
    expect(screen.getByText('Leaderboard rows')).toBeTruthy()

    fireEvent.click(closeButton)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
