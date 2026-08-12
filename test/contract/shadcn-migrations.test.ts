import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

const deleteAccountDialog = 'packages/playfab/src/components/AccountDetails/DeleteAccountDialog.tsx'
const staleAlertDialog = 'packages/ui/src/components/custom/alert-dialog/index.tsx'

describe('shared shadcn component contracts', () => {
  it('uses the accessible base alert dialog directly', () => {
    const source = readFileSync(deleteAccountDialog, 'utf8')

    expect(source).toContain("from '@nl/ui/base/alert-dialog'")
    expect(source).not.toContain("from '@nl/ui/custom/alert-dialog'")
    expect(source).toContain('<AlertDialogTrigger asChild>')
    expect(source).toContain('<AlertDialogTitle>Delete Account</AlertDialogTitle>')
    expect(source).toContain('<AlertDialogDescription>')
  })

  it('removes the single-use custom alert dialog wrapper', () => {
    expect(existsSync(staleAlertDialog)).toBe(false)
  })
})
