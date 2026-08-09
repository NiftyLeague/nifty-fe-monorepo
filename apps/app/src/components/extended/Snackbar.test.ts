import { describe, expect, it } from 'bun:test'

import { getSnackbarPosition, getSnackbarTransitionClass } from './Snackbar'

describe('Snackbar adapter', () => {
  it('maps all anchor positions to Sonner positions', () => {
    expect(getSnackbarPosition({ vertical: 'top', horizontal: 'left' })).toBe('top-left')
    expect(getSnackbarPosition({ vertical: 'top', horizontal: 'center' })).toBe('top-center')
    expect(getSnackbarPosition({ vertical: 'bottom', horizontal: 'right' })).toBe('bottom-right')
  })

  it('maps migrated transition names and safely falls back for unknown names', () => {
    expect(getSnackbarTransitionClass('SlideLeft')).toContain('slide-in-from-right')
    expect(getSnackbarTransitionClass('Fade')).toContain('fade-in-0')
    expect(getSnackbarTransitionClass('Unknown')).toContain('fade-in-0')
  })
})
